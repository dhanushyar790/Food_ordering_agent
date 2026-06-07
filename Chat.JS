// ============================================================
// AI CHAT ENGINE — Powered by Claude API
// ============================================================

let chatHistory = [];
let currentLang = 'en';
let isVoiceActive = false;
let recognition = null;
let orderedOnce = false;

const SYSTEM_PROMPT = `You are Anandha's AI Food Assistant — a warm, friendly, and smart chatbot for the restaurant "Anandha's" (website: anandhas.zervfoods.com). You help customers order food conversationally.

You understand English, Tamil, and Tanglish (Tamil+English mix). Reply in the same language the user uses. If they use Tanglish, reply in Tanglish.

MENU AVAILABLE:
${JSON.stringify(MENU_DATA.map(m => ({
  id: m.id, name: m.name, price: m.price, category: m.category,
  veg: m.veg, available: m.available, popular: m.popular || false
})), null, 2)}

AVAILABLE COUPONS: ANANDHA10 (10% off), WELCOME50 (₹50 off), BIRYANI20 (20% off), FIRSTORDER (₹100 off first order)

YOUR CAPABILITIES:
1. Show menu, recommend dishes, describe items
2. Add items to cart — respond with JSON action: {"action":"add","itemId":N,"qty":1}
3. Remove items — respond with JSON action: {"action":"remove","itemId":N}
4. Apply coupon — respond with JSON action: {"action":"coupon","code":"XXXX"}
5. Show order summary — respond with {"action":"summary"}
6. Confirm order (go to payment) — respond with {"action":"confirm"}
7. Track order — respond with {"action":"track"}
8. Show feedback — respond with {"action":"feedback"}
9. Clear cart — respond with {"action":"clear"}

RULES:
- Always be warm, helpful, and a little fun
- If item is out of stock, suggest alternatives
- If user asks for best sellers, recommend: Chicken Biryani, Chicken 65, Filter Coffee, Masala Dosa, Mutton Biryani
- For Tamil speakers: use Tamil words naturally (nalla choice, super item, ungalukku pidikkum)
- When adding items, ALWAYS include the JSON action in your response, wrapped in <ACTION> tags
- Example response: "Sure! Adding Chicken Biryani to your cart 🍛 <ACTION>{"action":"add","itemId":1,"qty":1}</ACTION>"
- Keep responses concise (2-3 sentences max for simple requests)
- Use emojis naturally but not excessively
- If user says "remove one item" or "change something", understand context from chat history
- For payment, confirm total and show QR action
- After order is confirmed, ask for feedback after a moment`;

async function sendToAI(userMessage) {
  chatHistory.push({ role: "user", content: userMessage });

  // Add cart context to every message
  const cartContext = Cart.getCount() > 0
    ? `\n[CURRENT CART: ${Cart.getItems().map(i => `${i.name} x${i.qty}`).join(', ')} | Total: ₹${Cart.getTotal()}]`
    : '\n[CART IS EMPTY]';

  const messagesWithContext = chatHistory.map((m, i) =>
    i === chatHistory.length - 1 && m.role === 'user'
      ? { ...m, content: m.content + cartContext }
      : m
  );

  // ⚠️ REPLACE THIS WITH YOUR API KEY from https://console.anthropic.com
  const API_KEY = "YOUR_API_KEY_HERE";

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messagesWithContext
      })
    });

    const data = await response.json();
    const rawText = data.content?.[0]?.text || "Sorry, something went wrong. Please try again!";

    // Parse and execute any actions
    const processed = processActions(rawText);
    chatHistory.push({ role: "assistant", content: rawText });
    return processed;

  } catch (err) {
    console.error('AI Error:', err);
    chatHistory.push({ role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again!" });
    return { text: "Sorry, I'm having trouble connecting. Please try again! 😅", html: null };
  }
}

function processActions(rawText) {
  // Extract action JSON from <ACTION> tags
  const actionMatch = rawText.match(/<ACTION>(.*?)<\/ACTION>/s);
  let html = null;
  let cleanText = rawText.replace(/<ACTION>.*?<\/ACTION>/gs, '').trim();

  if (actionMatch) {
    try {
      const action = JSON.parse(actionMatch[1]);
      html = executeAction(action);
    } catch (e) {
      console.warn('Action parse error:', e);
    }
  }

  return { text: cleanText, html };
}

function executeAction(action) {
  switch (action.action) {
    case 'add': {
      const result = Cart.add(action.itemId, action.qty || 1);
      if (result === 'outofstock') {
        setTimeout(() => {
          addBotMessage("Oh no, that item is currently out of stock 😔 Let me suggest an alternative!");
        }, 500);
      }
      const item = MENU_DATA.find(m => m.id === action.itemId);
      if (item) {
        return `<div class="menu-card-msg" onclick="Cart.add(${item.id})">
          <span class="item-emoji">${item.emoji}</span>
          <div class="item-info">
            <div class="item-name">${item.name}</div>
            <div class="item-price">₹${item.price}</div>
          </div>
          <button class="add-btn-inline" onclick="event.stopPropagation();Cart.add(${item.id})">+ Add More</button>
        </div>`;
      }
      return null;
    }
    case 'remove': {
      Cart.remove(action.itemId);
      return null;
    }
    case 'coupon': {
      const result = Cart.applyCoupon(action.code);
      if (result) {
        setTimeout(() => addBotMessage(`🎉 Coupon "${action.code}" applied! You save ${result.type === 'percent' ? result.discount + '%' : '₹' + result.discount}!`), 300);
      } else {
        setTimeout(() => addBotMessage("That coupon code isn't valid. Try: ANANDHA10, WELCOME50, or FIRSTORDER 😊"), 300);
      }
      return null;
    }
    case 'summary': {
      if (Cart.getCount() === 0) return null;
      const items = Cart.getItems();
      const lines = items.map(i => `<div class="order-line"><span>${i.emoji} ${i.name} ×${i.qty}</span><span>₹${i.price * i.qty}</span></div>`).join('');
      return `<div class="order-summary-msg">
        <h4>Your Current Order</h4>
        ${lines}
        <div class="order-line"><span>Delivery</span><span>${Cart.getDeliveryCharge() === 0 ? 'FREE' : '₹' + Cart.getDeliveryCharge()}</span></div>
        <div class="order-total"><span>Total</span><span>₹${Cart.getTotal()}</span></div>
      </div>`;
    }
    case 'confirm': {
      setTimeout(() => confirmOrder(), 500);
      return null;
    }
    case 'track': {
      setTimeout(() => showTracking(), 500);
      return null;
    }
    case 'feedback': {
      setTimeout(() => document.getElementById('feedbackModal').style.display = 'flex', 500);
      return null;
    }
    case 'clear': {
      Cart.clear();
      return null;
    }
    default:
      return null;
  }
}

// ===== UI FUNCTIONS =====

function addBotMessage(text, extraHTML = null) {
  const win = document.getElementById('chatWindow');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = `
    <div class="msg-avatar">🍽️</div>
    <div>
      <div class="msg-bubble">${text}</div>
      ${extraHTML ? extraHTML : ''}
      <div class="msg-time">${time}</div>
    </div>`;
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
}

function addUserMessage(text) {
  const win = document.getElementById('chatWindow');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = 'msg user';
  div.innerHTML = `
    <div class="msg-avatar">😊</div>
    <div>
      <div class="msg-bubble">${text}</div>
      <div class="msg-time">${time}</div>
    </div>`;
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
}

function showTyping() {
  const win = document.getElementById('chatWindow');
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'typingMsg';
  div.innerHTML = `
    <div class="msg-avatar">🍽️</div>
    <div class="msg-bubble typing-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById('typingMsg');
  if (t) t.remove();
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  addUserMessage(text);
  showTyping();

  const { text: botText, html } = await sendToAI(text);
  hideTyping();
  addBotMessage(botText, html);
}

function sendQuick(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

function setLang(lang) {
  currentLang = lang;
  const placeholders = {
    en: "Ask me anything about food...",
    ta: "சாப்பாடு பத்தி கேளுங்க...",
    hi: "खाने के बारे में पूछें..."
  };
  document.getElementById('chatInput').placeholder = placeholders[lang] || placeholders.en;
}

// ===== VOICE INPUT =====
function toggleVoice() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    addBotMessage("Voice input isn't supported in this browser. Try Chrome! 🎙️");
    return;
  }

  if (isVoiceActive) {
    recognition?.stop();
    isVoiceActive = false;
    document.getElementById('micBtn').classList.remove('active');
    return;
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = currentLang === 'ta' ? 'ta-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isVoiceActive = true;
    document.getElementById('micBtn').classList.add('active');
  };

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    document.getElementById('chatInput').value = transcript;
    sendMessage();
  };

  recognition.onend = () => {
    isVoiceActive = false;
    document.getElementById('micBtn').classList.remove('active');
  };

  recognition.onerror = () => {
    isVoiceActive = false;
    document.getElementById('micBtn').classList.remove('active');
  };

  recognition.start();
}

// ===== PAYMENT =====
function paymentSuccess() {
  closeModal('qrModal');
  const orderId = document.getElementById('qrOrderId').textContent;

  addBotMessage(`🎊 Payment confirmed! Your order ${orderId} is now being prepared in the kitchen. You can track it live! Would you like to track your order?`);

  // Notify kitchen (simulate)
  console.log('[KITCHEN NOTIFICATION] New order:', orderId, Cart.getItems());

  Cart.clear();
  orderedOnce = true;

  // Show tracking after 2s
  setTimeout(() => showTracking(orderId), 2500);

  // Ask for feedback after delivery simulation
  setTimeout(() => {
    addBotMessage("Your food is on its way! 🛵 Once you receive it, please share your feedback — it means a lot to us! 💛");
    setTimeout(() => document.getElementById('feedbackModal').style.display = 'flex', 1000);
  }, 30000);
}

// ===== FEEDBACK =====
let selectedRating = 0;
function setRating(r) {
  selectedRating = r;
  document.querySelectorAll('.star-rating span').forEach((s, i) => {
    s.classList.toggle('active', i < r);
  });
}

function submitFeedback() {
  const text = document.getElementById('feedbackText').value;
  closeModal('feedbackModal');
  addBotMessage(`Thank you for your ${selectedRating}⭐ feedback${text ? '! We noted: "' + text.substring(0, 50) + '"' : ''}. See you again at Anandha's! 🍽️`);
  document.getElementById('feedbackText').value = '';
  selectedRating = 0;
  document.querySelectorAll('.star-rating span').forEach(s => s.classList.remove('active'));
}

// ===== MODAL =====
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

window.sendMessage = sendMessage;
window.sendQuick = sendQuick;
window.setLang = setLang;
window.toggleVoice = toggleVoice;
window.paymentSuccess = paymentSuccess;
window.setRating = setRating;
window.submitFeedback = submitFeedback;
window.closeModal = closeModal;
window.addBotMessage = addBotMessage;