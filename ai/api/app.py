import os
import sys
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Import from ai_service
from services.ai_service import (
    extract_incident_data,
    generate_form,
    analyze_incident,
    autofill_fields,
    detect_form_type,
    get_form_fields
)

app = Flask(__name__)
CORS(app)

# ================================================================
#  ENDPOINTS
# ================================================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "service": "FormaAI Python Service",
        "provider": "Gemini",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "GET /health",
            "generate": "POST /api/ai/generate",
            "extract": "POST /api/ai/extract",
            "analyze": "POST /api/ai/analyze",
            "generate-form": "POST /api/ai/generate-form"
        }
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "FormaAI Python AI Service",
        "provider": "Gemini",
        "timestamp": datetime.now().isoformat()
    })

@app.route("/api/ai/extract", methods=["POST"])
def extract():
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
    port = int(os.getenv("AI_SERVICE_PORT", 5001))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    print(f"""
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🤖 FormaAI AI Service (Gemini)                              ║
║                                                               ║
║   📡 Port:          {port}                                      ║
║   📍 URL:           http://localhost:{port}                     ║
║   🔧 Debug Mode:    {debug}                                      ║
║   🤖 AI Provider:   Gemini                                    ║
║                                                               ║
║   📋 Endpoints:                                               ║
║   - GET  /                        Service info                ║
║   - GET  /health                  Health check                ║
║   - POST /api/ai/extract          Extract data                ║
║   - POST /api/ai/generate         Generate form               ║
║   - POST /api/ai/analyze          Analyze incident            ║
║   - POST /api/ai/generate-form    Generate from extracted     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    """)
    
    app.run(host="0.0.0.0", port=port, debug=debug)
