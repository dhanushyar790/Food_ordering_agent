// ============================================================
// APP INITIALIZATION
// ============================================================

let activeCategory = 'All';

function initMenu() {
  // Render category tabs
  const tabsEl = document.getElementById('categoryTabs');
  tabsEl.innerHTML = CATEGORIES.map(cat =>
    `<button class="cat-tab ${cat === 'All' ? 'active' : ''}" onclick="filterByCategory('${cat}')">${cat}</button>`
  ).join('');

  renderMenuItems(MENU_DATA);
}

function renderMenuItems(items) {
  const list = document.getElementById('menuList');
  list.innerHTML = items.map(item => `
    <div class="menu-item ${!item.available ? 'out-of-stock' : ''}" onclick="${item.available ? `Cart.add(${item.id}); addBotMessage('Added ${item.name} to your cart! 🎉')` : ''}">
      <span class="menu-item-emoji">${item.emoji}</span>
      <div class="menu-item-info">
        <div class="menu-item-name">${item.name} ${item.popular ? '🔥' : ''}</div>
        <div class="menu-item-desc">${item.desc}</div>
        <div class="menu-item-footer">
          <span class="menu-item-price">₹${item.price}</span>
          <span class="menu-item-veg ${item.veg ? 'veg' : 'nonveg'}">${item.veg ? 'VEG' : 'NON-VEG'}</span>
          ${item.available ? `<button class="add-btn" onclick="event.stopPropagation(); Cart.add(${item.id}); addBotMessage('${item.name} added! 😋')">+ Add</button>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function filterByCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.cat-tab').forEach(t => {
    t.classList.toggle('active', t.textContent === cat);
  });
  const filtered = cat === 'All' ? MENU_DATA : MENU_DATA.filter(m => m.category === cat);
  renderMenuItems(filtered);
}

function filterMenu(query) {
  const q = query.toLowerCase();
  const filtered = MENU_DATA.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.desc.toLowerCase().includes(q) ||
    m.category.toLowerCase().includes(q)
  );
  renderMenuItems(filtered);
}

// ===== WELCOME MESSAGE =====
function showWelcome() {
  setTimeout(() => {
    addBotMessage("👋 Vanakkam! Welcome to Anandha's!");
  }, 400);

  setTimeout(() => {
    addBotMessage(
      "I'm your AI ordering assistant 🍽️ I can help you browse our menu, place orders, track delivery, and more!\n\nEnna saapida virupam? What would you like to eat today?",
      `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
        <button class="chip" onclick="sendQuick('Show me best sellers')">⭐ Best Sellers</button>
        <button class="chip" onclick="sendQuick('Show veg items only')">🥗 Veg Menu</button>
        <button class="chip" onclick="sendQuick('What biryani do you have?')">🍛 Biryani</button>
      </div>`
    );
  }, 1200);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    ['qrModal', 'trackModal', 'feedbackModal'].forEach(id => {
      document.getElementById(id).style.display = 'none';
    });
  }
});

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.style.display = 'none';
  });
});

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  initMenu();
  Cart.render();
  showWelcome();
});

window.filterByCategory = filterByCategory;
window.filterMenu = filterMenu;