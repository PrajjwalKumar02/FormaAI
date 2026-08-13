import os
import re
from datetime import datetime
from config.ai_config import config
from services.gemini_service import (
    extract_with_gemini,
    generate_form_with_gemini,
    analyze_with_gemini,
    fallback_extraction
)

# ================================================================
#  MAIN EXTRACTION FUNCTION - CALL THIS FROM API
# ================================================================

def extract_incident_data(text):
    """
    Extract structured data from text using Gemini
    This is the main function called by the API
    """
    print(f"🔍 extract_incident_data called with {len(text)} characters")
    
    if config.AI_PROVIDER == "gemini":
        return extract_with_gemini(text)
    else:
        return fallback_extraction(text)


def generate_form(user_input):
    """
    Generate form using Gemini
    """
    if config.AI_PROVIDER == "gemini":
        result = generate_form_with_gemini(user_input)
    else:
        result = generate_form_basic(user_input)
    return result


def analyze_incident(incident_data):
    """
    Analyze incident using Gemini
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
            {"id": "name", "label": "Full Name", "type": "text", "required": True, "placeholder": "Enter your name"},
            {"id": "description", "label": "Description", "type": "textarea", "required": True, "placeholder": "Describe the incident"},
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
    if "student" in text_lower or "admission" in text_lower:
        return "student_registration"
    elif "employee" in text_lower or "staff" in text_lower:
        return "employee_registration"
    elif "patient" in text_lower or "hospital" in text_lower:
        return "patient_registration"
    elif "accident" in text_lower or "vehicle" in text_lower or "car" in text_lower:
        return "incident_report"
    elif "theft" in text_lower or "stolen" in text_lower:
        return "theft_report"
    elif "fire" in text_lower:
        return "fire_report"
    else:
        return "general_form"


def get_form_fields(form_type):
    """Get form fields based on form type"""
    common_fields = [
        {"id": "name", "label": "Full Name", "type": "text", "required": True, "placeholder": "Enter your full name"},
        {"id": "phone", "label": "Phone Number", "type": "tel", "required": True, "placeholder": "Enter phone number"},
        {"id": "email", "label": "Email Address", "type": "email", "required": False, "placeholder": "Enter email address"}
    ]
    
    if form_type == "student_registration":
        specific = [
            {"id": "rollNumber", "label": "Roll Number", "type": "text", "required": True, "placeholder": "Enter roll number"},
            {"id": "department", "label": "Department", "type": "text", "required": True, "placeholder": "Enter department"},
            {"id": "year", "label": "Year", "type": "select", "required": True, "options": ["1st", "2nd", "3rd", "4th"]}
        ]
    elif form_type == "employee_registration":
        specific = [
            {"id": "employeeId", "label": "Employee ID", "type": "text", "required": True, "placeholder": "Enter employee ID"},
            {"id": "department", "label": "Department", "type": "select", "required": True, "options": ["HR", "Engineering", "Finance", "Marketing"]},
            {"id": "designation", "label": "Designation", "type": "text", "required": True, "placeholder": "Enter designation"}
        ]
    elif form_type == "patient_registration":
        specific = [
            {"id": "age", "label": "Age", "type": "number", "required": True, "placeholder": "Enter age"},
            {"id": "symptoms", "label": "Symptoms", "type": "textarea", "required": True, "placeholder": "Describe symptoms"},
            {"id": "bloodGroup", "label": "Blood Group", "type": "select", "required": False, "options": ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
        ]
    elif form_type in ["incident_report", "theft_report", "fire_report"]:
        specific = [
            {"id": "incidentType", "label": "Incident Type", "type": "text", "required": True, "placeholder": "Enter incident type"},
            {"id": "severity", "label": "Severity", "type": "select", "required": True, "options": ["Low", "Medium", "High", "Critical"]},
            {"id": "location", "label": "Location", "type": "text", "required": True, "placeholder": "Enter location"},
            {"id": "date", "label": "Date of Incident", "type": "date", "required": True},
            {"id": "time", "label": "Time of Incident", "type": "time", "required": False},
            {"id": "vehicle", "label": "Vehicle Model", "type": "text", "required": False, "placeholder": "Enter vehicle model"},
            {"id": "vehicleNumber", "label": "Vehicle Number", "type": "text", "required": False, "placeholder": "Enter vehicle number"},
            {"id": "description", "label": "Description", "type": "textarea", "required": True, "placeholder": "Describe the incident in detail"},
            {"id": "policeReport", "label": "Police Report", "type": "select", "required": False, "options": ["Yes", "No"]},
            {"id": "firNumber", "label": "FIR Number", "type": "text", "required": False, "placeholder": "Enter FIR number"},
            {"id": "policeStation", "label": "Police Station", "type": "text", "required": False, "placeholder": "Enter police station name"}
        ]
    else:
        specific = [
            {"id": "description", "label": "Description", "type": "textarea", "required": True, "placeholder": "Describe what you need"}
        ]
    
    return common_fields + specific


def generate_form_from_extracted(extracted_data, form_type="incident"):
    """Generate form from already extracted data"""
    fields = []
    for key, value in extracted_data.items():
        if value and value != "Not provided":
            fields.append({
                "id": key,
                "label": key.replace("_", " ").title(),
                "type": "text",
                "value": value,
                "required": False
            })
    
    return {
        "title": f"{form_type.replace('_', ' ').title()} Report",
        "fields": fields,
        "totalFields": len(fields)
    }
