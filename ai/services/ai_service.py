"""
AI Service
Handles AI request processing.
"""

from prompts.form_prompt import build_form_prompt
from utils.json_validator import validate_response


def extract_information(text):
    extracted_data = {}

    if "honda" in text:
        extracted_data["vehicle"] = "Honda"

    if "toyota" in text:
        extracted_data["vehicle"] = "Toyota"

    if "deer" in text:
        extracted_data["incidentType"] = "Animal Collision"

    if "windshield" in text:
        extracted_data["damage"] = "Windshield"

    if "nh48" in text:
        extracted_data["road"] = "NH48"

    return extracted_data

def autofill_fields(fields, extracted_data):
    for field in fields:
        label = field["label"].lower()

        if "vehicle" in label and "vehicle" in extracted_data:
            field["value"] = extracted_data["vehicle"]

        elif "road" in label and "road" in extracted_data:
            field["value"] = extracted_data["road"]

        elif "damage" in label and "damage" in extracted_data:
            field["value"] = extracted_data["damage"]

        elif "incident" in label and "incidentType" in extracted_data:
            field["value"] = extracted_data["incidentType"]

    return fields


def generate_form(user_input):
    prompt = build_form_prompt(user_input)
    text = user_input.lower()
    extracted_data = extract_information(text)

    if "student" in text:
        response = {
            "success": True,
            "title": "Student Registration Form",
            "fields": [
                {"label": "Student Name", "type": "text", "required": True, "placeholder": "Enter student name"},
                {"label": "Roll Number", "type": "text", "required": True, "placeholder": "Enter roll number"},
                {"label": "Department", "type": "text", "required": True, "placeholder": "Enter department"} ,
                {"label": "Vehicle", "type": "text", "required": False, "placeholder": "Vehicle involved"},
                {"label": "Road", "type": "text", "required": False, "placeholder": "Road name"},
                {"label": "Damage", "type": "text", "required": False, "placeholder": "Damage details"},
                {"label": "Incident Type", "type": "text", "required": False, "placeholder": "Incident type"}  
            ]
        }

    elif "employee" in text:
        response = {
            "success": True,
            "title": "Employee Registration Form",
            "fields": [
                {"label": "Employee Name", "type": "text", "required": True, "placeholder": "Enter employee name"},
                {"label": "Employee ID", "type": "text", "required": True, "placeholder": "Enter employee ID"},
                {"label": "Department", "type": "text", "required": True, "placeholder": "Enter department"}
            ]
        }

    elif "hospital" in text or "patient" in text:
        response = {
            "success": True,
            "title": "Patient Registration Form",
            "fields": [
                {"label": "Patient Name", "type": "text", "required": True, "placeholder": "Enter patient name"},
                {"label": "Age", "type": "number", "required": True, "placeholder": "Enter age"},
                {"label": "Symptoms", "type": "textarea", "required": True, "placeholder": "Describe symptoms"}
            ]
        }

    else:
        response = {
            "success": True,
            "title": "Generated Form",
            "fields": [
                {
                   "label": "Full Name",
                   "type": "text",
                   "required": True,
                   "placeholder": "Enter your full name"
                }
            ],
               "extractedData": extracted_data
        }

    if validate_response(response):
        response["fields"] = autofill_fields(
           response["fields"],
           extracted_data
    )

        response["extractedData"] = extracted_data

        return response
    return {
        "success": False,
        "title": "Invalid Response",
        "fields": []
    }