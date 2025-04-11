from config.config import MAX_INPUT_LENGTH
async def validate_input_length(user_input: str) -> str:
    if len(user_input) > MAX_INPUT_LENGTH:
        return False
    else:
        return True