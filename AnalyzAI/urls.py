from django.urls import path

from .views import ask_ai_assistant, index, result_page

app_name = "AnalyzAI"

urlpatterns = [
    path("", index, name="index"),
    path("result/", result_page, name="result"),
    path("assistant/ask/", ask_ai_assistant, name="ask_ai_assistant"),
]
