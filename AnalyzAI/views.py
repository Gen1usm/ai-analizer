import json

from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.http import require_POST

from .forms import ReportAnalysisForm
from .services.ai_service import AIServiceError, analyze_report
from .services.assistant_service import AssistantServiceError, ask_assistant
from .services.file_parser import FileParserError, extract_text_from_file


def index(request):
    if request.method == "POST":
        form = ReportAnalysisForm(request.POST, request.FILES)
        if form.is_valid():
            assignment_text = (form.cleaned_data.get("assignment_text") or "").strip()
            report_text = (form.cleaned_data.get("report_text") or "").strip()
            assignment_file = form.cleaned_data.get("assignment_file")
            report_file = form.cleaned_data.get("report_file")

            if not assignment_text:
                if assignment_file:
                    try:
                        assignment_text = extract_text_from_file(assignment_file)
                    except FileParserError as exc:
                        form.add_error("assignment_file", str(exc))
                else:
                    form.add_error(
                        "assignment_text",
                        "Добавьте текст задания или загрузите файл задания.",
                    )

            if not report_text:
                if report_file:
                    try:
                        report_text = extract_text_from_file(report_file)
                    except FileParserError as exc:
                        form.add_error("report_file", str(exc))
                else:
                    form.add_error(
                        "report_text",
                        "Добавьте текст отчета или загрузите файл отчета.",
                    )

            if not form.errors:
                try:
                    result = analyze_report(
                        assignment_text=assignment_text,
                        report_text=report_text,
                    )
                    request.session["latest_analysis"] = {
                        "assignment_text": assignment_text,
                        "report_text": report_text,
                        "assignment_file_name": getattr(assignment_file, "name", ""),
                        "report_file_name": getattr(report_file, "name", ""),
                        "result": result,
                    }
                    return redirect("AnalyzAI:result")
                except AIServiceError as exc:
                    form.add_error(None, str(exc))
    else:
        form = ReportAnalysisForm()

    return render(
        request,
        "AnalyzAI/index.html",
        {
            "form": form,
        },
    )


def result_page(request):
    latest_analysis = request.session.get("latest_analysis")
    if not latest_analysis:
        return redirect("AnalyzAI:index")

    return render(
        request,
        "AnalyzAI/result.html",
        {
            "result": latest_analysis.get("result", {}),
            "assignment_text": latest_analysis.get("assignment_text", ""),
            "report_text": latest_analysis.get("report_text", ""),
            "assignment_file_name": latest_analysis.get("assignment_file_name", ""),
            "report_file_name": latest_analysis.get("report_file_name", ""),
        },
    )


@require_POST
def ask_ai_assistant(request):
    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse(
            {"ok": False, "error": "Некорректный формат запроса."},
            status=400,
        )

    question = (payload.get("question") or "").strip()
    assignment_text = payload.get("assignment_text") or ""
    report_text = payload.get("report_text") or ""
    language = payload.get("language") or "ru"

    if not question:
        return JsonResponse(
            {"ok": False, "error": "Введите вопрос для AI-ассистента."},
            status=400,
        )

    try:
        answer = ask_assistant(
            question=question,
            assignment_text=assignment_text,
            report_text=report_text,
            language=language,
        )
    except AssistantServiceError as exc:
        return JsonResponse({"ok": False, "error": str(exc)}, status=400)

    return JsonResponse({"ok": True, "answer": answer})
