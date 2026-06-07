// ============================================================
// LIVE ORDER TRACKING
// ============================================================

const TRACK_STEPS_CONFIG = [
  { icon: "✅", label: "Order Confirmed", sub: "Restaurant accepted your order", state: "done" },
  { icon: "👨‍🍳", label: "Preparing Your Food", sub: "Chefs are working on it", state: "active" },
  { icon: "📦", label: "Ready for Pickup", sub: "Waiting for delivery partner", state: "pending" },
  { icon: "🛵", label: "Out for Delivery", sub: "On the way to your location", state: "pending" },
  { icon: "🏠", label: "Delivered", sub: "Enjoy your meal!", state: "pending" },
];

let trackingInterval = null;
let currentStep = 1;

function showTracking(orderId = null) {
  const modal = document.getElementById('trackModal');
  const stepsEl = document.getElementById('trackSteps');
  const orderIdEl = document.getElementById('trackOrderId');

  if (orderId) orderIdEl.textContent = `Order ${orderId}`;

  // Reset and render steps
  currentStep = Math.floor(Math.random() * 2) + 1; // Start at step 1 or 2
  renderTrackSteps();

  modal.style.display = 'flex';

  // Simulate live progress
  if (trackingInterval) clearInterval(trackingInterval);
  trackingInterval = setInterval(() => {
    if (currentStep < TRACK_STEPS_CONFIG.length - 1) {
      currentStep++;
      renderTrackSteps();
      updateETA();
    } else {
      clearInterval(trackingInterval);
    }
  }, 6000);
}

function renderTrackSteps() {
  const el = document.getElementById('trackSteps');
  if (!el) return;

  el.innerHTML = TRACK_STEPS_CONFIG.map((step, i) => {
    let state = 'pending';
    if (i < currentStep) state = 'done';
    else if (i === currentStep) state = 'active';

    return `
      <div class="track-step ${state}">
        <div class="step-icon">${state === 'done' ? '✅' : step.icon}</div>
        <div class="step-info">
          <div class="step-label">${step.label}</div>
          <div class="step-sub">${i === currentStep ? '⏳ In progress...' : state === 'done' ? 'Completed' : step.sub}</div>
        </div>
      </div>
    `;
  }).join('');
}

function updateETA() {
  const etas = ['25–30 min', '20–25 min', '15–20 min', '8–12 min', '2–5 min', 'Arrived!'];
  const el = document.getElementById('etaTime');
  if (el) el.textContent = etas[Math.min(currentStep, etas.length - 1)];
}

window.showTracking = showTracking;