document.addEventListener("DOMContentLoaded", () => {
  // Extract plan info from URL with improved error handling
  const urlParams = new URLSearchParams(window.location.search)
  const plan = urlParams.get("plan") || "الاشتراك الشهري"
  const price = urlParams.get("price") || "500"

  // Update plan info in the page with animation
  function updatePlanInfo() {
    const planNameElements = document.querySelectorAll("#plan-name")
    const planPriceElements = document.querySelectorAll("#plan-price, #total-amount, #vodafone-amount")

    planNameElements.forEach((el) => {
      if (el) {
        el.textContent = plan
        el.classList.add("fade-in")
      }
    })

    planPriceElements.forEach((el) => {
      if (el) {
        el.textContent = price + " جنيه مصري"
        el.classList.add("fade-in")
      }
    })
  }

  updatePlanInfo()

  // Payment timer
  function startPaymentTimer() {
    let timeLeft = 15 * 60 // 15 minutes in seconds
    const timerElement = document.querySelector(".timer")

    if (!timerElement) return

    const countdownInterval = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60)
      const seconds = timeLeft % 60
      timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

      if (timeLeft <= 0) {
        clearInterval(countdownInterval)
        timerElement.textContent = "00:00"
        timerElement.style.color = "var(--error-color)"

        // Show session expired message
        const expiredMessage = document.createElement("div")
        expiredMessage.className = "security-badge"
        expiredMessage.style.backgroundColor = "#fff0f0"
        expiredMessage.style.borderColor = "#ffcdd2"
        expiredMessage.style.color = "var(--error-color)"
        expiredMessage.innerHTML = `
          <i class="fas fa-exclamation-circle"></i>
          <p>انتهت مدة الجلسة. يرجى تحديث الصفحة للمتابعة.</p>
        `
        const paymentTimer = document.querySelector(".payment-timer")
        if (paymentTimer) {
          paymentTimer.parentNode.insertBefore(expiredMessage, paymentTimer.nextSibling)
        }
      }

      timeLeft--
    }, 1000)
  }

  startPaymentTimer()

  // Progress steps functionality
  function initProgressSteps() {
    const progressBar = document.getElementById("progress-bar")
    const steps = document.querySelectorAll(".progress-step")
    let currentStep = 1

    // Function to update progress
    window.updateProgress = (step) => {
      currentStep = step

      // Update progress bar width
      if (progressBar) {
        progressBar.style.width = `${((step - 1) / (steps.length - 1)) * 100}%`
      }

      // Update step circles and titles
      steps.forEach((stepEl, index) => {
        const stepNum = index + 1
        const circle = stepEl.querySelector(".step-circle")
        const title = stepEl.querySelector(".step-title")

        if (stepNum < step) {
          // Completed steps
          circle.classList.remove("active")
          circle.classList.add("completed")
          circle.innerHTML = '<i class="fas fa-check"></i>'

          title.classList.remove("active")
          title.classList.add("completed")
        } else if (stepNum === step) {
          // Current step
          circle.classList.add("active")
          circle.classList.remove("completed")
          circle.textContent = stepNum

          title.classList.add("active")
          title.classList.remove("completed")
        } else {
          // Future steps
          circle.classList.remove("active", "completed")
          circle.textContent = stepNum

          title.classList.remove("active", "completed")
        }
      })
    }
  }

  initProgressSteps()

  // Payment method switching with enhanced UX
  function initPaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]')
    const paymentForms = document.querySelectorAll(".payment-form")

    paymentMethods.forEach((method) => {
      method.addEventListener("change", function () {
        // Hide all forms with fade out
        paymentForms.forEach((form) => {
          form.style.opacity = "0"
          setTimeout(() => {
            form.classList.add("hidden")
          }, 300)
        })

        // Show selected form with fade in
        const selectedForm = document.getElementById(this.id + "-form")
        if (selectedForm) {
          setTimeout(() => {
            selectedForm.classList.remove("hidden")
            selectedForm.style.opacity = "0"

            // Trigger reflow
            void selectedForm.offsetWidth

            selectedForm.style.opacity = "1"
            selectedForm.style.transition = "opacity 0.5s ease"

            // Update progress steps
            window.updateProgress(2)
          }, 300)
        }
      })
    })

    // Back buttons functionality
    const backButtons = document.querySelectorAll("#back-button, #vodafone-back-button, #fawry-back-button")
    backButtons.forEach((button) => {
      button.addEventListener("click", () => {
        window.updateProgress(1)

        // Reset to credit card form
        document.getElementById("credit-card").checked = true

        // Hide all forms with fade out
        paymentForms.forEach((form) => {
          form.style.opacity = "0"
          setTimeout(() => {
            form.classList.add("hidden")
          }, 300)
        })

        // Show credit card form
        setTimeout(() => {
          const creditCardForm = document.getElementById("credit-card-form")
          creditCardForm.classList.remove("hidden")
          creditCardForm.style.opacity = "0"

          // Trigger reflow
          void creditCardForm.offsetWidth

          creditCardForm.style.opacity = "1"
          creditCardForm.style.transition = "opacity 0.5s ease"
        }, 300)
      })
    })
  }

  initPaymentMethods()

  // Credit card live preview
  function initCardPreview() {
    const cardNumber = document.getElementById("card-number")
    const cardHolder = document.getElementById("card-holder")
    const expiryDate = document.getElementById("expiry-date")

    const cardPreviewNumber = document.getElementById("card-preview-number")
    const cardPreviewHolder = document.getElementById("card-preview-holder")
    const cardPreviewExpiry = document.getElementById("card-preview-expiry")

    if (cardNumber && cardPreviewNumber) {
      cardNumber.addEventListener("input", function () {
        // Format the displayed number with spaces and mask all but last 4 digits
        const value = this.value.replace(/\s/g, "")
        if (value.length > 0) {
          let maskedValue = value.replace(/\d(?=\d{4})/g, "*")
          maskedValue = maskedValue.match(/.{1,4}/g)?.join(" ") || ""
          cardPreviewNumber.textContent = maskedValue
        } else {
          cardPreviewNumber.textContent = "**** **** **** ****"
        }
      })
    }

    if (cardHolder && cardPreviewHolder) {
      cardHolder.addEventListener("input", function () {
        cardPreviewHolder.textContent = this.value || "اسم صاحب البطاقة"
      })
    }

    if (expiryDate && cardPreviewExpiry) {
      expiryDate.addEventListener("input", function () {
        cardPreviewExpiry.textContent = this.value || "MM/YY"
      })
    }
  }

  initCardPreview()

  // Enhanced credit card input formatting and validation
  function initCardValidation() {
    const cardNumberInput = document.getElementById("card-number")
    if (cardNumberInput) {
      // Wrap input in validation wrapper
      wrapInputWithValidation(cardNumberInput)

      cardNumberInput.addEventListener("input", function (e) {
        // Remove non-digits and limit length
        let value = this.value.replace(/\D/g, "").substring(0, 16)

        // Add space after every 4 digits
        if (value.length > 0) {
          value = value.match(/.{1,4}/g).join(" ")
        }

        this.value = value

        // Validate card number visually
        validateCardNumber(value)
      })

      function validateCardNumber(value) {
        const inputWrapper = cardNumberInput.closest(".input-wrapper")
        const cardIcons = document.querySelectorAll(".card-icons i")
        const cleanValue = value.replace(/\s/g, "")
        const errorMessage = inputWrapper.querySelector(".error-message")

        // Reset all icons
        cardIcons.forEach((icon) => {
          icon.style.opacity = "0.3"
        })

        // Highlight appropriate card icon based on first digits
        if (cleanValue.startsWith("4")) {
          document.querySelector(".fa-cc-visa").style.opacity = "1"
        } else if (/^5[1-5]/.test(cleanValue)) {
          document.querySelector(".fa-cc-mastercard").style.opacity = "1"
        }

        // Add visual validation
        if (cleanValue.length >= 16 && luhnCheck(cleanValue)) {
          inputWrapper.classList.remove("invalid")
          inputWrapper.classList.add("valid")
          if (errorMessage) errorMessage.style.display = "none"
        } else if (cleanValue.length > 0) {
          inputWrapper.classList.remove("valid")
          if (cleanValue.length >= 16) {
            inputWrapper.classList.add("invalid")
            if (errorMessage) {
              errorMessage.textContent = "رقم البطاقة غير صالح"
              errorMessage.style.display = "block"
            }
          } else {
            inputWrapper.classList.remove("invalid")
            if (errorMessage) errorMessage.style.display = "none"
          }
        } else {
          inputWrapper.classList.remove("valid", "invalid")
          if (errorMessage) errorMessage.style.display = "none"
        }
      }
    }

    // Enhanced expiry date formatting and validation
    const expiryDateInput = document.getElementById("expiry-date")
    if (expiryDateInput) {
      // Wrap input in validation wrapper
      wrapInputWithValidation(expiryDateInput)

      expiryDateInput.addEventListener("input", function (e) {
        // Remove non-digits
        let value = this.value.replace(/\D/g, "")

        // Format as MM/YY
        if (value.length > 0) {
          // Handle month input
          if (value.length >= 1) {
            // Prevent month > 12
            if (value.charAt(0) > "1") {
              value = "0" + value.charAt(0)
            } else if (value.length >= 2 && value.charAt(0) === "1" && value.charAt(1) > "2") {
              value = "12" + value.substring(2)
            }
          }

          // Add slash after month
          if (value.length > 2) {
            value = value.substring(0, 2) + "/" + value.substring(2, 4)
          }
        }

        this.value = value

        // Validate expiry date
        validateExpiryDate(value)
      })

      function validateExpiryDate(value) {
        const inputWrapper = expiryDateInput.closest(".input-wrapper")
        const errorMessage = inputWrapper.querySelector(".error-message")

        if (value.length >= 5) {
          const parts = value.split("/")
          const month = Number.parseInt(parts[0], 10)
          const year = Number.parseInt("20" + parts[1], 10)

          const now = new Date()
          const currentYear = now.getFullYear()
          const currentMonth = now.getMonth() + 1

          if (year > currentYear || (year === currentYear && month >= currentMonth)) {
            inputWrapper.classList.remove("invalid")
            inputWrapper.classList.add("valid")
            if (errorMessage) errorMessage.style.display = "none"
          } else {
            inputWrapper.classList.remove("valid")
            inputWrapper.classList.add("invalid")
            if (errorMessage) {
              errorMessage.textContent = "تاريخ انتهاء الصلاحية غير صالح"
              errorMessage.style.display = "block"
            }
          }
        } else {
          inputWrapper.classList.remove("valid", "invalid")
          if (errorMessage) errorMessage.style.display = "none"
        }
      }
    }

    // CVV validation
    const cvvInput = document.getElementById("cvv")
    if (cvvInput) {
      // Wrap input in validation wrapper
      wrapInputWithValidation(cvvInput)

      cvvInput.addEventListener("input", function () {
        // Remove non-digits and limit length
        this.value = this.value.replace(/\D/g, "").substring(0, 3)

        const inputWrapper = this.closest(".input-wrapper")
        const errorMessage = inputWrapper.querySelector(".error-message")

        // Validate CVV
        if (this.value.length === 3) {
          inputWrapper.classList.remove("invalid")
          inputWrapper.classList.add("valid")
          if (errorMessage) errorMessage.style.display = "none"
        } else if (this.value.length > 0) {
          inputWrapper.classList.remove("valid", "invalid")
          if (errorMessage) errorMessage.style.display = "none"
        } else {
          inputWrapper.classList.remove("valid", "invalid")
          if (errorMessage) errorMessage.style.display = "none"
        }
      })
    }

    // Email validation
    const emailInput = document.getElementById("email")
    if (emailInput) {
      // Wrap input in validation wrapper
      wrapInputWithValidation(emailInput)

      emailInput.addEventListener("input", function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const inputWrapper = this.closest(".input-wrapper")
        const errorMessage = inputWrapper.querySelector(".error-message")

        if (emailRegex.test(this.value)) {
          inputWrapper.classList.remove("invalid")
          inputWrapper.classList.add("valid")
          if (errorMessage) errorMessage.style.display = "none"
        } else if (this.value.length > 0) {
          inputWrapper.classList.remove("valid")
          inputWrapper.classList.add("invalid")
          if (errorMessage) {
            errorMessage.textContent = "البريد الإلكتروني غير صالح"
            errorMessage.style.display = "block"
          }
        } else {
          inputWrapper.classList.remove("valid", "invalid")
          if (errorMessage) errorMessage.style.display = "none"
        }
      })
    }

    // Phone validation
    const phoneInput = document.getElementById("phone")
    if (phoneInput) {
      // Wrap input in validation wrapper
      wrapInputWithValidation(phoneInput)

      phoneInput.addEventListener("input", function () {
        // Format Egyptian phone number
        let value = this.value.replace(/\D/g, "")

        // Ensure starts with 01
        if (value.length > 0 && !value.startsWith("01")) {
          if (value.startsWith("1")) {
            value = "0" + value
          } else if (!value.startsWith("0")) {
            value = "01" + value
          }
        }

        this.value = value.substring(0, 11)

        const inputWrapper = this.closest(".input-wrapper")
        const errorMessage = inputWrapper.querySelector(".error-message")

        // Validate phone
        if (this.value.length === 11 && this.value.startsWith("01")) {
          inputWrapper.classList.remove("invalid")
          inputWrapper.classList.add("valid")
          if (errorMessage) errorMessage.style.display = "none"
        } else if (this.value.length > 0) {
          inputWrapper.classList.remove("valid")
          if (this.value.length >= 8) {
            inputWrapper.classList.add("invalid")
            if (errorMessage) {
              errorMessage.textContent = "رقم الهاتف غير صالح"
              errorMessage.style.display = "block"
            }
          } else {
            inputWrapper.classList.remove("invalid")
            if (errorMessage) errorMessage.style.display = "none"
          }
        } else {
          inputWrapper.classList.remove("valid", "invalid")
          if (errorMessage) errorMessage.style.display = "none"
        }
      })
    }
  }

  initCardValidation()

  // Helper function to wrap inputs with validation markup
  function wrapInputWithValidation(inputElement) {
    if (!inputElement.closest(".input-wrapper")) {
      const parent = inputElement.parentNode
      const wrapper = document.createElement("div")
      wrapper.className = "input-wrapper"

      // Create validation icons
      const validIcon = document.createElement("i")
      validIcon.className = "fas fa-check-circle validation-icon valid"

      const invalidIcon = document.createElement("i")
      invalidIcon.className = "fas fa-times-circle validation-icon invalid"

      // Create error message element
      const errorMessage = document.createElement("div")
      errorMessage.className = "error-message"

      // Replace input with wrapper
      parent.replaceChild(wrapper, inputElement)

      // Add elements to wrapper
      wrapper.appendChild(inputElement)
      wrapper.appendChild(validIcon)
      wrapper.appendChild(invalidIcon)
      wrapper.appendChild(errorMessage)
    }
  }

  // Luhn algorithm for credit card validation
  function luhnCheck(cardNumber) {
    if (!cardNumber) return false

    let sum = 0
    let shouldDouble = false

    // Loop through values starting from the rightmost digit
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = Number.parseInt(cardNumber.charAt(i))

      if (shouldDouble) {
        digit *= 2
        if (digit > 9) digit -= 9
      }

      sum += digit
      shouldDouble = !shouldDouble
    }

    return sum % 10 === 0
  }

  // Enhanced form submission with validation
  function initFormSubmission() {
    const paymentForm = document.getElementById("payment-form")
    if (paymentForm) {
      paymentForm.addEventListener("submit", (e) => {
        e.preventDefault()

        // Validate form
        if (validatePaymentForm()) {
          // Update progress step
          window.updateProgress(3)

          // Show loading state
          const submitButton = paymentForm.querySelector("button[type='submit']")
          const originalText = submitButton.innerHTML
          submitButton.disabled = true
          submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إتمام الدفع...'

          // Simulate payment processing (replace with actual payment gateway)
          setTimeout(() => {
            showSuccessMessage()
          }, 2000)
        }
      })
    }

    // Other payment confirmation buttons
    const confirmButtons = document.querySelectorAll(".payment-form:not(#credit-card-form) .pay-button")
    confirmButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Update progress step
        window.updateProgress(3)

        // Show loading state
        const originalText = button.innerHTML
        button.disabled = true
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التأكيد...'

        // Simulate processing
        setTimeout(() => {
          showSuccessMessage()
        }, 2000)
      })
    })
  }

  initFormSubmission()

  // Form validation
  function validatePaymentForm() {
    let isValid = true
    const activeForm = document.querySelector(".payment-form:not(.hidden)")

    if (activeForm.id === "credit-card-form") {
      const requiredFields = [
        { field: document.getElementById("card-holder"), minLength: 3 },
        { field: document.getElementById("card-number"), minLength: 19, validate: validateCardNumberField },
        { field: document.getElementById("expiry-date"), minLength: 5, validate: validateExpiryDateField },
        { field: document.getElementById("cvv"), minLength: 3 },
        { field: document.getElementById("email"), validate: validateEmail },
        { field: document.getElementById("phone"), minLength: 11, validate: validatePhone },
      ]

      requiredFields.forEach((item) => {
        if (!item.field) return

        const inputWrapper = item.field.closest(".input-wrapper")
        const errorMessage = inputWrapper ? inputWrapper.querySelector(".error-message") : null

        let fieldValid = true

        // Check if empty
        if (!item.field.value.trim()) {
          fieldValid = false
          if (errorMessage) {
            errorMessage.textContent = "هذا الحقل مطلوب"
            errorMessage.style.display = "block"
          }
        }
        // Check minimum length
        else if (item.minLength && item.field.value.length < item.minLength) {
          fieldValid = false
          if (errorMessage) {
            errorMessage.textContent = `يجب أن يكون الإدخال ${item.minLength} أحرف على الأقل`
            errorMessage.style.display = "block"
          }
        }
        // Run custom validation
        else if (item.validate && !item.validate(item.field.value)) {
          fieldValid = false
          // Error message is set in the validate function
        }

        if (!fieldValid) {
          isValid = false

          if (inputWrapper) {
            inputWrapper.classList.remove("valid")
            inputWrapper.classList.add("invalid")

            // Add shake animation
            inputWrapper.classList.add("shake-animation")
            setTimeout(() => {
              inputWrapper.classList.remove("shake-animation")
            }, 500)
          }
        }
      })
    } else if (activeForm.id === "vodafone-cash-form") {
      const vodafoneNumber = document.getElementById("vodafone-number")
      if (vodafoneNumber) {
        const inputWrapper = vodafoneNumber.closest(".input-wrapper")
        const errorMessage = inputWrapper ? inputWrapper.querySelector(".error-message") : null

        if (!vodafoneNumber.value.trim() || vodafoneNumber.value.length < 11) {
          isValid = false

          if (inputWrapper) {
            inputWrapper.classList.remove("valid")
            inputWrapper.classList.add("invalid")

            if (errorMessage) {
              errorMessage.textContent = "رقم هاتف فودافون غير صالح"
              errorMessage.style.display = "block"
            }

            // Add shake animation
            inputWrapper.classList.add("shake-animation")
            setTimeout(() => {
              inputWrapper.classList.remove("shake-animation")
            }, 500)
          }
        }
      }
    }

    return isValid
  }

  function validateCardNumberField(value) {
    const cleanValue = value.replace(/\s/g, "")
    return cleanValue.length === 16 && luhnCheck(cleanValue)
  }

  function validateExpiryDateField(value) {
    if (value.length < 5) return false

    const parts = value.split("/")
    const month = Number.parseInt(parts[0], 10)
    const year = Number.parseInt("20" + parts[1], 10)

    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    return year > currentYear || (year === currentYear && month >= currentMonth)
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  function validatePhone(phone) {
    return phone.length === 11 && phone.startsWith("01")
  }

  // Show success message
  function showSuccessMessage() {
    // Create success message with animations
    const successMessage = document.createElement("div")
    successMessage.className = "success-message"
    successMessage.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <h2>تمت عملية الدفع بنجاح!</h2>
      <p>شكراً لاشتراكك في صالة البدوي. تم إرسال تفاصيل الاشتراك إلى بريدك الإلكتروني.</p>
      <div class="button-group">
        <button class="secondary-button print-receipt">
          <i class="fas fa-print"></i> طباعة الإيصال
        </button>
        <a href="index.html" class="cta-button">العودة إلى الموقع</a>
      </div>
    `

    // Replace payment container with success message
    const paymentContainer = document.querySelector(".payment-container")
    paymentContainer.style.opacity = "0"

    setTimeout(() => {
      paymentContainer.innerHTML = ""
      paymentContainer.appendChild(successMessage)
      paymentContainer.style.opacity = "1"

      // Add print functionality
      const printButton = document.querySelector(".print-receipt")
      if (printButton) {
        printButton.addEventListener("click", () => {
          window.print()
        })
      }
    }, 300)
  }

  // Add Dark Mode Toggle
  function addDarkModeToggle() {
    const darkModeToggle = document.createElement("button")
    darkModeToggle.className = "dark-mode-toggle"
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'
    darkModeToggle.setAttribute("aria-label", "تبديل الوضع الليلي")

    document.body.appendChild(darkModeToggle)

    // Check for saved preference
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark")
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    }

    darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark")

      if (document.body.classList.contains("dark")) {
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'
        localStorage.setItem("darkMode", "enabled")
      } else {
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'
        localStorage.setItem("darkMode", "disabled")
      }
    })
  }

  addDarkModeToggle()

  // Add Accessibility Menu
  function addAccessibilityMenu() {
    const accessibilityMenu = document.createElement("div")
    accessibilityMenu.className = "accessibility-menu"
    accessibilityMenu.innerHTML = `
      <button class="accessibility-toggle" aria-label="خيارات إمكانية الوصول">
        <i class="fas fa-universal-access"></i>
      </button>
      <h3>إمكانية الوصول</h3>
      
      <div class="accessibility-option">
        <label>حجم الخط</label>
        <div class="font-size-controls">
          <button class="font-size-decrease" aria-label="تصغير حجم الخط">أ-</button>
          <button class="font-size-reset" aria-label="إعادة ضبط حجم الخط">أ</button>
          <button class="font-size-increase" aria-label="تكبير حجم الخط">أ+</button>
        </div>
      </div>
      
      <div class="accessibility-option">
        <div class="contrast-toggle">
          <label for="high-contrast">تباين عالي</label>
          <input type="checkbox" id="high-contrast">
        </div>
      </div>
    `

    document.body.appendChild(accessibilityMenu)

    // Toggle menu
    const accessibilityToggle = accessibilityMenu.querySelector(".accessibility-toggle")
    accessibilityToggle.addEventListener("click", () => {
      accessibilityMenu.classList.toggle("open")
    })

    // Font size controls
    const decreaseBtn = accessibilityMenu.querySelector(".font-size-decrease")
    const resetBtn = accessibilityMenu.querySelector(".font-size-reset")
    const increaseBtn = accessibilityMenu.querySelector(".font-size-increase")

    decreaseBtn.addEventListener("click", () => {
      document.body.classList.remove("larger-font")
      document.body.classList.remove("large-font")
      localStorage.setItem("fontSize", "normal")
    })

    resetBtn.addEventListener("click", () => {
      document.body.classList.remove("larger-font")
      document.body.classList.add("large-font")
      localStorage.setItem("fontSize", "large")
    })

    increaseBtn.addEventListener("click", () => {
      document.body.classList.remove("large-font")
      document.body.classList.add("larger-font")
      localStorage.setItem("fontSize", "larger")
    })

    // High contrast toggle
    const contrastToggle = document.getElementById("high-contrast")

    // Check for saved preferences
    if (localStorage.getItem("fontSize") === "large") {
      document.body.classList.add("large-font")
    } else if (localStorage.getItem("fontSize") === "larger") {
      document.body.classList.add("larger-font")
    }

    if (localStorage.getItem("highContrast") === "enabled") {
      document.body.classList.add("high-contrast")
      contrastToggle.checked = true
    }

    contrastToggle.addEventListener("change", () => {
      if (contrastToggle.checked) {
        document.body.classList.add("high-contrast")
        localStorage.setItem("highContrast", "enabled")
      } else {
        document.body.classList.remove("high-contrast")
        localStorage.setItem("highContrast", "disabled")
      }
    })
  }

  addAccessibilityMenu()

  // Add offline support
  window.addEventListener("online", () => {
    const offlineMessage = document.getElementById("offline-message")
    if (offlineMessage) {
      offlineMessage.remove()
    }
  })

  window.addEventListener("offline", () => {
    if (!document.getElementById("offline-message")) {
      const offlineMessage = document.createElement("div")
      offlineMessage.id = "offline-message"
      offlineMessage.style.position = "fixed"
      offlineMessage.style.top = "0"
      offlineMessage.style.left = "0"
      offlineMessage.style.width = "100%"
      offlineMessage.style.padding = "10px"
      offlineMessage.style.backgroundColor = "#f8d7da"
      offlineMessage.style.color = "#721c24"
      offlineMessage.style.textAlign = "center"
      offlineMessage.style.zIndex = "9999"
      offlineMessage.innerHTML = "أنت غير متصل بالإنترنت. يرجى التحقق من اتصالك."

      document.body.prepend(offlineMessage)
    }
  })

  // Add keyframe animations if not already in CSS
  if (!document.querySelector("style#payment-animations")) {
    const style = document.createElement("style")
    style.id = "payment-animations"
    style.textContent = `
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      
      .shake-animation {
        animation: shake 0.5s ease;
      }
    `
    document.head.appendChild(style)
  }
})

