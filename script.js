(function initSlider() {
  const slider = document.getElementById('mainSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('sliderDots');
  let current = 0;
  let timer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(n) {
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
    resetTimer();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, 4000);
  }

  document.getElementById('nextBtn')?.addEventListener('click', next);
  document.getElementById('prevBtn')?.addEventListener('click', prev);

  resetTimer();
})();

// ─── SCROLL ROW ───────────────────────────────────────────────
function scrollRow(id, dir) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollBy({ left: dir === 'right' ? 500 : -500, behavior: 'smooth' });
}

// ─── CART ─────────────────────────────────────────────────────
function getCart() {
  try { return JSON.parse(localStorage.getItem('shopx_cart') || '[]'); }
  catch(e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem('shopx_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

function addToCart(name, price, img) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.name === name);
  if (idx > -1) {
    cart[idx].qty++;
  } else {
    cart.push({ name, price, img, qty: 1 });
  }
  saveCart(cart);

  // Visual feedback
  const btn = event.target;
  const orig = btn.textContent;
  btn.textContent = '✓ Added!';
  btn.style.background = 'var(--clr-accent-alt)';
  btn.style.color = '#000';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    btn.style.color = '';
  }, 1200);
}

// ─── CART PAGE ────────────────────────────────────────────────
function renderCart() {
  const cartContainer = document.getElementById('cartItemsContainer');
  const summaryContainer = document.getElementById('cartSummary');
  if (!cartContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <div class="icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <a href="index.html" class="shop-btn">Start Shopping →</a>
      </div>`;
    if (summaryContainer) summaryContainer.style.display = 'none';
    return;
  }

  if (summaryContainer) summaryContainer.style.display = '';

  cartContainer.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>₹${item.price.toLocaleString('en-IN')} each</p>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty(${i},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
        </div>
      </div>
      <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
      <button class="remove-btn" onclick="removeItem(${i})" title="Remove">✕</button>
    </div>
  `).join('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal > 999 ? 0 : 99;
  const total = subtotal + delivery;

  if (summaryContainer) {
    summaryContainer.innerHTML = `
      <h3>Order Summary</h3>
      <div class="summary-row"><span>Subtotal (${cart.reduce((s,i)=>s+i.qty,0)} items)</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
      <div class="summary-row"><span>Delivery</span><span>${delivery === 0 ? '<span style="color:var(--clr-accent-alt)">FREE</span>' : '₹' + delivery}</span></div>
      <div class="summary-row total"><span>Total</span><span>₹${total.toLocaleString('en-IN')}</span></div>
      <button class="checkout-btn">Proceed to Checkout →</button>
    `;
  }
}

function changeQty(i, delta) {
  const cart = getCart();
  cart[i].qty = Math.max(1, cart[i].qty + delta);
  saveCart(cart);
  renderCart();
}

function removeItem(i) {
  const cart = getCart();
  cart.splice(i, 1);
  saveCart(cart);
  renderCart();
}

// ─── INIT ─────────────────────────────────────────────────────
updateCartBadge();
renderCart();