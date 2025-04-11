import re
async def filter_sensitive_info(text: str) -> str:
    # 주민등록번호 뒷자리 가명 처리
    text = re.sub(r'(\d{6}-)\d{7}', r'\1XXXXXX', text)

    # 전화번호 뒷자리 가명 처리
    text = re.sub(r'(\d{3}-\d{4}-)\d{4}', r'\1XXXX', text)

    # 주소 처리 (서울특별시 중구 광희동 -> 서울특별시 중구)
    text = re.sub(r'([\uac00-\ud7a3]+시 [\uac00-\ud7a3]+구)\s[\uac00-\ud7a3]+', r'\1', text)
    return text