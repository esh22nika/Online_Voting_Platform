// Function to get CSRF token from cookies
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

document.addEventListener('DOMContentLoaded', function() {
  const tabSignIn = document.getElementById('tabSignIn');
  const tabRegister = document.getElementById('tabRegister');
  const signinForm = document.getElementById('signinForm');
  const registerForm = document.getElementById('registerForm');
  const formTitle = document.getElementById('formTitle');
  const formSubtitle = document.getElementById('formSubtitle');
  const toggleText = document.getElementById('toggleText');
  const dobInput = document.getElementById('dob');
  const dobWarning = document.getElementById('dobWarning');

  // Debug: Log if elements are found - FIXED: Removed extra closing brace
  console.log('Elements found:', {
    tabSignIn: !!tabSignIn,
    tabRegister: !!tabRegister,
    signinForm: !!signinForm,
    registerForm: !!registerForm,
    formTitle: !!formTitle,
    formSubtitle: !!formSubtitle,
    toggleText: !!toggleText
  });

  // Check if all required elements exist
  if (!tabSignIn || !tabRegister || !signinForm || !registerForm || !formTitle || !formSubtitle || !toggleText) {
    console.error('Some elements are missing. Please check your HTML IDs.');
    return;
  }

  // Set max date for DOB to ensure 18+ age
  if (dobInput) {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    dobInput.max = eighteenYearsAgo.toISOString().split('T')[0];

    dobInput.addEventListener('change', function() {
      const selectedDate = new Date(this.value);
      const ageDiffMs = Date.now() - selectedDate.getTime();
      const ageDate = new Date(ageDiffMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);

      if (age < 18) {
        dobWarning.style.display = 'block';
      } else {
        dobWarning.style.display = 'none';
      }
    });
  }

  // Message display functions for approval system
  function showMessage(message, type = 'success', isPending = false) {
    let existingAlert = document.querySelector('.auth-alert');
    if (existingAlert) {
      existingAlert.remove();
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show auth-alert`;
    alertDiv.setAttribute('role', 'alert');
    
    let iconClass = type === 'success' ? 'check-circle' : (type === 'danger' ? 'exclamation-triangle' : 'info-circle');
    let icon = `<i class="bi bi-${iconClass} me-2"></i>`;
    
    if (isPending) {
      alertDiv.innerHTML = `
        ${icon}
        <strong>Login Successful!</strong><br>
        ${message}<br>
        <small class="text-muted">You will be redirected once your account is approved.</small>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;
    } else {
      alertDiv.innerHTML = `
        ${icon}${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;
    }

    // Insert the alert at the top of the auth card
    const authCard = document.querySelector('.auth-card') || document.querySelector('.card') || document.body;
    const welcomeText = authCard.querySelector('.welcome-text') || authCard.querySelector('.card-header') || authCard.firstChild;
    if (welcomeText) {
      authCard.insertBefore(alertDiv, welcomeText);
    } else {
      authCard.insertBefore(alertDiv, authCard.firstChild);
    }

    // Auto-hide success messages after 5 seconds
    if (type === 'success' && !isPending) {
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

  function switchForm(form) {
    hideMessage(); // Clear any messages when switching forms
    
    if (form === 'signin') {
      signinForm.style.display = 'block';
      registerForm.style.display = 'none';
      tabSignIn.classList.add('active');
      tabRegister.classList.remove('active');
      formTitle.textContent = 'Welcome Back';
      formSubtitle.textContent = 'Welcome back, please login to your account.';
      toggleText.innerHTML = 'Don\'t have an account? <span style="color: #007bff; cursor: pointer;">Create an Account</span>';
    } else {
      signinForm.style.display = 'none';
      registerForm.style.display = 'block';
      tabSignIn.classList.remove('active');
      tabRegister.classList.add('active');
      formTitle.textContent = 'Create Account';
      formSubtitle.textContent = 'Join DeshKaVote and participate in democratic elections.';
      toggleText.innerHTML = 'Already have an account? <span style="color: #007bff; cursor: pointer;">Sign In</span>';
    }
  }

  // Add click handlers with explicit function references
  tabSignIn.onclick = function() {
    console.log('Sign In tab clicked');
    switchForm('signin');
  };

  tabRegister.onclick = function() {
    console.log('Register tab clicked');
    switchForm('register');
  };

  toggleText.onclick = function() {
    console.log('Toggle text clicked');
    if (signinForm.style.display === 'none' || signinForm.style.display === '') {
      switchForm('signin');
    } else {
      switchForm('register');
    }
  };

  // Force initial state
  console.log('Setting initial state to signin');
  switchForm('signin');

  // Handle login form submission with enhanced error handling and approval system
  signinForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Login form submitted');
    hideMessage();
    
    // Get form elements - check both possible IDs for login form
    let voterIdInput = signinForm.querySelector('#voterId') || signinForm.querySelector('[name="voter_id"]') || signinForm.querySelector('input[type="text"]');
    let passwordInput = signinForm.querySelector('#password') || signinForm.querySelector('[name="password"]') || signinForm.querySelector('input[type="password"]');
    
    console.log('Found form elements:', {
      voterId: !!voterIdInput,
      password: !!passwordInput
    });
  
    if (!voterIdInput || !passwordInput) {
      console.error('Could not find login form inputs');
      showMessage('Form elements not found. Please refresh the page and try again.', 'danger');
      return;
    }

    const voterId = voterIdInput.value.trim();
    const password = passwordInput.value.trim();
    
    console.log('Form values:', {
      voterId: voterId ? 'Has value' : 'Empty',
      password: password ? 'Has value' : 'Empty'
    });

    // Basic validation
    if (!voterId || !password) {
      showMessage('Please fill in all fields', 'danger');
      return;
    }

    // Validate Voter ID format (3 letters followed by 7 digits)
    if (!/^[A-Z]{3}[0-9]{7}$/.test(voterId.toUpperCase())) {
      showMessage('Please enter a valid Voter ID (3 letters followed by 7 digits)', 'danger');
      return;
    }

    // Show loading state
    const submitButton = signinForm.querySelector('button[type="submit"]') || signinForm.querySelector('input[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent || submitButton.value : '';
    if (submitButton) {
      submitButton.disabled = true;
      if (submitButton.textContent !== undefined) {
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing in...';
      } else {
        submitButton.value = 'Logging in...';
      }
    }

    // Prepare data for JSON submission (supporting approval system)
    const data = {
      voterId: voterId.toUpperCase(),
      password: password,
      request_otp: true
    };

    console.log('Sending login request...');

    // Send login request with approval system support
    fetch('/login_user/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      return response.json();
    })
    .then(result => {
      console.log('Response result:', result);
      
      // Reset button state
      if (submitButton) {
        submitButton.disabled = false;
        if (submitButton.textContent !== undefined) {
          submitButton.textContent = originalButtonText;
        } else {
          submitButton.value = originalButtonText;
        }
      }

      if (result.success) {
        if (result.otp_required) {
          // Show OTP modal
          showOTPModal(voterId.toUpperCase(), result.mobile);
        } else if (result.redirect_url) {
          showMessage('Login successful! Redirecting...', 'success');
          setTimeout(() => {
            window.location.href = result.redirect_url;
          }, 1000);
        }
      } else {
        // Check if it's a pending approval case
        if (result.pending_approval) {
          showMessage(result.message, 'info', true);
        } else {
          showMessage(result.message, 'danger');
        }
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      
      // Reset button state
      if (submitButton) {
        submitButton.disabled = false;
        if (submitButton.textContent !== undefined) {
          submitButton.textContent = originalButtonText;
        } else {
          submitButton.value = originalButtonText;
        }
      }
      
      // Check if it's a network error or server error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showMessage('Network error. Please check your internet connection and try again.', 'danger');
      } else {
        showMessage('Login failed. Please try again.', 'danger');
      }
    });
  });

  // Add this new function for OTP verification
  function showOTPModal(voterId, mobile) {
    const modalHTML = `
      <div class="modal fade" id="otpModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">OTP Verification</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p>An OTP has been sent to your registered email address</p>
              <div class="mb-3">
                <label for="otpInput" class="form-label">Enter OTP</label>
                <input type="text" class="form-control" id="otpInput" placeholder="Enter 6-digit OTP" maxlength="6" pattern="[0-9]{6}">
                <div id="otpError" class="text-danger mt-2" style="display: none;"></div>
              </div>
              <p class="text-muted small">OTP is valid for 10 minutes. You have 3 attempts.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="verifyOtpBtn">Verify OTP</button>
            </div>
          </div>
        </div>
      </div>`;
    
    document.getElementById('otpModal')?.remove();
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const otpModal = new bootstrap.Modal(document.getElementById('otpModal'));
    otpModal.show();

    document.getElementById('verifyOtpBtn').addEventListener('click', function() {
      const otpInput = document.getElementById('otpInput');
      const otp = otpInput.value.trim();
      
      if (!/^[0-9]{6}$/.test(otp)) {
        document.getElementById('otpError').textContent = 'Please enter a valid 6-digit OTP';
        document.getElementById('otpError').style.display = 'block';
        return;
      }

      const verifyBtn = this;
      verifyBtn.disabled = true;
      verifyBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Verifying...';

      fetch('/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
          voterId: voterId,
          otp: otp
        })
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          otpModal.hide();
          showMessage('OTP verified! Redirecting...', 'success');
          setTimeout(() => {
            window.location.href = result.redirect_url;
          }, 1000);
        } else {
          document.getElementById('otpError').textContent = result.message;
          document.getElementById('otpError').style.display = 'block';
          verifyBtn.disabled = false;
          verifyBtn.textContent = 'Verify OTP';
        }
      })
      .catch(error => {
        console.error('OTP verification error:', error);
        document.getElementById('otpError').textContent = 'Error verifying OTP. Please try again.';
        document.getElementById('otpError').style.display = 'block';
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verify OTP';
      });
    });

    document.getElementById('otpInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        document.getElementById('verifyOtpBtn').click();
      }
    });
  }

  // --- Enhanced registration form validation logic ---
  function isValidEmail(email) {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  }

  // Create or get error message element
  function getOrCreateErrorElement(inputId) {
    let errorElement = document.getElementById(inputId + '-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = inputId + '-error';
      errorElement.className = 'error-message';
      errorElement.style.color = '#dc3545';
      errorElement.style.fontSize = '12px';
      errorElement.style.marginTop = '5px';
      errorElement.style.display = 'none';
      
      const input = document.getElementById(inputId);
      if (input && input.parentNode) {
        input.parentNode.insertBefore(errorElement, input.nextSibling);
      }
    }
    return errorElement;
  }

  function markField(input, isValid, message = '') {
    const errorElement = getOrCreateErrorElement(input.id);
    
    input.classList.remove('is-valid', 'is-invalid');
    input.style.removeProperty('border-color');
    input.style.removeProperty('box-shadow');
    
    if (isValid) {
      input.classList.add('is-valid');
      input.style.borderColor = '#28a745';
      input.style.boxShadow = '0 0 0 0.2rem rgba(40, 167, 69, 0.25)';
      input.setCustomValidity('');
      errorElement.style.display = 'none';
      errorElement.textContent = '';
    } else {
      input.classList.add('is-invalid');
      input.style.borderColor = '#dc3545';
      input.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
      input.setCustomValidity(message);
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  // Real-time validation setup
  function setupRealTimeValidation() {
    const validations = [
      { id: 'firstName', test: val => /^[A-Za-z]{2,}$/.test(val), msg: 'First name must be at least 2 letters long and contain only alphabets.' },
      { id: 'lastName', test: val => val.trim() !== '', msg: 'Last name cannot be empty.' },
      { id: 'email', test: isValidEmail, msg: 'Enter a valid email (e.g. user@example.com).' },
      { id: 'mobile', test: val => /^[6-9]\d{9}$/.test(val), msg: 'Mobile must be 10 digits and start with 6/7/8/9.' },
      { id: 'dob', test: val => {
        if (!val) return false;
        const dob = new Date(val);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        return age > 18 || (age === 18 && today >= new Date(dob.setFullYear(dob.getFullYear() + 18)));
      }, msg: 'You must be at least 18 years old.' },
      { id: 'gender', test: val => val !== '', msg: 'Please select a gender.' },
      { id: 'parentSpouseName', test: val => val.trim() !== '', msg: 'This field cannot be empty.' },
      { id: 'streetAddress', test: val => val.trim() !== '', msg: 'Address cannot be empty.' },
      { id: 'city', test: val => val.trim() !== '', msg: 'City cannot be empty.' },
      { id: 'state', test: val => val !== '', msg: 'Please select a state.' },
      { id: 'pincode', test: val => /^[1-9][0-9]{5}$/.test(val), msg: 'Pincode must be 6 digits starting with non-zero.' },
      { id: 'placeOfBirth', test: val => val.trim() !== '', msg: 'Place of birth cannot be empty.' },
      { id: 'registerVoterId', test: val => /^[A-Z]{3}[0-9]{7}$/.test(val), msg: 'Voter ID must be in format: 3 letters followed by 7 digits.' },
      { id: 'aadharNumber', test: val => /^\d{12}$/.test(val), msg: 'Aadhar must be a 12-digit number.' },
      { id: 'panNumber', test: val => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val), msg: 'PAN must be in format: 5 letters, 4 digits, 1 letter.' },
      { id: 'registerPassword', test: val => val.length >= 6, msg: 'Password must be at least 6 characters.' },
      { id: 'confirmPassword', test: val => {
        const password = document.getElementById('registerPassword').value;
        return val === password && val.length >= 6;
      }, msg: 'Passwords must match and be at least 6 characters.' }
    ];

    // Add event listeners for real-time validation
    validations.forEach(({ id, test, msg }) => {
      const input = document.getElementById(id);
      if (input) {
        // Validate on blur (when user leaves field)
        input.addEventListener('blur', function() {
          if (this.value.trim() !== '' || this.type === 'date') {
            const isValid = test(this.value.trim());
            markField(this, isValid, msg);
          }
        });

        // Validate on input for certain fields
        if (['registerPassword', 'confirmPassword'].includes(id)) {
          input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
              const isValid = test(this.value.trim());
              markField(this, isValid, msg);
              
              // Also validate confirm password when password changes
              if (id === 'registerPassword') {
                const confirmPasswordInput = document.getElementById('confirmPassword');
                if (confirmPasswordInput && confirmPasswordInput.value.trim() !== '') {
                  const confirmValidation = validations.find(v => v.id === 'confirmPassword');
                  const confirmIsValid = confirmValidation.test(confirmPasswordInput.value.trim());
                  markField(confirmPasswordInput, confirmIsValid, confirmValidation.msg);
                }
              }
            }
          });
        }
      }
    });

    return validations;
  }

  const validations = setupRealTimeValidation();

  // Check if all fields are valid
  function isFormValid() {
    let isValid = true;
    validations.forEach(({ id, test, msg }) => {
      const input = document.getElementById(id);
      if (input) {
        const fieldValid = test(input.value.trim());
        if (!fieldValid) {
          isValid = false;
        }
      }
    });
    return isValid;
  }

  // Update submit button state
  function updateSubmitButton() {
    const submitButton = registerForm.querySelector('button[type="submit"]') || registerForm.querySelector('input[type="submit"]');
    if (submitButton) {
      const formValid = isFormValid();
      submitButton.disabled = !formValid;
      submitButton.style.opacity = formValid ? '1' : '0.6';
      submitButton.style.cursor = formValid ? 'pointer' : 'not-allowed';
    }
  }

  // Add input listeners to update submit button state
  validations.forEach(({ id }) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', updateSubmitButton);
      input.addEventListener('change', updateSubmitButton);
    }
  });

  // Registration form submission handler
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    hideMessage();
    
    console.log('=== REGISTRATION FORM SUBMISSION DEBUG ===');
    
    // Check if all input elements exist
    const fieldIds = ['firstName', 'lastName', 'email', 'mobile', 'dob', 'gender', 
                     'parentSpouseName', 'streetAddress', 'city', 'state', 'pincode', 
                     'placeOfBirth', 'registerVoterId', 'aadharNumber', 'panNumber', 'registerPassword'];
    
    console.log('Checking if all fields exist:');
    fieldIds.forEach(id => {
        const element = document.getElementById(id);
        console.log(`${id}: ${element ? 'EXISTS' : 'MISSING'} - Value: ${element ? element.value : 'N/A'}`);
    });
    
    let isFormValidCheck = true;

    // Validate all fields one final time
    validations.forEach(({ id, test, msg }) => {
        const input = document.getElementById(id);
        if (input) {
            const isValid = test(input.value.trim());
            markField(input, isValid, msg);
            if (!isValid) {
                console.log(`Validation failed for ${id}: ${msg}`);
                isFormValidCheck = false;
            }
        }
    });

    if (!isFormValidCheck) {
        showMessage('Please fix all validation errors before submitting.', 'danger');
        const firstInvalidField = registerForm.querySelector('.is-invalid');
        if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalidField.focus();
        }
        return;
    }

    console.log('Form validation passed, preparing submission...');

    // Show loading state
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Registering...';

    // Create FormData
    console.log('\n=== Creating FormData ===');
    const formData = new FormData();
    
    // Manually add each field
    formData.append('firstName', document.getElementById('firstName').value);
    formData.append('lastName', document.getElementById('lastName').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('mobile', document.getElementById('mobile').value);
    formData.append('dob', document.getElementById('dob').value);
    formData.append('gender', document.getElementById('gender').value);
    formData.append('parentSpouseName', document.getElementById('parentSpouseName').value);
    formData.append('streetAddress', document.getElementById('streetAddress').value);
    formData.append('city', document.getElementById('city').value);
    formData.append('state', document.getElementById('state').value);
    formData.append('pincode', document.getElementById('pincode').value);
    formData.append('placeOfBirth', document.getElementById('placeOfBirth').value);
    formData.append('voterId', document.getElementById('registerVoterId').value);
    formData.append('aadharNumber', document.getElementById('aadharNumber').value);
    formData.append('panNumber', document.getElementById('panNumber').value);
    formData.append('password', document.getElementById('registerPassword').value);
    
    // Add files
    const aadharDoc = document.getElementById('aadhar_document');
    const panDoc = document.getElementById('pan_document');
    const voterIdDoc = document.getElementById('voter_id_document');
    
    if (aadharDoc && aadharDoc.files[0]) {
        formData.append('aadhar_document', aadharDoc.files[0]);
    }
    if (panDoc && panDoc.files[0]) {
        formData.append('pan_document', panDoc.files[0]);
    }
    if (voterIdDoc && voterIdDoc.files[0]) {
        formData.append('voter_id_document', voterIdDoc.files[0]);
    }
    
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    console.log('\n=== SENDING REQUEST ===');

    // Send registration request
    fetch('/register/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: formData
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.json();
    })
    .then(result => {
        console.log('Server response:', result);
        
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;

        if (result.success) {
            showMessage(result.message, 'success');
            setTimeout(() => {
                switchForm('signin');
                registerForm.reset();
                // Clear validation states
                document.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
                    el.classList.remove('is-valid', 'is-invalid');
                    el.style.removeProperty('border-color');
                    el.style.removeProperty('box-shadow');
                });
            }, 2000);
        } else {
            showMessage(result.message, 'danger');
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        showMessage('Registration failed. Please try again.', 'danger');
    });
  });

// CLOSING BRACE FOR DOMContentLoaded - Make sure this is at the end!
});