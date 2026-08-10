"""
JSON Validator
Checks whether the generated response has the required structure.
Provides detailed validation errors.
"""

from typing import Dict, List, Any, Tuple

# Valid field types
VALID_FIELD_TYPES = [
    "text", "textarea", "email", "tel", "number", 
    "date", "time", "select", "checkbox", "radio", "file"
]

# Field types that require options
TYPES_WITH_OPTIONS = ["select", "radio"]


def validate_response(response: Dict[str, Any]) -> bool:
    """
    Main validation function - returns True/False
    """
    success, errors = validate_response_detailed(response)
    return success


def validate_response_detailed(response: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """
    Validate response with detailed error messages
    Returns: (is_valid, list_of_error_messages)
    """
    errors = []

    # ================================================================
    # 1. Check top-level keys
    # ================================================================
    required_keys = ["success", "title", "fields"]
    for key in required_keys:
        if key not in response:
            errors.append(f"Missing top-level key: '{key}'")
    
    if errors:
        return False, errors

    # ================================================================
    # 2. Check 'success' is boolean
    # ================================================================
    if not isinstance(response["success"], bool):
        errors.append("'success' must be a boolean")

    # ================================================================
    # 3. Check 'title' is non-empty string
    # ================================================================
    if not isinstance(response["title"], str):
        errors.append("'title' must be a string")
    elif not response["title"].strip():
        errors.append("'title' cannot be empty")

    # ================================================================
    # 4. Check 'fields' is an array
    # ================================================================
    if not isinstance(response["fields"], list):
        errors.append("'fields' must be an array")
        return False, errors

    if len(response["fields"]) == 0:
        errors.append("'fields' array cannot be empty")

    # ================================================================
    # 5. Validate each field
    # ================================================================
    for idx, field in enumerate(response["fields"]):
        field_errors = validate_field(field, idx)
        errors.extend(field_errors)

    # ================================================================
    # 6. Validate optional fields (if present)
    # ================================================================
    if "extractedData" in response:
        if not isinstance(response["extractedData"], dict):
            errors.append("'extractedData' must be an object")
    
    if "description" in response:
        if not isinstance(response["description"], str):
            errors.append("'description' must be a string")

    if "confidence" in response:
        if not isinstance(response["confidence"], (int, float)):
            errors.append("'confidence' must be a number")
        elif response["confidence"] < 0 or response["confidence"] > 100:
            errors.append("'confidence' must be between 0 and 100")

    return len(errors) == 0, errors


def validate_field(field: Dict[str, Any], index: int) -> List[str]:
    """
    Validate a single field
    """
    errors = []
    prefix = f"Field[{index}]"

    # ================================================================
    # 5.1 Check field has required keys
    # ================================================================
    required_field_keys = ["label", "type", "required"]
    for key in required_field_keys:
        if key not in field:
            errors.append(f"{prefix}: Missing required key '{key}'")
    
    if errors:
        return errors

    # ================================================================
    # 5.2 Validate 'label'
    # ================================================================
    if not isinstance(field["label"], str):
        errors.append(f"{prefix}: 'label' must be a string")
    elif not field["label"].strip():
        errors.append(f"{prefix}: 'label' cannot be empty")

    # ================================================================
    # 5.3 Validate 'type'
    # ================================================================
    if not isinstance(field["type"], str):
        errors.append(f"{prefix}: 'type' must be a string")
    elif field["type"] not in VALID_FIELD_TYPES:
        errors.append(f"{prefix}: Invalid type '{field['type']}'. Valid types: {', '.join(VALID_FIELD_TYPES)}")

    # ================================================================
    # 5.4 Validate 'required'
    # ================================================================
    if not isinstance(field["required"], bool):
        errors.append(f"{prefix}: 'required' must be a boolean")

    # ================================================================
    # 5.5 Validate 'placeholder' (if present)
    # ================================================================
    if "placeholder" in field:
        if not isinstance(field["placeholder"], str):
            errors.append(f"{prefix}: 'placeholder' must be a string")
        elif not field["placeholder"].strip() and field.get("required"):
            errors.append(f"{prefix}: 'placeholder' cannot be empty for required field")

    # ================================================================
    # 5.6 Validate 'options' (for select/radio types)
    # ================================================================
    field_type = field.get("type", "")
    if field_type in TYPES_WITH_OPTIONS:
        if "options" not in field:
            errors.append(f"{prefix}: '{field_type}' field must have 'options' array")
        elif not isinstance(field["options"], list):
            errors.append(f"{prefix}: 'options' must be an array")
        elif len(field["options"]) == 0:
            errors.append(f"{prefix}: 'options' cannot be empty")
        else:
            for opt_idx, option in enumerate(field["options"]):
                if not isinstance(option, str):
                    errors.append(f"{prefix}: Option[{opt_idx}] must be a string")
                elif not option.strip():
                    errors.append(f"{prefix}: Option[{opt_idx}] cannot be empty")

    # ================================================================
    # 5.7 Validate 'value' (if present)
    # ================================================================
    if "value" in field:
        if field_type == "number":
            if not isinstance(field["value"], (int, float)):
                errors.append(f"{prefix}: 'value' must be a number")
        elif field_type in ["email", "text", "textarea", "tel", "date", "time"]:
            if not isinstance(field["value"], str):
                errors.append(f"{prefix}: 'value' must be a string")
        elif field_type in ["checkbox"]:
            if not isinstance(field["value"], bool):
                errors.append(f"{prefix}: 'value' must be a boolean")

    # ================================================================
    # 5.8 Validate 'id' (if present)
    # ================================================================
    if "id" in field:
        if not isinstance(field["id"], str):
            errors.append(f"{prefix}: 'id' must be a string")
        elif not field["id"].strip():
            errors.append(f"{prefix}: 'id' cannot be empty")

    return errors


def validate_extracted_data(extracted_data: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """
    Validate extracted data
    """
    errors = []
    
    if not isinstance(extracted_data, dict):
        errors.append("Extracted data must be an object")
        return False, errors
    
    # Check for empty extracted data
    if not extracted_data:
        errors.append("Extracted data is empty")
    
    return len(errors) == 0, errors


def is_valid_field_type(field_type: str) -> bool:
    """
    Check if field type is valid
    """
    return field_type in VALID_FIELD_TYPES


def get_field_type_errors(field: Dict[str, Any]) -> List[str]:
    """
    Get type-specific validation errors
    """
    errors = []
    field_type = field.get("type", "")
    
    if field_type == "email":
        if "value" in field and field["value"]:
            import re
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, field["value"]):
                errors.append(f"Invalid email format: {field['value']}")
    
    if field_type == "number":
        if "value" in field and field["value"]:
            try:
                float(field["value"])
            except (ValueError, TypeError):
                errors.append(f"Invalid number: {field['value']}")
    
    return errors


# ================================================================
#  Example usage
# ================================================================

if __name__ == "__main__":
    # Example 1: Valid response
    valid_response = {
        "success": True,
        "title": "Test Form",
        "fields": [
            {"label": "Name", "type": "text", "required": True, "placeholder": "Enter name"},
            {"label": "Email", "type": "email", "required": True, "placeholder": "Enter email"},
            {"label": "Department", "type": "select", "required": True, "options": ["HR", "Engineering"]}
        ]
    }
    
    is_valid, errors = validate_response_detailed(valid_response)
    print(f"Valid: {is_valid}")
    if errors:
        print("Errors:", errors)
    
    print("-" * 50)
    
    # Example 2: Invalid response
    invalid_response = {
        "success": "true",  # Should be boolean
        "title": "",  # Empty title
        "fields": [
            {"label": "", "type": "invalid", "required": "yes"}  # Invalid type
        ]
    }
    
    is_valid, errors = validate_response_detailed(invalid_response)
    print(f"Valid: {is_valid}")
    print("Errors:")
    for error in errors:
        print(f"  - {error}")
