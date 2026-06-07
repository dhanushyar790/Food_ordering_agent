// ============================================================
// ANANDHA'S MENU DATA
// Real menu from anandhas.zervfoods.com style
// ============================================================

const MENU_DATA = [
  // RICE DISHES
  { id: 1, name: "Chicken Biryani", emoji: "🍛", price: 180, category: "Rice", desc: "Aromatic basmati rice with tender chicken & spices", veg: false, available: true, rating: 4.8, popular: true },
  { id: 2, name: "Veg Biryani", emoji: "🥘", price: 130, category: "Rice", desc: "Fragrant rice with seasonal vegetables & saffron", veg: true, available: true, rating: 4.5, popular: true },
  { id: 3, name: "Mutton Biryani", emoji: "🍲", price: 220, category: "Rice", desc: "Slow-cooked mutton with special masala rice", veg: false, available: true, rating: 4.9, popular: true },
  { id: 4, name: "Egg Biryani", emoji: "🥚", price: 130, category: "Rice", desc: "Boiled eggs cooked in aromatic biryani masala", veg: false, available: true, rating: 4.4 },
  { id: 5, name: "Curd Rice", emoji: "🍚", price: 60, category: "Rice", desc: "Comfort food — cool rice with fresh curd & tempering", veg: true, available: true, rating: 4.2 },

  // SOUTH INDIAN
  { id: 6, name: "Masala Dosa", emoji: "🫓", price: 70, category: "South Indian", desc: "Crispy dosa with spiced potato filling & chutneys", veg: true, available: true, rating: 4.7, popular: true },
  { id: 7, name: "Idly (3 pcs)", emoji: "🥞", price: 50, category: "South Indian", desc: "Steamed rice cakes with sambar & coconut chutney", veg: true, available: true, rating: 4.6 },
  { id: 8, name: "Vada (2 pcs)", emoji: "🍩", price: 55, category: "South Indian", desc: "Crispy medu vada with sambar & chutney", veg: true, available: true, rating: 4.5 },
  { id: 9, name: "Uttapam", emoji: "🫔", price: 75, category: "South Indian", desc: "Thick pancake with onion, tomato & chillies", veg: true, available: true, rating: 4.3 },
  { id: 10, name: "Pongal", emoji: "🫕", price: 65, category: "South Indian", desc: "Rice & lentil porridge with ghee, pepper & cashews", veg: true, available: true, rating: 4.4 },

  // CURRIES
  { id: 11, name: "Chicken Curry", emoji: "🍗", price: 160, category: "Curries", desc: "Spicy Chettinad-style chicken curry", veg: false, available: true, rating: 4.7, popular: true },
  { id: 12, name: "Dal Tadka", emoji: "🫘", price: 90, category: "Curries", desc: "Yellow lentils tempered with cumin & garlic", veg: true, available: true, rating: 4.4 },
  { id: 13, name: "Paneer Butter Masala", emoji: "🧀", price: 150, category: "Curries", desc: "Soft paneer in rich tomato-butter gravy", veg: true, available: true, rating: 4.6 },
  { id: 14, name: "Fish Curry", emoji: "🐟", price: 170, category: "Curries", desc: "Fresh fish in tangy tamarind-coconut curry", veg: false, available: false, rating: 4.8 },
  { id: 15, name: "Sambar", emoji: "🥣", price: 40, category: "Curries", desc: "Traditional lentil vegetable curry", veg: true, available: true, rating: 4.5 },

  // SNACKS
  { id: 16, name: "Samosa (2 pcs)", emoji: "🥟", price: 40, category: "Snacks", desc: "Crispy pastry filled with spiced potato", veg: true, available: true, rating: 4.3 },
  { id: 17, name: "Chicken 65", emoji: "🍗", price: 140, category: "Snacks", desc: "Spicy deep-fried chicken — Anandha's signature!", veg: false, available: true, rating: 4.9, popular: true },
  { id: 18, name: "Gobi Manchurian", emoji: "🥦", price: 110, category: "Snacks", desc: "Crispy cauliflower in Indo-Chinese sauce", veg: true, available: true, rating: 4.4 },
  { id: 19, name: "Bread Omelette", emoji: "🍳", price: 60, category: "Snacks", desc: "Fluffy omelette with buttered toast", veg: false, available: true, rating: 4.2 },

  // DRINKS
  { id: 20, name: "Filter Coffee", emoji: "☕", price: 30, category: "Drinks", desc: "Authentic South Indian decoction with frothy milk", veg: true, available: true, rating: 4.9, popular: true },
  { id: 21, name: "Mango Lassi", emoji: "🥭", price: 60, category: "Drinks", desc: "Chilled mango blended with creamy yogurt", veg: true, available: true, rating: 4.7 },
  { id: 22, name: "Tender Coconut", emoji: "🥥", price: 50, category: "Drinks", desc: "Fresh tender coconut water — chilled", veg: true, available: true, rating: 4.8 },
  { id: 23, name: "Buttermilk", emoji: "🥛", price: 25, category: "Drinks", desc: "Spiced chaas with curry leaves & ginger", veg: true, available: true, rating: 4.5 },

  // SWEETS
  { id: 24, name: "Gulab Jamun (2 pcs)", emoji: "🍮", price: 50, category: "Sweets", desc: "Soft milk-solid dumplings in rose syrup", veg: true, available: true, rating: 4.6 },
  { id: 25, name: "Payasam", emoji: "🍯", price: 55, category: "Sweets", desc: "Traditional rice kheer with cashews & raisins", veg: true, available: true, rating: 4.5 },
];

const CATEGORIES = ["All", ...new Set(MENU_DATA.map(i => i.category))];

const COUPONS = {
  "ANANDHA10": { discount: 10, type: "percent", desc: "10% off" },
  "WELCOME50": { discount: 50, type: "flat", desc: "₹50 off" },
  "BIRYANI20": { discount: 20, type: "percent", desc: "20% off biryani orders" },
  "FIRSTORDER": { discount: 100, type: "flat", desc: "₹100 off first order" },
};

window.MENU_DATA = MENU_DATA;
window.CATEGORIES = CATEGORIES;
window.COUPONS = COUPONS;