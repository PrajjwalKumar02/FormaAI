import os
import sys

from flask import Flask, request, jsonify

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.ai_service import generate_form
app = Flask(__name__)


@app.route("/api/ai/generate", methods=["POST"])
def generate():

    data = request.get_json()

    if not data or "prompt" not in data:
        return jsonify({
            "success": False,
            "message": "Prompt is required."
        }), 400

    user_prompt = data["prompt"]

    response = generate_form(user_prompt)

    return jsonify(response)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "FormaAI Python Service Running"
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "running",
        "service": "FormaAI Python AI Service"
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)