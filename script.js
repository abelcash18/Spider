// ============ SPIDER CURSOR ANIMATION ============
const spider = document.getElementById('spider');
let mouseX = 0, mouseY = 0;
let posX = 0, posY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - 15;
    mouseY = e.clientY - 15;
});

function animateSpider() {
    posX += (mouseX - posX) * 0.25;
    posY += (mouseY - posY) * 0.25;
    
    spider.style.left = posX + 'px';
    spider.style.top = posY + 'px';
    
    requestAnimationFrame(animateSpider);
}

animateSpider();

// Spider click effect
document.addEventListener('click', () => {
    spider.style.transform = 'scale(1.8) rotate(20deg)';
    setTimeout(() => spider.style.transform = 'scale(1) rotate(0deg)', 200);
});

// ============ USER STORAGE & DATA ============
const users = JSON.parse(localStorage.getItem('users')) || {};

// ============ TOAST NOTIFICATIONS ============
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============ WAIT FOR DOM TO LOAD ============
document.addEventListener('DOMContentLoaded', () => {

// ============ LOGIN FORM ============
const loginForm = document.getElementById('loginForm');
const loginBtn = loginForm?.querySelector('.btn-login');
const loginBox = document.getElementById('loginBox');
const profileBox = document.getElementById('profileBox');
let currentUser = null;

// Check if user is already logged in
function checkLoggedInUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        showProfile();
    }
}

// Show profile
function showProfile() {
    if (!currentUser) return;
    
    const allUsers = JSON.parse(localStorage.getItem('users')) || {};
    const userData = allUsers[currentUser];
    
    if (userData) {
        document.getElementById('welcomeMsg').textContent = `Welcome, ${currentUser}! 🕷️`;
        document.getElementById('profileUsername').textContent = currentUser;
        document.getElementById('profileEmail').textContent = userData.email;
        document.getElementById('profileCreated').textContent = userData.createdAt;
        
        loginBox.style.display = 'none';
        profileBox.style.display = 'block';
    }
}

// Show login
function showLogin() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    loginBox.style.display = 'block';
    profileBox.style.display = 'none';
    loginForm.reset();
}

// Logout button
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        showToast('Logged out successfully! 👋', 'success');
        showLogin();
    });
}

// Delete account button
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete account "${currentUser}"? This cannot be undone.`)) {
            const allUsers = JSON.parse(localStorage.getItem('users')) || {};
            delete allUsers[currentUser];
            localStorage.setItem('users', JSON.stringify(allUsers));
            showToast('Account deleted successfully', 'success');
            showLogin();
        }
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!username || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        const currentUsers = JSON.parse(localStorage.getItem('users')) || {};
        
        // Check credentials
        if (currentUsers[username] && currentUsers[username].password === password) {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';
            
            spider.style.transform = 'scale(2)';
            
            setTimeout(() => {
                currentUser = username;
                localStorage.setItem('currentUser', username);
                showToast(`Welcome back, ${username}! 🕷️`, 'success');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login';
                spider.style.transform = 'scale(1)';
                showProfile();
            }, 1500);
        } else {
            showToast('Invalid username or password', 'error');
        }
    });
}

// ============ PASSWORD VISIBILITY TOGGLE ============
const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.getElementById('password');

if (togglePassword) {
    togglePassword.addEventListener('click', (e) => {
        e.preventDefault();
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });
}

// ============ MODAL FUNCTIONALITY ============
const signupModal = document.getElementById('signupModal');
const resetModal = document.getElementById('resetModal');

function closeAllModals() {
    signupModal?.classList.remove('active');
    resetModal?.classList.remove('active');
}

function openModal(modal) {
    closeAllModals();
    modal?.classList.add('active');
}

// Open modals
const signupBtn = document.getElementById('signupBtn');
const forgotBtn = document.getElementById('forgotBtn');

if (signupBtn) {
    signupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(signupModal);
    });
}

if (forgotBtn) {
    forgotBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(resetModal);
    });
}

// Close modal buttons
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
});

// Close modal on background click
[signupModal, resetModal].forEach(modal => {
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeAllModals();
    });
});

// ============ SIGN UP FORM ============
const signupForm = document.getElementById('signupForm');
const strengthMeter = document.getElementById('strengthMeter');
const signupPassword = document.getElementById('signupPassword');

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    
    strengthMeter.className = 'password-strength';
    if (strength === 0) strengthMeter.classList.add('weak');
    else if (strength <= 2) strengthMeter.classList.add('weak');
    else if (strength <= 3) strengthMeter.classList.add('medium');
    else strengthMeter.classList.add('strong');
}

if (signupPassword) {
    signupPassword.addEventListener('input', (e) => {
        checkPasswordStrength(e.target.value);
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newUsername = document.getElementById('signupUsername').value.trim();
        const newEmail = document.getElementById('signupEmail').value.trim();
        const newPassword = document.getElementById('signupPassword').value.trim();
        const confirmPass = document.getElementById('confirmPassword').value.trim();
        
        // Validation
        if (!newUsername || !newEmail || !newPassword) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (newUsername.length < 3) {
            showToast('Username must be at least 3 characters', 'error');
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
            showToast('Please enter a valid email', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        
        if (newPassword !== confirmPass) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        const allUsers = JSON.parse(localStorage.getItem('users')) || {};
        
        if (allUsers[newUsername]) {
            showToast('Username already exists', 'error');
            return;
        }
        
        // Save user
        allUsers[newUsername] = {
            email: newEmail,
            password: newPassword,
            createdAt: new Date().toLocaleString()
        };
        localStorage.setItem('users', JSON.stringify(allUsers));
        
        showToast(`Account created successfully! 🎉`, 'success');
        signupForm.reset();
        strengthMeter.className = 'password-strength';
        
        setTimeout(() => {
            closeAllModals();
            // Auto-login after signup
            currentUser = newUsername;
            localStorage.setItem('currentUser', newUsername);
            showProfile();
        }, 1500);
    });
}

// ============ PASSWORD RESET FORM ============
const resetForm = document.getElementById('resetForm');

if (resetForm) {
    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('resetEmail').value.trim();
        
        if (!email) {
            showToast('Please enter your email', 'error');
            return;
        }
        
        // Find user by email
        const allUsers = JSON.parse(localStorage.getItem('users')) || {};
        const userExists = Object.values(allUsers).some(user => user.email === email);
        
        if (!userExists) {
            showToast('No account found with this email', 'error');
            return;
        }
        
        showToast('Reset link sent to your email! 📧', 'success');
        resetForm.reset();
        
        setTimeout(() => {
            closeAllModals();
        }, 1500);
    });
}

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
});

// Check if user is already logged in on page load
checkLoggedInUser();

}); // End DOMContentLoaded