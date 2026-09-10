/**
 * Kranti Furnitures & Electronics - Customer Dashboard JS
 * Handles Profile, Submitted Inquiries, Wishlist, and Saved Addresses
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const welcomeText = document.getElementById('dash-welcome-text');
  const firstNameDisplay = document.getElementById('dash-first-name');
  const lastNameDisplay = document.getElementById('dash-last-name');
  const emailDisplay = document.getElementById('dash-email');
  const phoneDisplay = document.getElementById('dash-phone');
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const editProfileModal = document.getElementById('edit-profile-modal');
  const closeEditProfileModal = document.getElementById('close-edit-profile-modal');
  const editProfileForm = document.getElementById('edit-profile-form');

  const recentInquiriesList = document.getElementById('dash-recent-inquiries-list');
  const inquiriesHistoryList = document.getElementById('dash-inquiries-history-list');
  const savedAddressesList = document.getElementById('dash-saved-addresses-list');
  const wishlistContainer = document.getElementById('dash-wishlist-container');
  const addAddressBtn = document.getElementById('add-address-btn');
  const addressModal = document.getElementById('add-address-modal');
  const closeAddressModal = document.getElementById('close-address-modal');
  const addAddressForm = document.getElementById('add-address-form');

  function renderProfile() {
    const currentUser = Store.getUser();
    if (!currentUser) return;

    if (welcomeText) welcomeText.textContent = `Welcome back, ${currentUser.firstName || 'Customer'}`;
    if (firstNameDisplay) firstNameDisplay.textContent = currentUser.firstName || 'Ramesh';
    if (lastNameDisplay) lastNameDisplay.textContent = currentUser.lastName || 'Kumar';
    if (emailDisplay) emailDisplay.textContent = currentUser.email || 'ramesh.kumar@example.com';
    if (phoneDisplay) phoneDisplay.textContent = currentUser.phone || '+91 98765 43210';
  }

  function renderInquiries() {
    const inquiries = Store.getInquiries();

    // Summary list for dashboard home card
    if (recentInquiriesList) {
      if (inquiries.length === 0) {
        recentInquiriesList.innerHTML = `
          <div class="py-4 text-center text-xs text-on-surface-variant">
            No inquiries submitted yet.
          </div>
        `;
      } else {
        recentInquiriesList.innerHTML = inquiries.slice(0, 3).map(inq => `
          <div class="flex justify-between items-center py-3 border-b border-outline-variant/30 last:border-0">
            <div>
              <p class="font-bold text-xs text-on-surface line-clamp-1">${inq.productName}</p>
              <p class="text-[11px] text-on-surface-variant">${inq.id} • ${inq.date}</p>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary shrink-0">
              ${inq.status}
            </span>
          </div>
        `).join('');
      }
    }

    // Full Inquiries list tab
    if (inquiriesHistoryList) {
      if (inquiries.length === 0) {
        inquiriesHistoryList.innerHTML = `
          <div class="p-8 text-center text-on-surface-variant text-sm">
            <span class="material-symbols-outlined text-4xl text-outline mb-2">contact_support</span>
            <p>You haven't submitted any product inquiries yet.</p>
            <a href="products.html" class="mt-3 inline-block bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-container transition-colors">Browse Catalog &amp; Raise Query</a>
          </div>
        `;
      } else {
        inquiriesHistoryList.innerHTML = inquiries.map(inq => `
          <div class="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-surface/60 transition-colors border-b border-outline-variant/30 last:border-0">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                <span class="material-symbols-outlined text-xl">contact_support</span>
              </div>
              <div>
                <h4 class="font-bold text-sm md:text-base text-on-surface">${inq.productName}</h4>
                <p class="text-xs text-on-surface-variant mb-1">Inquiry #${inq.id} • Submitted on ${inq.date}</p>
                <p class="text-xs text-on-surface font-medium bg-surface-container-low p-2 rounded-lg border border-outline-variant/30 mt-2">
                  "${inq.message}"
                </p>
              </div>
            </div>
            <div class="flex flex-col items-end w-full md:w-auto shrink-0">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-discount/10 text-discount border border-discount/20 mb-2 w-max">
                ${inq.status}
              </span>
              <button data-inquire-btn data-product-id="${inq.productId}" data-product-name="${inq.productName}" class="text-primary text-xs font-bold border border-primary px-4 py-1.5 rounded-lg hover:bg-primary hover:text-on-primary transition-colors inline-block text-center">
                Send Follow-up
              </button>
            </div>
          </div>
        `).join('');
      }
    }
  }

  function renderAddresses() {
    const currentUser = Store.getUser();
    if (!currentUser || !savedAddressesList) return;

    savedAddressesList.innerHTML = (currentUser.addresses || []).map(addr => `
      <div class="p-4 rounded-xl border ${addr.isDefault ? 'border-primary bg-primary-container/5 ring-1 ring-primary' : 'border-outline-variant/60 bg-surface-container-lowest'} relative">
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">${addr.type.includes('Home') ? 'home' : 'business'}</span>
            <span class="font-bold text-sm text-on-surface">${addr.type}</span>
          </div>
          ${addr.isDefault ? '<span class="text-[10px] uppercase font-bold bg-primary text-on-primary px-2 py-0.5 rounded">Default</span>' : ''}
        </div>
        <p class="text-xs text-on-surface-variant mt-2 leading-relaxed">${addr.addressLine}</p>
        <p class="text-xs text-on-surface-variant font-medium mt-1">📞 ${addr.phone}</p>
      </div>
    `).join('');
  }

  function renderWishlist() {
    if (!wishlistContainer) return;
    const wishlistItems = Store.getWishlistDetailed();

    if (wishlistItems.length === 0) {
      wishlistContainer.innerHTML = `
        <div class="py-12 text-center text-on-surface-variant text-sm col-span-full">
          <span class="material-symbols-outlined text-4xl text-outline mb-2">favorite_border</span>
          <p>Your wishlist is currently empty.</p>
          <a href="products.html" class="mt-3 inline-block bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-semibold hover:bg-primary-container transition-colors">Browse Showroom Catalog</a>
        </div>
      `;
      return;
    }

    wishlistContainer.innerHTML = wishlistItems.map(p => `
      <div class="p-4 border border-outline-variant/40 rounded-xl bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4 w-full sm:w-auto">
          <img src="${p.image}" alt="${p.name}" class="w-16 h-16 object-cover rounded-lg bg-surface-container-high shrink-0" />
          <div>
            <h4 class="font-bold text-sm text-on-surface line-clamp-1">${p.name}</h4>
            <p class="text-xs text-on-surface-variant">${p.brand}</p>
            <span class="text-xs text-discount font-bold flex items-center gap-1 mt-1">
              <span class="material-symbols-outlined text-xs filled">check_circle</span> Showroom Available
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button data-inquire-btn data-product-id="${p.id}" class="bg-primary text-on-primary hover:bg-primary-container px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors">
            <span class="material-symbols-outlined text-sm">contact_support</span>
            Inquire Now
          </button>
          <button class="remove-wish-item p-1.5 text-outline hover:text-error rounded-full" data-id="${p.id}" title="Remove">
            <span class="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </div>
    `).join('');

    wishlistContainer.querySelectorAll('.remove-wish-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        Store.toggleWishlist(id);
        renderWishlist();
      });
    });
  }

  // Dashboard Tab Switching (Profile, Inquiries, Wishlist, Addresses)
  document.querySelectorAll('[data-dash-nav]').forEach(navBtn => {
    navBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = navBtn.getAttribute('data-dash-nav');

      document.querySelectorAll('[data-dash-nav]').forEach(b => {
        b.className = "flex items-center space-x-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors font-medium text-sm text-left w-full";
      });
      navBtn.className = "flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary-container text-on-primary-container font-bold text-sm text-left w-full";

      document.querySelectorAll('.dash-tab-section').forEach(sec => sec.classList.add('hidden'));
      const activeSec = document.getElementById(`dash-sec-${target}`);
      if (activeSec) activeSec.classList.remove('hidden');

      if (target === 'wishlist') renderWishlist();
      if (target === 'inquiries') renderInquiries();
    });
  });

  // Edit Profile Modal
  if (editProfileBtn && editProfileModal) {
    editProfileBtn.addEventListener('click', () => {
      const currentUser = Store.getUser();
      document.getElementById('edit-first-name').value = currentUser?.firstName || '';
      document.getElementById('edit-last-name').value = currentUser?.lastName || '';
      document.getElementById('edit-email').value = currentUser?.email || '';
      document.getElementById('edit-phone').value = currentUser?.phone || '';
      editProfileModal.classList.remove('hidden');
    });
  }

  if (closeEditProfileModal && editProfileModal) {
    closeEditProfileModal.addEventListener('click', () => {
      editProfileModal.classList.add('hidden');
    });
  }

  if (editProfileForm) {
    editProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      Store.updateUser({
        firstName: document.getElementById('edit-first-name').value.trim(),
        lastName: document.getElementById('edit-last-name').value.trim(),
        email: document.getElementById('edit-email').value.trim(),
        phone: document.getElementById('edit-phone').value.trim()
      });
      editProfileModal.classList.add('hidden');
      renderProfile();
    });
  }

  // Add Address Modal
  if (addAddressBtn && addressModal) {
    addAddressBtn.addEventListener('click', () => {
      addressModal.classList.remove('hidden');
    });
  }
  if (closeAddressModal && addressModal) {
    closeAddressModal.addEventListener('click', () => {
      addressModal.classList.add('hidden');
    });
  }

  if (addAddressForm) {
    addAddressForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newAddr = {
        type: document.getElementById('addr-type').value,
        fullName: document.getElementById('addr-name').value.trim(),
        phone: document.getElementById('addr-phone').value.trim(),
        pincode: document.getElementById('addr-pincode').value.trim(),
        city: document.getElementById('addr-city').value.trim(),
        addressLine: document.getElementById('addr-street').value.trim(),
        isDefault: document.getElementById('addr-default').checked
      };

      Store.addAddress(newAddr);
      addressModal.classList.add('hidden');
      addAddressForm.reset();
      renderAddresses();
    });
  }

  // Listen for inquiry updates
  window.addEventListener('inquiries-updated', () => {
    renderInquiries();
  });

  // Initial Renders
  renderProfile();
  renderInquiries();
  renderAddresses();
});
