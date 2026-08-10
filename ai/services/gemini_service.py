import os
import json
import re
from datetime import datetime

#  Try to import Gemini, fallback if not available
try:
    import google.generativeai as genai  # type: ignore
    GEMINI_AVAILABLE = True
except ImportError:
    print("⚠️ google-generativeai not installed. Using fallback extraction.")
    GEMINI_AVAILABLE = False

#  Import config - handle both ways
try:
    from config.ai_config import config
except ImportError:
    # Fallback config
    class Config:
        GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
        GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-pro")
        GEMINI_GENERATION_CONFIG = {
            "temperature": 0.3,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 1024,
        }
        GEMINI_SAFETY_SETTINGS = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        ]
    config = Config()

# Configure Gemini if available
if GEMINI_AVAILABLE and config.GEMINI_API_KEY:
    genai.configure(api_key=config.GEMINI_API_KEY)
    print("✅ Gemini configured successfully")

# ================================================================
#  GEMINI HELPERS
# ================================================================

def get_gemini_model(model_name=None):
    """Get Gemini model instance"""
    if not GEMINI_AVAILABLE:
        return None
    
    model_name = model_name or config.GEMINI_MODEL
    return genai.GenerativeModel(
        model_name=model_name,
        generation_config=config.GEMINI_GENERATION_CONFIG,
        safety_settings=config.GEMINI_SAFETY_SETTINGS,
    )


def extract_with_gemini(text):
    """
    Extract structured data using Gemini
    """
    # If Gemini not available, use fallback
    if not GEMINI_AVAILABLE or not config.GEMINI_API_KEY:
        print("⚠️ Gemini not available, using fallback extraction")
        return fallback_extraction(text)
    
    try:
        model = get_gemini_model()
        
        prompt = f"""
Extract the following information from this text. Return ONLY valid JSON.

Text: {text}

Extract these fields:
- ownerName (person's full name)
- age (age as number)
- phone (phone number)
- email (email address)
- incidentType (type of incident: Accident, Fire, Theft, Injury, etc.)
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
        
        response = model.generate_content(prompt)
        
        # Parse JSON from response
        result_text = response.text.strip()
        
        # Extract JSON from markdown if present
        if "```json" in result_text:
            result_text = result_text.split("```json")[1].split("```")[0].strip()
        elif "```" in result_text:
            result_text = result_text.split("```")[1].split("```")[0].strip()
        
        extracted = json.loads(result_text)
        return extracted
        
    except Exception as e:
        print(f"⚠️ Gemini extraction error: {e}")
        return fallback_extraction(text)


def generate_form_with_gemini(user_input):
    """
    Generate form using Gemini
    """
    # If Gemini not available, use fallback
    if not GEMINI_AVAILABLE or not config.GEMINI_API_KEY:
        print("⚠️ Gemini not available, using fallback form generation")
        return generate_form_fallback(user_input)
    
    try:
        model = get_gemini_model()
        
        prompt = f"""
You are FormaAI, an intelligent AI assistant for dynamic form generation.

Generate a dynamic form based on this user input:

User Input: {user_input}

Return ONLY valid JSON with this structure:
{{
    "success": true,
    "title": "Form Title",
    "fields": [
        {{
            "label": "Field Label",
            "type": "text",
            "required": true,
            "placeholder": "Enter text here"
        }}
    ],
    "extractedData": {{}}
}}

Available field types: text, textarea, email, tel, number, date, time, select, checkbox, radio

For select and radio fields, include an "options" array.
"""
        
        response = model.generate_content(prompt)
        
        # Parse JSON from response
        result_text = response.text.strip()
        if "```json" in result_text:
            result_text = result_text.split("```json")[1].split("```")[0].strip()
        elif "```" in result_text:
            result_text = result_text.split("```")[1].split("```")[0].strip()
        
        result = json.loads(result_text)
        return result
        
    except Exception as e:
        print(f"⚠️ Gemini form generation error: {e}")
        return generate_form_fallback(user_input)


def analyze_with_gemini(incident_data):
    """
    Analyze incident using Gemini
    """
    if not GEMINI_AVAILABLE or not config.GEMINI_API_KEY:
        return {
            "summary": "Incident analyzed (fallback)",
            "riskLevel": "Medium",
            "suggestedActions": ["Review documentation", "Contact insurance"],
            "analysisDetails": {}
        }
    
    try:
        model = get_gemini_model()
        
        prompt = f"""
Analyze this incident data and provide insights.

Incident Data: {incident_data}

Return ONLY valid JSON with:
{{
    "summary": "Brief summary of the incident",
    "riskLevel": "Low/Medium/High/Critical",
    "suggestedActions": ["Action 1", "Action 2"],
    "analysisDetails": {{}}
}}
"""
        
        response = model.generate_content(prompt)
        
        result_text = response.text.strip()
        if "```json" in result_text:
            result_text = result_text.split("```json")[1].split("```")[0].strip()
        elif "```" in result_text:
            result_text = result_text.split("```")[1].split("```")[0].strip()
        
        result = json.loads(result_text)
        return result
        
    except Exception as e:
        print(f"⚠️ Gemini analysis error: {e}")
        return {
            "summary": "Analysis failed",
            "riskLevel": "Medium",
            "suggestedActions": ["Contact support"],
            "analysisDetails": {}
        }


def fallback_extraction(text):
    """Fallback extraction using keywords"""
    text_lower = text.lower()
    extracted = {}
    
    # Vehicle detection
    vehicles = ["honda", "toyota", "hyundai", "maruti", "suzuki", "ford", "tata", "mahindra"]
    for vehicle in vehicles:
        if vehicle in text_lower:
            extracted["vehicle"] = vehicle.title()
            break
    
    # Incident type
    if "accident" in text_lower or "crash" in text_lower:
        extracted["incidentType"] = "Accident"
    elif "fire" in text_lower:
        extracted["incidentType"] = "Fire"
    elif "theft" in text_lower or "stolen" in text_lower:
        extracted["incidentType"] = "Theft"
    else:
        extracted["incidentType"] = "General Incident"
    
    # Name
    name_match = re.search(r"my name is\s+([A-Z][a-z]+\s+[A-Z][a-z]+)", text, re.IGNORECASE)
    if name_match:
        extracted["ownerName"] = name_match.group(1)
    
    # Location
    location_match = re.search(r"(?:at|in)\s+([^,.]+(?:,\s*[^,.]+)?)", text, re.IGNORECASE)
    if location_match:
        extracted["location"] = location_match.group(1).strip()
    
    return extracted


def generate_form_fallback(user_input):
    """Fallback form generation"""
    extracted = fallback_extraction(user_input)
    
    return {
        "success": True,
        "title": "Generated Form",
        "fields": [
            {"label": "Full Name", "type": "text", "required": True, "placeholder": "Enter your name"},
            {"label": "Description", "type": "textarea", "required": True, "placeholder": "Describe the incident"},
        ],
        "extractedData": extracted
    }
