# 🍽️ Anandha's — AI Food Ordering Assistant

## 📸 Preview

> A warm, luxury-themed dark UI with gold accents — built for authentic South Indian restaurant ordering.

| Chat Interface | Menu Panel | Order Tracking |
|---|---|---|
| Conversational AI ordering | Category browse + search | Live step-by-step tracking |
| Tamil / Tanglish support | Customize any dish | ETA countdown |
| Voice input (🎙️) | Veg/Non-veg filter | Rider animation |

---

## ✨ Features

### 🤖 AI-Powered Chat
- Powered by **Claude Sonnet** via Anthropic API
- Understands **English**, **Tamil**, and **Tanglish** (code-mixed Tamil+English)
- Detects user language automatically and replies in kind
- Remembers cart context across every message
- Personalized onboarding: asks name → diet preference → dessert choice → shows tailored picks

### 🛒 Smart Cart Management
- Add / remove / update quantities via chat or sidebar UI
- Real-time cart rendering with subtotal, delivery charge, discount row
- Delivery vs Pickup toggle (free delivery above ₹300)
- Coupon system: `ANANDHA10`, `WELCOME50`, `FIRSTORDER`, `BIRYANI20`

### 🎨 Dish Customization
- Per-item customization modal with:
  - **Portion size** — Half / Full / Double
  - **Spice level** — Mild → Extra Hot (animated slider)
  - **Add-ons** — category-specific extras (raita, ghee, extra chutney, etc.)
  - **Special instructions** — free text + quick-note chips
  - **Quantity selector** — up to 10 units

### 💳 Payment & QR
- Auto-generated UPI QR canvas on order confirmation
- Unique order ID per session (`#AN####`)
- Simulated payment confirmation flow

### 🛵 Live Order Tracking
- 5-step tracker: Confirmed → Preparing → Ready → Out for Delivery → Delivered
- Animated step progression every 5–6 seconds
- ETA countdown display
- Rider animation dot

### 🎙️ Voice Input
- Web Speech API integration
- Supports `en-IN`, `ta-IN`, `hi-IN` based on selected language
- Visual waveform indicator during listening

### 📍 Address Management
- Multi-address form (Home / Work / Other)
- Saved address slots with visual selection
- Inline address capture via chat flow

### ⭐ Feedback System
- 5-star rating modal post-delivery
- Text input with character preview
- Auto-triggered after simulated delivery

---

## 🗂️ Project Structure

```
anandhas-ai-assistant/
│
├── index.html              # Single-file version (fully self-contained)
│
├── css/
│   └── style.css           # Full design system with CSS variables
│
├── js/
│   ├── menu-data.js        # MENU_DATA[], CATEGORIES[], COUPONS{}
│   ├── cart.js             # Cart IIFE — add, remove, coupon, render
│   ├── chat.js             # AI engine + mockAI fallback + message UI
│   ├── tracking.js         # Live tracking modal + step progression
│   └── app.js              # Init, menu render, category filter, welcome
│
└── README.md
```

---

## 🧠 How the AI Works

The chat engine sends every user message to **Claude Sonnet** via the Anthropic Messages API. A detailed system prompt defines:

- The full menu (JSON-injected at runtime)
- Available coupon codes
- Supported action types returned as `<ACTION>{...}</ACTION>` tags

Claude replies in natural language **plus** structured action tags that the frontend parses and executes:

```
User: "Add chicken biryani please"
Claude: "Sure! Adding Chicken Biryani 🍛 <ACTION>{"action":"add","itemId":1,"qty":1}</ACTION>"
```

**Supported actions:**

| Action | Effect |
|--------|--------|
| `add` | Adds item to cart |
| `remove` | Removes one unit |
| `coupon` | Applies discount code |
| `summary` | Renders order summary card |
| `confirm` | Triggers QR payment modal |
| `track` | Opens live tracking modal |
| `feedback` | Opens rating modal |
| `clear` | Empties cart |

The cart state is appended to every message so Claude always knows what's in the cart:
```
[CURRENT CART: Chicken Biryani x1, Filter Coffee x1 | Total: ₹210]
```

A **local `mockAI()` fallback** handles common intents (menu, add item, coupon, tracking) without API calls — making the app usable even without an API key for demos.

---

## 🎟️ Coupon Codes (Demo)

| Code | Discount |
|------|----------|
| `ANANDHA10` | 10% off total |
| `WELCOME50` | ₹50 flat off |
| `FIRSTORDER` | ₹100 off first order |
| `BIRYANI20` | 20% off (biryani orders) |

---

## 🌐 Language Support

| Language | Trigger |
|----------|---------|
| English | Default |
| Tamil (தமிழ்) | Tamil script detected |
| Tanglish | Keywords like `da`, `macha`, `nalla`, `vendum`, `sollu` |

The AI replies in the **same language the user types in** — no manual switching needed.

---

## 🍽️ Sample Menu Categories

| Category | Items |
|----------|-------|
| 🍛 Rice | Chicken Biryani, Mutton Biryani, Veg Biryani, Egg Biryani, Curd Rice |
| 🫓 South Indian | Masala Dosa, Idly, Medu Vada, Uttapam, Pongal |
| 🍗 Curries | Chicken Curry, Paneer Butter Masala, Dal Tadka, Fish Curry, Sambar |
| 🥟 Snacks | Chicken 65, Samosa, Gobi Manchurian, Bread Omelette |
| ☕ Drinks | Filter Coffee, Mango Lassi, Tender Coconut, Buttermilk |
| 🍮 Sweets | Gulab Jamun, Payasam |

---

## 🔮 Roadmap / Possible Enhancements

- [ ] Backend API proxy (Node.js / FastAPI) for secure key handling
- [ ] Real UPI deep-link QR generation
- [ ] Firebase / Supabase order persistence
- [ ] Admin dashboard for live order management
- [ ] WhatsApp ordering integration
- [ ] Loyalty points system
- [ ] Multi-restaurant support

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML, CSS3, JavaScript (ES6+) |
| AI | Anthropic Claude Sonnet (`claude-sonnet-4-20250514`) |
| Fonts | Playfair Display + DM Sans (Google Fonts) |
| Voice | Web Speech API |
| QR | Canvas 2D API (custom drawn) |
| Payments | UPI QR (simulated) |

---

## 👨‍💻 Author

**Dhanushya** — AI & Data Science student, Karpagam College of Engineering, Coimbatore
