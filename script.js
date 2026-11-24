// Theme
const htmlEl = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('alloff_ig_theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('alloff_ig_theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// Toast
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// Profile Bio & Follow
const bioDisplay = document.getElementById('profileBioDisplay');
const savedBio = localStorage.getItem('alloff_ig_bio');
if (savedBio) bioDisplay.textContent = savedBio;

document.getElementById('editBioBtn').addEventListener('click', () => {
  const updated = prompt('Yangi bio matnini kiriting:', bioDisplay.textContent);
  if (updated && updated.trim()) {
    bioDisplay.textContent = updated.trim();
    localStorage.setItem('alloff_ig_bio', updated.trim());
    showToast('Bio yangilandi');
  }
});

let isFollowing = JSON.parse(localStorage.getItem('alloff_ig_follow') || 'false');
let followersCount = Number(localStorage.getItem('alloff_ig_followers') || 1280);
const followBtn = document.getElementById('followBtn');

function renderFollowState() {
  followBtn.textContent = isFollowing ? 'Obuna bo‘lingan ✓' : 'Obuna bo‘lish';
  followBtn.className = isFollowing ? 'btn-ghost-sm' : 'btn-primary-sm';
  document.getElementById('pFollowers').textContent = followersCount.toLocaleString('uz-UZ');
}

followBtn.addEventListener('click', () => {
  isFollowing = !isFollowing;
  followersCount += isFollowing ? 1 : -1;
  localStorage.setItem('alloff_ig_follow', JSON.stringify(isFollowing));
  localStorage.setItem('alloff_ig_followers', String(followersCount));
  renderFollowState();
  showToast(isFollowing ? '@all.off.uz ga obuna bo‘ldingiz' : 'Obuna bekor qilindi');
});

// Stories + Next/Prev
const stories = [
  { id: 0, title: 'Aksiya -20%', icon: '🔥', text: 'all.off.uz do‘konida maxsus takliflar va tezkor buyurtmalar!' },
  { id: 1, title: 'Web & Bot', icon: '💻', text: 'Zamonaviy saytlar, kataloglar va Telegram botlar yaratish.' },
  { id: 2, title: 'SMM Boost', icon: '📈', text: 'Ijtimoiy tarmoqlarda brendni faol rivojlantirish.' },
  { id: 3, title: 'Portfolio', icon: '🎨', text: 'Tayyor loyihalar va interfeys namunalari.' },
  { id: 4, title: '2026 Hub', icon: '✨', text: 'Dark mode, qulay filtrlar va tezkor savatcha.' }
];

const storiesBar = document.getElementById('storiesBar');
const storyModal = document.getElementById('storyModal');
let activeStoryIndex = 0;

storiesBar.innerHTML = stories
  .map(
    (s) => `
    <button class="story-item" data-idx="${s.id}">
      <div class="story-ring"><div class="story-inner">${s.icon}</div></div>
      <span>${s.title}</span>
    </button>
  `
  )
  .join('');

function openStory(idx) {
  activeStoryIndex = (idx + stories.length) % stories.length;
  const st = stories[activeStoryIndex];
  document.getElementById('storyModalTitle').textContent = st.title;
  document.getElementById('storyVisual').textContent = st.icon;
  document.getElementById('storyModalText').textContent = st.text;
  document.getElementById('storyProgressBars').innerHTML = stories
    .map((_, i) => `<div class="story-seg ${i <= activeStoryIndex ? 'done' : ''}"></div>`)
    .join('');
  storyModal.classList.add('open');
}

storiesBar.querySelectorAll('.story-item').forEach((btn) => {
  btn.addEventListener('click', () => openStory(Number(btn.dataset.idx)));
});

document.getElementById('prevStoryBtn').addEventListener('click', () => openStory(activeStoryIndex - 1));
document.getElementById('nextStoryBtn').addEventListener('click', () => openStory(activeStoryIndex + 1));
document.getElementById('closeStory').addEventListener('click', () => storyModal.classList.remove('open'));
storyModal.addEventListener('click', (e) => {
  if (e.target === storyModal) storyModal.classList.remove('open');
});

// Direct Messages
let messages = JSON.parse(localStorage.getItem('alloff_ig_dm') || 'null') || [
  { from: 'all.off.uz', text: 'Assalomu alaykum! all.off.uz platformasiga xush kelibsiz.' },
  { from: 'all.off.uz', text: 'Savol yoki buyurtma bo‘lsa, shu yerda yozishingiz mumkin.' }
];

const dmModal = document.getElementById('dmModal');

function renderDm() {
  document.getElementById('msgCount').textContent = messages.length;
  document.getElementById('dmList').innerHTML = messages
    .map((m) => `<div class="dm-bubble ${m.from === 'me' ? 'me' : ''}"><strong>${m.from}:</strong> ${m.text}</div>`)
    .join('');
}

document.getElementById('dmBtn').addEventListener('click', () => {
  renderDm();
  dmModal.classList.add('open');
});
document.getElementById('closeDm').addEventListener('click', () => dmModal.classList.remove('open'));
dmModal.addEventListener('click', (e) => {
  if (e.target === dmModal) dmModal.classList.remove('open');
});

document.getElementById('dmForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const inp = document.getElementById('dmInput');
  const txt = inp.value.trim();
  if (!txt) return;
  messages.push({ from: 'me', text: txt });
  localStorage.setItem('alloff_ig_dm', JSON.stringify(messages));
  inp.value = '';
  renderDm();
  showToast('Xabar yuborildi');
});

// Reels Data
const reels = [
  { id: 1, tag: '#reels • web', icon: '⚡', title: '1 soniyada tezkor UI', desc: 'Zamonaviy interfeys, qorong‘i rejim va qulay navigatsiya.' },
  { id: 2, tag: '#reels • shop', icon: '🛒', title: 'Aqlli Savatcha Tizimi', desc: 'Mahsulot sonini oshirish, kamaytirish va bir zumda buyurtma.' },
  { id: 3, tag: '#reels • bot', icon: '🤖', title: 'Avtomatlashtirilgan Xizmatlar', desc: 'Sayt va Telegram botlar bilan mijozlarga tezkor javob.' }
];

function renderReels() {
  document.getElementById('reelsStack').innerHTML = reels
    .map(
      (r) => `
      <div class="reel-card">
        <div class="reel-top">
          <span class="tag-badge">@all.off.uz</span>
          <small>${r.tag}</small>
        </div>
        <div class="reel-center">
          <span>${r.icon}</span>
          <h3>${r.title}</h3>
          <p>${r.desc}</p>
        </div>
        <div class="reel-bottom">
          <button class="btn-primary-sm" onclick="sharePost('${r.title}')">Ulashish</button>
          <button class="btn-ghost-sm" onclick="switchView('feed')">Lentaga qaytish</button>
        </div>
      </div>
    `
    )
    .join('');
}

// Posts Data
const defaultPosts = [
  {
    id: 101,
    author: 'all.off.uz',
    category: 'shop',
    emoji: '🎧',
    image: '',
    title: 'Simsiz Quloqchin Pro',
    caption: 'Toza ovoz va qulay dizayn. Rasmga ikki marta bosing yoki savatchaga qo‘shing!',
    price: 450000,
    likes: 24,
    liked: false,
    saved: false,
    comments: [{ user: 'jasur', text: 'Zo‘r tanlov!' }]
  },
  {
    id: 102,
    author: 'all.off.uz',
    category: 'services',
    emoji: '🚀',
    image: '',
    title: 'Veb-sayt va Telegram Bot',
    caption: 'Biznesingiz uchun sayt va buyurtmalarni boshqaruvchi bot.',
    price: 0,
    likes: 31,
    liked: false,
    saved: true,
    comments: [{ user: 'dilnoza', text: 'Biznes tarif qiziq.' }]
  },
  {
    id: 103,
    author: 'all.off.uz',
    category: 'portfolio',
    emoji: '🛍️',
    image: '',
    title: 'Onlayn Do‘kon Maketi',
    caption: 'Filtr, savatcha va moslashuvchan interfeys.',
    price: 250000,
    likes: 19,
    liked: false,
    saved: false,
    comments: []
  },
  {
    id: 104,
    author: 'all.off.uz',
    category: 'blog',
    emoji: '📰',
    image: '',
    title: 'Zamonaviy Web Interfeyslar',
    caption: 'Tezkor yuklanish, qulay navigatsiya va foydalanuvchi tajribasi.',
    price: 0,
    likes: 27,
    liked: false,
    saved: false,
    comments: []
  }
];

let posts = JSON.parse(localStorage.getItem('alloff_ig_posts_v3') || 'null') || defaultPosts;
let activeCategory = 'all';
let searchQuery = '';
let currentView = 'feed';

function savePosts() {
  localStorage.setItem('alloff_ig_posts_v3', JSON.stringify(posts));
}

// Cart
let cart = JSON.parse(localStorage.getItem('alloff_ig_cart_v3') || '[]');
const cartModal = document.getElementById('cartModal');

function saveCart() {
  localStorage.setItem('alloff_ig_cart_v3', JSON.stringify(cart));
}

function addToCart(name, price) {
  const found = cart.find((i) => i.name === name);
  if (found) found.qty += 1;
  else cart.push({ name, price: Number(price), qty: 1 });
  saveCart();
  renderCart();
  showToast(`"${name}" savatchaga qo‘shildi`);
}

function changeQty(idx, delta) {
  if (!cart[idx]) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart();
  renderCart();
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const sum = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = `${sum.toLocaleString('uz-UZ')} so‘m`;

  const wrap = document.getElementById('cartItems');
  if (!cart.length) {
    wrap.innerHTML = '<p style="color: var(--muted); padding: 10px 0;">Savatcha bo‘sh</p>';
    return;
  }

  wrap.innerHTML = cart
    .map(
      (item, idx) => `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong><br />
          <small style="color: var(--muted);">${(item.price * item.qty).toLocaleString('uz-UZ')} so‘m</small>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <button class="btn-ghost-sm" onclick="changeQty(${idx}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="btn-ghost-sm" onclick="changeQty(${idx}, 1)">+</button>
        </div>
      </div>
    `
    )
    .join('');
}

document.getElementById('cartBtn').addEventListener('click', () => {
  renderCart();
  cartModal.classList.add('open');
});
document.getElementById('closeCart').addEventListener('click', () => cartModal.classList.remove('open'));
cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) cartModal.classList.remove('open');
});
document.getElementById('clearCartBtn').addEventListener('click', () => {
  cart = [];
  saveCart();
  renderCart();
  showToast('Savatcha tozalandi');
});
document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (!cart.length) return showToast('Savatcha bo‘sh!');
  const sum = cart.reduce((s, i) => s + i.price * i.qty, 0);
  showToast(`Buyurtma qabul qilindi: ${sum.toLocaleString('uz-UZ')} so‘m`);
  cart = [];
  saveCart();
  renderCart();
  cartModal.classList.remove('open');
});

// Views Switcher
const views = {
  feed: document.getElementById('feedView'),
  reels: document.getElementById('reelsView'),
  explore: document.getElementById('exploreView'),
  saved: document.getElementById('savedView'),
  profile: document.getElementById('profileView')
};

function switchView(viewName) {
  currentView = viewName;
  Object.keys(views).forEach((k) => {
    views[k].classList.toggle('hidden', k !== viewName);
  });

  document.querySelectorAll('.view-tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.view === viewName);
  });

  document.querySelectorAll('.bnav-btn[data-view]').forEach((b) => {
    b.classList.toggle('active', b.dataset.view === viewName);
  });

  if (viewName === 'reels') renderReels();
  renderAll();
}

document.querySelectorAll('.view-tab, .bnav-btn[data-view]').forEach((btn) => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

// Create / Edit Post Modal
const createModal = document.getElementById('createModal');
const modalPostForm = document.getElementById('modalPostForm');

function openCreateModal(postToEdit = null) {
  if (postToEdit) {
    document.getElementById('modalFormTitle').textContent = 'Postni Tahrirlash';
    document.getElementById('modalSubmitBtn').textContent = 'Saqlash';
    document.getElementById('editPostId').value = postToEdit.id;
    document.getElementById('mTitle').value = postToEdit.title;
    document.getElementById('mCaption').value = postToEdit.caption;
    document.getElementById('mCategory').value = postToEdit.category;
    document.getElementById('mPrice').value = postToEdit.price || '';
    document.getElementById('mImage').value = postToEdit.image || '';
  } else {
    document.getElementById('modalFormTitle').textContent = 'Yangi Post Yaratish';
    document.getElementById('modalSubmitBtn').textContent = 'Lentaga joylash';
    modalPostForm.reset();
    document.getElementById('editPostId').value = '';
  }
  createModal.classList.add('open');
}

document.getElementById('openCreateModalBtn').addEventListener('click', () => openCreateModal(null));
document.getElementById('mobCreateBtn').addEventListener('click', () => openCreateModal(null));
document.getElementById('closeCreate').addEventListener('click', () => createModal.classList.remove('open'));
createModal.addEventListener('click', (e) => {
  if (e.target === createModal) createModal.classList.remove('open');
});

const emojiByCat = {
  shop: '🛍️',
  services: '⚙️',
  portfolio: '🎯',
  blog: '✍️'
};

function createNewPost({ title, caption, category, price, image }) {
  posts.unshift({
    id: Date.now(),
    author: 'all.off.uz',
    category,
    emoji: emojiByCat[category] || '✨',
    image: image || '',
    title,
    caption,
    price: Number(price || 0),
    likes: 1,
    liked: true,
    saved: false,
    comments: []
  });
  savePosts();
  switchView('feed');
  showToast('Yangi post joylandi');
}

document.getElementById('inlineComposer').addEventListener('submit', (e) => {
  e.preventDefault();
  createNewPost({
    title: document.getElementById('quickTitle').value.trim(),
    caption: document.getElementById('quickCaption').value.trim(),
    category: document.getElementById('quickCat').value,
    price: document.getElementById('quickPrice').value
  });
  e.target.reset();
});

modalPostForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const editId = Number(document.getElementById('editPostId').value || 0);
  const title = document.getElementById('mTitle').value.trim();
  const caption = document.getElementById('mCaption').value.trim();
  const category = document.getElementById('mCategory').value;
  const price = Number(document.getElementById('mPrice').value || 0);
  const image = document.getElementById('mImage').value.trim();

  if (editId) {
    const target = posts.find((x) => x.id === editId);
    if (target) {
      target.title = title;
      target.caption = caption;
      target.category = category;
      target.emoji = emojiByCat[category] || target.emoji;
      target.price = price;
      target.image = image;
      savePosts();
      renderAll();
      showToast('Post yangilandi');
    }
  } else {
    createNewPost({ title, caption, category, price, image });
  }

  modalPostForm.reset();
  createModal.classList.remove('open');
});

// Post Card Template
function postCardHTML(p) {
  const safeTitle = p.title.replace(/'/g, '');
  const hasImg = Boolean(p.image);
  return `
    <article class="post-card">
      <div class="post-header">
        <div class="post-author">
          <div class="avatar">AO</div>
          <div>
            <strong>${p.author}</strong>
            <small>all.off.uz • ${p.category}</small>
          </div>
        </div>
        <div class="post-head-right">
          <span class="tag-badge">${p.category}</span>
          <button class="icon-act" onclick="editPost(${p.id})" title="Tahrirlash">✏️</button>
          <button class="icon-act" onclick="deletePost(${p.id})" title="O‘chirish">🗑</button>
        </div>
      </div>

      <div class="post-media ${hasImg ? 'has-img' : ''}" ondblclick="doubleLike(${p.id})">
        ${hasImg ? `<img src="${p.image}" alt="${safeTitle}" onerror="this.remove()" />` : ''}
        <div class="heart-burst" id="heart-${p.id}">❤️</div>
        <div class="post-media-overlay">
          <div class="post-emoji">${p.emoji || '✨'}</div>
          <h3>${p.title}</h3>
        </div>
      </div>

      <div class="post-actions">
        <div class="action-left">
          <button class="act-btn ${p.liked ? 'liked' : ''}" onclick="toggleLike(${p.id})">
            ${p.liked ? '❤️' : '🤍'} <span>${p.likes}</span>
          </button>
          <button class="act-btn" onclick="focusComment(${p.id})">💬 <span>${p.comments.length}</span></button>
          <button class="act-btn" onclick="sharePost('${safeTitle}')">➤</button>
        </div>
        <button class="act-btn" onclick="toggleSave(${p.id})">${p.saved ? '🔖' : '📑'}</button>
      </div>

      <div class="post-body">
        <div class="post-likes-line">${p.likes} ta layk</div>
        <p class="post-caption"><strong>${p.author}</strong> ${p.caption}</p>

        ${
          p.price > 0
            ? `<div class="post-shop-bar">
                 <span class="post-price">${Number(p.price).toLocaleString('uz-UZ')} so‘m</span>
                 <button class="btn-primary-sm" onclick="addToCart('${safeTitle}', ${p.price})">Savatchaga</button>
               </div>`
            : ''
        }

        <div class="comments-box">
          ${p.comments.map((c) => `<div class="comment-item"><strong>${c.user}:</strong> ${c.text}</div>`).join('')}
          <form class="comment-form" onsubmit="addComment(event, ${p.id})">
            <input type="text" id="cmt-${p.id}" placeholder="Izoh yozing..." required />
            <button type="submit" class="btn-ghost-sm">Yuborish</button>
          </form>
        </div>
      </div>
    </article>
  `;
}

function tileHTML(p) {
  return `
    <div class="explore-tile" onclick="switchView('feed')">
      ${p.image ? `<img src="${p.image}" alt="${p.title}" onerror="this.remove()" />` : ''}
      <span style="font-size:1.5rem; position:relative; z-index:1;">${p.emoji || '✨'}</span>
      <div class="explore-tile-label">${p.title} • ❤️ ${p.likes}</div>
    </div>
  `;
}

function renderAll() {
  const totalLikes = posts.reduce((s, p) => s + p.likes, 0);
  const savedPosts = posts.filter((p) => p.saved);

  document.getElementById('savedBadge').textContent = savedPosts.length;
  document.getElementById('pPosts').textContent = posts.length;
  document.getElementById('pLikes').textContent = totalLikes;

  const q = searchQuery.trim().toLowerCase();
  const filteredFeed = posts.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.caption.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  document.getElementById('feedList').innerHTML = filteredFeed.length
    ? filteredFeed.map(postCardHTML).join('')
    : '<div class="post-card" style="padding:24px; text-align:center; color:var(--muted);">Postlar topilmadi.</div>';

  const explorePool = q
    ? posts.filter((p) => p.title.toLowerCase().includes(q) || p.caption.toLowerCase().includes(q))
    : posts;
  document.getElementById('exploreGrid').innerHTML = explorePool.length
    ? explorePool.map(tileHTML).join('')
    : '<p style="color:var(--muted);">Hech narsa topilmadi.</p>';

  document.getElementById('savedList').innerHTML = savedPosts.length
    ? savedPosts.map(postCardHTML).join('')
    : '<div class="post-card" style="padding:24px; text-align:center; color:var(--muted);">Hali saqlangan postlar yo‘q.</div>';

  document.getElementById('profilePostsGrid').innerHTML = posts.length
    ? posts.map(tileHTML).join('')
    : '<p style="color:var(--muted);">Postlar yo‘q.</p>';
}

// Post Actions
window.toggleLike = (id) => {
  const p = posts.find((x) => x.id === id);
  if (!p) return;
  p.liked = !p.liked;
  p.likes += p.liked ? 1 : -1;
  savePosts();
  renderAll();
};

window.doubleLike = (id) => {
  const p = posts.find((x) => x.id === id);
  if (!p) return;
  if (!p.liked) {
    p.liked = true;
    p.likes += 1;
    savePosts();
    renderAll();
  }
  const burst = document.getElementById(`heart-${id}`);
  if (burst) {
    burst.classList.add('pop');
    setTimeout(() => burst.classList.remove('pop'), 450);
  }
};

window.toggleSave = (id) => {
  const p = posts.find((x) => x.id === id);
  if (!p) return;
  p.saved = !p.saved;
  savePosts();
  renderAll();
  showToast(p.saved ? 'Saqlanganlarga qo‘shildi' : 'Saqlanganlardan olindi');
};

window.editPost = (id) => {
  const p = posts.find((x) => x.id === id);
  if (p) openCreateModal(p);
};

window.deletePost = (id) => {
  posts = posts.filter((x) => x.id !== id);
  savePosts();
  renderAll();
  showToast('Post o‘chirildi');
};

window.focusComment = (id) => {
  const el = document.getElementById(`cmt-${id}`);
  if (el) el.focus();
};

window.sharePost = (title) => {
  showToast(`"${title}" ulashishga tayyor`);
};

window.addComment = (e, id) => {
  e.preventDefault();
  const inp = document.getElementById(`cmt-${id}`);
  const text = inp.value.trim();
  if (!text) return;
  const p = posts.find((x) => x.id === id);
  if (!p) return;
  p.comments.push({ user: 'mehmon', text });
  savePosts();
  renderAll();
};

// Filters & Search
document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    activeCategory = chip.dataset.cat;
    renderAll();
  });
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderAll();
});

// Plans & Quick Contact
document.querySelectorAll('.plan-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.getElementById('qMsg').value = `Assalomu alaykum! "${btn.dataset.plan}" tarifini tanladim.`;
    document.getElementById('qName').focus();
    showToast(`${btn.dataset.plan} tanlandi`);
  });
});

document.getElementById('quickContactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('qName').value.trim();
  document.getElementById('qStatus').textContent = `Rahmat, ${name}! So‘rovingiz qabul qilindi.`;
  showToast('Xabar yuborildi');
  e.target.reset();
});

renderFollowState();
renderDm();
renderAll();
renderCart();