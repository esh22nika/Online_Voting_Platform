// static/js/candidate-auth.js

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function showMessage(message, type = 'success') {
  let existingAlert = document.querySelector('.auth-alert');
  if (existingAlert) {
    existingAlert.remove();
  }

  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show auth-alert`;
  alertDiv.setAttribute('role', 'alert');
  
  let iconClass = type === 'success' ? 'check-circle' : (type === 'danger' ? 'exclamation-triangle' : 'info-circle');
  alertDiv.innerHTML = `
    <i class="fas fa-${iconClass} me-2"></i>${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  const authCard = document.querySelector('.auth-card');
  const welcomeText = authCard.querySelector('.welcome-text');
  authCard.insertBefore(alertDiv, welcomeText);

  if (type === 'success') {
    setTimeout(() => {
      if (alertDiv && alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 5000);
  }
}

function hideMessage() {
  const existingAlert = document.querySelector('.auth-alert');
  if (existingAlert) {
    existingAlert.remove();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const tabSignIn = document.getElementById('tabSignIn');
  const tabRegister = document.getElementById('tabRegister');
  const signinForm = document.getElementById('signinForm');
  const registerForm = document.getElementById('registerForm');
  const formTitle = document.getElementById('formTitle');
  const formSubtitle = document.getElementById('formSubtitle');
  const toggleText = document.getElementById('toggleText');

  function switchForm(form) {
    hideMessage();
    
    if (form === 'signin') {
      signinForm.style.display = 'block';
      registerForm.style.display = 'none';
      tabSignIn.classList.add('active');
      tabRegister.classList.remove('active');
      formTitle.textContent = 'Candidate Portal';
      formSubtitle.textContent = 'Login to your candidate account';
      toggleText.innerHTML = 'Don\'t have an account? <span style="color: #007bff; cursor: pointer;">Register as Candidate</span>';
    } else {
      signinForm.style.display = 'none';
      registerForm.style.display = 'block';
      tabSignIn.classList.remove('active');
      tabRegister.classList.add('active');
      formTitle.textContent = 'Candidate Registration';
      formSubtitle.textContent = 'Register to participate in elections';
      toggleText.innerHTML = 'Already have an account? <span style="color: #007bff; cursor: pointer;">Sign In</span>';
    }
  }

  tabSignIn.onclick = () => switchForm('signin');
  tabRegister.onclick = () => switchForm('register');
  toggleText.onclick = () => {
    if (signinForm.style.display === 'none') {
      switchForm('signin');
    } else {
      switchForm('register');
    }
  };

  switchForm('signin');

  // Login form submission
  signinForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    hideMessage();
    
    const candidateId = document.getElementById('candidateId').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!candidateId || !password) {
      showMessage('Please fill in all fields', 'danger');
      return;
    }

    const submitButton = signinForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing in...';

    try {
      const response = await fetch('/candidate-login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          candidate_id: candidateId,
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        showMessage(data.message, 'success');
        setTimeout(() => {
          window.location.href = data.redirect_url;
        }, 1000);
      } else {
        showMessage(data.message, 'danger');
      }
    } catch (error) {
      console.error('Login error:', error);
      showMessage('Login failed. Please try again.', 'danger');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });

  // Registration form submission
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    hideMessage();

    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      showMessage('Passwords do not match', 'danger');
      return;
    }

    if (password.length < 6) {
      showMessage('Password must be at least 6 characters', 'danger');
      return;
    }

    const submitButton = registerForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Registering...';

    const formData = new FormData(registerForm);

    try {
      const response = await fetch('/candidate-register/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        showMessage(data.message, 'success');
        setTimeout(() => {
          switchForm('signin');
          registerForm.reset();
        }, 2000);
      } else {
        showMessage(data.message, 'danger');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showMessage('Registration failed. Please try again.', 'danger');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
});