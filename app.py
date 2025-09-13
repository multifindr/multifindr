from dotenv import load_dotenv
load_dotenv()

import os
from flask import Flask, request, jsonify, render_template
import google.generativeai as genai

app = Flask(__name__)

# Gemini API key load
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

# ---------------- Routes ---------------- #

@app.route('/')
def index():
    return render_template('index.html')

# 🌐 Search (with engine param)
@app.route('/search')
def search():
    query = request.args.get('q', '')
    engine = request.args.get('engine', 'Google')  # frontend se aa raha hai
    if not query:
        return jsonify({"result": "❌ Please enter a query"})

    try:
        # TODO: Future me SERP API se actual search results fetch karo
        response = model.generate_content(f"Search using {engine} engine:\n\n{query}")
        result = response.text
    except Exception as e:
        result = f"⚠️ Error: {str(e)}"

    return jsonify({"result": result})

# 🤖 Gemini full response
@app.route('/gemini', methods=['POST'])
def gemini_endpoint():
    data = request.json
    message = data.get("message", "")
    if not message:
        return jsonify({"response": "❌ No input message"})

    try:
        response = model.generate_content(
            f"Answer in detail, step by step, with clear explanation:\n\n{message}"
        )
        answer = response.text
    except Exception as e:
        answer = f"⚠️ Error: {str(e)}"

    return jsonify({"response": answer})

# ⚡ Gemini short answer
@app.route("/ask")
def ask():
    query = request.args.get("q", "")
    if not query:
        return jsonify({"result": "⚠️ No question provided."})
    try:
        response = model.generate_content(
            f"Give a short and clear answer (max 3-4 lines) to:\n{query}"
        )
        result = response.text
    except Exception as e:
        result = f"⚠️ Error: {str(e)}"

    return jsonify({"result": result})

# 🖼 Image Generation (dummy route)
@app.route("/image", methods=["POST"])
def image_gen():
    data = request.json
    prompt = data.get("prompt", "")
    if not prompt:
        return jsonify({"url": "", "error": "❌ No prompt provided"})

    # TODO: Replace with Replicate/StableDiffusion API
    return jsonify({"url": f"https://dummyimage.com/600x400/000/fff&text={prompt}"})

# 🎥 Video Generation (dummy route)
@app.route("/video", methods=["POST"])
def video_gen():
    data = request.json
    prompt = data.get("prompt", "")
    if not prompt:
        return jsonify({"url": "", "error": "❌ No prompt provided"})

    # TODO: Replace with Replicate/Runway API
    return jsonify({"url": "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"})

# 🎤 Whisper Speech-to-Text (dummy route)
@app.route("/whisper", methods=["POST"])
def whisper():
    if "audio" not in request.files:
        return jsonify({"error": "❌ No audio file uploaded"})
    audio = request.files["audio"]

    # TODO: Replace with Whisper API call
    return jsonify({"predictions": [{"output": "Hello from dummy Whisper"}]})

# ---------------- Run App ---------------- #
if __name__ == "__main__":
    app.run(debug=True)
