import re

# 필터링할 민감 정보 패턴 사전 정의
SENSITIVE_PATTERNS = {
    '주민등록번호': r'\b\d{6}-\d{7}\b',

    # 휴대폰 번호 (01X-XXX(or XXXX)-XXXX)
    '전화번호': r'\b(01[0|1|6|7|8|9])-\d{3,4}-\d{4}\b',

    # 이메일 주소
    '이메일': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b',

    # 신용카드 번호 (XXXX-XXXX-XXXX-XXXX 형태)
    '신용카드번호': r'\b(?:\d{4}-){3}\d{4}\b',

    # 한글 이름 간단 필터 (2~4글자 범위 예시)
    '한글이름': r'\b[가-힣]{2,4}\b',
}

async def filter_sensitive_info(text: str) -> str:
    # 여러 민감 정보 패턴을 순회하며 텍스트 내 패턴을 치환
    for label, pattern in SENSITIVE_PATTERNS.items():
        text = re.sub(pattern, f'[FILTERED-{label}]', text)
    return text