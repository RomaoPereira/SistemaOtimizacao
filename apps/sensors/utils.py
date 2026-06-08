from rest_framework.response import Response

def standard_response(status, message, data=None, http_status=200):
    """
    Gera uma resposta padronizada para a API.
    
    Args:
        status (str): 'success' ou 'error'.
        message (str): Mensagem descritiva do resultado.
        data (dict, list, optional): Dados a serem retornados. Defaults to None.
        http_status (int, optional): Código de status HTTP. Defaults to 200.
        
    Returns:
        Response: Objeto de resposta do DRF padronizado.
    """
    response_body = {
        "status": status,
        "message": message,
    }
    
    if data is not None:
        response_body["data"] = data
        
    return Response(response_body, status=http_status)
