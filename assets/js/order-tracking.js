/**
 * Kranti Furnitures & Electronics - Order Tracking JS
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedId = urlParams.get('orderId');
  
  const orders = Store.getOrders();
  const order = requestedId ? Store.getOrderById(requestedId) : (orders[0] || null);

  if (!order) {
    Store.showToast('Order not found', 'error');
    return;
  }

  // DOM Elements
  const orderIdHeading = document.getElementById('tracking-order-id');
  const orderMetaText = document.getElementById('tracking-order-meta');
  const deliveryEstimateHeading = document.getElementById('tracking-delivery-heading');
  const deliveryStatusText = document.getElementById('tracking-delivery-sub');
  const timelineProgressBar = document.getElementById('tracking-progress-line');
  const timelineStepsContainer = document.getElementById('tracking-steps-container');
  const milestoneEventsContainer = document.getElementById('tracking-events-list');
  const itemsContainer = document.getElementById('tracking-items-list');
  const deliveryAddressEl = document.getElementById('tracking-address-content');
  const paymentMethodEl = document.getElementById('tracking-payment-method');
  const orderSubtotalEl = document.getElementById('tracking-subtotal');
  const orderTotalEl = document.getElementById('tracking-total');
  const invoiceDownloadBtn = document.getElementById('download-invoice-btn');
  const helpSupportBtn = document.getElementById('order-help-btn');

  // Populate Header
  if (orderIdHeading) orderIdHeading.textContent = `Order #${order.orderId}`;
  if (orderMetaText) {
    orderMetaText.innerHTML = `Order #${order.orderId} <span class="mx-2">•</span> Placed on ${order.date}`;
  }

  if (deliveryEstimateHeading) {
    if (order.status === 'Delivered') {
      deliveryEstimateHeading.textContent = 'Package Delivered';
    } else if (order.status === 'Out for Delivery') {
      deliveryEstimateHeading.textContent = 'Arriving Today';
    } else {
      deliveryEstimateHeading.textContent = 'In Transit';
    }
  }

  if (deliveryStatusText) {
    deliveryStatusText.textContent = order.estimatedDelivery || 'Estimated delivery within 2-3 business days';
  }

  // Step Progress (1: Placed, 2: Confirmed, 3: Shipped, 4: Out for Delivery, 5: Delivered)
  const currentStep = order.statusStep || 4;
  const progressPercent = Math.min(100, Math.max(10, (currentStep - 1) * 25));
  if (timelineProgressBar) {
    timelineProgressBar.style.width = `${progressPercent}%`;
  }

  const stepsDef = [
    { title: 'Order Placed', date: order.date },
    { title: 'Confirmed', date: order.date },
    { title: 'Shipped', date: 'Oct 13' },
    { title: 'Out for Delivery', date: 'Today' },
    { title: 'Delivered', date: 'TBD' }
  ];

  if (timelineStepsContainer) {
    timelineStepsContainer.innerHTML = stepsDef.map((s, idx) => {
      const stepNum = idx + 1;
      const isCompleted = stepNum < currentStep;
      const isCurrent = stepNum === currentStep;

      let iconHtml = `<span class="material-symbols-outlined text-sm font-bold">check</span>`;
      let circleClass = 'w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center';
      
      if (isCurrent) {
        circleClass = 'w-8 h-8 rounded-full bg-surface-container-lowest border-2 border-primary text-primary flex items-center justify-center ring-4 ring-primary/20';
        iconHtml = `<span class="material-symbols-outlined text-sm filled">directions_car</span>`;
      } else if (!isCompleted && !isCurrent) {
        circleClass = 'w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant text-outline flex items-center justify-center';
        iconHtml = `<span class="material-symbols-outlined text-sm">inventory_2</span>`;
      }

      return `
        <div class="relative z-10 flex flex-col items-center gap-2">
          <div class="${circleClass}">
            ${iconHtml}
          </div>
          <span class="text-xs font-semibold ${isCompleted || isCurrent ? 'text-primary' : 'text-on-surface-variant'} text-center w-24">
            ${s.title}<br/>
            <span class="text-[11px] font-normal text-on-surface-variant">${s.date}</span>
          </span>
        </div>
      `;
    }).join('');
  }

  // Milestone Events List
  if (milestoneEventsContainer && order.timeline) {
    milestoneEventsContainer.innerHTML = order.timeline.map((evt, idx) => `
      <div class="flex gap-4 relative z-10">
        <div class="w-6 h-6 rounded-full ${idx === 0 ? 'bg-primary ring-4 ring-primary/20' : 'bg-surface-container-lowest border border-outline-variant'} flex items-center justify-center shrink-0 mt-0.5">
          ${idx === 0 ? '<div class="w-2 h-2 rounded-full bg-on-primary"></div>' : ''}
        </div>
        <div>
          <h3 class="text-sm font-bold ${idx === 0 ? 'text-primary' : 'text-on-surface'}">${evt.title}</h3>
          <p class="text-xs text-on-surface-variant mt-0.5">${evt.desc}</p>
          <p class="text-[11px] text-outline mt-1 font-medium">${evt.time}</p>
        </div>
      </div>
    `).join('');
  }

  // Ordered Items
  if (itemsContainer && order.items) {
    itemsContainer.innerHTML = order.items.map(item => `
      <div class="flex items-start gap-4 p-4 border border-outline-variant/60 rounded-xl bg-surface-container-lowest hover:bg-surface transition-colors">
        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg bg-surface-container-high shrink-0 border border-outline-variant/30" />
        <div class="flex flex-col flex-grow min-w-0">
          <h3 class="font-bold text-sm md:text-base text-primary truncate">${item.name}</h3>
          <p class="text-xs text-on-surface-variant mt-1">
            ${item.color ? `Color: ${item.color} | ` : ''} Qty: ${item.quantity}
          </p>
          <p class="font-bold text-base text-primary mt-2 font-headline">${formatCurrency(item.price * item.quantity)}</p>
        </div>
        <a href="product-detail.html?id=${item.productId}" class="hidden sm:inline-flex px-4 py-2 text-xs font-bold text-primary border border-primary rounded-lg hover:bg-primary hover:text-on-primary transition-colors shrink-0">
          View Item
        </a>
      </div>
    `).join('');
  }

  // Delivery Address Card
  if (deliveryAddressEl && order.deliveryAddress) {
    const addr = order.deliveryAddress;
    deliveryAddressEl.innerHTML = `
      <p class="font-bold text-sm text-primary mb-1">${addr.fullName}</p>
      <p class="text-xs text-on-surface-variant leading-relaxed">${addr.address}</p>
      <p class="text-xs text-on-surface-variant mt-2 font-medium">📞 ${addr.phone}</p>
    `;
  }

  // Payment Method
  if (paymentMethodEl) {
    paymentMethodEl.textContent = order.paymentMethod || 'UPI / Online';
  }

  if (orderSubtotalEl) orderSubtotalEl.textContent = formatCurrency(order.subtotal || order.total);
  if (orderTotalEl) orderTotalEl.textContent = formatCurrency(order.total);

  // Invoice Download simulation
  if (invoiceDownloadBtn) {
    invoiceDownloadBtn.addEventListener('click', () => {
      Store.showToast(`Invoice #${order.orderId}.pdf downloaded successfully!`, 'success');
    });
  }

  // Help Modal simulation
  if (helpSupportBtn) {
    helpSupportBtn.addEventListener('click', () => {
      Store.showToast('Connecting to Kranti Prayagraj Customer Care hotline...', 'info');
    });
  }
});
