(function () {
    const root = document.documentElement;
    const form = document.getElementById("analysisForm");
    const submitButton = document.getElementById("submitButton");
    const overlay = document.getElementById("loadingOverlay");
    const themeToggle = document.getElementById("themeToggle");
    const languageButtons = document.querySelectorAll("[data-lang]");
    const assistantPanel = document.querySelector(".assistant-panel");
    const assistantChat = document.getElementById("assistantChat");
    const assistantQuestion = document.getElementById("assistantQuestion");
    const assistantSendButton = document.getElementById("assistantSendButton");
    const assistantError = document.getElementById("assistantError");
    const storageKey = "analyzai-theme";
    const languageStorageKey = "analyzai-language";

    const translations = {
        ru: {
            brand_subtitle: "Scientific Review Platform",
            hero_title: "Экспертная оценка научных отчетов в одном окне",
            hero_text: "Загрузите задание и отчет, а система покажет соответствие шаблону, баллы по критериям, ошибки языка, анализ рынка, рекомендации и итоговое решение.",
            form_title: "Данные для анализа",
            form_text: "Введите текст вручную или загрузите файлы. Для каждого блока достаточно текста или файла.",
            assignment_text_label: "Текст задания",
            assignment_file_label: "Файл задания",
            report_text_label: "Текст отчета",
            report_file_label: "Файл отчета",
            analyze_button: "Анализировать",
            result_title: "Результат",
            result_text: "После анализа здесь появится подробный экспертный вывод по структуре, качеству отчета и перспективам внедрения.",
            expand_text: "Развернуть",
            collapse_text: "Свернуть",
            analysis_done: "Анализ завершен",
            report_comment: "Комментарий по отчету",
            total_score: "Итоговый балл",
            template_match: "Соответствие шаблону",
            win_chance: "Шанс выигрыша",
            template_section: "Соответствие шаблону",
            missing_sections: "Отсутствующие разделы",
            missing_sections_empty: "Критических пропусков по обязательным разделам не выявлено.",
            problems: "Проблемы",
            problems_empty: "Явные структурные проблемы не зафиксированы.",
            criteria_title: "Оценки по критериям",
            criteria_chart_title: "Диаграмма весов критериев",
            criteria_chart_text: "Размер сектора показывает вес критерия, а рядом в легенде указан выставленный балл.",
            criterion_strategic: "Стратегическая релевантность",
            criterion_goal: "Цель и задачи",
            criterion_novelty: "Научная новизна",
            criterion_practical: "Практическая применимость",
            criterion_results: "Ожидаемые результаты",
            criterion_social: "Соц-экономический эффект",
            criterion_feasibility: "Реализуемость",
            strengths_weaknesses: "Сильные и слабые стороны",
            strengths: "Сильные стороны",
            strengths_empty: "Сильные стороны не выделены.",
            weaknesses: "Слабые стороны",
            weaknesses_empty: "Существенные слабые стороны не перечислены.",
            market_title: "Анализ рынка",
            market_demand: "Востребованность проекта",
            market_competitors: "Наличие аналогов",
            market_users: "Потенциальные пользователи",
            market_value: "Практическая ценность",
            market_risks: "Риски внедрения",
            language_title: "Ошибки языка",
            language_grammar: "Грамматика",
            language_grammar_empty: "Явные грамматические ошибки не выделены.",
            language_spelling: "Орфография",
            language_spelling_empty: "Явные орфографические ошибки не выделены.",
            language_style: "Стиль",
            language_style_empty: "Стилистические проблемы не зафиксированы.",
            recommendations: "Рекомендации",
            recommendations_empty: "Рекомендации пока не сформированы.",
            waiting: "Ожидает запуск",
            analytics_ready: "Панель аналитики готова",
            analytics_ready_text: "После отправки формы здесь появятся комментарий по отчету, соответствие шаблону, анализ рынка, языковые ошибки, баллы по критериям, рекомендации и итоговое решение.",
            loading_title: "Идет AI-анализ",
            loading_text: "Проверяем структуру отчета, критерии, язык и рыночную применимость.",
            assignment_placeholder: "Вставьте формулировку задания, критерии или техническое описание.",
            report_placeholder: "Вставьте текст научного отчета для последующей экспертной оценки.",
            toggle_theme_label: "Переключить тему",
            toggle_theme_title: "Сменить светлый или темный режим",
            assistant_title: "AI-ассистент",
            assistant_text: "Задайте любой вопрос по проекту, отчету, структуре заявки, улучшению текста или подготовке материалов.",
            assistant_badge: "Всегда на связи",
            assistant_welcome: "Я AI-ассистент AnalyzAI. Могу помочь с отчетом, критериями, текстом, структурой заявки и любыми вопросами по проекту.",
            assistant_placeholder: "Напишите вопрос для AI-ассистента...",
            assistant_send: "Спросить AI",
            assistant_thinking: "AI-ассистент думает...",
            assistant_error_empty: "Введите вопрос для AI-ассистента.",
            assistant_error_html: "Сервер вернул страницу вместо JSON. Перезапустите Django-сервер и обновите страницу."
        },
        kz: {
            brand_subtitle: "Scientific Review Platform",
            hero_title: "Ғылыми есептерді бір терезеде сараптамалық бағалау",
            hero_text: "Тапсырма мен есепті жүктеңіз, ал жүйе үлгіге сәйкестікті, критерийлік балдарды, тілдік қателерді, нарықтық талдауды, ұсынымдарды және қорытынды шешімді көрсетеді.",
            form_title: "Талдауға арналған деректер",
            form_text: "Мәтінді қолмен енгізіңіз немесе файлдарды жүктеңіз. Әр блок үшін мәтін не файл жеткілікті.",
            assignment_text_label: "Тапсырма мәтіні",
            assignment_file_label: "Тапсырма файлы",
            report_text_label: "Есеп мәтіні",
            report_file_label: "Есеп файлы",
            analyze_button: "Талдау",
            result_title: "Нәтиже",
            result_text: "Талдаудан кейін мұнда есеп құрылымы, сапасы және енгізу перспективалары бойынша толық сараптамалық қорытынды шығады.",
            expand_text: "Толық ашу",
            collapse_text: "Жию",
            analysis_done: "Талдау аяқталды",
            report_comment: "Есеп бойынша түсіндірме",
            total_score: "Жалпы балл",
            template_match: "Үлгіге сәйкестік",
            win_chance: "Жеңу мүмкіндігі",
            template_section: "Үлгіге сәйкестік",
            missing_sections: "Жоқ бөлімдер",
            missing_sections_empty: "Міндетті бөлімдер бойынша маңызды олқылықтар анықталмады.",
            problems: "Мәселелер",
            problems_empty: "Айқын құрылымдық мәселелер тіркелмеді.",
            criteria_title: "Критерийлер бойынша бағалар",
            criteria_chart_title: "Критерий салмақтарының диаграммасы",
            criteria_chart_text: "Сектор өлшемі критерий салмағын көрсетеді, ал аңызда берілген балл көрсетіледі.",
            criterion_strategic: "Стратегиялық релеванттылық",
            criterion_goal: "Мақсат пен міндеттер",
            criterion_novelty: "Ғылыми жаңалық",
            criterion_practical: "Практикалық қолданылым",
            criterion_results: "Күтілетін нәтижелер",
            criterion_social: "Әлеуметтік-экономикалық әсер",
            criterion_feasibility: "Іске асырылуы",
            strengths_weaknesses: "Күшті және әлсіз жақтар",
            strengths: "Күшті жақтар",
            strengths_empty: "Күшті жақтар бөлінбеген.",
            weaknesses: "Әлсіз жақтар",
            weaknesses_empty: "Елеулі әлсіз жақтар көрсетілмеген.",
            market_title: "Нарық талдауы",
            market_demand: "Жобаның сұранысы",
            market_competitors: "Ұқсас шешімдердің болуы",
            market_users: "Әлеуетті пайдаланушылар",
            market_value: "Практикалық құндылық",
            market_risks: "Енгізу тәуекелдері",
            language_title: "Тілдік қателер",
            language_grammar: "Грамматика",
            language_grammar_empty: "Айқын грамматикалық қателер анықталмады.",
            language_spelling: "Орфография",
            language_spelling_empty: "Айқын орфографиялық қателер анықталмады.",
            language_style: "Стиль",
            language_style_empty: "Стильдік мәселелер тіркелмеді.",
            recommendations: "Ұсынымдар",
            recommendations_empty: "Ұсынымдар әлі қалыптастырылған жоқ.",
            waiting: "Іске қосуды күтуде",
            analytics_ready: "Аналитика панелі дайын",
            analytics_ready_text: "Форма жіберілгеннен кейін мұнда есеп бойынша түсіндірме, үлгіге сәйкестік, нарық талдауы, тілдік қателер, критерийлік балдар, ұсынымдар және қорытынды шешім пайда болады.",
            loading_title: "AI талдауы жүріп жатыр",
            loading_text: "Есеп құрылымын, критерийлерді, тілді және нарықтық қолданылымды тексеріп жатырмыз.",
            assignment_placeholder: "Тапсырманың тұжырымын, критерийлерін немесе техникалық сипаттамасын енгізіңіз.",
            report_placeholder: "Кейінгі сараптамалық бағалау үшін ғылыми есеп мәтінін енгізіңіз.",
            toggle_theme_label: "Тақырыпты ауыстыру",
            toggle_theme_title: "Жарық және қараңғы режимді ауыстыру",
            assistant_title: "AI-көмекші",
            assistant_text: "Жоба, есеп, өтінім құрылымы, мәтінді жақсарту немесе материал дайындау бойынша кез келген сұрақ қойыңыз.",
            assistant_badge: "Әрқашан байланыста",
            assistant_welcome: "Мен AnalyzAI AI-көмекшісімін. Есеп, критерийлер, мәтін, өтінім құрылымы және жобаға қатысты кез келген сұрақ бойынша көмектесе аламын.",
            assistant_placeholder: "AI-көмекшіге сұрағыңызды жазыңыз...",
            assistant_send: "AI-ден сұрау",
            assistant_thinking: "AI-көмекші ойланып жатыр...",
            assistant_error_empty: "AI-көмекшіге сұрақ енгізіңіз.",
            assistant_error_html: "Сервер JSON орнына HTML бет қайтарды. Django серверін қайта іске қосып, бетті жаңартыңыз."
        },
        en: {
            brand_subtitle: "Scientific Review Platform",
            hero_title: "Expert Evaluation of Scientific Reports in One Workspace",
            hero_text: "Upload the assignment and the report, and the system will show template compliance, criteria scores, language issues, market analysis, recommendations, and the final decision.",
            form_title: "Analysis Input",
            form_text: "Enter the text manually or upload files. For each block, either text or a file is enough.",
            assignment_text_label: "Assignment Text",
            assignment_file_label: "Assignment File",
            report_text_label: "Report Text",
            report_file_label: "Report File",
            analyze_button: "Analyze",
            result_title: "Result",
            result_text: "After analysis, a detailed expert conclusion about the structure, quality, and implementation prospects of the report will appear here.",
            expand_text: "Expand",
            collapse_text: "Collapse",
            analysis_done: "Analysis Complete",
            report_comment: "Report Comment",
            total_score: "Total Score",
            template_match: "Template Compliance",
            win_chance: "Win Probability",
            template_section: "Template Compliance",
            missing_sections: "Missing Sections",
            missing_sections_empty: "No critical omissions were found in the required sections.",
            problems: "Problems",
            problems_empty: "No obvious structural problems were detected.",
            criteria_title: "Criteria Scores",
            criteria_chart_title: "Criteria Weight Chart",
            criteria_chart_text: "Each slice shows the criterion weight, and the legend displays the score that was assigned.",
            criterion_strategic: "Strategic Relevance",
            criterion_goal: "Goal and Tasks",
            criterion_novelty: "Scientific Novelty",
            criterion_practical: "Practical Applicability",
            criterion_results: "Expected Results",
            criterion_social: "Socio-Economic Effect",
            criterion_feasibility: "Feasibility",
            strengths_weaknesses: "Strengths and Weaknesses",
            strengths: "Strengths",
            strengths_empty: "No strengths were highlighted.",
            weaknesses: "Weaknesses",
            weaknesses_empty: "No significant weaknesses were listed.",
            market_title: "Market Analysis",
            market_demand: "Project Demand",
            market_competitors: "Existing Alternatives",
            market_users: "Potential Users",
            market_value: "Practical Value",
            market_risks: "Implementation Risks",
            language_title: "Language Issues",
            language_grammar: "Grammar",
            language_grammar_empty: "No obvious grammar issues were identified.",
            language_spelling: "Spelling",
            language_spelling_empty: "No obvious spelling issues were identified.",
            language_style: "Style",
            language_style_empty: "No stylistic issues were detected.",
            recommendations: "Recommendations",
            recommendations_empty: "Recommendations have not been generated yet.",
            waiting: "Waiting to Start",
            analytics_ready: "Analytics Panel Is Ready",
            analytics_ready_text: "After submitting the form, this area will show the report comment, template compliance, market analysis, language issues, criteria scores, recommendations, and the final decision.",
            loading_title: "AI Analysis in Progress",
            loading_text: "We are checking the report structure, criteria, language quality, and market applicability.",
            assignment_placeholder: "Paste the assignment wording, criteria, or technical description.",
            report_placeholder: "Paste the scientific report text for further expert evaluation.",
            toggle_theme_label: "Toggle theme",
            toggle_theme_title: "Switch between light and dark mode",
            assistant_title: "AI Assistant",
            assistant_text: "Ask any question about the project, report, proposal structure, text improvement, or material preparation.",
            assistant_badge: "Always available",
            assistant_welcome: "I am the AnalyzAI assistant. I can help with the report, evaluation criteria, writing, proposal structure, and any project-related questions.",
            assistant_placeholder: "Write a question for the AI assistant...",
            assistant_send: "Ask AI",
            assistant_thinking: "The AI assistant is thinking...",
            assistant_error_empty: "Enter a question for the AI assistant.",
            assistant_error_html: "The server returned an HTML page instead of JSON. Restart the Django server and refresh the page."
        }
    };

    function getCurrentLanguage() {
        const storedLanguage = window.localStorage.getItem(languageStorageKey);
        return translations[storedLanguage] ? storedLanguage : "ru";
    }

    function getDictionary() {
        return translations[getCurrentLanguage()];
    }

    function applyTheme(theme) {
        const normalizedTheme = theme === "dark" ? "dark" : "light";
        root.setAttribute("data-theme", normalizedTheme);
        if (themeToggle) {
            themeToggle.setAttribute("aria-pressed", String(normalizedTheme === "dark"));
        }
    }

    function applyLanguage(language) {
        const normalizedLanguage = translations[language] ? language : "ru";
        const dictionary = translations[normalizedLanguage];
        const assignmentText = document.getElementById("id_assignment_text");
        const reportText = document.getElementById("id_report_text");

        document.querySelectorAll("[data-i18n]").forEach(function (element) {
            const key = element.getAttribute("data-i18n");
            if (dictionary[key]) {
                element.textContent = dictionary[key];
            }
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
            const key = element.getAttribute("data-i18n-placeholder");
            if (dictionary[key]) {
                element.placeholder = dictionary[key];
            }
        });

        if (assignmentText) {
            assignmentText.placeholder = dictionary.assignment_placeholder;
        }
        if (reportText) {
            reportText.placeholder = dictionary.report_placeholder;
        }
        if (themeToggle) {
            themeToggle.setAttribute("aria-label", dictionary.toggle_theme_label);
            themeToggle.setAttribute("title", dictionary.toggle_theme_title);
        }

        const defaultAssistantMessage = document.querySelector("[data-default-message='true']");
        if (defaultAssistantMessage) {
            defaultAssistantMessage.textContent = dictionary.assistant_welcome;
        }

        languageButtons.forEach(function (button) {
            button.classList.toggle("is-active", button.getAttribute("data-lang") === normalizedLanguage);
        });

        window.localStorage.setItem(languageStorageKey, normalizedLanguage);
        document.documentElement.lang = normalizedLanguage === "kz" ? "kk" : normalizedLanguage;
        refreshExpandableTextButtons();
    }

    function refreshExpandableTextButtons() {
        const dictionary = getDictionary();

        document.querySelectorAll("[data-expandable-block]").forEach(function (block) {
            const content = block.querySelector("[data-expandable-content]");
            const toggle = block.querySelector("[data-expandable-toggle]");

            if (!content || !toggle) {
                return;
            }

            const isExpanded = !content.classList.contains("is-collapsed");
            toggle.textContent = isExpanded ? dictionary.collapse_text : dictionary.expand_text;
            toggle.setAttribute("aria-expanded", String(isExpanded));
        });
    }

    function initializeExpandableText() {
        document.querySelectorAll("[data-expandable-block]").forEach(function (block) {
            const content = block.querySelector("[data-expandable-content]");
            const toggle = block.querySelector("[data-expandable-toggle]");

            if (!content || !toggle) {
                return;
            }

            toggle.addEventListener("click", function () {
                content.classList.toggle("is-collapsed");
                refreshExpandableTextButtons();
            });

            window.requestAnimationFrame(function () {
                const shouldShowToggle = content.scrollHeight > content.clientHeight + 8;
                toggle.hidden = !shouldShowToggle;
                refreshExpandableTextButtons();
            });
        });
    }

    function appendAssistantMessage(text, role) {
        if (!assistantChat) {
            return null;
        }

        const message = document.createElement("div");
        message.className = role === "user"
            ? "assistant-message assistant-message-user"
            : "assistant-message assistant-message-bot";
        message.textContent = text;
        assistantChat.appendChild(message);
        assistantChat.scrollTop = assistantChat.scrollHeight;
        return message;
    }

    function applyScoreRings() {
        document.querySelectorAll(".score-ring").forEach(function (ring) {
            const rawScore = Number(ring.dataset.score || 0);
            const score = Math.max(0, Math.min(100, rawScore));
            const hue = score * 1.2;
            const color = "hsl(" + hue + " 85% 58%)";

            ring.style.setProperty("--score-value", String(score));
            ring.style.setProperty("--score-color", color);
        });
    }

    async function sendAssistantQuestion() {
        if (!assistantQuestion || !assistantSendButton) {
            return;
        }

        const question = assistantQuestion.value.trim();
        const dictionary = getDictionary();

        if (!question) {
            if (assistantError) {
                assistantError.hidden = false;
                assistantError.textContent = dictionary.assistant_error_empty;
            }
            return;
        }

        if (assistantError) {
            assistantError.hidden = true;
            assistantError.textContent = "";
        }

        appendAssistantMessage(question, "user");
        assistantQuestion.value = "";
        assistantSendButton.disabled = true;

        const thinkingMessage = appendAssistantMessage(dictionary.assistant_thinking, "bot");
        const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]")?.value;
        const assistantUrl = assistantPanel?.dataset.assistantUrl || "/assistant/ask/";

        try {
            const response = await fetch(assistantUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken || "",
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    question: question,
                    assignment_text: document.getElementById("id_assignment_text")?.value || "",
                    report_text: document.getElementById("id_report_text")?.value || "",
                    language: getCurrentLanguage(),
                }),
            });

            const rawText = await response.text();
            let payload;

            try {
                payload = JSON.parse(rawText);
            } catch (parseError) {
                throw new Error(dictionary.assistant_error_html);
            }

            if (!response.ok || !payload.ok) {
                throw new Error(payload.error || "Assistant request failed.");
            }

            if (thinkingMessage) {
                thinkingMessage.textContent = payload.answer;
            } else {
                appendAssistantMessage(payload.answer, "bot");
            }
        } catch (error) {
            if (thinkingMessage) {
                thinkingMessage.remove();
            }
            if (assistantError) {
                assistantError.hidden = false;
                assistantError.textContent = error.message;
            }
        } finally {
            assistantSendButton.disabled = false;
        }
    }

    applyTheme(window.localStorage.getItem(storageKey));
    applyLanguage(window.localStorage.getItem(languageStorageKey));
    applyScoreRings();
    initializeExpandableText();

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            applyTheme(nextTheme);
            window.localStorage.setItem(storageKey, nextTheme);
        });
    }

    languageButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            applyLanguage(button.getAttribute("data-lang"));
        });
    });

    if (assistantSendButton) {
        assistantSendButton.addEventListener("click", function () {
            sendAssistantQuestion();
        });
    }

    if (assistantQuestion) {
        assistantQuestion.addEventListener("keydown", function (event) {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();
                sendAssistantQuestion();
            }
        });
    }

    if (!form || !submitButton || !overlay) {
        return;
    }

    form.addEventListener("submit", function () {
        document.body.classList.add("is-loading");
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
        overlay.setAttribute("aria-hidden", "false");
    });
})();
