/**
 * Kranti Furnitures & Electronics - Global Application JS
 * Header, Search Autocomplete, Inquiry Modal, Mobile Navigation & Toast Dispatcher
 */

document.addEventListener('DOMContentLoaded', () => {
  initBadges();
  initSearch();
  initMobileNav();
  initActiveLinks();
  initProfileDropdown();
  initInquiryModal();
  initGlobalButtonListeners();
  initNewsletter();
});

// Update Wishlist counter everywhere (Cart counters hidden)
function initBadges() {
  function updateCounters() {
    const wishlistCount = Store.getWishlistCount();

    document.querySelectorAll('.cart-badge-count').forEach(el => {
      el.style.display = 'none';
    });

    document.querySelectorAll('.wishlist-badge-count').forEach(el => {
      el.textContent = wishlistCount;
      el.style.display = wishlistCount > 0 ? 'inline-flex' : 'none';
    });

    // Update wishlist icon visual states
    document.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
      const pId = btn.getAttribute('data-product-id');
      const icon = btn.querySelector('.material-symbols-outlined');
      if (pId && icon) {
        if (Store.isInWishlist(pId)) {
          icon.classList.add('filled', 'text-error');
          icon.textContent = 'favorite';
        } else {
          icon.classList.remove('filled', 'text-error');
          icon.textContent = 'favorite';
        }
      }
    });
  }

  updateCounters();
  window.addEventListener('wishlist-updated', updateCounters);
}

// Global live search with autocomplete popup (No prices shown)
function initSearch() {
  const searchInputs = document.querySelectorAll('.header-search-input');
  
  searchInputs.forEach(input => {
    let dropdown = input.parentElement.querySelector('.search-autocomplete-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'search-autocomplete-dropdown hidden absolute top-full left-0 w-full mt-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden max-h-96 overflow-y-auto';
      input.parentElement.appendChild(dropdown);
    }

    input.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (q.length < 2) {
        dropdown.classList.add('hidden');
        dropdown.innerHTML = '';
        return;
      }

      const products = Store.getProducts();
      const matches = products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q)
      ).slice(0, 5);

      if (matches.length === 0) {
        dropdown.innerHTML = `
          <div class="p-4 text-center text-sm text-on-surface-variant">
            No products found for "<span class="font-semibold">${e.target.value}</span>"
          </div>
        `;
      } else {
        dropdown.innerHTML = `
          <div class="p-2 border-b border-outline-variant bg-surface-container-low text-xs font-semibold text-primary uppercase tracking-wider">
            Matching Products (${matches.length})
          </div>
          <div class="divide-y divide-outline-variant/40">
            ${matches.map(p => `
              <div class="flex items-center justify-between p-3 hover:bg-surface transition-colors gap-3">
                <a href="product-detail.html?id=${p.id}" class="flex items-center gap-3 min-w-0 flex-grow">
                  <img src="${p.image}" alt="${p.name}" class="w-12 h-12 rounded object-cover bg-surface-container-high shrink-0" />
                  <div class="min-w-0 flex-grow">
                    <p class="font-medium text-sm text-on-surface truncate">${p.name}</p>
                    <p class="text-xs text-on-surface-variant">${p.brand} • ${p.categoryLabel}</p>
                  </div>
                </a>
                <button data-inquire-btn data-product-id="${p.id}" class="shrink-0 bg-primary/10 hover:bg-primary text-primary hover:text-on-primary px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs">contact_support</span> Inquire
                </button>
              </div>
            `).join('')}
          </div>
          <a href="products.html?q=${encodeURIComponent(q)}" class="block p-2.5 text-center text-xs font-semibold text-primary bg-surface-container hover:bg-surface-container-high transition-colors">
            View all results for "${q}" →
          </a>
        `;
      }
      dropdown.classList.remove('hidden');
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) {
          window.location.href = `products.html?q=${encodeURIComponent(q)}`;
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (!input.parentElement.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  });
}

// Highlight active navigation links
function initActiveLinks() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('nav a, header a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      if (link.classList.contains('nav-category-link')) {
        link.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-primary');
        link.classList.remove('text-on-surface-variant');
      }
    }
  });
}

// Mobile Navigation
function initMobileNav() {
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeDrawerBtn = document.getElementById('close-mobile-drawer');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('hidden');
    });
  }

  if (closeDrawerBtn && mobileDrawer) {
    closeDrawerBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('hidden');
    });
  }
}

// Profile dropdown menu
function initProfileDropdown() {
  const profileBtns = document.querySelectorAll('.profile-dropdown-btn');
  profileBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const menu = btn.parentElement.querySelector('.profile-dropdown-menu');
      if (menu) {
        menu.classList.toggle('hidden');
      }
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.profile-dropdown-menu').forEach(menu => {
      menu.classList.add('hidden');
    });
  });
}

// Global Product Inquiry Modal Setup
function initInquiryModal() {
  let modal = document.getElementById('global-inquiry-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'global-inquiry-modal';
    modal.className = 'hidden fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in';
    modal.innerHTML = `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button id="close-inquiry-modal" class="absolute top-4 right-4 text-on-surface-variant hover:text-primary p-1 rounded-full hover:bg-surface-container-high transition-colors" aria-label="Close">
          <span class="material-symbols-outlined text-2xl">close</span>
        </button>
        
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-xl">contact_support</span>
          </div>
          <div>
            <h3 class="font-headline-lg text-lg font-bold text-primary">Product Inquiry Form</h3>
            <p class="text-xs text-on-surface-variant">Kranti Furnitures &amp; Electronics, Prayagraj</p>
          </div>
        </div>

        <div id="inquiry-modal-product-card" class="p-3 bg-surface-container-low rounded-xl border border-outline-variant/50 flex items-center gap-3 mb-4">
          <img id="inquiry-modal-img" src="" alt="Product" class="w-14 h-14 object-cover rounded-lg bg-surface-container-high shrink-0" />
          <div class="min-w-0 flex-grow">
            <p id="inquiry-modal-brand" class="text-[10px] uppercase font-bold text-outline"></p>
            <h4 id="inquiry-modal-title" class="font-bold text-xs md:text-sm text-on-surface truncate"></h4>
            <span class="text-[11px] text-discount font-semibold flex items-center gap-1 mt-0.5">
              <span class="material-symbols-outlined text-xs filled">check_circle</span> Available in Showroom
            </span>
          </div>
        </div>

        <form id="global-inquiry-form" class="space-y-3.5">
          <input type="hidden" id="inquiry-hidden-product-id" value="" />
          <input type="hidden" id="inquiry-hidden-product-name" value="" />

          <div>
            <label class="block text-xs font-bold text-on-surface mb-1">Your Name *</label>
            <input type="text" id="inquiry-name" required placeholder="e.g. Ramesh Kumar" class="w-full text-xs px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-on-surface mb-1">Phone / WhatsApp *</label>
              <input type="tel" id="inquiry-phone" required placeholder="+91 9876543210" class="w-full text-xs px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label class="block text-xs font-bold text-on-surface mb-1">Email Address</label>
              <input type="email" id="inquiry-email" placeholder="ramesh@example.com" class="w-full text-xs px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-on-surface mb-1">Location / Area</label>
            <input type="text" id="inquiry-location" value="Civil Lines, Prayagraj" placeholder="e.g. Civil Lines, Prayagraj" class="w-full text-xs px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>

          <div>
            <label class="block text-xs font-bold text-on-surface mb-1">Your Query / Requirements</label>
            <textarea id="inquiry-message" rows="3" placeholder="Ask about product details, custom sizing, delivery timelines, or showroom visit..." class="w-full text-xs px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary"></textarea>
          </div>

          <button type="submit" class="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95">
            <span class="material-symbols-outlined text-sm">send</span>
            <span>Submit Query to Kranti Team</span>
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const closeBtn = document.getElementById('close-inquiry-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  // Close modal when clicking outside box
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // Form Submission
  const form = document.getElementById('global-inquiry-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const pId = document.getElementById('inquiry-hidden-product-id').value;
      const pName = document.getElementById('inquiry-hidden-product-name').value;
      const name = document.getElementById('inquiry-name').value.trim();
      const phone = document.getElementById('inquiry-phone').value.trim();
      const email = document.getElementById('inquiry-email').value.trim();
      const location = document.getElementById('inquiry-location').value.trim();
      const message = document.getElementById('inquiry-message').value.trim();

      Store.saveInquiry({
        productId: pId,
        productName: pName || 'General Product Inquiry',
        fullName: name,
        phone: phone,
        email: email,
        location: location,
        message: message
      });

      modal.classList.add('hidden');
    });
  }
}

// Open global inquiry modal for a given product
window.openInquiryModal = function(productId, customTitle, customBrand, customImg) {
  let product = typeof getProductById === 'function' ? getProductById(productId) : null;
  if (!product && typeof PRODUCTS_DATA !== 'undefined') {
    product = PRODUCTS_DATA.find(p => p.id === productId);
  }

  const modal = document.getElementById('global-inquiry-modal');
  if (!modal) return;

  const titleEl = document.getElementById('inquiry-modal-title');
  const brandEl = document.getElementById('inquiry-modal-brand');
  const imgEl = document.getElementById('inquiry-modal-img');
  const hiddenId = document.getElementById('inquiry-hidden-product-id');
  const hiddenName = document.getElementById('inquiry-hidden-product-name');
  const messageInput = document.getElementById('inquiry-message');

  const user = Store.getUser();
  if (user) {
    const nameInput = document.getElementById('inquiry-name');
    const phoneInput = document.getElementById('inquiry-phone');
    const emailInput = document.getElementById('inquiry-email');
    if (nameInput && !nameInput.value) nameInput.value = `${user.firstName} ${user.lastName}`;
    if (phoneInput && !phoneInput.value) phoneInput.value = user.phone;
    if (emailInput && !emailInput.value) emailInput.value = user.email;
  }

  if (product) {
    if (titleEl) titleEl.textContent = product.name;
    if (brandEl) brandEl.textContent = product.brand;
    if (imgEl) imgEl.src = product.image;
    if (hiddenId) hiddenId.value = product.id;
    if (hiddenName) hiddenName.value = product.name;
    if (messageInput && !messageInput.value) {
      messageInput.value = `I am interested in "${product.name}". Please provide details on availability, delivery, and installation.`;
    }
  } else {
    if (titleEl) titleEl.textContent = customTitle || 'Kranti Furniture & Electronics Inquiry';
    if (brandEl) brandEl.textContent = customBrand || 'Kranti Showroom';
    if (imgEl) imgEl.src = customImg || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKfKcUMLmltlnHHF2xlrwfK4e-EpILGh0IysEyDq4uxtWWLInLX5LMv0ZGwPzPCESv448Qeww61Vn9sIyOCTaJCxKfHuzbEElmTp8AKLBUxxmKEMiyPgtbdRns8gRjXnb-gt3m3XPw2gsVn0G8_dL-0VMwoCN5X7goKLDQOagHYBukDQy_EReajT078RYzkZ5qWFayFAx6o1K1D-1LFrZ1-PO-YYQk36owrSSIuhgHKpXPGjMSQcFg';
    if (hiddenId) hiddenId.value = productId || '';
    if (hiddenName) hiddenName.value = customTitle || '';
  }

  modal.classList.remove('hidden');
};

// Global button listener for Inquire Now & Wishlist buttons
function initGlobalButtonListeners() {
  document.addEventListener('click', (e) => {
    // Inquire Now button
    const inquireBtn = e.target.closest('[data-inquire-btn]');
    if (inquireBtn) {
      e.preventDefault();
      e.stopPropagation();
      const productId = inquireBtn.getAttribute('data-product-id');
      const name = inquireBtn.getAttribute('data-product-name');
      const brand = inquireBtn.getAttribute('data-product-brand');
      const img = inquireBtn.getAttribute('data-product-image');
      window.openInquiryModal(productId, name, brand, img);
      return;
    }

    // Legacy add to cart button redirected to inquiry
    const cartBtn = e.target.closest('[data-add-cart-btn]');
    if (cartBtn) {
      e.preventDefault();
      e.stopPropagation();
      const productId = cartBtn.getAttribute('data-product-id');
      window.openInquiryModal(productId);
      return;
    }

    // Wishlist toggle button
    const wishlistBtn = e.target.closest('[data-wishlist-btn]');
    if (wishlistBtn) {
      e.preventDefault();
      e.stopPropagation();
      const productId = wishlistBtn.getAttribute('data-product-id');
      if (productId) {
        Store.toggleWishlist(productId);
      }
      return;
    }
  });
}

// Footer newsletter subscription
function initNewsletter() {
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        Store.showToast('Thank you for subscribing to Kranti digital showroom updates!', 'success');
        emailInput.value = '';
      }
    });
  }
}
