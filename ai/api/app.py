import os
import sys
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from config.ai_config import config
from services.ai_service import (
    extract_incident_data,  
    generate_form,
    analyze_incident,
    autofill_fields,
    detect_form_type,
    get_form_fields,
    generate_form_from_extracted
)

app = Flask(__name__)
CORS(app)

# ================================================================
#  ENDPOINTS
# ================================================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "service": "FormaAI AI Service",
        "provider": config.AI_PROVIDER,
        "version": "2.0.0",
        "status": "running",
        "endpoints": {
            "health": "GET /health",
            "extract": "POST /api/ai/extract",
            "generate": "POST /api/ai/generate",
            "analyze": "POST /api/ai/analyze",
            "generate-form": "POST /api/ai/generate-form"
        }
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "FormaAI AI Service",
        "provider": config.AI_PROVIDER,
        "timestamp": datetime.now().isoformat()
    })

@app.route("/api/ai/extract", methods=["POST"])
def extract():
    """Extract data from incident description"""
    try:
        data = request.get_json()
        if not data or "description" not in data:
            return jsonify({
                "success": False,
                "message": "Description is required."
            }), 400

        result = extract_incident_data(data["description"])
        
        return jsonify({
            "success": True,
            "data": result,
            "message": "Extraction successful"
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route("/api/ai/generate", methods=["POST"])
def generate():
    """Generate form from prompt"""
    try:
        data = request.get_json()
        if not data or "prompt" not in data:
            return jsonify({
                "success": False,
                "message": "Prompt is required."
            }), 400

        result = generate_form(data["prompt"])
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route("/api/ai/analyze", methods=["POST"])
def analyze():
    """Analyze incident data"""
    try:
        data = request.get_json()
        if not data or "incident_data" not in data:
            return jsonify({
                "success": False,
                "message": "Incident data is required."
            }), 400

        result = analyze_incident(data["incident_data"])
        return jsonify({
            "success": True,
            "data": result,
            "message": "Analysis complete"
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route("/api/ai/generate-form", methods=["POST"])
def generate_form_from_data():
    """Generate form from extracted data"""
    try:
        data = request.get_json()
        if not data or "extracted_data" not in data:
            return jsonify({
                "success": False,
                "message": "Extracted data is required."
            }), 400

        extracted_data = data["extracted_data"]
        form_type = data.get("form_type", "incident")
        
        fields = get_form_fields(form_type)
        fields = autofill_fields(fields, extracted_data)
        
        return jsonify({
            "success": True,
            "data": {
                "title": f"{form_type.replace('_', ' ').title()} Form",
                "fields": fields,
                "extractedData": extracted_data
            },
            "message": "Form generated successfully"
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "message": "Endpoint not found"
    }), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({
        "success": False,
        "message": "Internal server error"
    }), 500

if __name__ == "__main__":
    port = config.AI_SERVICE_PORT
    debug = config.DEBUG
    
    print(f"""
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🤖 FormaAI AI Service                                       ║
║                                                               ║
║   📡 Port:          {port}                                     ║
║   📍 URL:           http://localhost:{port}                    ║
║   🤖 Provider:      {config.AI_PROVIDER}                      ║
║   📦 Model:         {config.GEMINI_MODEL}                     ║
║                                                               ║
║   📋 Endpoints:                                               ║
║   - POST /api/ai/extract          Extract data                ║
║   - POST /api/ai/generate         Generate form               ║
║   - POST /api/ai/analyze          Analyze incident            ║
║   - POST /api/ai/generate-form    Generate from extracted     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    """)
    
    app.run(host="0.0.0.0", port=port, debug=debug)
