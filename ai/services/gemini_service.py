import os
import json
import re
from google import genai
from config.ai_config import config

print("=" * 60)
print("🔍 LOADING GEMINI SERVICE - COMPLETE")
print("=" * 60)

api_key = config.GEMINI_API_KEY
if not api_key:
    print("❌ GEMINI_API_KEY is MISSING!")
    client = None
else:
    print(f"✅ API Key found: {api_key[:15]}...")
    try:
        client = genai.Client(api_key=api_key)
        print("✅ Gemini client initialized successfully")
    except Exception as e:
        print(f"❌ Client initialization error: {e}")
        client = None

# ================================================================
#  COMPLETE FIELDS LIST
# ================================================================

COMPLETE_FIELDS = [
    # Personal Information (16 fields)
    "fullName", "dateOfBirth", "age", "gender", "nationality", 
    "aadharNumber", "panNumber", "phoneNumber", "alternatePhone", 
    "emailAddress", "address", "city", "state", "pincode", 
    "occupation", "employer",
    
    # Incident Details (11 fields)
    "incidentType", "incidentDescription", "severity", "incidentDate", 
    "incidentTime", "incidentLocation", "landmark", "weatherConditions", 
    "roadConditions", "accidentType", "trafficLight",
    
    # Vehicle Details (12 fields)
    "vehicleType", "vehicleMake", "vehicleModel", "vehicleYear", 
    "vehicleColor", "vehicleNumber", "chassisNumber", "engineNumber", 
    "vehicleOwner", "vehicleInsuranceType", "vehicleDamage", "repairEstimate",
    
    # Police Details (7 fields)
    "policeReportFiled", "firNumber", "policeStationName", 
    "policeOfficerName", "policeBadgeNumber", "policeReportDate", 
    "chargesFiled",
    
    # Insurance Details (14 fields)
    "insuranceCompanyName", "insuranceType", "policyNumber", 
    "policyStartDate", "policyEndDate", "claimNumber", "claimType", 
    "claimDate", "claimStatus", "claimAmount", "settlementAmount", 
    "excessAmount", "surveyorName", "paymentStatus",
    
    # Financial Details (7 fields)
    "estimatedTotalLoss", "totalDamageCost", "thirdPartyDamage", 
    "propertyDamage", "medicalExpenses", "towingCost", "storageCharges",
    
    # Medical Details (13 fields)
    "hospitalName", "doctorName", "specialistName", "injuriesDescription",
    "injurySeverity", "injuryType", "bodyPart", "treatmentStatus",
    "treatmentCost", "ambulanceService", "medicalLeaveDays", "recoveryTime",
    "disability", "medication",
    
    # Witnesses (4 fields)
    "witnesses", "witnessPhone", "witnessAddress", "witnessStatement",
    
    # Evidence (1 field)
    "evidenceAvailable",
    
    # Additional Information (6 fields)
    "drivingExperience", "drivingLicenseNumber", "emergencyContact",
    "emergencyContactPhone", "notes", "attachments"
]

# ================================================================
#  MAIN EXTRACTION FUNCTION
# ================================================================

def extract_with_gemini(text):
    """Extract ALL information using Gemini"""
    if not client:
        print("❌ Gemini client not available")
        return fallback_extraction_complete(text)
    
    try:
        print("🤖 Extracting with Gemini...")
        
        prompt = f"""
You are an expert data extraction AI for insurance claims. Extract ALL possible information from this text.
Return ONLY valid JSON with no markdown, no explanations.

TEXT:
{text}

EXTRACT THESE EXACT FIELDS (use "Not provided" if missing):

PERSONAL INFORMATION:
- fullName: Full name of the person
- dateOfBirth: Date of birth in DD/MM/YYYY format
- age: Age as number
- gender: Male/Female/Other
- nationality: Nationality
- aadharNumber: 12-digit Aadhar number
- panNumber: PAN card number (5 letters, 4 digits, 1 letter)
- phoneNumber: Primary phone number
- alternatePhone: Alternate phone number
- emailAddress: Email address
- address: Complete address
- city: City
- state: State
- pincode: 6-digit pincode
- occupation: Job title
- employer: Company name

INCIDENT DETAILS:
- incidentType: Type of incident (Accident, Theft, Fire, Injury, etc.)
- incidentDescription: Full detailed description of incident
- severity: Level (Critical/High/Medium/Low)
- incidentDate: Date in DD/MM/YYYY format
- incidentTime: Time in HH:MM AM/PM format
- incidentLocation: Location where incident occurred
- landmark: Nearby landmark
- weatherConditions: Weather at time (Sunny/Rainy/Foggy etc.)
- roadConditions: Road conditions (Dry/Wet/Slippery etc.)
- accidentType: Type (Head-on/Rear-end/Side-impact/Rollover etc.)
- trafficLight: Traffic light status (Red/Green/Yellow/Not applicable)

VEHICLE DETAILS:
- vehicleType: Car/Bike/Truck/SUV/Sedan etc.
- vehicleMake: Make (Hyundai, Toyota, Honda, etc.)
- vehicleModel: Model name
- vehicleYear: Manufacturing year (YYYY)
- vehicleColor: Color
- vehicleNumber: Registration number
- chassisNumber: 17-digit VIN/Chassis number
- engineNumber: Engine number
- vehicleOwner: Owner name
- vehicleInsuranceType: Comprehensive/Third Party
- vehicleDamage: Description of damage
- repairEstimate: Repair estimate amount

POLICE DETAILS:
- policeReportFiled: Yes/No
- firNumber: FIR number
- policeStationName: Police station name
- policeOfficerName: Investigating officer name
- policeBadgeNumber: Officer badge number
- policeReportDate: Report filing date
- chargesFiled: Charges filed

INSURANCE DETAILS:
- insuranceCompanyName: Insurance company name
- insuranceType: Comprehensive/Third Party
- policyNumber: Policy number
- policyStartDate: Policy start date
- policyEndDate: Policy end date
- claimNumber: Claim number
- claimType: Theft/Accident/Damage/Loss
- claimDate: Claim filing date
- claimStatus: Pending/Approved/Rejected/Settled
- claimAmount: Claim amount
- settlementAmount: Settlement amount
- excessAmount: Excess/Deductible amount
- surveyorName: Surveyor name
- paymentStatus: Payment status

FINANCIAL DETAILS:
- estimatedTotalLoss: Estimated total loss amount
- totalDamageCost: Total damage cost
- thirdPartyDamage: Third party damage cost
- propertyDamage: Property damage amount
- medicalExpenses: Medical expenses
- towingCost: Towing charges
- storageCharges: Storage charges

MEDICAL DETAILS:
- hospitalName: Hospital name
- doctorName: Doctor name
- specialistName: Specialist doctor
- injuriesDescription: Injuries description
- injurySeverity: Minor/Moderate/Severe/Critical
- injuryType: Fracture/Burn/Head/Spinal etc.
- bodyPart: Body part affected
- treatmentStatus: Ongoing/Completed
- treatmentCost: Treatment cost
- ambulanceService: Ambulance used
- medicalLeaveDays: Medical leave days
- recoveryTime: Recovery time
- disability: Temporary/Permanent
- medication: Prescribed medication

WITNESSES:
- witnesses: List of witness names
- witnessPhone: Witness phone number
- witnessAddress: Witness address
- witnessStatement: Witness statement

EVIDENCE:
- evidenceAvailable: List of evidence (CCTV, Photos, Reports, etc.)

ADDITIONAL INFORMATION:
- drivingExperience: Years of driving experience
- drivingLicenseNumber: Driving license number
- emergencyContact: Emergency contact name
- emergencyContactPhone: Emergency contact phone
- notes: Additional notes
- attachments: List of attached files

Return ONLY valid JSON. Use "Not provided" for missing fields.
"""
        
        response = client.models.generate_content(
            model=config.GEMINI_MODEL,
            contents=prompt,
            config={
                "temperature": 0.0,
                "max_output_tokens": 8192,
            }
        )
        
        result_text = response.text.strip()
        print(f"📥 Raw response received")
        
        if "```json" in result_text:
            result_text = result_text.split("```json")[1].split("```")[0].strip()
        elif "```" in result_text:
            result_text = result_text.split("```")[1].split("```")[0].strip()
        
        extracted = json.loads(result_text)
        print(f"✅ Extraction successful! Found {len(extracted)} fields")
        
        fallback = fallback_extraction_complete(text)
        for key, value in fallback.items():
            if key not in extracted or extracted[key] == "Not provided" or extracted[key] == "":
                extracted[key] = value
        
        return extracted
        
    except Exception as e:
        print(f"❌ Gemini error: {e}")
        return fallback_extraction_complete(text)

# ================================================================
#  FORM GENERATION FUNCTION
# ================================================================

def generate_form_with_gemini(user_input):
    """Generate form using Gemini"""
    if not client:
        return {"success": False, "message": "Client not available"}
    
    try:
        print("🤖 Generating form with Gemini...")
        
        prompt = f"""
Generate a dynamic form based on this user input. Return ONLY valid JSON.

User Input: {user_input}

{{
    "success": true,
    "title": "Generated Form",
    "fields": [
        {{"label": "Field Label", "type": "text", "required": true, "placeholder": "Enter text"}}
    ],
    "extractedData": {{}}
}}
"""
        
        response = client.models.generate_content(
            model=config.GEMINI_MODEL,
            contents=prompt,
            config={
                "temperature": 0.3,
                "max_output_tokens": 4096,
            }
        )
        
        result_text = response.text.strip()
        if "```json" in result_text:
            result_text = result_text.split("```json")[1].split("```")[0].strip()
        elif "```" in result_text:
            result_text = result_text.split("```")[1].split("```")[0].strip()
        
        return json.loads(result_text)
        
    except Exception as e:
        print(f"❌ Form generation error: {e}")
        return {"success": False, "message": str(e)}

# ================================================================
#  ANALYSIS FUNCTION
# ================================================================

def analyze_with_gemini(incident_data):
    """Analyze incident using Gemini"""
    if not client:
        return {"summary": "Analysis failed", "riskLevel": "Medium"}
    
    try:
        print("🤖 Analyzing with Gemini...")
        
        prompt = f"""
Analyze this incident data and provide insights. Return ONLY valid JSON.

Data: {incident_data}

{{
    "summary": "Brief summary",
    "riskLevel": "Low/Medium/High/Critical",
    "suggestedActions": ["Action 1", "Action 2"],
    "analysisDetails": {{}}
}}
"""
        
        response = client.models.generate_content(
            model=config.GEMINI_MODEL,
            contents=prompt,
            config={
                "temperature": 0.3,
                "max_output_tokens": 4096,
            }
        )
        
        result_text = response.text.strip()
        if "```json" in result_text:
            result_text = result_text.split("```json")[1].split("```")[0].strip()
        elif "```" in result_text:
            result_text = result_text.split("```")[1].split("```")[0].strip()
        
        return json.loads(result_text)
        
    except Exception as e:
        print(f"❌ Analysis error: {e}")
        return {"summary": "Analysis failed", "riskLevel": "Medium"}

# ================================================================
#  COMPLETE FALLBACK EXTRACTION - ALL 90+ FIELDS
# ================================================================

def fallback_extraction_complete(text):
    """Complete fallback extraction with ALL fields"""
    print("⚠️ Using complete fallback extraction")
    extracted = {}
    
    # ============================================================
    # PERSONAL INFORMATION (16 fields)
    # ============================================================
    
    # Full Name
    name_patterns = [
        r"my name is\s+([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
        r"name\s*:?\s*([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
        r"full name\s*:?\s*([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
        r"([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:aged|age|,)",
    ]
    for pattern in name_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["fullName"] = match.group(1).strip()
            break
    
    # Date of Birth
    dob_patterns = [
        r"born\s+(?:on\s+)?(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})",
        r"DOB\s*:?\s*(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})",
        r"date of birth\s*:?\s*(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})",
    ]
    for pattern in dob_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["dateOfBirth"] = f"{match.group(1)}/{match.group(2)}/{match.group(3)}"
            break
    
    # Age
    age_patterns = [
        r"(\d{1,2})-year-old",
        r"age\s*:?\s*(\d{1,2})",
        r"aged\s+(\d{1,2})",
        r"(\d{1,2})\s+years old",
    ]
    for pattern in age_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["age"] = int(match.group(1))
            break
    
    # Gender
    if re.search(r"\bmale\b", text.lower()):
        extracted["gender"] = "Male"
    elif re.search(r"\bfemale\b", text.lower()):
        extracted["gender"] = "Female"
    
    # Nationality
    nationalities = ["Indian", "American", "British", "Canadian", "Australian", "German", "French", "Japanese", "Chinese"]
    for nationality in nationalities:
        if nationality.lower() in text.lower():
            extracted["nationality"] = nationality
            break
    
    # Aadhar Number
    aadhar_patterns = [
        r"\b\d{4}\s?\d{4}\s?\d{4}\b",
        r"aadhar\s*:?\s*(\d{4}\s?\d{4}\s?\d{4})",
    ]
    for pattern in aadhar_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["aadharNumber"] = re.sub(r'\s', '', match.group(0) if match.group(0) else match.group(1))
            break
    
    # PAN Number
    pan_patterns = [
        r"[A-Z]{5}[0-9]{4}[A-Z]{1}",
        r"PAN\s*:?\s*([A-Z]{5}[0-9]{4}[A-Z]{1})",
    ]
    for pattern in pan_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["panNumber"] = match.group(0) if match.group(0) else match.group(1)
            break
    
    # Phone Number
    phone_patterns = [
        r"\+?91[\s\-]?[6-9]\d{9}",
        r"phone\s*:?\s*([\+\d\s\-]{10,})",
        r"mobile\s*:?\s*([\+\d\s\-]{10,})",
        r"tel\s*:?\s*([\+\d\s\-]{10,})",
    ]
    for pattern in phone_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            phone = match.group(0).strip() if match.group(0) else match.group(1).strip()
            phone = re.sub(r'[^\d+]', '', phone)
            if len(phone) >= 10:
                extracted["phoneNumber"] = phone
                break
    
    # Alternate Phone
    alt_patterns = [
        r"alternate\s+(?:phone|mobile|number)\s*:?\s*([\+\d\s\-]{10,})",
        r"secondary\s+(?:phone|number)\s*:?\s*([\+\d\s\-]{10,})",
    ]
    for pattern in alt_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            alt_phone = re.sub(r'[^\d+]', '', match.group(1).strip())
            if len(alt_phone) >= 10:
                extracted["alternatePhone"] = alt_phone
                break
    
    # Email
    email_match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    if email_match:
        extracted["emailAddress"] = email_match.group(0)
    
    # Address
    addr_patterns = [
        r"address\s*:?\s*([^,\n]+(?:,\s*[^,\n]+)*)",
        r"lives?\s+at\s+([^,.]+(?:,\s*[^,.]+)*)",
        r"resides?\s+at\s+([^,.]+(?:,\s*[^,.]+)*)",
        r"#\d+[^.]*\d{6}",
    ]
    for pattern in addr_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["address"] = match.group(1).strip() if match.group(1) else match.group(0).strip()
            break
    
    # City
    city_match = re.search(r"Sector\s+\d+,\s*([A-Za-z\s]+?)\s*-\s*\d{6}", text)
    if city_match:
        extracted["city"] = city_match.group(1).strip()
    elif "address" in extracted:
        addr_parts = extracted["address"].split(",")
        for part in addr_parts:
            part = part.strip()
            if re.match(r"^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?$", part) and len(part) > 3:
                skip_words = ["apartments", "sector", "building", "floor", "street", "road", "lane"]
                if not any(word in part.lower() for word in skip_words):
                    extracted["city"] = part
                    break
    
    # State
    state_patterns = [
        r"(Karnataka|Maharashtra|Tamil Nadu|Delhi|Mumbai|Bangalore|Chennai|Hyderabad|Pune|Kerala|Goa|Rajasthan|Uttar Pradesh|Gujarat|West Bengal)",
        r"state\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
    ]
    for pattern in state_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["state"] = match.group(1).strip()
            break
    
    # Pincode
    pincode_match = re.search(r"\b(\d{6})\b", text)
    if pincode_match:
        extracted["pincode"] = pincode_match.group(1)
    
    # Occupation
    occ_patterns = [
        r"(?:working as|works as|occupation)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
        r"as\s+a(n?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
    ]
    for pattern in occ_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["occupation"] = match.group(1).strip() if len(match.groups()) == 1 else match.group(2).strip()
            break
    
    # Employer
    emp_patterns = [
        r"(?:working at|employer|company)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?(?:\s+Pvt\s+Ltd)?(?:\s+Limited)?)",
        r"at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?(?:\s+Pvt\s+Ltd)?(?:\s+Limited)?)(?:\s+in|\s+for|\s+as)",
    ]
    for pattern in emp_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["employer"] = match.group(1).strip()
            break
    
    # ============================================================
    # INCIDENT DETAILS (11 fields)
    # ============================================================
    
    # Incident Location
    loc_patterns = [
        r"at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:on|in|at)",
        r"location\s*:?\s*([^,\n]+)",
        r"occurred\s+(?:at|in)\s+([^,.]+)",
        r"near\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
    ]
    for pattern in loc_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            potential_loc = match.group(1).strip()
            skip_words = ["pm", "am", "january", "february", "march", "april", "may", "june", 
                         "july", "august", "september", "october", "november", "december",
                         "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
            if not any(word in potential_loc.lower() for word in skip_words):
                extracted["incidentLocation"] = potential_loc
                break
    
    # Incident Type
    if re.search(r"car\s+accident|vehicle\s+accident", text.lower()):
        extracted["incidentType"] = "Car Accident"
    elif re.search(r"road\s+accident|traffic\s+accident", text.lower()):
        extracted["incidentType"] = "Road Accident"
    elif "accident" in text.lower():
        extracted["incidentType"] = "Accident"
    elif "theft" in text.lower() or "stolen" in text.lower():
        extracted["incidentType"] = "Theft"
    elif "fire" in text.lower():
        extracted["incidentType"] = "Fire"
    elif "injury" in text.lower():
        extracted["incidentType"] = "Injury"
    elif "robbery" in text.lower():
        extracted["incidentType"] = "Robbery"
    elif "assault" in text.lower():
        extracted["incidentType"] = "Assault"
    else:
        extracted["incidentType"] = "General Incident"
    
    # Incident Description
    desc_patterns = [
        r"(?:description|incident)\s*:?\s*([^.]+\.[^.]*\.?)",
        r"description\s*:?\s*([^,\n]{10,})",
    ]
    for pattern in desc_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["incidentDescription"] = match.group(1).strip()
            break
    
    # Date
    date_patterns = [
        r"(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})",
        r"(\d{1,2})(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})",
        r"(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})",
    ]
    months = {"January": "01", "February": "02", "March": "03", "April": "04", "May": "05", 
              "June": "06", "July": "07", "August": "08", "September": "09", "October": "10", 
              "November": "11", "December": "12"}
    for pattern in date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            if len(match.groups()) == 3:
                if match.group(1).isdigit() and match.group(2).isdigit():
                    extracted["incidentDate"] = f"{match.group(1)}/{match.group(2)}/{match.group(3)}"
                elif match.group(1).isdigit() and not match.group(2).isdigit():
                    day = match.group(1)
                    month = match.group(2)
                    year = match.group(3)
                    if month in months:
                        extracted["incidentDate"] = f"{day}/{months[month]}/{year}"
                else:
                    month = match.group(1)
                    day = match.group(2)
                    year = match.group(3)
                    if month in months:
                        extracted["incidentDate"] = f"{day}/{months[month]}/{year}"
            break
    
    # Time
    time_patterns = [
        r"(\d{1,2}):(\d{2})\s*(AM|PM)",
        r"(\d{1,2})\s*(AM|PM)",
    ]
    for pattern in time_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            if len(match.groups()) == 3:
                extracted["incidentTime"] = f"{match.group(1)}:{match.group(2)} {match.group(3).upper()}"
            elif len(match.groups()) == 2:
                extracted["incidentTime"] = f"{match.group(1)}:00 {match.group(2).upper()}"
            break
    
    # Severity
    severity_keywords = {
        "critical": "Critical", "severe": "Critical", "fatal": "Critical",
        "high": "High", "major": "High", "serious": "High",
        "medium": "Medium", "moderate": "Medium",
        "low": "Low", "minor": "Low",
    }
    for keyword, severity in severity_keywords.items():
        if keyword in text.lower():
            extracted["severity"] = severity
            break
    
    # Landmark
    landmark_match = re.search(r"near\s+([^,.]{3,})", text, re.IGNORECASE)
    if landmark_match:
        extracted["landmark"] = landmark_match.group(1).strip()
    
    # Weather
    weather_keywords = ["sunny", "rainy", "cloudy", "foggy", "clear", "storm", "rain", "thunder", "lightning", "snow"]
    for weather in weather_keywords:
        if weather in text.lower():
            extracted["weatherConditions"] = weather.title()
            break
    
    # Road Conditions
    road_keywords = ["dry", "wet", "slippery", "icy", "snowy", "muddy", "pothole", "uneven"]
    for road in road_keywords:
        if road in text.lower():
            extracted["roadConditions"] = road.title()
            break
    
    # Accident Type
    accident_types = ["head-on", "rear-end", "side-impact", "rollover", "multi-vehicle", "pedestrian", "single-vehicle"]
    for acc_type in accident_types:
        if acc_type in text.lower():
            extracted["accidentType"] = acc_type.title()
            break
    
    # Traffic Light
    traffic_keywords = ["red light", "green light", "yellow light", "signal", "traffic light"]
    for traffic in traffic_keywords:
        if traffic in text.lower():
            if "red" in text.lower():
                extracted["trafficLight"] = "Red"
            elif "green" in text.lower():
                extracted["trafficLight"] = "Green"
            elif "yellow" in text.lower():
                extracted["trafficLight"] = "Yellow"
            else:
                extracted["trafficLight"] = "Present"
            break
    
    # ============================================================
    # VEHICLE DETAILS (12 fields)
    # ============================================================
    
    # Vehicle Type
    vehicle_types = ["car", "bike", "motorcycle", "scooter", "truck", "bus", "auto", "van", "suv", "sedan", "hatchback"]
    for v_type in vehicle_types:
        if v_type in text.lower():
            extracted["vehicleType"] = v_type.title()
            break
    
    # Vehicle Make
    vehicles = ["hyundai", "toyota", "honda", "maruti", "suzuki", "ford", "tata", 
                "mahindra", "bmw", "mercedes", "audi", "volkswagen", "nissan", 
                "renault", "skoda", "volvo", "jeep"]
    for v in vehicles:
        if v in text.lower():
            extracted["vehicleMake"] = v.title()
            break
    
    # Vehicle Model
    model_match = re.search(rf"{extracted.get('vehicleMake', '').lower()}\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)", text, re.IGNORECASE)
    if model_match:
        extracted["vehicleModel"] = model_match.group(1)
    
    # Vehicle Year
    year_match = re.search(r"(19|20)\d{2}\s+(?:model|make|vehicle)", text, re.IGNORECASE)
    if year_match:
        extracted["vehicleYear"] = year_match.group(0)[:4]
    
    # Vehicle Color
    colors = ["red", "blue", "black", "white", "silver", "gray", "grey", "green", "yellow", "orange", "brown", "gold"]
    for color in colors:
        if color in text.lower():
            extracted["vehicleColor"] = color.title()
            break
    
    # Vehicle Number
    vn_patterns = [
        r"[A-Z]{2}[\s\-]?\d{2}[\s\-]?[A-Z]{1,2}[\s\-]?\d{4}",
        r"[A-Z]{2}[\s\-]?\d{2}[\s\-]?[A-Z]{1,2}[\s\-]?\d{3,4}",
    ]
    for pattern in vn_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["vehicleNumber"] = match.group(0).upper()
            break
    
    # Chassis Number
    chassis_patterns = [
        r"chassis\s*(?:number|no\.?)?\s*:?\s*([A-Z0-9]{17})",
        r"VIN\s*:?\s*([A-Z0-9]{17})",
    ]
    for pattern in chassis_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["chassisNumber"] = match.group(1)
            break
    
    # Engine Number
    engine_patterns = [
        r"engine\s*(?:number|no\.?)?\s*:?\s*([A-Z0-9\-]+)",
        r"engine\s*:?\s*([A-Z0-9\-]+)",
    ]
    for pattern in engine_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["engineNumber"] = match.group(1)
            break
    
    # Vehicle Owner
    owner_match = re.search(r"owner\s*:?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)", text, re.IGNORECASE)
    if owner_match:
        extracted["vehicleOwner"] = owner_match.group(1)
    
    # Vehicle Insurance Type
    if "comprehensive" in text.lower():
        extracted["vehicleInsuranceType"] = "Comprehensive"
    elif "third party" in text.lower():
        extracted["vehicleInsuranceType"] = "Third Party"
    
    # Vehicle Damage
    damage_match = re.search(r"(?:damage|dented|scratched|broken)\s*:?\s*([^,.]+)", text, re.IGNORECASE)
    if damage_match:
        extracted["vehicleDamage"] = damage_match.group(1).strip()
    
    # Repair Estimate
    repair_match = re.search(r"repair\s*(?:estimate|cost)\s*:?\s*[\₹\$€£]?\s?([\d,]+(?:\.\d+)?)", text, re.IGNORECASE)
    if repair_match:
        extracted["repairEstimate"] = f"₹{repair_match.group(1)}"
    
    # ============================================================
    # POLICE DETAILS (7 fields)
    # ============================================================
    
    # Police Report Filed
    if "police" in text.lower() or "fir" in text.lower():
        extracted["policeReportFiled"] = "Yes"
    
    # FIR Number
    fir_patterns = [
        r"FIR[\s\-]?(\d{4}[\s\-]?\d{6})",
        r"FIR[\s\-]?([A-Z0-9\-]+)",
        r"FIR\s*Number\s*:?\s*([A-Z0-9\-]+)",
    ]
    for pattern in fir_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["firNumber"] = f"FIR-{match.group(1)}"
            break
    
    # Police Station
    ps_match = re.search(r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+Police\s+Station", text)
    if ps_match:
        extracted["policeStationName"] = f"{ps_match.group(1)} Police Station"
    
    # Police Officer Name
    officer_patterns = [
        r"officer\s*:?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)",
        r"([A-Z][a-z]+\s+[A-Z][a-z]+)\s+(?:investigating officer|police officer)",
    ]
    for pattern in officer_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["policeOfficerName"] = match.group(1)
            break
    
    # Police Badge Number
    badge_match = re.search(r"badge\s*(?:number|no\.?)?\s*:?\s*([A-Z0-9\-]+)", text, re.IGNORECASE)
    if badge_match:
        extracted["policeBadgeNumber"] = badge_match.group(1)
    
    # Police Report Date
    police_date = re.search(r"report\s+(?:filed|dated)\s+(?:on\s+)?(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})", text, re.IGNORECASE)
    if police_date:
        extracted["policeReportDate"] = f"{police_date.group(1)}/{police_date.group(2)}/{police_date.group(3)}"
    
    # Charges Filed
    charges_match = re.search(r"charges?\s*:?\s*([^,.]+)", text, re.IGNORECASE)
    if charges_match:
        extracted["chargesFiled"] = charges_match.group(1).strip()
    
    # ============================================================
    # INSURANCE DETAILS (14 fields)
    # ============================================================
    
    # Insurance Company
    insurance_companies = ["ICICI Lombard", "Bajaj Allianz", "New India Assurance", "SBI General", 
                          "HDFC Ergo", "Star Health", "TATA AIG", "Oriental Insurance", "United India",
                          "Reliance General", "Future Generali", "Royal Sundaram", "IFFCO Tokio"]
    for company in insurance_companies:
        if company.lower() in text.lower():
            extracted["insuranceCompanyName"] = company
            break
    
    # Insurance Type
    if "comprehensive" in text.lower():
        extracted["insuranceType"] = "Comprehensive"
    elif "third party" in text.lower():
        extracted["insuranceType"] = "Third Party"
    
    # Policy Number
    policy_patterns = [
        r"policy\s*(?:number|no\.?)?\s*:?\s*([A-Z0-9\-]+)",
        r"policy\s*:?\s*([A-Z0-9\-]+)",
    ]
    for pattern in policy_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["policyNumber"] = match.group(1)
            break
    
    # Policy Start Date
    policy_start = re.search(r"policy\s+(?:start|commencement)\s+(?:date)?\s*:?\s*(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})", text, re.IGNORECASE)
    if policy_start:
        extracted["policyStartDate"] = f"{policy_start.group(1)}/{policy_start.group(2)}/{policy_start.group(3)}"
    
    # Policy End Date
    policy_end = re.search(r"policy\s+(?:end|expiry|expiration)\s+(?:date)?\s*:?\s*(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})", text, re.IGNORECASE)
    if policy_end:
        extracted["policyEndDate"] = f"{policy_end.group(1)}/{policy_end.group(2)}/{policy_end.group(3)}"
    
    # Claim Number
    claim_patterns = [
        r"claim\s*(?:number|no\.?)?\s*:?\s*([A-Z0-9\-]+)",
        r"claim\s*:?\s*([A-Z0-9\-]+)",
    ]
    for pattern in claim_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["claimNumber"] = match.group(1)
            break
    
    # Claim Type
    claim_types = ["theft", "accident", "damage", "loss", "liability", "total loss"]
    for c_type in claim_types:
        if c_type in text.lower():
            extracted["claimType"] = c_type.title()
            break
    
    # Claim Date
    claim_date = re.search(r"claim\s+(?:filed|submitted|made)\s+(?:on\s+)?(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})", text, re.IGNORECASE)
    if claim_date:
        extracted["claimDate"] = f"{claim_date.group(1)}/{claim_date.group(2)}/{claim_date.group(3)}"
    
    # Claim Status
    status_keywords = ["pending", "approved", "rejected", "settled", "processing", "under review"]
    for status in status_keywords:
        if status in text.lower():
            extracted["claimStatus"] = status.title()
            break
    
    # Claim Amount
    claim_amount = re.search(r"claim\s+(?:amount|value)\s*:?\s*[\₹\$€£]?\s?([\d,]+(?:\.\d+)?)", text, re.IGNORECASE)
    if claim_amount:
        extracted["claimAmount"] = f"₹{claim_amount.group(1)}"
    
    # Settlement Amount
    settlement = re.search(r"settlement\s*(?:amount)?\s*:?\s*[\₹\$€£]?\s?([\d,]+(?:\.\d+)?)", text, re.IGNORECASE)
    if settlement:
        extracted["settlementAmount"] = f"₹{settlement.group(1)}"
    
    # Excess Amount
    excess_match = re.search(r"excess\s*(?:amount)?\s*:?\s*[\₹\$€£]?\s?([\d,]+(?:\.\d+)?)", text, re.IGNORECASE)
    if excess_match:
        extracted["excessAmount"] = f"₹{excess_match.group(1)}"
    
    # Surveyor Name
    surveyor_match = re.search(r"surveyor\s*:?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)", text, re.IGNORECASE)
    if surveyor_match:
        extracted["surveyorName"] = surveyor_match.group(1)
    
    # Payment Status
    payment_status = ["paid", "pending", "processing", "approved", "rejected", "settled"]
    for status in payment_status:
        if status in text.lower():
            extracted["paymentStatus"] = status.title()
            break
    
    # ============================================================
    # FINANCIAL DETAILS (7 fields)
    # ============================================================
    
    # Estimated Total Loss
    loss_patterns = [
        r"[\₹\$€£]?\s?([\d,]+(?:\.\d+)?)\s*(?:lakh|crore|thousand)?",
        r"loss\s*:?\s*[\₹\$€£]?\s?([\d,]+(?:\.\d+)?)",
    ]
    for pattern in loss_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            amount = match.group(1)
            if "lakh" in text.lower() and "crore" not in text.lower():
                extracted["estimatedTotalLoss"] = f"₹{amount} Lakh"
            elif "crore" in text.lower():
                extracted["estimatedTotalLoss"] = f"₹{amount} Crore"
            else:
                extracted["estimatedTotalLoss"] = f"₹{amount}"
            break
    
    # Total Damage Cost
    damage_cost = re.search(r"damage\s*(?:cost|amount)\s*:?\s*[\₹\$€£]?\s?([\d,]+(?:\.\d+)?)", text, re.IGNORECASE)
    if damage_cost:
        extracted["totalDamageCost"] = f"₹{damage_cost.group(1)}"
    
    # Third Party Damage
    third_party = re.search(r"third\s+party\s*(?:damage|cost)\s*:?\s*[\₹\$€£]?\s?([\d,]+(?:\.\d+)?)", text, re.IGNORECASE)
    if third_party:
        extracted["thirdPartyDamage"] = f"₹{third_party.group(1)}"
    
    # Property Damage
    property_damage = re.search(r"property\s*(?:damage|loss)\s*:?\s*[\₹\$€£]?\s?([\d,]+(?:\.\d+)?)", text, re.IGNORECASE)
    if property_damage:
        extracted["propertyDamage"] = f"₹{property_damage.group(1)}"
    
    # Medical Expenses
    medical_cost = re.search(r"medical\s*(?:expense|cost)\s*:?\s*[\₹\$€£]?\s?([\d,]+(?:\.\d+)?)", text, re.IGNORECASE)
    if medical_cost:
        extracted["medicalExpenses"] = f"₹{medical_cost.group(1)}"
    
    # Towing Cost
    towing_match = re.search(r"towing\s*(?:cost|charge)\s*:?\s*[\₹\$€£]?\s?([\d,]+(?:\.\d+)?)", text, re.IGNORECASE)
    if towing_match:
        extracted["towingCost"] = f"₹{towing_match.group(1)}"
    
    # Storage Charges
    storage_match = re.search(r"storage\s*(?:charge|cost)\s*:?\s*[\₹\$€£]?\s?([\d,]+(?:\.\d+)?)", text, re.IGNORECASE)
    if storage_match:
        extracted["storageCharges"] = f"₹{storage_match.group(1)}"
    
    # ============================================================
    # MEDICAL DETAILS (13 fields)
    # ============================================================
    
    # Hospital Name
    hospital_patterns = [
        r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+Hospital",
        r"hospital\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
    ]
    for pattern in hospital_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["hospitalName"] = f"{match.group(1)} Hospital"
            break
    
    # Doctor Name
    doctor_patterns = [
        r"Dr\.?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)",
        r"doctor\s*:?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)",
    ]
    for pattern in doctor_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["doctorName"] = f"Dr. {match.group(1)}"
            break
    
    # Specialist Name
    specialist_match = re.search(r"specialist\s*:?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)", text, re.IGNORECASE)
    if specialist_match:
        extracted["specialistName"] = specialist_match.group(1)
    
    # Injuries Description
    injury_keywords = ["fracture", "broken", "sprain", "head injury", "whiplash", "bruise", 
                      "wound", "bleeding", "concussion", "burn", "laceration", "contusion",
                      "dislocation", "crush", "puncture", "abrasion", "trauma"]
    injury_sentences = []
    sentences = re.split(r'[.!?]', text)
    for sentence in sentences:
        for keyword in injury_keywords:
            if keyword in sentence.lower():
                injury_sentences.append(sentence.strip())
                break
    if injury_sentences:
        extracted["injuriesDescription"] = "; ".join(injury_sentences)
    
    # Injury Severity
    injury_severity = ["minor", "moderate", "severe", "critical", "fatal"]
    for severity in injury_severity:
        if severity in text.lower():
            extracted["injurySeverity"] = severity.title()
            break
    
    # Injury Type
    injury_types = ["fracture", "burn", "head", "spinal", "whiplash", "contusion", "laceration", "abrasion"]
    for i_type in injury_types:
        if i_type in text.lower():
            extracted["injuryType"] = i_type.title()
            break
    
    # Body Part
    body_parts = ["head", "neck", "back", "arm", "leg", "hand", "foot", "shoulder", "knee", "hip", "chest", "abdomen"]
    for part in body_parts:
        if part in text.lower():
            extracted["bodyPart"] = part.title()
            break
    
    # Treatment Status
    if "ongoing" in text.lower():
        extracted["treatmentStatus"] = "Ongoing"
    elif "completed" in text.lower():
        extracted["treatmentStatus"] = "Completed"
    
    # Treatment Cost
    treatment_cost = re.search(r"treatment\s*(?:cost|expense)\s*:?\s*[\₹\$€£]?\s?([\d,]+(?:\.\d+)?)", text, re.IGNORECASE)
    if treatment_cost:
        extracted["treatmentCost"] = f"₹{treatment_cost.group(1)}"
    
    # Ambulance Service
    if "ambulance" in text.lower():
        extracted["ambulanceService"] = "Yes"
    
    # Medical Leave Days
    leave_patterns = [
        r"(\d+)\s+(?:days?|weeks?)\s+(?:medical|leave)",
        r"leave\s+(?:days?)?\s*:?\s*(\d+)",
    ]
    for pattern in leave_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["medicalLeaveDays"] = match.group(1)
            break
    
    # Recovery Time
    recovery_patterns = [
        r"(\d+)\s*(?:weeks?|months?)",
        r"recovery\s*:?\s*(\d+\s*(?:weeks?|months?))",
    ]
    for pattern in recovery_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["recoveryTime"] = match.group(0) if len(match.groups()) == 1 else match.group(1)
            break
    
    # Disability
    if "temporary disability" in text.lower():
        extracted["disability"] = "Temporary"
    elif "permanent disability" in text.lower():
        extracted["disability"] = "Permanent"
    
    # Medication
    medication_match = re.search(r"medication\s*:?\s*([^,.]+)", text, re.IGNORECASE)
    if medication_match:
        extracted["medication"] = medication_match.group(1).strip()
    
    # ============================================================
    # WITNESSES (4 fields)
    # ============================================================
    
    # Witnesses
    witness_patterns = [
        r"witness(?:es)?\s*:?\s*([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s*,\s*[A-Z][a-z]+\s+[A-Z][a-z]+)*)",
        r"witness(?:es)?\s*:?\s*([^,.]+)",
    ]
    for pattern in witness_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            witnesses = [w.strip() for w in re.split(r',|\sand\s', match.group(1)) if w.strip()]
            if witnesses:
                extracted["witnesses"] = witnesses
            break
    
    # Witness Phone
    witness_phone = re.search(r"witness\s+(?:phone|contact)\s*:?\s*([\+\d\s\-]{10,})", text, re.IGNORECASE)
    if witness_phone:
        extracted["witnessPhone"] = re.sub(r'[^\d+]', '', witness_phone.group(1).strip())
    
    # Witness Address
    witness_addr = re.search(r"witness\s+address\s*:?\s*([^,.\n]+)", text, re.IGNORECASE)
    if witness_addr:
        extracted["witnessAddress"] = witness_addr.group(1).strip()
    
    # Witness Statement
    witness_stmt = re.search(r"statement\s*:?\s*([^.]+\.[^.]*\.?)", text, re.IGNORECASE)
    if witness_stmt:
        extracted["witnessStatement"] = witness_stmt.group(1).strip()
    
    # ============================================================
    # EVIDENCE (1 field)
    # ============================================================
    
    evidence_list = []
    evidence_keywords = {
        "cctv": "CCTV Footage",
        "photograph": "Photographs",
        "photo": "Photographs",
        "fingerprint": "Fingerprints",
        "medical report": "Medical Reports",
        "x-ray": "Medical Reports",
        "xray": "Medical Reports",
        "video": "Video Evidence",
        "audio": "Audio Evidence",
        "document": "Documentation",
        "statement": "Witness Statement",
        "insurance report": "Insurance Report",
        "police report": "Police Report",
        "damage photo": "Damage Photos",
        "invoice": "Invoices",
        "repair estimate": "Repair Estimate",
        "receipt": "Receipts",
        "prescription": "Prescriptions",
    }
    for keyword, evidence in evidence_keywords.items():
        if keyword in text.lower():
            if evidence not in evidence_list:
                evidence_list.append(evidence)
    if evidence_list:
        extracted["evidenceAvailable"] = evidence_list
    
    # ============================================================
    # ADDITIONAL INFORMATION (6 fields)
    # ============================================================
    
    # Driving Experience
    exp_match = re.search(r"(\d+)\s*(?:years?)\s+of\s+driving", text, re.IGNORECASE)
    if exp_match:
        extracted["drivingExperience"] = f"{exp_match.group(1)} years"
    
    # Driving License Number
    license_patterns = [
        r"license\s*(?:number|no\.?)?\s*:?\s*([A-Z0-9\-]+)",
        r"licence\s*(?:number|no\.?)?\s*:?\s*([A-Z0-9\-]+)",
        r"DL\s*:?\s*([A-Z0-9\-]+)",
        r"driving\s+license\s*:?\s*([A-Z0-9\-]+)",
    ]
    for pattern in license_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["drivingLicenseNumber"] = match.group(1)
            break
    
    # Emergency Contact
    emergency_patterns = [
        r"emergency\s+(?:contact|person)\s*:?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)",
        r"emergency\s+name\s*:?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)",
    ]
    for pattern in emergency_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted["emergencyContact"] = match.group(1)
            break
    
    # Emergency Contact Phone
    emergency_phone = re.search(r"emergency\s+(?:phone|number)\s*:?\s*([\+\d\s\-]{10,})", text, re.IGNORECASE)
    if emergency_phone:
        extracted["emergencyContactPhone"] = re.sub(r'[^\d+]', '', emergency_phone.group(1).strip())
    
    # Notes
    notes_match = re.search(r"notes?\s*:?\s*([^.]+\.[^.]*\.?)", text, re.IGNORECASE)
    if notes_match:
        extracted["notes"] = notes_match.group(1).strip()
    
    # Attachments
    attachments = []
    attachment_keywords = ["pdf", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx", "file", "attachment"]
    for keyword in attachment_keywords:
        if keyword in text.lower():
            attachments.append(f"{keyword.upper()} File")
    if attachments:
        extracted["attachments"] = list(set(attachments))
    
    # ============================================================
    # SET DEFAULT VALUES FOR ALL FIELDS
    # ============================================================
    
    for field in COMPLETE_FIELDS:
        if field not in extracted or extracted[field] is None or extracted[field] == "":
            if field in ["witnesses", "evidenceAvailable", "attachments"]:
                extracted[field] = []
            elif field == "age":
                extracted[field] = 0
            else:
                extracted[field] = "Not provided"
    
    return extracted
fallback_extraction = fallback_extraction_complete
print("=" * 60)
print(f"✅ Service loaded. Client: {'AVAILABLE' if client else 'NOT AVAILABLE'}")
print(f"✅ Total fields: {len(COMPLETE_FIELDS)}")
print("=" * 60)
