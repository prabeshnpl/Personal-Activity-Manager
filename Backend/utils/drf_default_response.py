from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError

def custom_exception_handler(exc, context):
    """
    Docstring for custom_exception_handler
    
    :param exc: Description
    :param context: Description
    :return: Description
    For normalzing the response from drf default validation Error
    """
    response = exception_handler(exc, context)

    if response is not None and isinstance(exc, ValidationError):
        # Flatten validation errors
        error_messages = []
        for field, messages in exc.detail.items():
            # Append a clean string per field
            error_messages.append(f"{field}: {', '.join(str(m) for m in messages)}")
        
        # Join with newlines or commas for readability
        response.data = {"detail": "  \n  ".join(error_messages)}

    return response