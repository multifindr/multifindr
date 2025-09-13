// -------- Helper: Append message to chat area --------
function appendMessage(text, sender = "bot") {
  const chatArea = document.getElementById("chatArea");
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// -------- Show Result with Speech Option --------
function showResult(text) {
  const resultDiv = document.getElementById("results");

  resultDiv.innerHTML = `
    <div class="flex items-center justify-between mb-2" id="speechControls">
      <button onclick="speakResult()" class="px-2 py-1 bg-gray-200 rounded">🔊</button>
      <select id="voiceLang" class="border p-1 rounded">
        <option value="en-US">🇺🇸 English</option>
        <option value="hi-IN">🇮🇳 Hindi</option>
      </select>
    </div>
    <div id="resultText">${text}</div>
  `;
}

// -------- Text-to-Speech --------
function speakResult() {
  const text = document.getElementById("resultText")?.innerText || "";
  const lang = document.getElementById("voiceLang")?.value || "en-US";

  if (!text) return;

  // Stop previous speech if running
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  speechSynthesis.speak(utterance);
}

// -------- 🌐 Search --------
async function performSearch() {
  const query = document.getElementById("searchInput")?.value || "";
  const engine = document.getElementById("engine")?.value || "Google";

  if (!query) return;
  appendMessage(query, "user");

  try {
    const res = await fetch(`/search?q=${encodeURIComponent(query)}&engine=${engine}`);
    const data = await res.json();
    appendMessage(data.result, "bot");
    showResult(data.result);
  } catch (err) {
    appendMessage("⚠️ Error: " + err.message, "bot");
  }
}

// -------- 🤖 Ask Gemini AI --------
async function askAI() {
  const query = document.getElementById("searchInput")?.value || "";
  if (!query) return;

  appendMessage(query, "user");

  try {
    const res = await fetch("/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: query })
    });
    const data = await res.json();
    appendMessage(data.response || data.error, "bot");
    showResult(data.response || data.error);
  } catch (err) {
    appendMessage("⚠️ Error: " + err.message, "bot");
  }
}

// -------- 🎤 Voice Search (Browser Speech API) --------
function recordAndTranscribe() {
  if (!("webkitSpeechRecognition" in window)) {
    appendMessage("⚠️ Browser does not support voice recognition.", "bot");
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-IN"; // default English India
  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    appendMessage("🎤 " + transcript, "user");
    document.getElementById("searchInput").value = transcript;
    performSearch();
  };
  recognition.start();
}

// -------- Short Answer (Ask Route) --------
async function sendToGemini() {
  const query = document.getElementById("searchInput")?.value || "demo question";
  appendMessage(query, "user");

  try {
    const res = await fetch(`/ask?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    appendMessage(data.result, "bot");
    showResult(data.result);
  } catch (err) {
    appendMessage("⚠️ Error: " + err.message, "bot");
  }
}

// -------- Placeholder Functions (Future APIs) --------
function openArt() {
  appendMessage("🎨 Art generation feature coming soon...", "bot");
}
function openImage() {
  appendMessage("🖼 Image generation feature coming soon...", "bot");
}
function openVideo() {
  appendMessage("🎥 Video generation feature coming soon...", "bot");
}
function openCamera() {
  appendMessage("📷 Camera feature coming soon...", "bot");
}
function openMap() {
  appendMessage("🗺 Map feature coming soon...", "bot");
}
