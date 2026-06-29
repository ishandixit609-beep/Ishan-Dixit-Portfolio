// SLIDER
const slider = document.getElementById('mainSlider');
if (slider) {
  const slides = slider.querySelectorAll('.slide');
  const dots = document.getElementById('sliderDots');
  let cur = 0, timer;

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'slider-dot' + (i ? '' : ' active');
    d.onclick = () => go(i);
    dots.appendChild(d);
  });

  function go(n) {
    slides[cur].classList.remove('active');
    dots.children[cur].classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dots.children[cur].classList.add('active');
    clearInterval(timer);
    timer = setInterval(() => go(cur + 1), 4000);
  }

  document.getElementById('nextBtn')?.addEventListener('click', () => go(cur + 1));
  document.getElementById('prevBtn')?.addEventListener('click', () => go(cur - 1));
  timer = setInterval(() => go(cur + 1), 4000);
}

// SCROLL ROW
function scrollRow(id, dir) {
  document.getElementById(id)?.scrollBy({ left: dir === 'right' ? 500 : -500, behavior: 'smooth' });
}

// FILTER TABS
function filterCategory(tab, id) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  document.querySelectorAll('.product-section').forEach(s => {
    s.style.display = (id === 'all' || s.dataset.section === id) ? '' : 'none';
  });
}

// CART HELPERS
const getCart = () => { try { return JSON.parse(localStorage.getItem('shopx_cart') || '[]'); } catch { return []; } };
const saveCart = c => { localStorage.setItem('shopx_cart', JSON.stringify(c)); updateBadge(); };

function updateBadge() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = total;
    el.style.display = total ? 'flex' : 'none';
  });
}

function addToCart(name, price, img) {
  const cart = getCart(), idx = cart.findIndex(i => i.name === name);
  idx > -1 ? cart[idx].qty++ : cart.push({ name, price, img, qty: 1 });
  saveCart(cart);
  const btn = event.target, orig = btn.textContent;
  btn.textContent = '✓ Added!';
  btn.style.cssText = 'background:var(--clr-accent-alt);color:#000';
  setTimeout(() => { btn.textContent = orig; btn.style.cssText = ''; }, 1200);
}

// CART PAGE
function renderCart() {
  const box = document.getElementById('cartItemsContainer');
  const sum = document.getElementById('cartSummary');
  if (!box) return;
  const cart = getCart();
  if (!cart.length) {
    box.innerHTML = `<div class="empty-cart"><div class="icon">🛒</div><h2>Your cart is empty</h2><p>Nothing added yet.</p><a href="index.html" class="shop-btn">Start Shopping →</a></div>`;
    if (sum) sum.style.display = 'none';
    return;
  }
  if (sum) sum.style.display = '';
  box.innerHTML = cart.map((item, i) => `
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
      <div class="cart-item-price">₹${(item.price*item.qty).toLocaleString('en-IN')}</div>
      <button class="remove-btn" onclick="removeItem(${i})">✕</button>
    </div>`).join('');
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const del = sub > 999 ? 0 : 99;
  sum.innerHTML = `<h3>Order Summary</h3>
    <div class="summary-row"><span>Subtotal</span><span>₹${sub.toLocaleString('en-IN')}</span></div>
    <div class="summary-row"><span>Delivery</span><span>${del ? '₹'+del : '<span style="color:var(--clr-accent-alt)">FREE</span>'}</span></div>
    <div class="summary-row total"><span>Total</span><span>₹${(sub+del).toLocaleString('en-IN')}</span></div>
    <button class="checkout-btn">Proceed to Checkout →</button>`;
}

function changeQty(i, d) {
  const cart = getCart();
  cart[i].qty = Math.max(1, cart[i].qty + d);
  saveCart(cart); renderCart();
}

function removeItem(i) {
  const cart = getCart();
  cart.splice(i, 1);
  saveCart(cart); renderCart();
}

updateBadge();
renderCart();