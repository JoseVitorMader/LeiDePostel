
function normalizeEmail(email) {
    if (!email) return '';
    
    let normalized = email.trim();
    
    normalized = normalized.toLowerCase();
    
    return normalized;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    return password && password.length >= 6;
}

function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    input.classList.add('error');
    input.classList.remove('success');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    announceToScreenReader(message);
}

function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    input.classList.remove('error');
    errorElement.classList.remove('show');
    errorElement.textContent = '';
}


function markAsValid(fieldId) {
    const input = document.getElementById(fieldId);
    input.classList.add('success');
    input.classList.remove('error');
}





function announceToScreenReader(message) {
    const announcer = document.getElementById('aria-announcer');
    announcer.textContent = message;
    
    setTimeout(() => {
        announcer.textContent = '';
    }, 1000);
}



const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginForm = document.getElementById('loginForm');


let emailTimeout;
emailInput.addEventListener('input', function(e) {
    clearTimeout(emailTimeout);
    
    emailTimeout = setTimeout(() => {
        const originalEmail = e.target.value;
        const normalizedEmail = normalizeEmail(originalEmail);
        
        clearError('email');
        
        if (originalEmail.trim()) {
            showNormalizedPreview(normalizedEmail);
            
            if (!isValidEmail(normalizedEmail)) {
                showError('email', 'E-mail inválido. Use o formato: nome@exemplo.com');
            } else {
                markAsValid('email');
            }
        } else {
            document.getElementById('email-normalized').classList.remove('show');
        }
    }, 500); 
});

let passwordTimeout;
passwordInput.addEventListener('input', function(e) {
    clearTimeout(passwordTimeout);
    
    passwordTimeout = setTimeout(() => {
        const password = e.target.value;
        
        clearError('password');
        
        if (password) {
            if (!isValidPassword(password)) {
                showError('password', 'A senha deve ter pelo menos 6 caracteres.');
            } else {
                markAsValid('password');
            }
        }
    }, 500);
});

emailInput.addEventListener('focus', function() {
    if (this.classList.contains('error') && this.value.trim()) {
        clearError('email');
    }
});

passwordInput.addEventListener('focus', function() {
    if (this.classList.contains('error') && this.value) {
        clearError('password');
    }
});


loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const originalEmail = emailInput.value;
    const password = passwordInput.value;
    
    const normalizedEmail = normalizeEmail(originalEmail);
    
    clearError('email');
    clearError('password');
    
    let hasError = false;
    
    if (!normalizedEmail) {
        showError('email', 'Por favor, digite seu e-mail.');
        hasError = true;
    } else if (!isValidEmail(normalizedEmail)) {
        showError('email', 'E-mail inválido. Use o formato: nome@exemplo.com');
        hasError = true;
    }
    
    if (!password) {
        showError('password', 'Por favor, digite sua senha.');
        hasError = true;
    } else if (!isValidPassword(password)) {
        showError('password', 'A senha deve ter pelo menos 6 caracteres.');
        hasError = true;
    }
    
    if (hasError) {
        announceToScreenReader('Há erros no formulário. Por favor, corrija-os.');
        return;
    }
    
    simulateLogin(normalizedEmail, password);
});

function simulateLogin(email, password) {
    const submitButton = document.querySelector('.btn-login');
    
    submitButton.disabled = true;
    submitButton.textContent = 'Entrando...';
    
    setTimeout(() => {
        const correctEmail = 'usuario@exemplo.com';
        const correctPassword = 'senha123';
        
        if (email === correctEmail && password === correctPassword) {
            submitButton.textContent = '✓ Sucesso!';
            submitButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            announceToScreenReader('Login realizado com sucesso!');
            
            setTimeout(() => {
                alert('Login realizado com sucesso!\n\nE-mail normalizado: ' + email);
            }, 1500);
            
        } else if (email === correctEmail && password !== correctPassword) {
            submitButton.disabled = false;
            submitButton.textContent = 'Entrar';
            showError('password', 'Senha incorreta. Verifique e tente novamente.');
            passwordInput.value = '';
            passwordInput.focus();
            
        } else {
            submitButton.disabled = false;
            submitButton.textContent = 'Entrar';
            showError('email', 'E-mail não encontrado. Verifique e tente novamente.');
            emailInput.focus();
        }
    }, 1500);
}

