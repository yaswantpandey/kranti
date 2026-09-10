/**
 * Kranti Furnitures & Electronics - Enhanced Admin Dashboard Controller JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
  initAdminTabs();
  initOverviewStats();
  initProductsTable();
  initInquiriesTable();
  initSettingsForm();
  initGlobalAdminActions();
});

// Admin Login & Session Lock
function initAdminAuth() {
  const loginModal = document.getElementById('admin-login-modal');
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtn = document.getElementById('admin-logout-btn');

  function checkAuth() {
    if (Store.isAdminLoggedIn()) {
      if (loginModal) loginModal.classList.add('hidden');
    } else {
      if (loginModal) loginModal.classList.remove('hidden');
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = document.getElementById('admin-password-input').value;
      if (Store.adminLogin(pass)) {
        loginModal.classList.add('hidden');
        renderAllAdminData();
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      Store.adminLogout();
      loginModal.classList.remove('hidden');
    });
  }

  checkAuth();
}

// Global Quick Bar Actions (CSV Export & Demo Reset)
function initGlobalAdminActions() {
  const csvExportBtn = document.getElementById('admin-export-csv-btn');
  if (csvExportBtn) {
    csvExportBtn.addEventListener('click', () => {
      Store.exportInquiriesCSV();
    });
  }
}

// Admin Tab Navigation
function initAdminTabs() {
  document.querySelectorAll('[data-admin-tab]').forEach(tabBtn => {
    tabBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = tabBtn.getAttribute('data-admin-tab');

      document.querySelectorAll('[data-admin-tab]').forEach(b => {
        b.classList.remove('bg-primary-container', 'text-on-primary-container', 'font-bold');
        b.classList.add('text-on-surface-variant', 'hover:bg-surface-container-high');
      });
      tabBtn.classList.remove('text-on-surface-variant', 'hover:bg-surface-container-high');
      tabBtn.classList.add('bg-primary-container', 'text-on-primary-container', 'font-bold');

      document.querySelectorAll('.admin-tab-pane').forEach(pane => pane.classList.add('hidden'));
      const activePane = document.getElementById(`admin-pane-${target}`);
      if (activePane) activePane.classList.remove('hidden');

      if (target === 'overview') renderOverviewStats();
      if (target === 'products') renderProductsTable();
      if (target === 'inquiries') renderInquiriesTable();
      if (target === 'settings') loadSettingsForm();
    });
  });
}

function renderAllAdminData() {
  renderOverviewStats();
  renderProductsTable();
  renderInquiriesTable();
  loadSettingsForm();
}

// ----------------------------------------------------
// TAB 1: OVERVIEW STATS
// ----------------------------------------------------
function initOverviewStats() {
  renderOverviewStats();
}

function renderOverviewStats() {
  const products = Store.getProducts();
  const inquiries = Store.getInquiries();

  const totalProdEl = document.getElementById('stat-total-products');
  const totalInqEl = document.getElementById('stat-total-inquiries');
  const pendingInqEl = document.getElementById('stat-pending-inquiries');
  const categoryBreakdownEl = document.getElementById('stat-category-breakdown');

  if (totalProdEl) totalProdEl.textContent = products.length;
  if (totalInqEl) totalInqEl.textContent = inquiries.length;

  const pending = inquiries.filter(i => i.status.toLowerCase().includes('pending') || i.status.toLowerCase().includes('callback'));
  if (pendingInqEl) pendingInqEl.textContent = pending.length;

  if (categoryBreakdownEl) {
    const catMap = {};
    products.forEach(p => {
      const c = p.categoryLabel || p.category;
      catMap[c] = (catMap[c] || 0) + 1;
    });

    categoryBreakdownEl.innerHTML = Object.entries(catMap).map(([cat, count]) => `
      <div class="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-semibold">
        <span class="text-on-surface">${cat}</span>
        <span class="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container font-bold">${count} items</span>
      </div>
    `).join('');
  }
}

// ----------------------------------------------------
// TAB 2: PRODUCTS MANAGEMENT (CRUD + STOCK & FEATURED TOGGLES)
// ----------------------------------------------------
let editingProductId = null;

function initProductsTable() {
  const addProdBtn = document.getElementById('admin-add-product-btn');
  const prodModal = document.getElementById('admin-product-modal');
  const closeProdModal = document.getElementById('close-admin-product-modal');
  const prodForm = document.getElementById('admin-product-form');
  const prodSearch = document.getElementById('admin-product-search');
  const prodCatFilter = document.getElementById('admin-product-cat-filter');

  if (addProdBtn) {
    addProdBtn.addEventListener('click', () => {
      editingProductId = null;
      document.getElementById('modal-product-title').textContent = 'Add New Product';
      prodForm.reset();
      prodModal.classList.remove('hidden');
    });
  }

  if (closeProdModal) {
    closeProdModal.addEventListener('click', () => {
      prodModal.classList.add('hidden');
    });
  }

  if (prodForm) {
    prodForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('prod-input-name').value.trim();
      const brand = document.getElementById('prod-input-brand').value.trim();
      const cat = document.getElementById('prod-input-category').value;
      const catLabel = document.getElementById('prod-input-category-label').value.trim() || 'Furniture & Electronics';
      const image = document.getElementById('prod-input-image').value.trim();
      const desc = document.getElementById('prod-input-desc').value.trim();
      const isFeatured = document.getElementById('prod-input-featured')?.checked || false;
      const customBadge = document.getElementById('prod-input-badge')?.value || 'Showroom Available';
      const specsRaw = document.getElementById('prod-input-specs').value.trim();

      // Specs parser
      const specsObj = {};
      if (specsRaw) {
        specsRaw.split('\n').forEach(line => {
          const parts = line.split(':');
          if (parts.length >= 2) {
            specsObj[parts[0].trim()] = parts.slice(1).join(':').trim();
          }
        });
      }

      const productPayload = {
        name,
        brand,
        category: cat,
        categoryLabel: catLabel,
        subCategory: catLabel,
        image: image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKfKcUMLmltlnHHF2xlrwfK4e-EpILGh0IysEyDq4uxtWWLInLX5LMv0ZGwPzPCESv448Qeww61Vn9sIyOCTaJCxKfHuzbEElmTp8AKLBUxxmKEMiyPgtbdRns8gRjXnb-gt3m3XPw2gsVn0G8_dL-0VMwoCN5X7goKLDQOagHYBukDQy_EReajT078RYzkZ5qWFayFAx6o1K1D-1LFrZ1-PO-YYQk36owrSSIuhgHKpXPGjMSQcFg',
        description: desc,
        isFeatured: isFeatured,
        customBadge: customBadge,
        specs: Object.keys(specsObj).length > 0 ? specsObj : { "Status": "Showroom Available", "Warranty": "Official Brand Warranty" }
      };

      if (editingProductId) {
        Store.updateProduct(editingProductId, productPayload);
      } else {
        Store.saveProduct(productPayload);
      }

      prodModal.classList.add('hidden');
      renderProductsTable();
      renderOverviewStats();
    });
  }

  if (prodSearch) {
    prodSearch.addEventListener('input', () => renderProductsTable());
  }

  if (prodCatFilter) {
    prodCatFilter.addEventListener('change', () => renderProductsTable());
  }

  window.addEventListener('products-updated', () => renderProductsTable());
}

function renderProductsTable() {
  const tableBody = document.getElementById('admin-products-table-body');
  if (!tableBody) return;

  const products = Store.getProducts();
  const search = document.getElementById('admin-product-search')?.value.toLowerCase() || '';
  const cat = document.getElementById('admin-product-cat-filter')?.value || 'all';

  let filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search);
    const matchCat = cat === 'all' || p.category === cat;
    return matchSearch && matchCat;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="py-8 text-center text-xs text-on-surface-variant">
          No products matching your search criteria.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(p => {
    const inStock = p.inStock !== false;
    const isFeatured = p.isFeatured === true;

    return `
      <tr class="border-b border-outline-variant/30 hover:bg-surface/50 transition-colors">
        <td class="py-3.5 px-4 flex items-center gap-3">
          <img src="${p.image}" alt="${p.name}" class="w-12 h-12 rounded-lg object-cover bg-surface-container-high shrink-0 border border-outline-variant/30" />
          <div class="min-w-0">
            <p class="font-bold text-xs md:text-sm text-on-surface truncate">${p.name}</p>
            <p class="text-[11px] text-on-surface-variant font-medium">ID: ${p.id}</p>
          </div>
        </td>
        <td class="py-3.5 px-4 text-xs font-semibold text-on-surface">${p.brand}</td>
        <td class="py-3.5 px-4 text-xs font-medium text-on-surface-variant">
          <span class="px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-bold">
            ${p.categoryLabel || p.category}
          </span>
        </td>
        <td class="py-3.5 px-4 text-xs">
          <button onclick="toggleStock('${p.id}')" class="px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${inStock ? 'bg-discount/10 text-discount border border-discount/20 hover:bg-discount/20' : 'bg-error/10 text-error border border-error/20 hover:bg-error/20'}">
            ${inStock ? '✓ In Stock' : '✕ Out of Stock'}
          </button>
        </td>
        <td class="py-3.5 px-4 text-xs">
          <button onclick="toggleFeatured('${p.id}')" class="px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${isFeatured ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30' : 'bg-surface-container-high text-outline hover:text-primary'}">
            ${isFeatured ? '⭐ Featured' : '☆ Normal'}
          </button>
        </td>
        <td class="py-3.5 px-4 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="duplicateProduct('${p.id}')" class="p-1.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-colors" title="Duplicate / Clone">
              <span class="material-symbols-outlined text-base">content_copy</span>
            </button>
            <button onclick="editProduct('${p.id}')" class="p-1.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-colors" title="Edit">
              <span class="material-symbols-outlined text-base">edit</span>
            </button>
            <button onclick="deleteProduct('${p.id}')" class="p-1.5 rounded-lg bg-error/10 text-error hover:bg-error hover:text-on-primary transition-colors" title="Delete">
              <span class="material-symbols-outlined text-base">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.toggleStock = function(productId) {
  Store.toggleProductStock(productId);
  renderProductsTable();
};

window.toggleFeatured = function(productId) {
  Store.toggleProductFeatured(productId);
  renderProductsTable();
};

window.duplicateProduct = function(productId) {
  Store.duplicateProduct(productId);
  renderProductsTable();
  renderOverviewStats();
};

window.editProduct = function(productId) {
  const product = Store.getProductById(productId);
  if (!product) return;

  editingProductId = productId;
  document.getElementById('modal-product-title').textContent = 'Edit Product Details';
  document.getElementById('prod-input-name').value = product.name || '';
  document.getElementById('prod-input-brand').value = product.brand || '';
  document.getElementById('prod-input-category').value = product.category || 'sofas';
  document.getElementById('prod-input-category-label').value = product.categoryLabel || '';
  document.getElementById('prod-input-image').value = product.image || '';
  document.getElementById('prod-input-desc').value = product.description || '';
  if (document.getElementById('prod-input-featured')) document.getElementById('prod-input-featured').checked = product.isFeatured || false;

  if (product.specs) {
    document.getElementById('prod-input-specs').value = Object.entries(product.specs)
      .map(([k, v]) => `${k}: ${v}`).join('\n');
  }

  document.getElementById('admin-product-modal').classList.remove('hidden');
};

window.deleteProduct = function(productId) {
  if (confirm('Are you sure you want to delete this product from the showroom catalog?')) {
    Store.deleteProduct(productId);
    renderProductsTable();
    renderOverviewStats();
  }
};

// ----------------------------------------------------
// TAB 3: CUSTOMER INQUIRIES (WHATSAPP OUTREACH & ADMIN NOTES)
// ----------------------------------------------------
let currentInquiryFilter = 'all';

function initInquiriesTable() {
  document.querySelectorAll('[data-inquiry-filter]').forEach(filterBtn => {
    filterBtn.addEventListener('click', () => {
      document.querySelectorAll('[data-inquiry-filter]').forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add('bg-surface-container-lowest', 'text-on-surface-variant', 'border', 'border-outline-variant');
      });
      filterBtn.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant', 'border', 'border-outline-variant');
      filterBtn.classList.add('bg-primary', 'text-on-primary');

      currentInquiryFilter = filterBtn.getAttribute('data-inquiry-filter');
      renderInquiriesTable();
    });
  });

  window.addEventListener('inquiries-updated', () => renderInquiriesTable());
}

function renderInquiriesTable() {
  const tableBody = document.getElementById('admin-inquiries-table-body');
  if (!tableBody) return;

  const inquiries = Store.getInquiries();

  let filtered = inquiries.filter(i => {
    if (currentInquiryFilter === 'pending') {
      return i.status.toLowerCase().includes('pending') || i.status.toLowerCase().includes('callback');
    } else if (currentInquiryFilter === 'answered') {
      return i.status.toLowerCase().includes('answered') || i.status.toLowerCase().includes('completed');
    }
    return true;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="py-8 text-center text-xs text-on-surface-variant">
          No inquiries found under this filter.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(inq => {
    const rawPhone = (inq.phone || '').replace(/[^0-9]/g, '');
    const waPhone = rawPhone.length === 10 ? '91' + rawPhone : rawPhone;
    const waText = encodeURIComponent(`Namaste ${inq.fullName || 'Customer'}, thank you for contacting Kranti Furnitures & Electronics Prayagraj! Regarding your inquiry #${inq.id} for "${inq.productName}", we are ready to assist you with showroom availability and best pricing.`);
    const waLink = `https://wa.me/${waPhone}?text=${waText}`;

    return `
      <tr class="border-b border-outline-variant/30 hover:bg-surface/50 transition-colors">
        <td class="py-3.5 px-4">
          <span class="font-bold text-xs text-primary font-headline">${inq.id}</span>
          <p class="text-[11px] text-on-surface-variant">${inq.date}</p>
        </td>
        <td class="py-3.5 px-4">
          <p class="font-bold text-xs text-on-surface">${inq.fullName}</p>
          <p class="text-[11px] text-on-surface-variant font-semibold">📞 ${inq.phone}</p>
          <p class="text-[11px] text-on-surface-variant">${inq.location || 'Prayagraj'}</p>
        </td>
        <td class="py-3.5 px-4 font-semibold text-xs text-on-surface">
          ${inq.productName}
        </td>
        <td class="py-3.5 px-4 max-w-xs text-xs text-on-surface-variant leading-relaxed">
          <p class="truncate">"${inq.message}"</p>
          ${inq.adminNotes ? `<p class="text-[10px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded mt-1">Note: ${inq.adminNotes}</p>` : ''}
        </td>
        <td class="py-3.5 px-4">
          <select onchange="updateInqStatus('${inq.id}', this.value)" class="text-xs font-bold px-2.5 py-1 rounded-lg border border-outline-variant bg-surface-container-lowest focus:border-primary">
            <option value="Pending Callback" ${inq.status === 'Pending Callback' ? 'selected' : ''}>Pending Callback</option>
            <option value="Callback Scheduled" ${inq.status === 'Callback Scheduled' ? 'selected' : ''}>Callback Scheduled</option>
            <option value="Inquiry Answered" ${inq.status === 'Inquiry Answered' ? 'selected' : ''}>Inquiry Answered</option>
            <option value="Order Discussed" ${inq.status === 'Order Discussed' ? 'selected' : ''}>Order Discussed</option>
            <option value="Closed" ${inq.status === 'Closed' ? 'selected' : ''}>Closed</option>
          </select>
        </td>
        <td class="py-3.5 px-4 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <a href="${waLink}" target="_blank" class="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors text-xs font-bold flex items-center gap-1" title="Chat on WhatsApp">
              💬 WhatsApp
            </a>
            <button onclick="promptAdminNote('${inq.id}')" class="p-1.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary transition-colors" title="Add Note">
              <span class="material-symbols-outlined text-base">note_add</span>
            </button>
            <button onclick="deleteInquiry('${inq.id}')" class="p-1.5 rounded-lg bg-error/10 text-error hover:bg-error hover:text-on-primary transition-colors" title="Delete Inquiry">
              <span class="material-symbols-outlined text-base">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.updateInqStatus = function(inquiryId, newStatus) {
  Store.updateInquiryStatus(inquiryId, newStatus);
  renderOverviewStats();
};

window.promptAdminNote = function(inquiryId) {
  const existingInquiries = Store.getInquiries();
  const target = existingInquiries.find(i => i.id === inquiryId);
  const currentNote = target?.adminNotes || '';
  const note = prompt(`Enter internal admin note for Inquiry #${inquiryId}:`, currentNote);
  if (note !== null) {
    Store.addInquiryNote(inquiryId, note.trim());
    renderInquiriesTable();
  }
};

window.deleteInquiry = function(inquiryId) {
  if (confirm(`Delete inquiry #${inquiryId}?`)) {
    Store.deleteInquiry(inquiryId);
    renderInquiriesTable();
    renderOverviewStats();
  }
};

// ----------------------------------------------------
// TAB 4: SHOWROOM SETTINGS
// ----------------------------------------------------
function initSettingsForm() {
  const form = document.getElementById('admin-settings-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const settings = {
        storeName: document.getElementById('set-store-name').value.trim(),
        phone: document.getElementById('set-phone').value.trim(),
        altPhone: document.getElementById('set-alt-phone').value.trim(),
        email: document.getElementById('set-email').value.trim(),
        address: document.getElementById('set-address').value.trim(),
        hours: document.getElementById('set-hours').value.trim(),
        bannerNotice: document.getElementById('set-banner').value.trim(),
        whatsapp: document.getElementById('set-whatsapp')?.value.trim() || '+91 98765 43210'
      };
      Store.saveSettings(settings);
    });
  }
}

function loadSettingsForm() {
  const s = Store.getSettings();
  if (!s) return;
  if (document.getElementById('set-store-name')) document.getElementById('set-store-name').value = s.storeName || '';
  if (document.getElementById('set-phone')) document.getElementById('set-phone').value = s.phone || '';
  if (document.getElementById('set-alt-phone')) document.getElementById('set-alt-phone').value = s.altPhone || '';
  if (document.getElementById('set-email')) document.getElementById('set-email').value = s.email || '';
  if (document.getElementById('set-address')) document.getElementById('set-address').value = s.address || '';
  if (document.getElementById('set-hours')) document.getElementById('set-hours').value = s.hours || '';
  if (document.getElementById('set-banner')) document.getElementById('set-banner').value = s.bannerNotice || '';
  if (document.getElementById('set-whatsapp')) document.getElementById('set-whatsapp').value = s.whatsapp || '+91 98765 43210';
}
