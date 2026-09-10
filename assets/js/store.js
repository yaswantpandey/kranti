/**
 * Kranti Furnitures & Electronics - Central Reactive Store
 * LocalStorage persistence for Cart, Wishlist, User, Orders & Addresses
 */

const Store = {
  // Key names in LocalStorage
  KEYS: {
    CART: 'kranti_cart_v1',
    WISHLIST: 'kranti_wishlist_v1',
    USER: 'kranti_user_v1',
    ORDERS: 'kranti_orders_v1',
    COUPON: 'kranti_coupon_v1',
    INQUIRIES: 'kranti_inquiries_v1',
    PRODUCTS: 'kranti_products_v1',
    SETTINGS: 'kranti_settings_v1',
    ADMIN_SESSION: 'kranti_admin_session_v1',
  },

  // ----------------------------------------------------
  // Initial / Default States
  // ----------------------------------------------------
  init() {
    // Initial Cart Setup (Seed with Stitch items if empty so showroom looks alive)
    if (!localStorage.getItem(this.KEYS.CART)) {
      const initialCart = [
        {
          id: 'loring-3-seater-sofa',
          quantity: 1,
          selectedSize: '3-Seater (84" W)',
          selectedColor: 'Deep Navy Velvet'
        },
        {
          id: 'smart-4k-led-55-tv',
          quantity: 1,
          selectedSize: '55 Inch',
          selectedColor: 'Midnight Matte Black'
        }
      ];
      localStorage.setItem(this.KEYS.CART, JSON.stringify(initialCart));
    }

    // Initial Wishlist
    if (!localStorage.getItem(this.KEYS.WISHLIST)) {
      localStorage.setItem(this.KEYS.WISHLIST, JSON.stringify(['samsung-65-qled-4k-tv', 'royal-plush-recliner-armchair']));
    }

    // Initial Inquiries
    if (!localStorage.getItem(this.KEYS.INQUIRIES)) {
      const defaultInquiries = [
        {
          id: 'INQ-104921',
          date: 'Sep 01, 2024',
          productName: 'Samsung 65" Class QLED 4K Smart TV',
          productId: 'samsung-65-qled-4k-tv',
          fullName: 'Ramesh Kumar',
          phone: '+91 98765 43210',
          email: 'ramesh.kumar@example.com',
          location: 'Civil Lines, Prayagraj',
          message: 'Please share home delivery time and warranty terms for Prayagraj location.',
          status: 'Callback Scheduled',
          statusColor: 'discount'
        },
        {
          id: 'INQ-104880',
          date: 'Aug 28, 2024',
          productName: 'Loring 3-Seater Velvet Sofa',
          productId: 'loring-3-seater-sofa',
          fullName: 'Ramesh Kumar',
          phone: '+91 98765 43210',
          email: 'ramesh.kumar@example.com',
          location: 'Prayagraj',
          message: 'Looking for custom wood shade and velvet fabric sample view.',
          status: 'Inquiry Answered',
          statusColor: 'primary'
        }
      ];
      localStorage.setItem(this.KEYS.INQUIRIES, JSON.stringify(defaultInquiries));
    }

    // Initial Dynamic Products Setup (Seeded from PRODUCTS_DATA)
    if (!localStorage.getItem(this.KEYS.PRODUCTS) && typeof PRODUCTS_DATA !== 'undefined') {
      localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(PRODUCTS_DATA));
    }

    // Initial Showroom Settings
    if (!localStorage.getItem(this.KEYS.SETTINGS)) {
      const defaultSettings = {
        storeName: 'Kranti Furnitures & Electronics',
        phone: '+91 98765 43210',
        altPhone: '+91 0532 2400112',
        email: 'contact@krantifurniture.in',
        address: '123 Civil Lines, Near High Court, Prayagraj, UP 211001',
        hours: 'Open 7 Days: 10:00 AM - 9:00 PM',
        bannerNotice: 'Welcome to Kranti Digital Showroom! Experience handcrafted solid wood furniture and smart electronics.'
      };
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }

    // Initial User
    if (!localStorage.getItem(this.KEYS.USER)) {
      const defaultUser = {
        isLoggedIn: true,
        firstName: 'Ramesh',
        lastName: 'Kumar',
        email: 'ramesh.kumar@example.com',
        phone: '+91 98765 43210',
        addresses: [
          {
            id: 'addr_1',
            type: 'Home (Default)',
            fullName: 'Ramesh Kumar',
            phone: '+91 98765 43210',
            pincode: '211001',
            city: 'Prayagraj',
            state: 'Uttar Pradesh',
            addressLine: '123 Civil Lines, Near High Court, Prayagraj, UP 211001',
            isDefault: true
          },
          {
            id: 'addr_2',
            type: 'Office',
            fullName: 'Ramesh Kumar',
            phone: '+91 98765 43210',
            pincode: '211002',
            city: 'Prayagraj',
            state: 'Uttar Pradesh',
            addressLine: 'Suite 4B, Kranti Commercial Complex, MG Marg, Prayagraj',
            isDefault: false
          }
        ]
      };
      localStorage.setItem(this.KEYS.USER, JSON.stringify(defaultUser));
    }

    // Initial Orders matching the Stitch designs
    if (!localStorage.getItem(this.KEYS.ORDERS)) {
      const defaultOrders = [
        {
          orderId: 'KFE-849204-B',
          date: 'Oct 12, 2024',
          status: 'Out for Delivery',
          statusStep: 4, // 1: Placed, 2: Confirmed, 3: Shipped, 4: Out for Delivery, 5: Delivered
          estimatedDelivery: 'Tomorrow, by 9:00 PM',
          deliveryAddress: {
            fullName: 'Ramesh Kumar',
            phone: '+91 98765 43210',
            address: '123 Civil Lines, Near High Court, Prayagraj, UP 211001'
          },
          paymentMethod: 'UPI / Online Payment',
          timeline: [
            { title: 'Out for Delivery', desc: 'Your item is out for delivery. Our delivery executive will contact you shortly.', time: 'Oct 14, 2024, 08:30 AM', completed: true },
            { title: 'Reached local hub', desc: 'Package arrived at Prayagraj distribution center.', time: 'Oct 13, 2024, 11:45 PM', completed: true },
            { title: 'Shipped', desc: 'Package has left the main warehouse.', time: 'Oct 13, 2024, 02:15 PM', completed: true },
            { title: 'Confirmed', desc: 'Order verified by Kranti digital showroom team.', time: 'Oct 12, 2024, 04:20 PM', completed: true },
            { title: 'Order Placed', desc: 'Order received and payment confirmed.', time: 'Oct 12, 2024, 03:45 PM', completed: true }
          ],
          items: [
            {
              productId: 'sony-bravia-65-oled-tv',
              name: 'Sony Bravia 65" 4K Ultra HD Smart OLED TV',
              quantity: 1,
              price: 145990,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVMIYOzje4OcpmN64DB4wZro7bMFClQeMrCIDq2PVW7Y2_Y5pd4aapJ76jtuJOooM01iRa9V72YOTvLNoOi05-OGrDW5a3OOZlYH6Qak8H53Tr1c4PJ1BPv1ec8zSHSKpuU_U0bWdlR5-Lw5HoaQ5Yu9j-_YajSduNOjSfFFpAERG-v4vjpkNQ1ibxnd71LDQpjkrTsARzgCFVHWOooajUOjtmL0bWPo1seeEbIluwe63ir0S7ITMj'
            },
            {
              productId: 'urban-comfort-2-seater-sofa',
              name: 'Urban Comfort 2-Seater Fabric Sofa',
              quantity: 1,
              price: 18500,
              color: 'Stone Grey',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSkAIDRNZVKdpnifYFTJ6BwbG0BuFjwIA1MBjS_MwrYUfE_NQ4nFFNpcXWLFgTef_b4RlQ4Smxc9QbSeGBg0SDIw4ClpoVCaTBsVouWgo_iq9_a9E9s42R6G5TtYSoTpZOEx0kpNbdXnjrnGVp2m9hWf0wFRs3lNNgqCczt7-6D0-LlnulW2biwE56PcLvyOxLH8DLDryx3AxhFLhqzUEFFcFN_r5Qeh2261Alnfnmdn-cYYj1ErOv'
            }
          ],
          subtotal: 164490,
          discount: 0,
          deliveryFee: 0,
          total: 164490
        },
        {
          orderId: 'ORD-1029',
          date: 'Oct 24, 2023',
          status: 'Delivered',
          statusStep: 5,
          estimatedDelivery: 'Delivered on Oct 26, 2023',
          deliveryAddress: {
            fullName: 'Ramesh Kumar',
            phone: '+91 98765 43210',
            address: '123 Civil Lines, Near High Court, Prayagraj, UP 211001'
          },
          paymentMethod: 'Credit Card',
          items: [
            {
              productId: 'smart-4k-led-55-tv',
              name: 'Ultra HD Smart TV 55"',
              quantity: 1,
              price: 42999,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAviOs9QAvWnOOWiA59hBZuVZS0wqzHhyahnP31f0Le_tglvUpxk7YuGT044yST8aZqEdr5KcCYywuhof3N3uteUVjbHixhKV5czHS5-tf5jE9PhxcXhp5jZHFugI_3dRWjtu1E3Zc54z5jWl5mCc-NJgk_NdNy0E24ScP7C68vfNL7CEaOZTZIHhDbX2ApsEGMo3T5L9EXVv1d3DXiyMFyRU_jrXgpIEUGzPodPoSDi-jfVGvPtIo3'
            }
          ],
          subtotal: 42999,
          total: 42999
        },
        {
          orderId: 'ORD-1035',
          date: 'Nov 02, 2023',
          status: 'Shipped',
          statusStep: 3,
          estimatedDelivery: 'Nov 05, 2023',
          deliveryAddress: {
            fullName: 'Ramesh Kumar',
            phone: '+91 98765 43210',
            address: '123 Civil Lines, Near High Court, Prayagraj, UP 211001'
          },
          paymentMethod: 'UPI',
          items: [
            {
              productId: 'ergonomic-wooden-dining-chair',
              name: 'Modern Teakwood Dining Chair',
              quantity: 1,
              price: 4500,
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi1aEyX5Lva29nYe3IjyXiajdh3LvN3KsRuDRE5ZTcEV2tNO76QktZat0r7RUSuHp9frwIJZKfRsUHRMdS_QpFNVoOMco33gcK8kKYoJjU3BZfU5aJrpNst8DzQw4bxDkF40GzTiY3rHQTZKLiu4f85qM3Zwp8l7XKejetWgbEelo5AtHW173-vbzeFJQK_qKuDWvczKYDFEF-KE68lcGU139b5FbBZjggiNuN76_YWPcpBXrvt7PB'
            }
          ],
          subtotal: 4500,
          total: 4500
        }
      ];
      localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(defaultOrders));
    }
  },

  // ----------------------------------------------------
  // CART OPERATIONS
  // ----------------------------------------------------
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.CART)) || [];
    } catch {
      return [];
    }
  },

  getCartDetailed() {
    const rawCart = this.getCart();
    return rawCart.map(item => {
      const product = getProductById(item.id);
      return {
        ...product,
        quantity: item.quantity,
        selectedSize: item.selectedSize || (product.variants?.sizes ? product.variants.sizes[0] : ''),
        selectedColor: item.selectedColor || (product.variants?.colors ? product.variants.colors[0].name : '')
      };
    });
  },

  addToCart(productId, quantity = 1, options = {}) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
      if (options.selectedSize) cart[existingIndex].selectedSize = options.selectedSize;
      if (options.selectedColor) cart[existingIndex].selectedColor = options.selectedColor;
    } else {
      cart.push({
        id: productId,
        quantity: quantity,
        selectedSize: options.selectedSize,
        selectedColor: options.selectedColor
      });
    }

    localStorage.setItem(this.KEYS.CART, JSON.stringify(cart));
    this.dispatchEvent('cart-updated', { cart });

    const product = getProductById(productId);
    this.showToast(`Added "${product.name}" to cart`, 'success');
  },

  updateCartQuantity(productId, newQty) {
    let cart = this.getCart();
    if (newQty <= 0) {
      this.removeFromCart(productId);
      return;
    }
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.quantity = newQty;
      localStorage.setItem(this.KEYS.CART, JSON.stringify(cart));
      this.dispatchEvent('cart-updated', { cart });
    }
  },

  removeFromCart(productId) {
    let cart = this.getCart();
    const product = getProductById(productId);
    cart = cart.filter(i => i.id !== productId);
    localStorage.setItem(this.KEYS.CART, JSON.stringify(cart));
    this.dispatchEvent('cart-updated', { cart });
    this.showToast(`Removed "${product.name}" from cart`, 'info');
  },

  clearCart() {
    localStorage.setItem(this.KEYS.CART, JSON.stringify([]));
    this.dispatchEvent('cart-updated', { cart: [] });
  },

  getCartCount() {
    return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
  },

  getCartTotals() {
    const detailed = this.getCartDetailed();
    const subtotal = detailed.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const originalSubtotal = detailed.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
    const totalSavings = originalSubtotal - subtotal;

    const coupon = this.getCoupon();
    let couponDiscount = 0;
    if (coupon) {
      if (coupon.type === 'percent') {
        couponDiscount = Math.round((subtotal * coupon.value) / 100);
      } else if (coupon.type === 'flat') {
        couponDiscount = Math.min(coupon.value, subtotal);
      }
    }

    const deliveryFee = subtotal > 1000 ? 0 : 499;
    const finalTotal = Math.max(0, subtotal - couponDiscount + (deliveryFee === 0 ? 0 : deliveryFee));

    return {
      subtotal,
      originalSubtotal,
      totalSavings,
      deliveryFee,
      couponDiscount,
      coupon,
      finalTotal,
      itemCount: this.getCartCount()
    };
  },

  // ----------------------------------------------------
  // COUPON OPERATIONS
  // ----------------------------------------------------
  getCoupon() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.COUPON)) || null;
    } catch {
      return null;
    }
  },

  applyCoupon(code) {
    const validCoupons = {
      'KRANTI10': { code: 'KRANTI10', type: 'percent', value: 10, label: '10% Festive Discount' },
      'WELCOME500': { code: 'WELCOME500', type: 'flat', value: 500, label: '₹500 Welcome Voucher' },
      'FESTIVE15': { code: 'FESTIVE15', type: 'percent', value: 15, label: '15% Showroom Special' }
    };

    const upper = code.trim().toUpperCase();
    if (validCoupons[upper]) {
      localStorage.setItem(this.KEYS.COUPON, JSON.stringify(validCoupons[upper]));
      this.dispatchEvent('cart-updated', {});
      this.showToast(`Coupon "${upper}" applied successfully!`, 'success');
      return { success: true, message: `Coupon applied: ${validCoupons[upper].label}` };
    } else {
      return { success: false, message: 'Invalid coupon code. Try KRANTI10 or FESTIVE15' };
    }
  },

  removeCoupon() {
    localStorage.removeItem(this.KEYS.COUPON);
    this.dispatchEvent('cart-updated', {});
    this.showToast('Coupon removed', 'info');
  },

  // ----------------------------------------------------
  // WISHLIST OPERATIONS
  // ----------------------------------------------------
  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.WISHLIST)) || [];
    } catch {
      return [];
    }
  },

  isInWishlist(productId) {
    return this.getWishlist().includes(productId);
  },

  toggleWishlist(productId) {
    let wishlist = this.getWishlist();
    const product = getProductById(productId);
    let added = false;

    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter(id => id !== productId);
      this.showToast(`Removed "${product.name}" from wishlist`, 'info');
    } else {
      wishlist.push(productId);
      added = true;
      this.showToast(`Added "${product.name}" to wishlist`, 'success');
    }

    localStorage.setItem(this.KEYS.WISHLIST, JSON.stringify(wishlist));
    this.dispatchEvent('wishlist-updated', { wishlist, productId, added });
    return added;
  },

  getWishlistCount() {
    return this.getWishlist().length;
  },

  getWishlistDetailed() {
    const list = this.getWishlist();
    return list.map(id => getProductById(id)).filter(Boolean);
  },

  // ----------------------------------------------------
  // USER / AUTH OPERATIONS
  // ----------------------------------------------------
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.USER));
    } catch {
      return null;
    }
  },

  updateUser(updatedFields) {
    const user = { ...this.getUser(), ...updatedFields };
    localStorage.setItem(this.KEYS.USER, JSON.stringify(user));
    this.dispatchEvent('user-updated', { user });
    this.showToast('Profile updated successfully', 'success');
  },

  login(identifier) {
    const user = this.getUser() || {};
    user.isLoggedIn = true;
    if (identifier.includes('@')) {
      user.email = identifier;
    } else {
      user.phone = identifier;
    }
    localStorage.setItem(this.KEYS.USER, JSON.stringify(user));
    this.dispatchEvent('user-updated', { user });
    this.showToast('Signed in successfully! Welcome back.', 'success');
  },

  logout() {
    const user = this.getUser() || {};
    user.isLoggedIn = false;
    localStorage.setItem(this.KEYS.USER, JSON.stringify(user));
    this.dispatchEvent('user-updated', { user });
    this.showToast('Logged out of session', 'info');
  },

  addAddress(newAddress) {
    const user = this.getUser();
    if (!user) return;
    newAddress.id = 'addr_' + Date.now();
    user.addresses = user.addresses || [];
    if (newAddress.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }
    user.addresses.push(newAddress);
    localStorage.setItem(this.KEYS.USER, JSON.stringify(user));
    this.dispatchEvent('user-updated', { user });
    this.showToast('New address saved', 'success');
  },

  // ----------------------------------------------------
  // ORDER CREATION & TRACKING
  // ----------------------------------------------------
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.ORDERS)) || [];
    } catch {
      return [];
    }
  },

  getOrderById(orderId) {
    const orders = this.getOrders();
    return orders.find(o => o.orderId.toLowerCase() === orderId.toLowerCase()) || orders[0];
  },

  createOrder(shippingAddress, paymentMethod, deliveryOption = 'Standard Delivery') {
    const totals = this.getCartTotals();
    const items = this.getCartDetailed().map(i => ({
      productId: i.id,
      name: i.name,
      quantity: i.quantity,
      price: i.price,
      selectedSize: i.selectedSize,
      selectedColor: i.selectedColor,
      image: i.image
    }));

    const newOrderId = 'KFE-' + Math.floor(100000 + Math.random() * 900000) + '-P';
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newOrder = {
      orderId: newOrderId,
      date: dateStr,
      status: 'Order Placed',
      statusStep: 1,
      estimatedDelivery: 'Arriving in 2-3 Business Days',
      deliveryAddress: shippingAddress,
      paymentMethod: paymentMethod,
      deliveryOption: deliveryOption,
      timeline: [
        { title: 'Order Placed', desc: 'Order received and payment confirmed.', time: `${dateStr}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, completed: true },
        { title: 'Confirmed', desc: 'Awaiting showroom manager verification.', time: 'Expected shortly', completed: false },
        { title: 'Shipped', desc: 'Package will depart from Prayagraj central hub.', time: 'Pending', completed: false },
        { title: 'Out for Delivery', desc: 'Executive will contact for delivery slot.', time: 'Pending', completed: false },
        { title: 'Delivered', desc: 'Free doorstep setup and installation.', time: 'Pending', completed: false }
      ],
      items: items,
      subtotal: totals.subtotal,
      discount: totals.couponDiscount,
      deliveryFee: totals.deliveryFee,
      total: totals.finalTotal
    };

    const orders = this.getOrders();
    orders.unshift(newOrder);
    localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(orders));

    // Clear cart after placing order
    this.clearCart();
    localStorage.removeItem(this.KEYS.COUPON);

    return newOrder;
  },

  // ----------------------------------------------------
  // INQUIRIES MANAGEMENT
  // ----------------------------------------------------
  getInquiries() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.INQUIRIES)) || [];
    } catch {
      return [];
    }
  },

  saveInquiry(data) {
    const inquiries = this.getInquiries();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newInquiry = {
      id: 'INQ-' + Math.floor(100000 + Math.random() * 900000),
      date: dateStr,
      productName: data.productName || 'General Product Inquiry',
      productId: data.productId || '',
      fullName: data.fullName || 'Valued Customer',
      phone: data.phone || '',
      email: data.email || '',
      location: data.location || 'Prayagraj',
      message: data.message || 'Interested in product details and best pricing.',
      status: 'Pending Callback',
      statusColor: 'discount'
    };

    inquiries.unshift(newInquiry);
    localStorage.setItem(this.KEYS.INQUIRIES, JSON.stringify(inquiries));
    this.dispatchEvent('inquiries-updated', { inquiry: newInquiry });
    this.showToast(`Thank you! Your query for "${newInquiry.productName}" has been received.`, 'success');
    return newInquiry;
  },

  // ----------------------------------------------------
  // DYNAMIC PRODUCTS MANAGEMENT
  // ----------------------------------------------------
  getProducts() {
    try {
      const stored = localStorage.getItem(this.KEYS.PRODUCTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return typeof PRODUCTS_DATA !== 'undefined' ? PRODUCTS_DATA : [];
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || products[0];
  },

  saveProduct(productData) {
    const products = this.getProducts();
    if (!productData.id) {
      productData.id = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
    }
    productData.rating = productData.rating || 4.8;
    productData.reviewsCount = productData.reviewsCount || 10;
    productData.inStock = productData.inStock !== false;

    products.unshift(productData);
    localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
    this.dispatchEvent('products-updated', { product: productData });
    this.showToast(`Product "${productData.name}" added successfully!`, 'success');
    return productData;
  },

  updateProduct(id, updatedData) {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updatedData };
      localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
      this.dispatchEvent('products-updated', { product: products[idx] });
      this.showToast(`Product updated successfully!`, 'success');
      return products[idx];
    }
    return null;
  },

  deleteProduct(id) {
    let products = this.getProducts();
    const target = products.find(p => p.id === id);
    products = products.filter(p => p.id !== id);
    localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
    this.dispatchEvent('products-updated', { deletedId: id });
    this.showToast(`Product "${target?.name || id}" removed.`, 'info');
    return true;
  },

  toggleProductStock(id) {
    const products = this.getProducts();
    const target = products.find(p => p.id === id);
    if (target) {
      target.inStock = !target.inStock;
      localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
      this.dispatchEvent('products-updated', { product: target });
      this.showToast(`Product "${target.name}" is now ${target.inStock ? 'In Stock' : 'Out of Stock'}`, 'info');
      return target;
    }
    return null;
  },

  toggleProductFeatured(id) {
    const products = this.getProducts();
    const target = products.find(p => p.id === id);
    if (target) {
      target.isFeatured = !target.isFeatured;
      localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
      this.dispatchEvent('products-updated', { product: target });
      this.showToast(`Product "${target.name}" ${target.isFeatured ? 'marked as Featured ⭐' : 'removed from Featured'}`, 'success');
      return target;
    }
    return null;
  },

  duplicateProduct(id) {
    const products = this.getProducts();
    const target = products.find(p => p.id === id);
    if (target) {
      const clone = JSON.parse(JSON.stringify(target));
      clone.id = clone.id + '-copy-' + Math.floor(Math.random() * 1000);
      clone.name = clone.name + ' (Copy)';
      products.unshift(clone);
      localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
      this.dispatchEvent('products-updated', { product: clone });
      this.showToast(`Duplicated product "${target.name}"`, 'success');
      return clone;
    }
    return null;
  },

  updateInquiryStatus(id, newStatus) {
    const inquiries = this.getInquiries();
    const inq = inquiries.find(i => i.id === id);
    if (inq) {
      inq.status = newStatus;
      localStorage.setItem(this.KEYS.INQUIRIES, JSON.stringify(inquiries));
      this.dispatchEvent('inquiries-updated', { inquiry: inq });
      this.showToast(`Inquiry #${id} status updated to "${newStatus}"`, 'success');
      return inq;
    }
    return null;
  },

  addInquiryNote(id, noteText) {
    const inquiries = this.getInquiries();
    const inq = inquiries.find(i => i.id === id);
    if (inq) {
      inq.adminNotes = noteText;
      localStorage.setItem(this.KEYS.INQUIRIES, JSON.stringify(inquiries));
      this.dispatchEvent('inquiries-updated', { inquiry: inq });
      this.showToast(`Saved admin notes for Inquiry #${id}`, 'success');
      return inq;
    }
    return null;
  },

  deleteInquiry(id) {
    let inquiries = this.getInquiries();
    inquiries = inquiries.filter(i => i.id !== id);
    localStorage.setItem(this.KEYS.INQUIRIES, JSON.stringify(inquiries));
    this.dispatchEvent('inquiries-updated', { deletedId: id });
    this.showToast(`Inquiry #${id} deleted.`, 'info');
    return true;
  },

  exportInquiriesCSV() {
    const inquiries = this.getInquiries();
    if (inquiries.length === 0) {
      this.showToast('No inquiries available to export.', 'info');
      return;
    }

    const headers = ['Inquiry ID', 'Date', 'Customer Name', 'Phone', 'Email', 'Location', 'Product Name', 'Status', 'Message', 'Admin Notes'];
    const rows = inquiries.map(i => [
      `"${i.id}"`,
      `"${i.date}"`,
      `"${(i.fullName || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.location || '').replace(/"/g, '""')}"`,
      `"${(i.productName || '').replace(/"/g, '""')}"`,
      `"${(i.status || '').replace(/"/g, '""')}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`,
      `"${(i.adminNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kranti_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('Downloaded Inquiries CSV report!', 'success');
  },

  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.SETTINGS)) || {};
    } catch {
      return {};
    }
  },

  saveSettings(settingsData) {
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settingsData));
    this.dispatchEvent('settings-updated', { settings: settingsData });
    this.showToast('Showroom settings updated successfully!', 'success');
    return settingsData;
  },

  isAdminLoggedIn() {
    return localStorage.getItem(this.KEYS.ADMIN_SESSION) === 'active';
  },

  adminLogin(password) {
    if (password === 'admin123' || password === 'admin') {
      localStorage.setItem(this.KEYS.ADMIN_SESSION, 'active');
      this.showToast('Admin logged in successfully!', 'success');
      return true;
    } else {
      this.showToast('Invalid admin password. Try "admin123".', 'error');
      return false;
    }
  },

  adminLogout() {
    localStorage.removeItem(this.KEYS.ADMIN_SESSION);
    this.showToast('Admin logged out.', 'info');
  },

  // ----------------------------------------------------
  // EVENT BUS & TOAST DISPATCHER
  // ----------------------------------------------------
  dispatchEvent(name, detail = {}) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  },

  showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;

    let icon = 'check_circle';
    if (type === 'error') icon = 'error';
    if (type === 'info') icon = 'info';

    toast.innerHTML = `
      <span class="material-symbols-outlined filled text-[20px]">${icon}</span>
      <span class="flex-grow">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

// Auto-initialize store on script load
Store.init();
