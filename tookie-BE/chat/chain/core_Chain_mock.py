from core_Chain import core_Chain
mock_question = "NVIDIA에 투자하려고 하는데 맞는 선택일까?"

investment_level = 1

mock_user_info = {
    "investment_goal": "예적금 수익률보다 3~5%정도 기대할 수 있다면 원금보존 가능성은 좀 포기할 수 있음",
    "risk_tolerance": "투자원금은 반드시 보전",
    "investment_ratio": "10%미만",
    "investment_period": "1년 이하",
    "income_status": "정기적 수입이 있으나, 향후 감소 또는 불안정이 예상됨",
    "derivatives_experience": "1년 이상 3년 미만",
    "financial_vulnerability": "해당 사항 없음"
}

core_Chain(mock_question, investment_level, mock_user_info)