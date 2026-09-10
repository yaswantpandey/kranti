/**
 * Kranti Furnitures & Electronics - Shopping Cart JS
 */

document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.getElementById('cart-items-container');
  const emptyCartState = document.getElementById('empty-cart-state');
  const cartContentWrapper = document.getElementById('cart-content-wrapper');
  const subtotalEl = document.getElementById('cart-subtotal');
  const savingsEl = document.getElementById('cart-savings');
  const deliveryEl = document.getElementById('cart-delivery');
  const discountRow = document.getElementById('cart-coupon-row');
  const discountEl = document.getElementById('cart-discount-val');
  const totalEl = document.getElementById('cart-total');
  const couponInput = document.getElementById('coupon-code-input');
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  const couponMessage = document.getElementById('coupon-message');
  const activeCouponBadge = document.getElementById('active-coupon-badge');
  const removeCouponBtn = document.getElementById('remove-coupon-btn');

  function renderCart() {
    const items = Store.getCartDetailed();
    const totals = Store.getCartTotals();

    if (items.length === 0) {
      if (cartContentWrapper) cartContentWrapper.classList.add('hidden');
      if (emptyCartState) emptyCartState.classList.remove('hidden');
      return;
    }

    if (cartContentWrapper) cartContentWrapper.classList.remove('hidden');
    if (emptyCartState) emptyCartState.classList.add('hidden');

    // Render items list
    if (cartContainer) {
      cartContainer.innerHTML = items.map(item => `
        <div class="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-surface/50 transition-colors">
          <!-- Item Thumbnail & Info -->
          <div class="flex items-start gap-4 flex-grow min-w-0">
            <a href="product-detail.html?id=${item.id}" class="shrink-0">
              <img src="${item.image}" alt="${item.name}" class="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg bg-surface-container-high border border-outline-variant/40" />
            </a>
            <div class="flex-grow min-w-0">
              <span class="text-xs uppercase text-outline font-semibold">${item.brand}</span>
              <a href="product-detail.html?id=${item.id}" class="block font-bold text-sm md:text-base text-on-surface hover:text-primary transition-colors truncate">
                ${item.name}
              </a>
              <div class="flex flex-wrap gap-2 mt-1 text-xs text-on-surface-variant">
                ${item.selectedSize ? `<span class="bg-surface-container-high px-2 py-0.5 rounded">${item.selectedSize}</span>` : ''}
                ${item.selectedColor ? `<span class="bg-surface-container-high px-2 py-0.5 rounded">${item.selectedColor}</span>` : ''}
              </div>
              <div class="mt-2 text-sm font-bold text-primary sm:hidden">
                ${formatCurrency(item.price)}
              </div>
            </div>
          </div>

          <!-- Quantity Changer & Subtotal -->
          <div class="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/30">
            <!-- Qty Counter -->
            <div class="flex items-center border border-outline-variant rounded-lg bg-surface-container-lowest overflow-hidden">
              <button class="cart-qty-dec w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors" data-id="${item.id}" data-qty="${item.quantity - 1}">
                <span class="material-symbols-outlined text-sm">remove</span>
              </button>
              <span class="w-8 text-center font-bold text-sm text-on-surface">${item.quantity}</span>
              <button class="cart-qty-inc w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors" data-id="${item.id}" data-qty="${item.quantity + 1}">
                <span class="material-symbols-outlined text-sm">add</span>
              </button>
            </div>

            <!-- Price -->
            <div class="text-right hidden sm:block min-w-[90px]">
              <div class="font-bold text-base text-primary">${formatCurrency(item.price * item.quantity)}</div>
              ${item.quantity > 1 ? `<div class="text-xs text-outline">${formatCurrency(item.price)} each</div>` : ''}
            </div>

            <!-- Remove Button -->
            <button class="cart-remove-btn text-outline hover:text-error p-1.5 rounded-full hover:bg-error-container/30 transition-colors" data-id="${item.id}" title="Remove item">
              <span class="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </div>
        </div>
      `).join('');

      // Add Quantity & Remove Listeners
      cartContainer.querySelectorAll('.cart-qty-dec').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const qty = parseInt(btn.getAttribute('data-qty'), 10);
          Store.updateCartQuantity(id, qty);
        });
      });

      cartContainer.querySelectorAll('.cart-qty-inc').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const qty = parseInt(btn.getAttribute('data-qty'), 10);
          Store.updateCartQuantity(id, qty);
        });
      });

      cartContainer.querySelectorAll('.cart-remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          Store.removeFromCart(id);
        });
      });
    }

    // Update Totals
    if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
    if (savingsEl) {
      if (totals.totalSavings > 0) {
        savingsEl.parentElement.classList.remove('hidden');
        savingsEl.textContent = `- ${formatCurrency(totals.totalSavings)}`;
      } else {
        savingsEl.parentElement.classList.add('hidden');
      }
    }

    if (deliveryEl) {
      if (totals.deliveryFee === 0) {
        deliveryEl.innerHTML = '<span class="text-discount font-bold">FREE</span>';
      } else {
        deliveryEl.textContent = formatCurrency(totals.deliveryFee);
      }
    }

    if (discountRow && discountEl) {
      if (totals.couponDiscount > 0) {
        discountRow.classList.remove('hidden');
        discountEl.textContent = `- ${formatCurrency(totals.couponDiscount)}`;
      } else {
        discountRow.classList.add('hidden');
      }
    }

    if (totalEl) totalEl.textContent = formatCurrency(totals.finalTotal);

    // Coupon UI
    if (totals.coupon) {
      if (activeCouponBadge) {
        activeCouponBadge.classList.remove('hidden');
        activeCouponBadge.querySelector('.coupon-name').textContent = `${totals.coupon.code} (${totals.coupon.label})`;
      }
      if (couponInput) couponInput.disabled = true;
      if (applyCouponBtn) applyCouponBtn.disabled = true;
    } else {
      if (activeCouponBadge) activeCouponBadge.classList.add('hidden');
      if (couponInput) couponInput.disabled = false;
      if (applyCouponBtn) applyCouponBtn.disabled = false;
    }
  }

  // Apply Coupon
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim();
      if (!code) return;
      const res = Store.applyCoupon(code);
      if (couponMessage) {
        couponMessage.textContent = res.message;
        couponMessage.className = `text-xs mt-1.5 font-medium ${res.success ? 'text-discount' : 'text-error'}`;
      }
      if (res.success) couponInput.value = '';
    });
  }

  // Remove Coupon
  if (removeCouponBtn) {
    removeCouponBtn.addEventListener('click', () => {
      Store.removeCoupon();
      if (couponMessage) couponMessage.textContent = '';
    });
  }

  // Listen to Cart updates
  window.addEventListener('cart-updated', renderCart);

  // Initial Render
  renderCart();
});
