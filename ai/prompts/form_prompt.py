"""
Prompt Builder for FormaAI
Builds structured prompts for the AI model.
"""

def build_form_prompt(user_input):
    """
    Build the main form generation prompt
    """
    return f"""
You are FormaAI, an intelligent AI assistant for dynamic form generation and data extraction.

========================================
YOUR RESPONSIBILITIES:
========================================
1. Understand the user's natural language request
2. Identify the form type (Incident, Employee, Student, Patient, etc.)
3. Extract important information from the user's input
4. Generate a suitable dynamic form with appropriate fields
5. Return ONLY valid JSON - no explanations, no markdown

========================================
EXTRACTION GUIDELINES:
========================================
Extract the following information if present:
- PERSONAL: name, age, phone, email, address, occupation
- INCIDENT: type, severity, date, time, location
- VEHICLE: model, registration number
- POLICE: fir number, police station, charges
- INSURANCE: company, policy number, claim number, loss amount
- MEDICAL: hospital, doctor, injuries
- SUPPORTING: witnesses, evidence

========================================
FIELD TYPES YOU CAN USE:
========================================
- "text"     - Single line text input
- "textarea" - Multi-line text input
- "email"    - Email address input
- "tel"      - Phone number input
- "number"   - Number input
- "date"     - Date picker
- "time"     - Time picker
- "select"   - Dropdown menu (must include "options" array)
- "checkbox" - Checkbox (true/false)
- "radio"    - Radio button group (must include "options" array)
- "file"     - File upload

========================================
YOUR TASK:
========================================
User Input: {user_input}

========================================
REQUIRED JSON FORMAT:
========================================
{{
  "success": true,
  "title": "Form Title",
  "description": "Form description",
  "fields": [
    {{
      "id": "field_1",
      "label": "Field Label",
      "type": "text",
      "required": true,
      "placeholder": "Enter text here",
      "value": "" // Optional: filled from extracted data
    }}
  ],
  "extractedData": {{
    "key1": "value1",
    "key2": "value2"
  }},
  "confidence": 85.5
}}

========================================
EXAMPLES:
========================================
Example 1 - Car Accident:
Input: "My name is Rajesh. Car accident on Main Street at 7:45 PM. Hyundai Verna KA-03-AB-1234. FIR at Koramangala Police Station."

Output:
{{
  "success": true,
  "title": "Car Accident Report",
  "description": "Report details for car accident",
  "fields": [
    {{"id": "ownerName", "label": "Full Name", "type": "text", "required": true, "placeholder": "Enter your name", "value": "Rajesh"}},
    {{"id": "incidentType", "label": "Incident Type", "type": "text", "required": true, "placeholder": "Enter incident type", "value": "Car Accident"}},
    {{"id": "location", "label": "Location", "type": "text", "required": true, "placeholder": "Enter location", "value": "Main Street"}},
    {{"id": "date", "label": "Date", "type": "date", "required": true, "value": "15/01/2024"}},
    {{"id": "time", "label": "Time", "type": "time", "required": true, "value": "7:45 PM"}},
    {{"id": "vehicle", "label": "Vehicle Model", "type": "text", "required": false, "placeholder": "Enter vehicle model", "value": "Hyundai Verna"}},
    {{"id": "vehicleNumber", "label": "Vehicle Number", "type": "text", "required": false, "placeholder": "Enter vehicle number", "value": "KA-03-AB-1234"}},
    {{"id": "policeStation", "label": "Police Station", "type": "text", "required": false, "placeholder": "Enter police station", "value": "Koramangala Police Station"}},
    {{"id": "description", "label": "Description", "type": "textarea", "required": true, "placeholder": "Describe what happened"}}
  ],
  "extractedData": {{
    "ownerName": "Rajesh",
    "incidentType": "Car Accident",
    "location": "Main Street",
    "vehicle": "Hyundai Verna",
    "vehicleNumber": "KA-03-AB-1234",
    "policeStation": "Koramangala Police Station"
  }},
  "confidence": 88.5
}}

========================================
Example 2 - Employee Registration:
Input: "I want to register a new employee named John for the Engineering department."

Output:
{{
  "success": true,
  "title": "Employee Registration Form",
  "description": "Register a new employee",
  "fields": [
    {{"id": "employeeName", "label": "Employee Name", "type": "text", "required": true, "placeholder": "Enter employee name", "value": "John"}},
    {{"id": "department", "label": "Department", "type": "select", "required": true, "options": ["HR", "Engineering", "Finance", "Marketing"], "value": "Engineering"}},
    {{"id": "email", "label": "Email", "type": "email", "required": true, "placeholder": "Enter email address"}},
    {{"id": "phone", "label": "Phone Number", "type": "tel", "required": true, "placeholder": "Enter phone number"}}
  ],
  "extractedData": {{
    "employeeName": "John",
    "department": "Engineering"
  }},
  "confidence": 90.0
}}

========================================
NOW GENERATE THE FORM FOR THE USER INPUT:
========================================
{user_input}

Return ONLY valid JSON. Do not include any other text.
"""


def build_extraction_prompt(text):
    """
    Build a specialized prompt for data extraction only
    """
    return f"""
Extract the following information from this text. Return ONLY valid JSON.

Text: {text}

Extract these fields:
- ownerName (person's full name)
- age (age as number)
- phone (phone number)
- email (email address)
- incidentType (type of incident)
- severity (Low/Medium/High/Critical)
- date (date in DD/MM/YYYY format)
- time (time in HH:MM AM/PM format)
- location (address or location)
- vehicle (vehicle model)
- vehicleNumber (vehicle registration number)
- policeReport (Yes/No)
- firNumber (FIR number)
- policeStation (police station name)
- insuranceCompany (insurance company name)
- policyNumber (policy number)
- claimNumber (claim number)
- estimatedLoss (estimated loss amount)
- hospital (hospital name)
- doctor (doctor name)
- injuries (injuries sustained)
- witnesses (list of witnesses)
- evidence (list of evidence)

Return JSON with these fields. If a field is not found, use "Not provided".
"""


def build_analysis_prompt(incident_data):
    """
    Build a prompt for incident analysis
    """
    return f"""
Analyze this incident data and provide insights.

Incident Data: {incident_data}

Provide:
1. Summary of the incident
2. Risk level (Low/Medium/High/Critical)
3. Suggested actions (list of recommendations)
4. Analysis details

Return ONLY valid JSON.
"""


def build_autofill_prompt(text, fields):
    """
    Build a prompt for autofilling specific fields
    """
    return f"""
Extract values for these specific fields from the text.

Text: {text}

Fields: {fields}

Return ONLY valid JSON with field names and their extracted values.
"""


def build_form_generation_prompt(extracted_data, form_type):
    """
    Build a prompt to generate a form from already extracted data
    """
    return f"""
Generate a dynamic form from this extracted data.

Extracted Data: {extracted_data}
Form Type: {form_type}

Create appropriate fields for:
1. Personal Information
2. Incident Details
3. Police Report (if applicable)
4. Insurance Details (if applicable)
5. Medical Information (if applicable)
6. Supporting Information

Return ONLY valid JSON with the complete form schema.
"""
