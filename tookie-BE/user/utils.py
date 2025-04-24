from fastapi import Request
def get_client_ip(request:Request):
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0]
    return request.client.host

def get_user_agent(request:Request):
    return request.headers.get("User-Agent", "unknown")