/**
 * Kranti Furnitures & Electronics - Multi-Step Secure Checkout JS
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const user = Store.getUser();
  const totals = Store.getCartTotals();
  const items = Store.getCartDetailed();

  if (items.length === 0) {
    Store.showToast('Your cart is empty. Please add items to checkout.', 'info');
    setTimeout(() => {
      window.location.href = 'products.html';
    }, 1200);
    return;
  }

  // Shipping Address Form State
  let shippingData = {
    fullName: user?.firstName ? `${user.firstName} ${user.lastName}` : 'Ramesh Kumar',
    phone: user?.phone || '+91 98765 43210',
    email: user?.email || 'ramesh.kumar@example.com',
    pincode: '211001',
    city: 'Prayagraj',
    address: '123 Civil Lines, Near High Court, Prayagraj, UP 211001'
  };

  let deliverySpeed = 'Standard Free Delivery';
  let paymentMethod = 'UPI / Google Pay';

  // DOM Elements
  const step1Container = document.getElementById('step-1-shipping');
  const step2Container = document.getElementById('step-2-delivery');
  const step3Container = document.getElementById('step-3-payment');

  const stepIndicator1 = document.getElementById('step-indicator-1');
  const stepIndicator2 = document.getElementById('step-indicator-2');
  const stepIndicator3 = document.getElementById('step-indicator-3');

  const continueToDeliveryBtn = document.getElementById('continue-to-delivery-btn');
  const backToShippingBtn = document.getElementById('back-to-shipping-btn');
  const continueToPaymentBtn = document.getElementById('continue-to-payment-btn');
  const backToDeliveryBtn = document.getElementById('back-to-delivery-btn');
  const placeOrderBtn = document.getElementById('place-order-btn');

  // Input Fields
  const inputName = document.getElementById('checkout-name');
  const inputPhone = document.getElementById('checkout-phone');
  const inputEmail = document.getElementById('checkout-email');
  const inputPincode = document.getElementById('checkout-pincode');
  const inputCity = document.getElementById('checkout-city');
  const inputAddress = document.getElementById('checkout-address');

  // Pre-fill user data if available
  if (inputName) inputName.value = shippingData.fullName;
  if (inputPhone) inputPhone.value = shippingData.phone;
  if (inputEmail) inputEmail.value = shippingData.email;
  if (inputPincode) inputPincode.value = shippingData.pincode;
  if (inputCity) inputCity.value = shippingData.city;
  if (inputAddress) inputAddress.value = shippingData.address;

  // Order Summary Sidebar rendering
  function renderOrderSummary() {
    const summaryItems = document.getElementById('checkout-items-list');
    const summarySubtotal = document.getElementById('checkout-subtotal');
    const summaryDiscount = document.getElementById('checkout-discount');
    const summaryDelivery = document.getElementById('checkout-delivery');
    const summaryTotal = document.getElementById('checkout-total');

    if (summaryItems) {
      summaryItems.innerHTML = items.map(item => `
        <div class="flex gap-3 items-center py-2 border-b border-outline-variant/30 last:border-0">
          <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg bg-surface-container-high shrink-0 border border-outline-variant/30" />
          <div class="flex-grow min-w-0">
            <h4 class="font-bold text-xs md:text-sm text-on-surface truncate">${item.name}</h4>
            <p class="text-xs text-on-surface-variant">Qty: ${item.quantity} ${item.selectedSize ? `• ${item.selectedSize}` : ''}</p>
            <p class="font-bold text-xs md:text-sm text-primary mt-0.5">${formatCurrency(item.price * item.quantity)}</p>
          </div>
        </div>
      `).join('');
    }

    if (summarySubtotal) summarySubtotal.textContent = formatCurrency(totals.subtotal);
    if (summaryDiscount) {
      if (totals.couponDiscount > 0) {
        summaryDiscount.parentElement.classList.remove('hidden');
        summaryDiscount.textContent = `- ${formatCurrency(totals.couponDiscount)}`;
      } else {
        summaryDiscount.parentElement.classList.add('hidden');
      }
    }
    if (summaryDelivery) {
      summaryDelivery.textContent = totals.deliveryFee === 0 ? 'FREE' : formatCurrency(totals.deliveryFee);
    }
    if (summaryTotal) summaryTotal.textContent = formatCurrency(totals.finalTotal);
  }

  // Step 1 Validation & Proceed
  if (continueToDeliveryBtn) {
    continueToDeliveryBtn.addEventListener('click', () => {
      const name = inputName?.value.trim();
      const phone = inputPhone?.value.trim();
      const pincode = inputPincode?.value.trim();
      const address = inputAddress?.value.trim();

      if (!name || name.length < 3) {
        Store.showToast('Please enter your full name', 'error');
        inputName?.focus();
        return;
      }
      if (!phone || phone.length < 10) {
        Store.showToast('Please enter a valid mobile number', 'error');
        inputPhone?.focus();
        return;
      }
      if (!pincode || !/^\d{6}$/.test(pincode)) {
        Store.showToast('Please enter a valid 6-digit Pincode', 'error');
        inputPincode?.focus();
        return;
      }
      if (!address || address.length < 10) {
        Store.showToast('Please enter detailed delivery address', 'error');
        inputAddress?.focus();
        return;
      }

      shippingData = {
        fullName: name,
        phone: phone,
        email: inputEmail?.value.trim() || '',
        pincode: pincode,
        city: inputCity?.value.trim() || 'Prayagraj',
        address: address
      };

      goToStep(2);
    });
  }

  // Step 2 Proceed & Back
  if (backToShippingBtn) {
    backToShippingBtn.addEventListener('click', () => goToStep(1));
  }
  if (continueToPaymentBtn) {
    continueToPaymentBtn.addEventListener('click', () => {
      const selectedDeliveryRadio = document.querySelector('input[name="delivery-speed"]:checked');
      if (selectedDeliveryRadio) {
        deliverySpeed = selectedDeliveryRadio.value;
      }
      goToStep(3);
    });
  }

  // Step 3 Back & Place Order
  if (backToDeliveryBtn) {
    backToDeliveryBtn.addEventListener('click', () => goToStep(2));
  }

  // Payment Method Selection Tabs
  document.querySelectorAll('[data-pay-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-pay-tab]').forEach(t => {
        t.classList.remove('border-primary', 'bg-primary-container/10', 'text-primary', 'ring-1', 'ring-primary');
        t.classList.add('border-outline-variant', 'bg-surface-container-lowest', 'text-on-surface');
      });
      tab.classList.remove('border-outline-variant', 'bg-surface-container-lowest', 'text-on-surface');
      tab.classList.add('border-primary', 'bg-primary-container/10', 'text-primary', 'ring-1', 'ring-primary');

      paymentMethod = tab.getAttribute('data-pay-tab');

      document.querySelectorAll('.pay-method-view').forEach(v => v.classList.add('hidden'));
      const activeView = document.getElementById(`pay-view-${paymentMethod}`);
      if (activeView) activeView.classList.remove('hidden');
    });
  });

  // Final Order Placement
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      placeOrderBtn.disabled = true;
      placeOrderBtn.innerHTML = `
        <span class="inline-block animate-spin mr-2">⏳</span>
        Processing Order...
      `;

      setTimeout(() => {
        const newOrder = Store.createOrder(shippingData, paymentMethod, deliverySpeed);
        Store.showToast(`Order #${newOrder.orderId} confirmed successfully!`, 'success');
        
        setTimeout(() => {
          window.location.href = `order-tracking.html?orderId=${newOrder.orderId}`;
        }, 800);
      }, 1000);
    });
  }

  function goToStep(step) {
    currentStep = step;

    // Reset Containers
    [step1Container, step2Container, step3Container].forEach((el, idx) => {
      if (!el) return;
      if (idx + 1 === step) {
        el.classList.remove('opacity-60', 'pointer-events-none');
        el.querySelector('.step-content')?.classList.remove('hidden');
      } else if (idx + 1 < step) {
        el.classList.remove('opacity-60', 'pointer-events-none');
        el.querySelector('.step-content')?.classList.add('hidden');
      } else {
        el.classList.add('opacity-60', 'pointer-events-none');
        el.querySelector('.step-content')?.classList.add('hidden');
      }
    });

    // Update Progress Indicator Pills
    const indicators = [stepIndicator1, stepIndicator2, stepIndicator3];
    indicators.forEach((ind, idx) => {
      if (!ind) return;
      const numBadge = ind.querySelector('.step-num');
      const textLabel = ind.querySelector('.step-label');

      if (idx + 1 === step) {
        numBadge.className = 'step-num w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-primary/20';
        numBadge.textContent = idx + 1;
        textLabel.className = 'step-label text-xs font-bold text-primary';
      } else if (idx + 1 < step) {
        numBadge.className = 'step-num w-8 h-8 rounded-full bg-discount text-on-primary flex items-center justify-center font-bold text-sm shadow-sm';
        numBadge.innerHTML = '<span class="material-symbols-outlined text-sm font-bold">check</span>';
        textLabel.className = 'step-label text-xs font-semibold text-discount';
      } else {
        numBadge.className = 'step-num w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-semibold text-sm';
        numBadge.textContent = idx + 1;
        textLabel.className = 'step-label text-xs font-medium text-on-surface-variant';
      }
    });

    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  // Initial Summary
  renderOrderSummary();
});
