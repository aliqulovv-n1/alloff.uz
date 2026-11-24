// 1. Theme Toggle + LocalStorage
const htmlEl = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('all_off_theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('all_off_theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// 2. Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// 3. Product Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const products = document.querySelectorAll('.product');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    products.forEach((product) => {
      const match = filter === 'all' || product.dataset.category === filter;
      product.style.display = match ? 'flex' : 'none';
    });
  });
});

// 4. Toast Notification
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

// 5. Cart System + LocalStorage
let cart = JSON.parse(localStorage.getItem('all_off_cart') || '[]');

const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartModal = document.getElementById('cartModal');

function saveCart() {
  localStorage.setItem('all_off_cart', JSON.stringify(cart));
}

function addToCart(name, price) {
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price: Number(price), qty: 1 });
  }
  saveCart();
  renderCart();
  showToast(`"${name}" savatchaga qo‘shildi`);
}

function changeQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function renderCart() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalSum = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = totalCount;
  cartTotal.textContent = totalSum.toLocaleString('uz-UZ');

  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="color: var(--muted); padding: 12px 0;">Savatcha bo‘sh</p>';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item, index) => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br />
          <small style="color: var(--muted);">${(item.price * item.qty).toLocaleString('uz-UZ')} so‘m</small>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
          <button class="remove-btn" onclick="removeItem(${index})" title="O‘chirish">✕</button>
        </div>
      </div>
    `
    )
    .join('');
}

document.querySelectorAll('.add-to-cart').forEach((btn) => {
  btn.addEventListener('click', () => {
    addToCart(btn.dataset.name, btn.dataset.price);
  });
});

document.getElementById('cartBtn').addEventListener('click', () => {
  renderCart();
  cartModal.classList.add('open');
});

document.getElementById('closeCart').addEventListener('click', () => {
  cartModal.classList.remove('open');
});

cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) {
    cartModal.classList.remove('open');
  }
});

document.getElementById('clearCartBtn').addEventListener('click', () => {
  cart = [];
  saveCart();
  renderCart();
  showToast('Savatcha tozalandi');
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('Savatcha bo‘sh!');
    return;
  }
  const sum = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  showToast(`Buyurtma qabul qilindi (${sum.toLocaleString('uz-UZ')} so‘m)`);
  cart = [];
  saveCart();
  renderCart();
  cartModal.classList.remove('open');
});

// 6. Pricing Plan -> Contact Form
const messageInput = document.getElementById('messageInput');
document.querySelectorAll('.select-plan').forEach((btn) => {
  btn.addEventListener('click', () => {
    const plan = btn.dataset.plan;
    messageInput.value = `Assalomu alaykum! "${plan}" tarifini tanladim, batafsil ma'lumot bering.`;
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    showToast(`"${plan}" tarifi tanlandi`);
  });
});

// 7. Contact Form
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('nameInput').value.trim();
  const phone = document.getElementById('phoneInput').value.trim();

  formStatus.textContent = `Rahmat, ${name}! Xabaringiz qabul qilindi (${phone} raqamiga tez orada bog‘lanamiz).`;
  showToast('Xabar muvaffaqiyatli yuborildi');
  contactForm.reset();
});

// Initial render
renderCart();