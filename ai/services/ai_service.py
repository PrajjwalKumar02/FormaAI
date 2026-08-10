import os
import re
from datetime import datetime
from config.ai_config import config

# Import Gemini service
from services.gemini_service import (
    extract_with_gemini,
    generate_form_with_gemini,
    analyze_with_gemini,
    fallback_extraction
)

# ================================================================
#  UNIFIED AI SERVICE
# ================================================================

def extract_incident_data(text):
    """
    Extract structured data from text using configured AI provider
    """
    if config.AI_PROVIDER == "gemini":
        return extract_with_gemini(text)
    else:
        # Fallback to keyword extraction
        return fallback_extraction(text)


def generate_form(user_input):
    """
    Generate form using configured AI provider
    """
    if config.AI_PROVIDER == "gemini":
        result = generate_form_with_gemini(user_input)
    else:
        # Fallback to basic form generation
        result = generate_form_basic(user_input)
    
    return result


def analyze_incident(incident_data):
    """
    Analyze incident using configured AI provider
    """
    if config.AI_PROVIDER == "gemini":
        return analyze_with_gemini(incident_data)
    else:
        return {
            "summary": "Incident analyzed",
            "riskLevel": "Medium",
            "suggestedActions": ["Review documentation"],
            "analysisDetails": {}
        }


def generate_form_basic(user_input):
    """Basic form generation (fallback)"""
    extracted = extract_incident_data(user_input)
    
    return {
        "success": True,
        "title": "Generated Form",
        "fields": [
            {"label": "Full Name", "type": "text", "required": True, "placeholder": "Enter your name"},
            {"label": "Description", "type": "textarea", "required": True, "placeholder": "Describe the incident"},
        ],
        "extractedData": extracted
    }


def autofill_fields(fields, extracted_data):
    """Auto-fill form fields with extracted data"""
    if not fields or not extracted_data:
        return fields
    
    for field in fields:
        label = field.get("label", "").lower()
        field_id = field.get("id", "").lower()
        
        for key, value in extracted_data.items():
            key_lower = key.lower()
            if key_lower in label or key_lower in field_id:
                if value and value != "Not provided":
                    field["value"] = value
                    break
    
    return fields


def detect_form_type(text):
    """Detect form type from user input"""
    text_lower = text.lower()
    if "student" in text_lower:
        return "student_registration"
    elif "employee" in text_lower:
        return "employee_registration"
    elif "patient" in text_lower or "hospital" in text_lower:
        return "patient_registration"
    elif "accident" in text_lower or "vehicle" in text_lower:
        return "incident_report"
    else:
        return "general_form"


def get_form_fields(form_type):
    """Get form fields based on form type"""
    common_fields = [
        {"label": "Full Name", "type": "text", "required": True, "placeholder": "Enter your full name"},
        {"label": "Phone Number", "type": "tel", "required": True, "placeholder": "Enter phone number"},
        {"label": "Email Address", "type": "email", "required": False, "placeholder": "Enter email address"}
    ]
    
    if form_type == "student_registration":
        specific = [
            {"label": "Roll Number", "type": "text", "required": True, "placeholder": "Enter roll number"},
            {"label": "Department", "type": "text", "required": True, "placeholder": "Enter department"},
            {"label": "Year", "type": "select", "required": True, "options": ["1st", "2nd", "3rd", "4th"]}
        ]
    elif form_type == "employee_registration":
        specific = [
            {"label": "Employee ID", "type": "text", "required": True, "placeholder": "Enter employee ID"},
            {"label": "Department", "type": "select", "required": True, "options": ["HR", "Engineering", "Finance", "Marketing"]},
            {"label": "Designation", "type": "text", "required": True, "placeholder": "Enter designation"}
        ]
    elif form_type == "patient_registration":
        specific = [
            {"label": "Age", "type": "number", "required": True, "placeholder": "Enter age"},
            {"label": "Symptoms", "type": "textarea", "required": True, "placeholder": "Describe symptoms"},
            {"label": "Blood Group", "type": "select", "required": False, "options": ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
        ]
    elif form_type == "incident_report":
        specific = [
            {"label": "Incident Type", "type": "text", "required": True, "placeholder": "Enter incident type"},
            {"label": "Severity", "type": "select", "required": True, "options": ["Low", "Medium", "High", "Critical"]},
            {"label": "Location", "type": "text", "required": True, "placeholder": "Enter location"},
            {"label": "Vehicle Model", "type": "text", "required": False, "placeholder": "Enter vehicle model"},
            {"label": "Vehicle Number", "type": "text", "required": False, "placeholder": "Enter vehicle number"},
            {"label": "Description", "type": "textarea", "required": True, "placeholder": "Describe the incident"},
            {"label": "Police Report", "type": "select", "required": False, "options": ["Yes", "No"]},
            {"label": "FIR Number", "type": "text", "required": False, "placeholder": "Enter FIR number"}
        ]
    else:
        specific = [
            {"label": "Description", "type": "textarea", "required": True, "placeholder": "Describe what you need"}
        ]
    
    return common_fields + specific
