def build_default_market_analysis():
    return {
        "demand": "",
        "competitors": "",
        "target_users": "",
        "practical_value": "",
        "risks": "",
    }



def normalize_market_analysis(value):
    raw = value if isinstance(value, dict) else {}
    default = build_default_market_analysis()

    return {
        key: str(raw.get(key) or default[key]).strip()
        for key in default
    }
