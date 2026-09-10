/**
 * Kranti Furnitures & Electronics - Product Details JS
 * Gallery Switching, Variant Selectors, Inquiry Modal Trigger & Specifications Tabs
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'samsung-65-qled-4k-tv';
  const product = Store.getProductById(productId);

  // Selected Options state
  let selectedSize = product.variants?.sizes ? product.variants.sizes[0] : '';
  let selectedColor = product.variants?.colors ? product.variants.colors[0].name : '';

  // DOM Elements
  const breadcrumbCategory = document.getElementById('breadcrumb-cat');
  const breadcrumbProduct = document.getElementById('breadcrumb-prod');
  const brandBadge = document.getElementById('prod-brand');
  const titleEl = document.getElementById('prod-title');
  const ratingStars = document.getElementById('prod-rating-stars');
  const ratingText = document.getElementById('prod-rating-text');
  const descEl = document.getElementById('prod-desc');
  const mainImage = document.getElementById('main-gallery-img');
  const thumbnailContainer = document.getElementById('gallery-thumbnails');
  const sizeOptionsContainer = document.getElementById('size-options-container');
  const colorOptionsContainer = document.getElementById('color-options-container');
  const inquireActionBtn = document.getElementById('inquire-action');
  const wishlistDetailBtn = document.getElementById('wishlist-detail-btn');
  const pincodeInput = document.getElementById('pincode-input');
  const pincodeCheckBtn = document.getElementById('pincode-check-btn');
  const pincodeResult = document.getElementById('pincode-result');
  const specsTableBody = document.getElementById('specs-table-body');
  const relatedProductsGrid = document.getElementById('related-products-grid');

  // Populate Page Information
  document.title = `${product.name} | Kranti Furnitures & Electronics Prayagraj`;

  if (breadcrumbCategory) {
    breadcrumbCategory.textContent = product.categoryLabel;
    breadcrumbCategory.href = `products.html?category=${product.category}`;
  }
  if (breadcrumbProduct) breadcrumbProduct.textContent = product.name;
  if (brandBadge) brandBadge.textContent = product.brand;
  if (titleEl) titleEl.textContent = product.name;
  if (descEl) descEl.textContent = product.description;

  // Ratings
  if (ratingText) ratingText.textContent = `${product.rating} (${product.reviewsCount.toLocaleString()} reviews)`;
  if (ratingStars) {
    ratingStars.innerHTML = Array.from({ length: 5 }, (_, i) => {
      if (i < Math.floor(product.rating)) {
        return '<span class="material-symbols-outlined filled text-[18px]">star</span>';
      } else if (i < product.rating) {
        return '<span class="material-symbols-outlined text-[18px]">star_half</span>';
      } else {
        return '<span class="material-symbols-outlined text-[18px] text-outline-variant">star</span>';
      }
    }).join('');
  }

  // Main Image & Gallery Thumbnails
  const gallery = product.gallery || [product.image];
  if (mainImage) {
    mainImage.src = gallery[0];
    mainImage.alt = product.name;
  }

  if (thumbnailContainer) {
    thumbnailContainer.innerHTML = gallery.map((imgUrl, idx) => `
      <button class="gallery-thumb-btn aspect-square rounded-lg border-2 ${idx === 0 ? 'border-primary opacity-100' : 'border-outline-variant/60 opacity-70'} overflow-hidden p-1.5 bg-surface-container-lowest transition-all hover:opacity-100 cursor-pointer" data-img-src="${imgUrl}">
        <img src="${imgUrl}" alt="${product.name} View ${idx + 1}" class="w-full h-full object-contain" />
      </button>
    `).join('');

    thumbnailContainer.querySelectorAll('.gallery-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-img-src');
        if (mainImage && src) {
          mainImage.src = src;
          thumbnailContainer.querySelectorAll('.gallery-thumb-btn').forEach(b => {
            b.classList.remove('border-primary', 'opacity-100');
            b.classList.add('border-outline-variant/60', 'opacity-70');
          });
          btn.classList.remove('border-outline-variant/60', 'opacity-70');
          btn.classList.add('border-primary', 'opacity-100');
        }
      });
    });
  }

  // Size Variants
  if (sizeOptionsContainer && product.variants?.sizes) {
    sizeOptionsContainer.innerHTML = product.variants.sizes.map((s, idx) => `
      <button class="size-opt-btn px-4 py-2 rounded-lg border font-semibold text-sm transition-all ${idx === 0 ? 'border-primary bg-primary-container/10 text-primary ring-1 ring-primary' : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary'}" data-size="${s}">
        ${s}
      </button>
    `).join('');

    sizeOptionsContainer.querySelectorAll('.size-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedSize = btn.getAttribute('data-size');
        sizeOptionsContainer.querySelectorAll('.size-opt-btn').forEach(b => {
          b.classList.remove('border-primary', 'bg-primary-container/10', 'text-primary', 'ring-1', 'ring-primary');
          b.classList.add('border-outline-variant', 'bg-surface-container-lowest', 'text-on-surface');
        });
        btn.classList.remove('border-outline-variant', 'bg-surface-container-lowest', 'text-on-surface');
        btn.classList.add('border-primary', 'bg-primary-container/10', 'text-primary', 'ring-1', 'ring-primary');
      });
    });
  }

  // Color Variants
  if (colorOptionsContainer && product.variants?.colors) {
    colorOptionsContainer.innerHTML = product.variants.colors.map((c, idx) => `
      <button class="color-opt-btn flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all ${idx === 0 ? 'border-primary ring-2 ring-primary/30 text-primary bg-surface-container-high' : 'border-outline-variant text-on-surface-variant hover:border-primary bg-surface-container-lowest'}" data-color="${c.name}">
        <span class="w-4 h-4 rounded-full border border-black/10 inline-block" style="background-color: ${c.hex};"></span>
        <span>${c.name}</span>
      </button>
    `).join('');

    colorOptionsContainer.querySelectorAll('.color-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedColor = btn.getAttribute('data-color');
        colorOptionsContainer.querySelectorAll('.color-opt-btn').forEach(b => {
          b.classList.remove('border-primary', 'ring-2', 'ring-primary/30', 'text-primary', 'bg-surface-container-high');
          b.classList.add('border-outline-variant', 'text-on-surface-variant', 'bg-surface-container-lowest');
        });
        btn.classList.remove('border-outline-variant', 'text-on-surface-variant', 'bg-surface-container-lowest');
        btn.classList.add('border-primary', 'ring-2', 'ring-primary/30', 'text-primary', 'bg-surface-container-high');
      });
    });
  }

  // Inquire Action
  if (inquireActionBtn) {
    inquireActionBtn.addEventListener('click', () => {
      if (typeof window.openInquiryModal === 'function') {
        window.openInquiryModal(product.id, product.name, product.brand, product.image);
      }
    });
  }

  // Wishlist Toggle
  if (wishlistDetailBtn) {
    function updateWishlistIcon() {
      const isWish = Store.isInWishlist(product.id);
      const icon = wishlistDetailBtn.querySelector('.material-symbols-outlined');
      if (icon) {
        if (isWish) {
          icon.classList.add('filled', 'text-error');
          icon.textContent = 'favorite';
        } else {
          icon.classList.remove('filled', 'text-error');
          icon.textContent = 'favorite';
        }
      }
    }
    updateWishlistIcon();
    wishlistDetailBtn.addEventListener('click', () => {
      Store.toggleWishlist(product.id);
      updateWishlistIcon();
    });
  }

  // Pincode Delivery Check
  if (pincodeCheckBtn && pincodeInput && pincodeResult) {
    pincodeCheckBtn.addEventListener('click', () => {
      const pin = pincodeInput.value.trim();
      if (!/^\d{6}$/.test(pin)) {
        pincodeResult.innerHTML = `
          <div class="text-xs text-error font-medium flex items-center gap-1.5 mt-2">
            <span class="material-symbols-outlined text-sm">error</span>
            Please enter a valid 6-digit Indian PIN code.
          </div>
        `;
        return;
      }

      // If Prayagraj region (211xxx)
      if (pin.startsWith('211')) {
        pincodeResult.innerHTML = `
          <div class="p-3 bg-surface-container-high rounded-lg text-xs text-primary font-medium flex items-start gap-2 mt-2">
            <span class="material-symbols-outlined text-discount text-[18px]">verified</span>
            <div>
              <span class="font-bold text-on-surface">Express Delivery Available in Prayagraj (${pin})!</span>
              <p class="text-on-surface-variant mt-0.5">Free doorstep delivery &amp; expert installation by <strong>Tomorrow, 9:00 PM</strong>.</p>
            </div>
          </div>
        `;
      } else {
        pincodeResult.innerHTML = `
          <div class="p-3 bg-surface-container rounded-lg text-xs text-on-surface font-medium flex items-start gap-2 mt-2">
            <span class="material-symbols-outlined text-primary text-[18px]">local_shipping</span>
            <div>
              <span class="font-bold">Standard Delivery Available (${pin})</span>
              <p class="text-on-surface-variant mt-0.5">Estimated delivery in <strong>3-4 business days</strong> with full transit insurance.</p>
            </div>
          </div>
        `;
      }
    });
  }

  // Specs Table
  if (specsTableBody && product.specs) {
    specsTableBody.innerHTML = Object.entries(product.specs).map(([key, val]) => `
      <tr class="border-b border-outline-variant/40 hover:bg-surface transition-colors">
        <td class="py-3 px-4 font-semibold text-xs md:text-sm text-on-surface-variant bg-surface-container-low w-1/3">${key}</td>
        <td class="py-3 px-4 text-xs md:text-sm text-on-surface">${val}</td>
      </tr>
    `).join('');
  }

  // Tab switching
  document.querySelectorAll('[data-detail-tab]').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      const target = tabBtn.getAttribute('data-detail-tab');
      document.querySelectorAll('[data-detail-tab]').forEach(b => {
        b.classList.remove('border-primary', 'text-primary', 'font-bold');
        b.classList.add('border-transparent', 'text-on-surface-variant');
      });
      tabBtn.classList.remove('border-transparent', 'text-on-surface-variant');
      tabBtn.classList.add('border-primary', 'text-primary', 'font-bold');

      document.querySelectorAll('.detail-tab-content').forEach(c => c.classList.add('hidden'));
      const activeContent = document.getElementById(`tab-pane-${target}`);
      if (activeContent) activeContent.classList.remove('hidden');
    });
  });

  // Related Products
  if (relatedProductsGrid) {
    const related = Store.getProducts().filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand)).slice(0, 4);
    relatedProductsGrid.innerHTML = related.map(p => `
      <div class="product-card bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col group">
        <div class="relative aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-surface-container-high">
          <a href="product-detail.html?id=${p.id}">
            <img src="${p.image}" alt="${p.name}" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          </a>
        </div>
        <div class="text-xs uppercase text-outline font-semibold mb-1">${p.brand}</div>
        <a href="product-detail.html?id=${p.id}" class="font-bold text-sm text-on-surface mb-2 line-clamp-1 hover:text-primary transition-colors">
          ${p.name}
        </a>
        <div class="mt-auto flex items-center justify-between pt-2 border-t border-outline-variant/30">
          <span class="text-xs text-discount font-bold flex items-center gap-1">
            <span class="material-symbols-outlined text-xs filled">check_circle</span> Available
          </span>
          <button data-inquire-btn data-product-id="${p.id}" class="px-3 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container text-xs font-bold transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">contact_support</span> Inquire
          </button>
        </div>
      </div>
    `).join('');
  }
});
