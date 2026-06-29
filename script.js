console.log("Script Loaded");
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

const input = document.getElementById("searchInput");
const results = document.getElementById("searchResults");

const products = [

// Accessories
{ name: "Leather Handbag", page: "accessories.html", id: "leather-handbag" },
{ name: "Urban Backpack", page: "accessories.html", id: "urban-backpack" },
{ name: "Crossbody Sling Bag", page: "accessories.html", id: "crossbody-sling-bag" },
{ name: "Tote Canvas Bag", page: "accessories.html", id: "tote-canvas-bag" },
{ name: "Clutch Evening Bag", page: "accessories.html", id: "clutch-evening-bag" },

{ name: "Gold Bangle Bracelet", page: "accessories.html", id: "gold-bangle-bracelet" },
{ name: "Layered Pendant Necklace", page: "accessories.html", id: "layered-pendant-necklace" },
{ name: "Classic Hoop Earrings", page: "accessories.html", id: "classic-hoop-earrings" },
{ name: "Stackable Ring Set", page: "accessories.html", id: "stackable-ring-set" },

{ name: "Smartwatch Series 5", page: "accessories.html", id: "smartwatch-series-5" },
{ name: "Fitness Tracker Band", page: "accessories.html", id: "fitness-tracker-band" },
{ name: "Smart Health Ring", page: "accessories.html", id: "smart-health-ring" },

{ name: "Leather Watch Strap", page: "accessories.html", id: "leather-watch-strap" },
{ name: "6-Slot Watch Box", page: "accessories.html", id: "6-slot-watch-box" },
{ name: "Automatic Watch Winder", page: "accessories.html", id: "automatic-watch-winder" },
{ name: "Watch Cleaning Kit", page: "accessories.html", id: "watch-cleaning-kit" },

{ name: "Polarized Sunglasses", page: "accessories.html", id: "polarized-sunglasses" },
{ name: "Round Frame Glasses", page: "accessories.html", id: "round-frame-glasses" },
{ name: "Classic Aviator Sunglasses", page: "accessories.html", id: "classic-aviator-sunglasses" },
{ name: "Blue Light Blocking Glasses", page: "accessories.html", id: "blue-light-blocking-glasses" },

{ name: "Premium Shoe Lace Pack", page: "accessories.html", id: "premium-shoe-lace-pack" },
{ name: "Shoe Cleaning Kit", page: "accessories.html", id: "shoe-cleaning-kit" },
{ name: "Comfort Gel Insoles", page: "accessories.html", id: "comfort-gel-insoles" },

{ name: "Hardshell Trolley 24", page: "accessories.html", id: "hardshell-trolley-24" },
{ name: "Travel Duffel Bag", page: "accessories.html", id: "travel-duffel-bag" },
{ name: "Travel Toiletry Organizer", page: "accessories.html", id: "travel-toiletry-organizer" },
{ name: "Packing Cube Set (4pc)", page: "accessories.html", id: "packing-cube-set-4pc" },
{ name: "Cotton Kitchen Apron", page: "accessories.html", id: "cotton-kitchen-apron" },
{ name: "Heat Resistant Oven Mitts", page: "accessories.html", id: "heat-resistant-oven-mitts" },
{ name: "Chef Apron & Towel Set", page: "accessories.html", id: "chef-apron-towel-set" },
{ name: "Kitchen Glove Set", page: "accessories.html", id: "kitchen-glove-set" },

// Electronics
{ name: "Wireless Headphones", page: "electronics.html", id: "wireless-headphones" },
{ name: "True Wireless Earbuds", page: "electronics.html", id: "true-wireless-earbuds" },
{ name: "Portable Bluetooth Speaker", page: "electronics.html", id: "portable-bluetooth-speaker" },
{ name: "Over-Ear Studio Headphones", page: "electronics.html", id: "over-ear-studio-headphones" },
{ name: "Gaming Headset RGB", page: "electronics.html", id: "gaming-headset-rgb" },
{ name: "65W Fast Wall Charger", page: "electronics.html", id: "65w-fast-wall-charger" },
{ name: "Wireless Charging Pad", page: "electronics.html", id: "wireless-charging-pad" },
{ name: "20000mAh Power Bank", page: "electronics.html", id: "20000mah-power-bank" },
{ name: "4-in-1 USB Hub Charger", page: "electronics.html", id: "4-in-1-usb-hub-charger" },
{ name: "MagSafe Compatible Charger", page: "electronics.html", id: "magsafe-compatible-charger" },
{ name: "Wireless Game Controller", page: "electronics.html", id: "wireless-game-controller" },
{ name: "RGB Gaming Headset", page: "electronics.html", id: "rgb-gaming-headset" },
{ name: "Mechanical Gaming Keyboard", page: "electronics.html", id: "mechanical-gaming-keyboard" },
{ name: "Gaming Mouse Pad XL", page: "electronics.html", id: "gaming-mouse-pad-xl" },
{ name: "USB Gaming Microphone", page: "electronics.html", id: "usb-gaming-microphone" },
{ name: "Digital Air Fryer 4L", page: "electronics.html", id: "digital-air-fryer-4l" },
{ name: "Mixer Grinder 750W", page: "electronics.html", id: "mixer-grinder-750w" },
{ name: "Electric Kettle 1.7L", page: "electronics.html", id: "electric-kettle-1-7l" },
{ name: "Induction Cooktop 2000W", page: "electronics.html", id: "induction-cooktop-2000w" },
{ name: "Smartwatch Series 5", page: "electronics.html", id: "smartwatch-series-5" },
{ name: "WiFi Smart Bulb (Pack of 2)", page: "electronics.html", id: "wifi-smart-bulb-pack-of-2" },
{ name: "AI Smart Speaker", page: "electronics.html", id: "ai-smart-speaker" },
{ name: "Smart Doorbell Camera", page: "electronics.html", id: "smart-doorbell-camera" },
{ name: "Braided USB-C Cable 2m", page: "electronics.html", id: "braided-usb-c-cable-2m" },
{ name: "4K HDMI Cable 2m", page: "electronics.html", id: "4k-hdmi-cable-2m" },
{ name: "Lightning to USB-C Cable", page: "electronics.html", id: "lightning-to-usb-c-cable" },
{ name: "3-in-1 Charging Cable", page: "electronics.html", id: "3-in-1-charging-cable" },

{ name: "Nike Air Sneakers", page: "fashion.html", id: "nike-air-sneakers" },
{ name: "Leather Jacket", page: "fashion.html", id: "leather-jacket" },
{ name: "Summer Floral Dress", page: "fashion.html", id: "summer-floral-dress" },
{ name: "Slim Fit Jeans", page: "fashion.html", id: "slim-fit-jeans" },
{ name: "Classic White Tee", page: "fashion.html", id: "classic-white-tee" },
{ name: "Wool Winter Coat", page: "fashion.html", id: "wool-winter-coat" },

{ name: "Nike Air Sneakers", page: "footwear.html", id: "nike-air-sneakers" },
{ name: "Canvas Slip-Ons", page: "footwear.html", id: "canvas-slip-ons" },
{ name: "Casual Loafers", page: "footwear.html", id: "casual-loafers" },
{ name: "Low Top Trainers", page: "footwear.html", id: "low-top-trainers" },
{ name: "Comfort Slip-Ons", page: "footwear.html", id: "comfort-slip-ons" },
{ name: "UltraRun Running Shoes", page: "footwear.html", id: "ultrarun-running-shoes" },
{ name: "CrossTrain Pro Shoes", page: "footwear.html", id: "crosstrain-pro-shoes" },
{ name: "TrailBlazer Hiking Shoes", page: "footwear.html", id: "trailblazer-hiking-shoes" },
{ name: "Pro Soccer Cleats", page: "footwear.html", id: "pro-soccer-cleats" },
{ name: "FlexFit Yoga Shoes", page: "footwear.html", id: "flexfit-yoga-shoes" },
{ name: "Comfort Flip-Flops", page: "footwear.html", id: "comfort-flip-flops" },
{ name: "Sport Strap Sandals", page: "footwear.html", id: "sport-strap-sandals" },
{ name: "Leather Strap Sandals", page: "footwear.html", id: "leather-strap-sandals" },
{ name: "Wedge Platform Sandals", page: "footwear.html", id: "wedge-platform-sandals" },
{ name: "Classic Oxford Shoes", page: "footwear.html", id: "classic-oxford-shoes" },
{ name: "Leather Derby Shoes", page: "footwear.html", id: "leather-derby-shoes" },
{ name: "Monk Strap Shoes", page: "footwear.html", id: "monk-strap-shoes" },
{ name: "Wingtip Brogues", page: "footwear.html", id: "wingtip-brogues" },
{ name: "Chelsea Ankle Boots", page: "footwear.html", id: "chelsea-ankle-boots" },
{ name: "Combat Boots", page: "footwear.html", id: "combat-boots" },
{ name: "All-Terrain Hiking Boots", page: "footwear.html", id: "all-terrain-hiking-boots" },
{ name: "Western Cowboy Boots", page: "footwear.html", id: "western-cowboy-boots" },
{ name: "Knee High Leather Boots", page: "footwear.html", id: "knee-high-leather-boots" },
{ name: "Embroidered Juttis", page: "footwear.html", id: "embroidered-juttis" },
{ name: "Handcrafted Kolhapuris", page: "footwear.html", id: "handcrafted-kolhapuris" },
{ name: "Royal Mojari Slippers", page: "footwear.html", id: "royal-mojari-slippers" },
{ name: "Classic Nagra Shoes", page: "footwear.html", id: "classic-nagra-shoes" },

{ name: "3-Seater Fabric Sofa", page: "home.html", id: "3-seater-fabric-sofa" },
{ name: "Wooden Study Table", page: "home.html", id: "wooden-study-table" },
{ name: "5-Tier Bookshelf", page: "home.html", id: "5-tier-bookshelf" },
{ name: "Queen Bed Frame", page: "home.html", id: "queen-bed-frame" },
{ name: "Recliner Arm Chair", page: "home.html", id: "recliner-arm-chair" },
{ name: "Set of 5 Cushion Covers", page: "home.html", id: "set-of-5-cushion-covers" },
{ name: "Ceramic Table Lamp", page: "home.html", id: "ceramic-table-lamp" },
{ name: "Woven Storage Basket", page: "home.html", id: "woven-storage-basket" },
{ name: "Floating Wall Shelf", page: "home.html", id: "floating-wall-shelf" },
{ name: "Curtain Set (2 Panels)", page: "home.html", id: "curtain-set-2-panels" },
{ name: "Abstract Canvas Wall Art", page: "home.html", id: "abstract-canvas-wall-art" },
{ name: "Artificial Indoor Plant", page: "home.html", id: "artificial-indoor-plant" },
{ name: "Scented Candle Set (3pc)", page: "home.html", id: "scented-candle-set-3pc" },
{ name: "Decorative Mirror Round", page: "home.html", id: "decorative-mirror-round" },
{ name: "Macrame Wall Hanging", page: "home.html", id: "macrame-wall-hanging" },

{ name: "Gold Bangle Bracelet", page: "jewellery.html", id: "gold-bangle-bracelet" },
{ name: "Charm Bracelet", page: "jewellery.html", id: "charm-bracelet" },
{ name: "Beaded Stack Bracelet", page: "jewellery.html", id: "beaded-stack-bracelet" },
{ name: "Silver Cuff Bracelet", page: "jewellery.html", id: "silver-cuff-bracelet" },
{ name: "Tennis Bracelet", page: "jewellery.html", id: "tennis-bracelet" },

{ name: "Layered Pendant Necklace", page: "jewellery.html", id: "layered-pendant-necklace" },
{ name: "Statement Choker", page: "jewellery.html", id: "statement-choker" },
{ name: "Minimal Gold Chain", page: "jewellery.html", id: "minimal-gold-chain" },
{ name: "Pearl Strand Necklace", page: "jewellery.html", id: "pearl-strand-necklace" },
{ name: "Oxidised Silver Necklace", page: "jewellery.html", id: "oxidised-silver-necklace" },

{ name: "Classic Hoop Earrings", page: "jewellery.html", id: "classic-hoop-earrings" },
{ name: "Crystal Stud Earrings", page: "jewellery.html", id: "crystal-stud-earrings" },
{ name: "Statement Drop Earrings", page: "jewellery.html", id: "statement-drop-earrings" },
{ name: "Jhumka Earrings", page: "jewellery.html", id: "jhumka-earrings" },
{ name: "Threader Earrings", page: "jewellery.html", id: "threader-earrings" },

{ name: "Minimal Band Ring", page: "jewellery.html", id: "minimal-band-ring" },
{ name: "Statement Stone Ring", page: "jewellery.html", id: "statement-stone-ring" },
{ name: "Stackable Ring Set (5pc)", page: "jewellery.html", id: "stackable-ring-set-5pc" },
{ name: "Adjustable Flower Ring", page: "jewellery.html", id: "adjustable-flower-ring" },

{ name: "Vintage Floral Brooch", page: "jewellery.html", id: "vintage-floral-brooch" },
{ name: "Pearl Lapel Pin", page: "jewellery.html", id: "pearl-lapel-pin" },
{ name: "Crystal Statement Brooch", page: "jewellery.html", id: "crystal-statement-brooch" },
{ name: "Enamel Pin Set", page: "jewellery.html", id: "enamel-pin-set" },

{ name: "Beaded Anklet", page: "jewellery.html", id: "beaded-anklet" },
{ name: "Silver Chain Anklet", page: "jewellery.html", id: "silver-chain-anklet" },
{ name: "Traditional Bell Anklet", page: "jewellery.html", id: "traditional-bell-anklet" },
{ name: "Gold Layered Anklet", page: "jewellery.html", id: "gold-layered-anklet" },
];

input.addEventListener("input",()=>{

    let text=input.value.toLowerCase();
    results.innerHTML="";

    if(text==""){
        results.style.display="none";
        return;
    }

    products.forEach(product=>{

        if(product.name.toLowerCase().includes(text)){

            let item=document.createElement("div");
            item.className="search-item";
            item.textContent=product.name;

            item.onclick = () => {
    window.location.href = `${product.page}?product=${product.id}`;
};

            results.appendChild(item);
        }

    });

    if(results.children.length==0){

        let item=document.createElement("div");
        item.className="search-item no-result";
        item.textContent="No product found";
        results.appendChild(item);

    }

    results.style.display="block";

});

document.addEventListener("click",e=>{

    if(!e.target.closest(".search-bar")){
        results.style.display="none";
    }

});

window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("product");

  if (!productId) return;

  const product = document.getElementById(productId);

  if (product) {
    product.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    product.classList.add("highlight-product");

    setTimeout(() => {
      product.classList.remove("highlight-product");
    }, 1800);
  }
});
