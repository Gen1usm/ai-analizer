import json

from django.conf import settings
import httpx
from openai import OpenAI

from AnalyzAI.scoring import CRITERIA_KEYS, build_default_scores, calculate_total_score
from AnalyzAI.services.market_analysis import (
    build_default_market_analysis,
    normalize_market_analysis,
)
from .text_analyzer import analyze_text  # Импорт нашей функции


class AIServiceError(Exception):
    pass


SYSTEM_PROMPT = """
Ты строгий и критичный эксперт по оценке научных отчетов и заявок по шаблону научного задания.

Твоя задача:
- сравнить отчет с текстом задания;
- проверить, насколько отчет соответствует структуре и смысловым требованиям шаблона научного задания;
- оценивать не только наличие разделов, но и качество их раскрытия;
- не хвалить без оснований;
- если обязательный раздел отсутствует, указывать это явно;
- если раздел указан формально, поверхностно, неполно или не по смыслу, обязательно отмечать это как проблему;
- отдельно оценить отчет по заданным критериям;
- дать MVP-оценку рыночной применимости проекта без выдумывания точных рыночных данных, если в тексте нет подтверждения;
- проверить отчет на грамматические, орфографические и стилистические ошибки;
- в конце давать четкий итоговый вывод.

Ты обязан отдельно проверить наличие и качество следующих разделов:
- Общие сведения
- Наименование приоритета
- Наименование специализированного направления
- Цель программы
- Задачи программы
- Какие пункты стратегических и программных документов решает
- Ожидаемые результаты
- Прямые результаты
- Конечный результат
- Социально-экономический эффект
- Целевые потребители
- Бюджет / предельная сумма программы

Ты обязан выставить баллы по критериям:
- strategic_relevance: Стратегическая релевантность, вес 20%
- goal_and_tasks: Цель и задачи, вес 10%
- scientific_novelty: Научная новизна, вес 15%
- practical_applicability: Практическая применимость, вес 20%
- expected_results: Ожидаемые результаты, вес 15%
- socio_economic_effect: Социально-экономический эффект, вес 10%
- feasibility: Реализуемость, вес 10%

Также сформируй блок market_analysis:
- demand: насколько проект выглядит востребованным по описанию;
- competitors: есть ли вероятные аналоги или конкурирующие подходы;
- target_users: кто потенциальные пользователи или заказчики;
- practical_value: в чем прикладная ценность проекта;
- risks: основные риски внедрения и практического применения.

Также сформируй блок language_issues:
- grammar: список конкретных грамматических ошибок с кратким пояснением и исправлением, если возможно;
- spelling: список конкретных орфографических ошибок с исправлением, если возможно;
- style: список конкретных стилистических проблем с предложением улучшения.

Правила оценки:
- если раздела нет, добавляй его в template_compliance.missing_sections;
- если раздел есть, но он слабый, расплывчатый, формальный или не соответствует заданию, добавляй конкретную проблему в template_compliance.problems;
- overall_score: целое число от 0 до 100, где 0 означает почти полное несоответствие шаблону, а 100 означает очень сильное и полное соответствие;
- каждый criterion score: целое число от 0 до 100;
- comment по каждому критерию: короткий, конкретный и критичный;
- total_score: итоговый целочисленный балл от 0 до 100;
- market_analysis должен быть осторожным: если в тексте мало данных, так и пиши, а не придумывай факты;
- language_issues должен быть конкретным: не пиши общие фразы вроде "есть ошибки"; по возможности приводи проблемный фрагмент и краткое исправление;
- если заметных ошибок определенного типа нет, возвращай пустой список;
- strengths: только реально подтвержденные сильные стороны;
- weaknesses: конкретные недостатки, несоответствия и слабые места;
- recommendations: практические рекомендации, как исправить отчет;
- final_decision: короткий и жесткий итоговый вывод, например: "слабое соответствие", "частичное соответствие", "хорошее соответствие";
- win_probability_percent: целое число от 0 до 100, отражающее вероятность успешного прохождения экспертной оценки.

Верни ответ только в формате JSON без markdown и без дополнительных комментариев.
Структура JSON должна быть строго такой:
{
  "summary_comment": "",
  "template_compliance": {
    "overall_score": 0,
    "missing_sections": [],
    "problems": []
  },
  "criteria_scores": {
    "strategic_relevance": { "score": 0, "comment": "" },
    "goal_and_tasks": { "score": 0, "comment": "" },
    "scientific_novelty": { "score": 0, "comment": "" },
    "practical_applicability": { "score": 0, "comment": "" },
    "expected_results": { "score": 0, "comment": "" },
    "socio_economic_effect": { "score": 0, "comment": "" },
    "feasibility": { "score": 0, "comment": "" }
  },
  "total_score": 0,
  "market_analysis": {
    "demand": "",
    "competitors": "",
    "target_users": "",
    "practical_value": "",
    "risks": ""
  },
  "language_issues": {
    "grammar": [],
    "spelling": [],
    "style": []
  },
  "strengths": [],
  "weaknesses": [],
  "recommendations": [],
  "final_decision": "",
  "win_probability_percent": 0
}
""".strip()


DEFAULT_RESULT = {
    "summary_comment": "",
    "template_compliance": {
        "overall_score": 0,
        "missing_sections": [],
        "problems": [],
    },
    "criteria_scores": build_default_scores(),
    "total_score": 0,
    "market_analysis": build_default_market_analysis(),
    "language_issues": {
        "grammar": [],
        "spelling": [],
        "style": [],
    },
    "strengths": [],
    "weaknesses": [],
    "recommendations": [],
    "final_decision": "",
    "win_probability_percent": 0,
}


def analyze_report(assignment_text, report_text):
    # Вызываем нашу локальную функцию анализа текста
    text_analysis = analyze_text(report_text)
    
    # Возвращаем результат с добавлением нашей логики
    result = DEFAULT_RESULT.copy()
    result.update(text_analysis)  # Добавляем plagiarism и ai_detection
    
    # Здесь можно добавить остальную логику, если нужно
    return result



