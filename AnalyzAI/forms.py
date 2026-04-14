from django import forms

ALLOWED_EXTENSIONS = {
    ".docx",
    ".pdf",
    ".pptx",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".txt",
}


def validate_uploaded_file(uploaded_file):
    if not uploaded_file:
        return

    file_name = uploaded_file.name.lower()
    if not any(file_name.endswith(extension) for extension in ALLOWED_EXTENSIONS):
        allowed = ", ".join(sorted(ALLOWED_EXTENSIONS))
        raise forms.ValidationError(
            f"Неподдерживаемый формат файла. Разрешены: {allowed}."
        )


class ReportAnalysisForm(forms.Form):
    assignment_text = forms.CharField(
        label="Текст задания",
        required=False,
        widget=forms.Textarea(
            attrs={
                "rows": 6,
                "placeholder": "Вставьте формулировку задания, критерии или техническое описание.",
            }
        ),
    )
    assignment_file = forms.FileField(
        label="Файл задания",
        required=False,
        validators=[validate_uploaded_file],
        widget=forms.ClearableFileInput(
            attrs={"accept": ".docx,.pdf,.pptx,.png,.jpg,.jpeg,.webp,.txt"}
        ),
    )
    report_text = forms.CharField(
        label="Текст отчета",
        required=False,
        widget=forms.Textarea(
            attrs={
                "rows": 10,
                "placeholder": "Вставьте текст научного отчета для последующей экспертной оценки.",
            }
        ),
    )
    report_file = forms.FileField(
        label="Файл отчета",
        required=False,
        validators=[validate_uploaded_file],
        widget=forms.ClearableFileInput(
            attrs={"accept": ".docx,.pdf,.pptx,.png,.jpg,.jpeg,.webp,.txt"}
        ),
    )

    def clean(self):
        cleaned_data = super().clean()
        has_assignment = cleaned_data.get("assignment_text") or cleaned_data.get(
            "assignment_file"
        )
        has_report = cleaned_data.get("report_text") or cleaned_data.get("report_file")

        if not has_assignment:
            self.add_error(
                "assignment_text",
                "Добавьте текст задания или загрузите файл задания.",
            )
        if not has_report:
            self.add_error(
                "report_text",
                "Добавьте текст отчета или загрузите файл отчета.",
            )

        return cleaned_data
