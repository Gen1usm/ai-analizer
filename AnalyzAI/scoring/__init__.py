CRITERIA_WEIGHTS = {
    "strategic_relevance": 20,
    "goal_and_tasks": 10,
    "scientific_novelty": 15,
    "practical_applicability": 20,
    "expected_results": 15,
    "socio_economic_effect": 10,
    "feasibility": 10,
}

CRITERIA_KEYS = tuple(CRITERIA_WEIGHTS.keys())


def build_default_scores():
    return {
        key: {
            "score": 0,
            "comment": "",
        }
        for key in CRITERIA_KEYS
    }



def calculate_total_score(criteria_scores):
    total = 0.0

    for key, weight in CRITERIA_WEIGHTS.items():
        item = criteria_scores.get(key, {})
        try:
            score = int(item.get("score", 0))
        except (TypeError, ValueError):
            score = 0
        score = max(0, min(100, score))
        total += score * (weight / 100)

    return round(total)
