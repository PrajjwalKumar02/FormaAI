"""
JSON Validator
Checks whether the generated response has the required structure.
"""

def validate_response(response):
    required_keys = ["success", "title", "fields"]

    for key in required_keys:
        if key not in response:
            return False

    if not isinstance(response["fields"], list):
        return False

    for field in response["fields"]:
        field_keys = ["label", "type", "required"]

        for key in field_keys:
            if key not in field:
                return False

    return True