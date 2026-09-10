/**
 * Kranti Furnitures & Electronics - Authentication JS
 * Login, Registration & Interactive OTP Verification
 */

document.addEventListener('DOMContentLoaded', () => {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const viewLogin = document.getElementById('view-login');
  const viewRegister = document.getElementById('view-register');
  const viewOtp = document.getElementById('view-otp');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const otpForm = document.getElementById('otp-form');
  const otpInputs = document.querySelectorAll('.otp-digit-input');
  const backToLoginBtn = document.getElementById('back-to-login-btn');
  const otpMobileDisplay = document.getElementById('otp-mobile-display');
  const googleLoginBtn = document.getElementById('google-login-btn');

  let currentAuthIdentifier = '';

  // Tab switching
  function switchTab(tab) {
    if (tab === 'login') {
      tabLogin.className = "flex-1 py-4 font-bold text-sm text-primary border-b-2 border-primary bg-surface transition-colors";
      tabRegister.className = "flex-1 py-4 font-medium text-sm text-on-surface-variant bg-surface-container-lowest hover:bg-surface transition-colors";
      viewLogin.classList.remove('hidden');
      viewRegister.classList.add('hidden');
      viewOtp.classList.add('hidden');
    } else if (tab === 'register') {
      tabRegister.className = "flex-1 py-4 font-bold text-sm text-primary border-b-2 border-primary bg-surface transition-colors";
      tabLogin.className = "flex-1 py-4 font-medium text-sm text-on-surface-variant bg-surface-container-lowest hover:bg-surface transition-colors";
      viewRegister.classList.remove('hidden');
      viewLogin.classList.add('hidden');
      viewOtp.classList.add('hidden');
    }
  }

  if (tabLogin) tabLogin.addEventListener('click', () => switchTab('login'));
  if (tabRegister) tabRegister.addEventListener('click', () => switchTab('register'));

  // Password Visibility Toggle
  document.querySelectorAll('[data-toggle-password]').forEach(btn => {
    btn.addEventListener('click', () => {
      const inputId = btn.getAttribute('data-toggle-password');
      const input = document.getElementById(inputId);
      const icon = btn.querySelector('.material-symbols-outlined');
      if (input && icon) {
        if (input.type === 'password') {
          input.type = 'text';
          icon.textContent = 'visibility';
        } else {
          input.type = 'password';
          icon.textContent = 'visibility_off';
        }
      }
    });
  });

  // Login Submit -> Show OTP
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const identifier = document.getElementById('login-identifier').value.trim();
      if (!identifier) return;

      currentAuthIdentifier = identifier;
      if (otpMobileDisplay) {
        otpMobileDisplay.textContent = identifier;
      }

      viewLogin.classList.add('hidden');
      viewRegister.classList.add('hidden');
      viewOtp.classList.remove('hidden');

      tabLogin.className = "flex-1 py-4 font-medium text-sm text-on-surface-variant bg-surface-container-lowest cursor-default";
      tabRegister.className = "flex-1 py-4 font-medium text-sm text-on-surface-variant bg-surface-container-lowest cursor-default";

      // Focus first OTP box
      if (otpInputs.length > 0) {
        otpInputs[0].focus();
      }

      Store.showToast(`OTP 4321 sent to ${identifier}`, 'info');
    });
  }

  // Register Submit -> Show OTP
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const mobile = document.getElementById('reg-mobile').value.trim();
      const email = document.getElementById('reg-email').value.trim();

      const nameParts = name.split(' ');
      Store.updateUser({
        firstName: nameParts[0] || 'Customer',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: mobile,
        email: email
      });

      currentAuthIdentifier = mobile || email;
      if (otpMobileDisplay) {
        otpMobileDisplay.textContent = currentAuthIdentifier;
      }

      viewLogin.classList.add('hidden');
      viewRegister.classList.add('hidden');
      viewOtp.classList.remove('hidden');

      if (otpInputs.length > 0) {
        otpInputs[0].focus();
      }

      Store.showToast(`OTP 4321 sent to ${currentAuthIdentifier}`, 'info');
    });
  }

  // Auto-advance OTP inputs & Backspace
  otpInputs.forEach((input, index) => {
    input.addEventListener('keyup', (e) => {
      if (e.key === 'Backspace') {
        if (index > 0 && input.value.length === 0) {
          otpInputs[index - 1].focus();
        }
      } else if (/^[0-9]$/.test(e.key)) {
        input.value = e.key;
        if (index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
      if (/^\d{4}$/.test(pasteData)) {
        pasteData.split('').forEach((char, i) => {
          if (otpInputs[i]) otpInputs[i].value = char;
        });
        if (otpInputs[3]) otpInputs[3].focus();
      }
    });
  });

  // Verify OTP & Login
  if (otpForm) {
    otpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let otpCode = '';
      otpInputs.forEach(i => otpCode += i.value.trim());

      if (otpCode.length < 4) {
        Store.showToast('Please enter all 4 digits of the OTP', 'error');
        return;
      }

      Store.login(currentAuthIdentifier || '+91 98765 43210');
      
      const nextUrl = new URLSearchParams(window.location.search).get('redirect') || 'dashboard.html';
      setTimeout(() => {
        window.location.href = nextUrl;
      }, 600);
    });
  }

  // Back to Login
  if (backToLoginBtn) {
    backToLoginBtn.addEventListener('click', () => {
      switchTab('login');
    });
  }

  // Google Login Simulation
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
      Store.login('ramesh.kumar@gmail.com');
      const nextUrl = new URLSearchParams(window.location.search).get('redirect') || 'dashboard.html';
      setTimeout(() => {
        window.location.href = nextUrl;
      }, 500);
    });
  }
});
