import json
import re
from collections import Counter

def analyze_text(text):
    """
    Анализирует текст на антиплагиат и генерацию ИИ.
    
    Args:
        text (str): Текст отчета для анализа.
    
    Returns:
        dict: JSON-подобный словарь с результатами анализа.
    """
    # Разбиваем текст на предложения
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    # Разбиваем на слова
    words = re.findall(r'\b\w+\b', text.lower())
    total_words = len(words)
    unique_words = len(set(words))
    
    # Уникальность текста (простая оценка)
    uniqueness_percent = (unique_words / total_words * 100) if total_words > 0 else 0
    
    # Поиск повторяющихся фраз (биграммы)
    bigrams = [f"{words[i]} {words[i+1]}" for i in range(len(words)-1)]
    bigram_counts = Counter(bigrams)
    repeated_bigrams = [bigram for bigram, count in bigram_counts.items() if count > 1]
    
    # Подозрительные фрагменты: предложения с повторяющимися словами или шаблонными фразами
    suspicious_fragments = []
    for sentence in sentences:
        sentence_words = re.findall(r'\b\w+\b', sentence.lower())
        if len(sentence_words) > 5:  # Только длинные предложения
            # Проверяем на повторения слов
            word_counts = Counter(sentence_words)
            if any(count > 2 for count in word_counts.values()):
                suspicious_fragments.append(sentence)
            # Или если содержит повторяющиеся биграммы
            sent_bigrams = [f"{sentence_words[i]} {sentence_words[i+1]}" for i in range(len(sentence_words)-1)]
            if any(bigram in repeated_bigrams for bigram in sent_bigrams):
                if sentence not in suspicious_fragments:
                    suspicious_fragments.append(sentence)
    
    # Ограничиваем до 3 фрагментов
    suspicious_fragments = suspicious_fragments[:3]
    
    # Комментарий для антиплагиата
    if uniqueness_percent > 80:
        comment = "Текст имеет высокую уникальность."
    elif uniqueness_percent > 50:
        comment = "Текст умеренно уникален, но есть повторения."
    else:
        comment = "Текст содержит много повторений, возможен плагиат."
    
    # Антиплагиат блок
    plagiarism = {
        "uniqueness_percent": round(uniqueness_percent, 2),
        "suspicious_fragments": suspicious_fragments,
        "comment": comment
    }
    
    # Проверка на ИИ
    # Простая эвристика: на основе уникальности, повторений, длины предложений
    avg_sentence_length = sum(len(re.findall(r'\b\w+\b', s)) for s in sentences) / len(sentences) if sentences else 0
    repetition_score = len(repeated_bigrams) / len(bigrams) * 100 if bigrams else 0
    
    # Вероятность ИИ: комбинация факторов
    ai_probability = min(100, (100 - uniqueness_percent) + repetition_score + (10 if avg_sentence_length > 15 else 0))
    
    # Тип текста
    if ai_probability < 30:
        text_type = "человек"
    elif ai_probability < 70:
        text_type = "смешанный"
    else:
        text_type = "AI"
    
    # Причины
    reasons = []
    if repetition_score > 20:
        reasons.append("Высокий уровень повторяющихся фраз.")
    if uniqueness_percent < 50:
        reasons.append("Низкая уникальность слов.")
    if avg_sentence_length > 15:
        reasons.append("Слишком длинные предложения, характерно для ИИ.")
    if not reasons:
        reasons.append("Текст выглядит естественным.")
    
    # Финальный комментарий
    if text_type == "AI":
        final_comment = "Текст, вероятно, сгенерирован ИИ из-за повторений и шаблонности."
    elif text_type == "смешанный":
        final_comment = "Текст может быть частично написан человеком, частично ИИ."
    else:
        final_comment = "Текст выглядит как написанный человеком."
    
    ai_detection = {
        "ai_probability_percent": round(ai_probability, 2),
        "text_type": text_type,
        "reasons": reasons,
        "final_comment": final_comment
    }
    
    return {
        "plagiarism": plagiarism,
        "ai_detection": ai_detection
    }

# Пример использования
if __name__ == "__main__":
    sample_text = """
    Введение. В данной работе рассматривается анализ данных. Анализ данных является важным процессом. Процесс анализа включает сбор информации. Сбор информации требует внимания. Внимание к деталям критично. Детали могут быть упущены. Упущенные детали приводят к ошибкам. Ошибки в анализе недопустимы. Анализ должен быть точным. Точный анализ обеспечивает правильные выводы. Выводы должны быть обоснованными. Обоснованные выводы помогают в принятии решений. Принятие решений основано на данных. Данные должны быть надежными. Надежные данные - основа успеха. Успех зависит от качества. Качество анализа определяет результат. Результат работы важен. Работа должна быть завершена вовремя. Вовремя завершенная работа приносит пользу. Пользу от работы оценивают эксперты. Эксперты анализируют результаты. Результаты анализа представляют интерес. Интерес к теме растет. Растет понимание важности. Важность анализа очевидна. Очевидные факты подтверждают выводы. Выводы подтверждают гипотезы. Гипотезы требуют проверки. Проверка гипотез - следующий шаг. Шаг вперед ведет к прогрессу. Прогресс в науке ценен. Ценность науки неоспорима.
    """
    
    result = analyze_text(sample_text)
    print(json.dumps(result, ensure_ascii=False, indent=4))