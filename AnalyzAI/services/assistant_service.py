import httpx
from django.conf import settings
from openai import OpenAI


class AssistantServiceError(Exception):
    pass


ASSISTANT_SYSTEM_PROMPT = """
Ты AI-ассистент платформы AnalyzAI.

Твоя роль:
- отвечать на вопросы пользователя по проекту, научным отчетам, заявкам, структуре документов, критериям оценки, улучшению текста и подготовке материалов;
- объяснять ясно, доброжелательно и по существу;
- если пользователь передал текст задания или отчета, учитывать этот контекст в ответе;
- если контекста недостаточно, прямо говорить, чего не хватает;
- не выдумывать факты, которых нет в вопросе или контексте;
- отвечать кратко, полезно и профессионально.
""".strip()


def ask_assistant(question, assignment_text="", report_text="", language="ru"):
    api_key = settings.OPENAI_API_KEY
    if not api_key:
        raise AssistantServiceError("OPENAI_API_KEY не найден в .env.")

    if not (question or "").strip():
        raise AssistantServiceError("Введите вопрос для AI-ассистента.")

    client = OpenAI(
        api_key=api_key,
        http_client=httpx.Client(
            trust_env=False,
            timeout=httpx.Timeout(60.0, connect=20.0),
        ),
    )

    user_prompt = (
        f"Язык ответа: {language}\n\n"
        f"Вопрос пользователя:\n{question.strip()}\n\n"
        f"Текст задания:\n{(assignment_text or '').strip()}\n\n"
        f"Текст отчета:\n{(report_text or '').strip()}\n"
    )

    try:
        response = client.chat.completions.create(
            model=getattr(settings, "OPENAI_MODEL", None) or "gpt-4o-mini",
            messages=[
                {"role": "system", "content": ASSISTANT_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.4,
        )
    except Exception as exc:
        raise AssistantServiceError(
            f"Ошибка при обращении к AI-ассистенту: {exc}"
        ) from exc

    answer = response.choices[0].message.content if response.choices else ""
    answer = (answer or "").strip()
    if not answer:
        raise AssistantServiceError("AI-ассистент вернул пустой ответ.")

    return answer
