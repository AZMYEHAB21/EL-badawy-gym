document.addEventListener("DOMContentLoaded", () => {
  // Add touch feedback for interactive elements
  const interactiveElements = document.querySelectorAll(
    '[role="button"], button, .cta-button, .nav-links a, .service-card, .membership-card, .gallery-item',
  )

  interactiveElements.forEach((element) => {
    element.addEventListener(
      "touchstart",
      function (e) {
        this.style.transform = "scale(0.98)"
      },
      { passive: true },
    )

    element.addEventListener(
      "touchend",
      function (e) {
        this.style.transform = ""
      },
      { passive: true },
    )
  })

  // إضافة خاصية target="_blank" للروابط الخارجية
  function setupExternalLinks() {
    // الروابط التي تحتاج للفتح في تبويب جديد (الروابط الخارجية وصفحات الموقع الأخرى)
    const externalLinks = document.querySelectorAll('a:not([href^="#"])')

    externalLinks.forEach((link) => {
      // تجنب تعديل روابط القائمة الداخلية
      if (!link.closest(".nav-links") || link.classList.contains("login-button")) {
        link.setAttribute("target", "_blank")

        // إضافة rel="noopener noreferrer" للأمان عند فتح روابط خارجية
        if (link.getAttribute("href").startsWith("http")) {
          link.setAttribute("rel", "noopener noreferrer")
        }
      }
    })

    // إضافة target="_blank" لزر تسجيل الدخول بشكل خاص
    const loginButton = document.querySelector(".login-button")
    if (loginButton) {
      loginButton.setAttribute("target", "_blank")
    }

    // إضافة target="_blank" لزر الاتجاهات على الخريطة
    const directionsButton = document.querySelector(".map-container .cta-button")
    if (directionsButton) {
      directionsButton.setAttribute("target", "_blank")
      directionsButton.setAttribute("rel", "noopener noreferrer")
    }

    // إضافة target="_blank" لأزرار الاشتراك
    const subscribeButtons = document.querySelectorAll(".subscribe-btn")
    subscribeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const card = this.closest(".membership-card")
        const plan = card.getAttribute("data-plan")
        const price = card.getAttribute("data-price")

        // فتح صفحة الدفع في تبويب جديد
        const paymentUrl = `payment.html?plan=${encodeURIComponent(plan)}&price=${encodeURIComponent(price)}`
        window.open(paymentUrl, "_blank")

        // منع السلوك الافتراضي للزر
        return false
      })
    })
  }

  // تشغيل دالة إعداد الروابط الخارجية
  setupExternalLinks()

  // Page loader
  const pageLoader = document.querySelector(".page-loader")
  if (pageLoader) {
    window.addEventListener("load", () => {
      pageLoader.style.opacity = "0"
      setTimeout(() => {
        pageLoader.style.display = "none"
      }, 500)
    })
  }

  // Navigation functionality with improved animations
  const navSlide = () => {
    const burger = document.querySelector(".burger")
    const nav = document.querySelector(".nav-links")
    const navLinks = document.querySelectorAll(".nav-links li")

    burger.addEventListener("click", () => {
      // Toggle Nav
      nav.classList.toggle("nav-active")

      // Animate Links with staggered delay
      navLinks.forEach((link, index) => {
        if (link.style.animation) {
          link.style.animation = ""
        } else {
          link.style.animation = `fadeInRight 0.5s ease forwards ${index / 7 + 0.3}s`
        }
      })

      // Burger Animation
      burger.classList.toggle("toggle")
    })

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (nav.classList.contains("nav-active") && !nav.contains(e.target) && !burger.contains(e.target)) {
        nav.classList.remove("nav-active")
        burger.classList.remove("toggle")

        navLinks.forEach((link) => {
          link.style.animation = ""
        })
      }
    })
  }

  navSlide()

  // Header scroll effect with enhanced animation
  const header = document.querySelector("header")
  const backToTopButton = document.getElementById("back-to-top")

  function handleScroll() {
    if (window.scrollY > 100) {
      header.classList.add("header-scrolled")
    } else {
      header.classList.remove("header-scrolled")
    }

    // Animate elements when they come into view
    animateOnScroll()
  }

  window.addEventListener("scroll", handleScroll)

  // Improved smooth scrolling with easing function
  function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition
    let startTime = null

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const scrollY = easeInOutCubic(timeElapsed, startPosition, distance, duration)
      window.scrollTo(0, scrollY)

      if (timeElapsed < duration) {
        requestAnimationFrame(animation)
      }
    }

    // Cubic easing for more natural motion
    function easeInOutCubic(t, b, c, d) {
      t /= d / 2
      if (t < 1) return (c / 2) * t * t * t + b
      t -= 2
      return (c / 2) * (t * t * t + 2) + b
    }

    requestAnimationFrame(animation)
  }

  // Back to top button with smooth scrolling
  if (backToTopButton) {
    backToTopButton.style.display = "none"
  }

  // Enhanced smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        // Close mobile menu if open
        const nav = document.querySelector(".nav-links")
        const burger = document.querySelector(".burger")
        if (nav.classList.contains("nav-active")) {
          nav.classList.remove("nav-active")
          burger.classList.remove("toggle")
        }

        // Calculate position accounting for fixed header
        const headerHeight = document.querySelector("header").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20

        smoothScrollTo(targetPosition, 800)
      }
    })
  })

  // Form validation with improved UX
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    // Add input event listeners for real-time validation
    const formInputs = contactForm.querySelectorAll("input, select, textarea")
    formInputs.forEach((input) => {
      input.addEventListener("input", () => {
        validateInput(input)
      })

      // Add focus/blur effects
      input.addEventListener("focus", () => {
        input.parentElement.classList.add("focused")
      })

      input.addEventListener("blur", () => {
        input.parentElement.classList.remove("focused")
        validateInput(input)
      })
    })

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      if (validateForm()) {
        // Show loading state
        const submitButton = contactForm.querySelector("button[type='submit']")
        const originalText = submitButton.innerHTML
        submitButton.disabled = true
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...'

        // Use EmailJS to send the form
        emailjs
          .sendForm("service_id", "template_id", contactForm)
          .then(() => {
            // Show success message
            const formContainer = contactForm.parentElement
            const successMessage = document.createElement("div")
            successMessage.className = "success-message"
            successMessage.innerHTML = `
              <i class="fas fa-check-circle"></i>
              <h3>تم إرسال رسالتك بنجاح!</h3>
              <p>شكراً للتواصل معنا. سنرد عليك في أقرب وقت ممكن.</p>
              <button class="cta-button mt-3">العودة</button>
            `

            formContainer.innerHTML = ""
            formContainer.appendChild(successMessage)

            // Reset form on "back" button click
            const backButton = successMessage.querySelector(".cta-button")
            backButton.addEventListener("click", () => {
              formContainer.innerHTML = ""
              formContainer.appendChild(contactForm)
              contactForm.reset()
              submitButton.disabled = false
              submitButton.innerHTML = originalText
            })
          })
          .catch((error) => {
            // Show error message
            submitButton.disabled = false
            submitButton.innerHTML = originalText
            alert("حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.")
          })
      }
    })

    function validateInput(input) {
      const errorElement = document.getElementById(`${input.id}-error`)
      if (!errorElement) return

      if (input.validity.valid) {
        errorElement.style.display = "none"
        input.classList.remove("invalid")
      } else {
        showError(input, errorElement)
      }
    }

    function showError(input, errorElement, message) {
      errorElement.textContent = message || getDefaultErrorMessage(input)
      errorElement.style.display = "block"
      input.classList.add("invalid")
    }

    function getDefaultErrorMessage(input) {
      if (input.validity.valueMissing) {
        return "هذا الحقل مطلوب"
      } else if (input.validity.typeMismatch) {
        return "الرجاء إدخال قيمة صحيحة"
      } else if (input.validity.tooShort) {
        return `يجب أن يكون الإدخال ${input.minLength} أحرف على الأقل`
      } else {
        return "هذا الحقل غير صالح"
      }
    }

    function validateForm() {
      let isValid = true
      formInputs.forEach((input) => {
        if (!input.validity.valid) {
          isValid = false
          const errorElement = document.getElementById(`${input.id}-error`)
          if (errorElement) {
            showError(input, errorElement)
          }
        }
      })

      // Additional custom validation
      const email = document.getElementById("email")
      const phone = document.getElementById("phone")
      const message = document.getElementById("message")

      if (email && !isValidEmail(email.value)) {
        isValid = false
        showError(email, document.getElementById("email-error"), "يرجى إدخال بريد إلكتروني صحيح")
      }

      if (phone && !isValidPhone(phone.value)) {
        isValid = false
        showError(phone, document.getElementById("phone-error"), "يرجى إدخال رقم هاتف صحيح (11 رقم)")
      }

      if (message && message.value.length < 10) {
        isValid = false
        showError(message, document.getElementById("message-error"), "يجب أن تكون الرسالة 10 أحرف على الأقل")
      }

      return isValid
    }

    function isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }

    function isValidPhone(phone) {
      const re = /^01[0-9]{9}$/
      return re.test(phone)
    }
  }

  // Enhanced gallery with lightbox
  const galleryImages = document.querySelectorAll(".gallery-img")
  galleryImages.forEach((img) => {
    // Add lazy loading
    img.loading = "lazy"

    // Add click event for lightbox
    img.addEventListener("click", () => {
      createLightbox(img.src, img.alt)
    })
  })

  function createLightbox(imgSrc, imgAlt) {
    // Create lightbox container
    const lightbox = document.createElement("div")
    lightbox.className = "lightbox"
    lightbox.style.position = "fixed"
    lightbox.style.top = "0"
    lightbox.style.left = "0"
    lightbox.style.width = "100%"
    lightbox.style.height = "100%"
    lightbox.style.backgroundColor = "rgba(0, 0, 0, 0.9)"
    lightbox.style.display = "flex"
    lightbox.style.justifyContent = "center"
    lightbox.style.alignItems = "center"
    lightbox.style.zIndex = "9999"
    lightbox.style.opacity = "0"
    lightbox.style.transition = "opacity 0.3s ease"
    lightbox.style.backdropFilter = "blur(5px)"

    // Create image element
    const lightboxImg = document.createElement("img")
    lightboxImg.src = imgSrc
    lightboxImg.alt = imgAlt || "صورة معرض صالة البدوي"
    lightboxImg.style.maxWidth = "90%"
    lightboxImg.style.maxHeight = "90%"
    lightboxImg.style.borderRadius = "5px"
    lightboxImg.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)"
    lightboxImg.style.transform = "scale(0.9)"
    lightboxImg.style.transition = "transform 0.3s ease"

    // Create close button
    const closeBtn = document.createElement("button")
    closeBtn.innerHTML = "&times;"
    closeBtn.style.position = "absolute"
    closeBtn.style.top = "20px"
    closeBtn.style.right = "30px"
    closeBtn.style.color = "white"
    closeBtn.style.fontSize = "40px"
    closeBtn.style.background = "none"
    closeBtn.style.border = "none"
    closeBtn.style.cursor = "pointer"
    closeBtn.style.zIndex = "10000"
    closeBtn.style.transition = "transform 0.3s ease"
    closeBtn.setAttribute("aria-label", "إغلاق")

    // Create download button
    const downloadBtn = document.createElement("a")
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> تحميل'
    downloadBtn.style.position = "absolute"
    downloadBtn.style.bottom = "20px"
    downloadBtn.style.padding = "10px 20px"
    downloadBtn.style.backgroundColor = "var(--primary-color)"
    downloadBtn.style.color = "white"
    downloadBtn.style.borderRadius = "5px"
    downloadBtn.style.textDecoration = "none"
    downloadBtn.style.cursor = "pointer"
    downloadBtn.style.zIndex = "10000"
    downloadBtn.style.transition = "transform 0.3s ease, background-color 0.3s ease"
    downloadBtn.href = imgSrc
    downloadBtn.download = "elbadawy-gym-" + new Date().getTime() + ".jpg"
    downloadBtn.setAttribute("aria-label", "تحميل الصورة")

    // Add elements to DOM
    lightbox.appendChild(lightboxImg)
    lightbox.appendChild(closeBtn)
    lightbox.appendChild(downloadBtn)
    document.body.appendChild(lightbox)

    // Prevent scrolling when lightbox is open
    document.body.style.overflow = "hidden"

    // Animate lightbox appearance
    setTimeout(() => {
      lightbox.style.opacity = "1"
      lightboxImg.style.transform = "scale(1)"
    }, 10)

    // Close lightbox on click
    lightbox.addEventListener("click", (e) => {
      if (e.target !== lightboxImg && e.target !== downloadBtn) {
        lightboxImg.style.transform = "scale(0.9)"
        lightbox.style.opacity = "0"

        setTimeout(() => {
          document.body.removeChild(lightbox)
          document.body.style.overflow = ""
        }, 300)
      }
    })

    // Close on escape key
    document.addEventListener("keydown", function escHandler(e) {
      if (e.key === "Escape") {
        lightboxImg.style.transform = "scale(0.9)"
        lightbox.style.opacity = "0"

        setTimeout(() => {
          document.body.removeChild(lightbox)
          document.body.style.overflow = ""
          document.removeEventListener("keydown", escHandler)
        }, 300)
      }
    })
  }

  // Animate elements on scroll
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect()
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 && rect.bottom >= 0
  }

  function animateOnScroll() {
    // Animate service cards
    const serviceCards = document.querySelectorAll(".service-card")
    serviceCards.forEach((card, index) => {
      if (isElementInViewport(card) && !card.classList.contains("animated")) {
        card.classList.add("animated", "fade-in-up")
        card.style.animationDelay = `${index * 0.1}s`
      }
    })

    // Animate membership cards
    const membershipCards = document.querySelectorAll(".membership-card")
    membershipCards.forEach((card, index) => {
      if (isElementInViewport(card) && !card.classList.contains("animated")) {
        card.classList.add("animated", "fade-in-up")
        card.style.animationDelay = `${index * 0.1}s`
      }
    })

    // Animate schedule cards
    const scheduleCards = document.querySelectorAll(".schedule-card")
    scheduleCards.forEach((card, index) => {
      if (isElementInViewport(card) && !card.classList.contains("animated")) {
        card.classList.add("animated", "fade-in-up")
        card.style.animationDelay = `${index * 0.1}s`
      }
    })

    // Animate gallery items
    const galleryItems = document.querySelectorAll(".gallery-item")
    galleryItems.forEach((item, index) => {
      if (isElementInViewport(item) && !item.classList.contains("animated")) {
        item.classList.add("animated", "fade-in")
        item.style.animationDelay = `${index * 0.05}s`
      }
    })
  }

  // Run animation check on load and scroll
  window.addEventListener("load", animateOnScroll)
  window.addEventListener("scroll", animateOnScroll)

  // Membership subscription handling with enhanced UX
  const subscribeButtons = document.querySelectorAll(".subscribe-btn")
  subscribeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const card = this.closest(".membership-card")
      const plan = card.getAttribute("data-plan")
      const price = card.getAttribute("data-price")

      // Add click animation
      this.classList.add("pulse-animation")
      setTimeout(() => {
        this.classList.remove("pulse-animation")
      }, 500)

      // Open payment page
      const paymentUrl = `payment.html?plan=${encodeURIComponent(plan)}&price=${encodeURIComponent(price)}`
      window.location.href = paymentUrl
    })

    // Add hover effect
    button.addEventListener("mouseenter", function () {
      const card = this.closest(".membership-card")
      card.style.transform = "translateY(-15px)"
      card.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.15)"
    })

    button.addEventListener("mouseleave", function () {
      const card = this.closest(".membership-card")
      if (!card.classList.contains("featured")) {
        card.style.transform = ""
      } else {
        card.style.transform = "scale(1.05)"
      }
      card.style.boxShadow = ""
    })
  })

  // Login form validation
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    const usernameInput = document.getElementById("username")
    const passwordInput = document.getElementById("password")

    // Add input event listeners for real-time validation
    if (usernameInput && passwordInput) {
      ;[usernameInput, passwordInput].forEach((input) => {
        input.addEventListener("input", () => {
          validateLoginInput(input)
        })

        input.addEventListener("focus", () => {
          input.parentElement.style.borderColor = "var(--primary-color)"
          input.parentElement.style.boxShadow = "0 0 0 3px rgba(230, 57, 70, 0.2)"
        })

        input.addEventListener("blur", () => {
          input.parentElement.style.borderColor = ""
          input.parentElement.style.boxShadow = ""
          validateLoginInput(input)
        })
      })
    }

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      let isValid = true

      // Validate username
      if (usernameInput && !usernameInput.value.trim()) {
        document.getElementById("usernameError").style.display = "block"
        usernameInput.parentElement.classList.add("shake-animation")
        setTimeout(() => {
          usernameInput.parentElement.classList.remove("shake-animation")
        }, 500)
        isValid = false
      }

      // Validate password
      if (passwordInput && !passwordInput.value.trim()) {
        document.getElementById("passwordError").style.display = "block"
        passwordInput.parentElement.classList.add("shake-animation")
        setTimeout(() => {
          passwordInput.parentElement.classList.remove("shake-animation")
        }, 500)
        isValid = false
      }

      if (isValid) {
        // Show loading state
        const loginButton = loginForm.querySelector(".login-button")
        const originalText = loginButton.innerHTML
        loginButton.disabled = true
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الدخول...'

        // Simulate login (replace with actual login)
        setTimeout(() => {
          // Show success message
          const loginContainer = loginForm.parentElement
          const successMessage = document.createElement("div")
          successMessage.className = "success-message"
          successMessage.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 60px; color: var(--primary-color); margin-bottom: 20px;"></i>
            <h2>تم تسجيل الدخول بنجاح!</h2>
            <p>سيتم تحويلك إلى الصفحة الرئيسية...</p>
          `

          loginContainer.innerHTML = ""
          loginContainer.appendChild(successMessage)

          // Redirect to home page
          setTimeout(() => {
            window.location.href = "index.html"
          }, 2000)
        }, 1500)
      }
    })

    function validateLoginInput(input) {
      const errorId = input.id + "Error"
      const errorElement = document.getElementById(errorId)

      if (!errorElement) return

      if (input.value.trim()) {
        errorElement.style.display = "none"
      } else {
        errorElement.style.display = "block"
      }
    }
  }

  // Payment form handling
  const paymentForm = document.getElementById("payment-form")
  if (paymentForm) {
    // Extract plan info from URL
    const urlParams = new URLSearchParams(window.location.search)
    const plan = urlParams.get("plan")
    const price = urlParams.get("price")

    // Update plan info in the page
    if (plan && price) {
      const planNameElements = document.querySelectorAll("#plan-name")
      const planPriceElements = document.querySelectorAll("#plan-price, #total-amount, #vodafone-amount")

      planNameElements.forEach((el) => {
        if (el) el.textContent = plan
      })

      planPriceElements.forEach((el) => {
        if (el) el.textContent = price + " جنيه مصري"
      })
    }

    // Payment method switching
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]')
    const paymentForms = document.querySelectorAll(".payment-form")

    paymentMethods.forEach((method) => {
      method.addEventListener("change", function () {
        // Hide all forms
        paymentForms.forEach((form) => {
          form.classList.add("hidden")
        })

        // Show selected form with animation
        const selectedForm = document.getElementById(this.id + "-form")
        if (selectedForm) {
          selectedForm.classList.remove("hidden")
          selectedForm.style.animation = "fadeIn 0.5s ease-out"
        }
      })
    })

    // Credit card formatting
    const cardNumberInput = document.getElementById("card-number")
    if (cardNumberInput) {
      cardNumberInput.addEventListener("input", function () {
        // Remove non-digits
        let value = this.value.replace(/\D/g, "")

        // Add space after every 4 digits
        if (value.length > 0) {
          value = value.match(/.{1,4}/g).join(" ")
        }

        this.value = value
      })
    }

    // Expiry date formatting
    const expiryDateInput = document.getElementById("expiry-date")
    if (expiryDateInput) {
      expiryDateInput.addEventListener("input", function () {
        // Remove non-digits
        let value = this.value.replace(/\D/g, "")

        // Add / after month
        if (value.length > 2) {
          value = value.substring(0, 2) + "/" + value.substring(2, 4)
        }

        this.value = value
      })
    }

    // Form submission
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Show loading state
      const submitButton = paymentForm.querySelector("button[type='submit']")
      const originalText = submitButton.innerHTML
      submitButton.disabled = true
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الدفع...'

      // Simulate payment processing
      setTimeout(() => {
        showPaymentSuccess()
      }, 2000)
    })

    // Other payment buttons
    const otherPayButtons = document.querySelectorAll(".payment-form:not(#credit-card-form) .pay-button")
    otherPayButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Show loading state
        const originalText = button.innerHTML
        button.disabled = true
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التأكيد...'

        // Simulate processing
        setTimeout(() => {
          showPaymentSuccess()
        }, 2000)
      })
    })

    function showPaymentSuccess() {
      // Create success message
      const successMessage = document.createElement("div")
      successMessage.className = "success-message"
      successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h2>تمت عملية الدفع بنجاح!</h2>
        <p>شكراً لاشتراكك في صالة البدوي. تم إرسال تفاصيل الاشتراك إلى بريدك الإلكتروني.</p>
        <button class="cta-button" style="margin-top: 20px;" onclick="window.location.href='index.html'">العودة إلى الموقع</button>
      `

      // Replace payment container with success message
      const paymentContainer = document.querySelector(".payment-container")
      paymentContainer.innerHTML = ""
      paymentContainer.appendChild(successMessage)
    }
  }

  // Logo animation
  const logo = document.getElementById("logo")
  if (logo) {
    logo.addEventListener("mouseover", function () {
      this.style.transform = "scale(1.1) rotate(5deg)"
      this.style.transition = "transform 0.3s ease"
    })

    logo.addEventListener("mouseout", function () {
      this.style.transform = "scale(1) rotate(0deg)"
    })
  }

  // Add parallax effect to hero section
  const hero = document.querySelector(".hero")
  if (hero) {
    window.addEventListener("scroll", () => {
      const scrollPosition = window.pageYOffset
      if (scrollPosition < window.innerHeight) {
        hero.style.backgroundPositionY = scrollPosition * 0.5 + "px"
      }
    })
  }

  // Add typing animation to hero text
  const heroTitle = document.querySelector(".hero h1")
  const heroText = document.querySelector(".hero p")

  if (heroTitle && heroText) {
    // Add animation classes
    heroTitle.classList.add("fade-in-up")
    heroText.classList.add("fade-in-up")
    heroText.style.animationDelay = "0.3s"

    // Add animation to CTA button
    const ctaButton = document.querySelector(".hero .cta-button")
    if (ctaButton) {
      ctaButton.classList.add("fade-in-up")
      ctaButton.style.animationDelay = "0.6s"
    }
  }

  // إضافة خاصية target="_blank" لروابط وسائل التواصل الاجتماعي
  const socialLinks = document.querySelectorAll(".social-icons a")
  socialLinks.forEach((link) => {
    link.setAttribute("target", "_blank")
    link.setAttribute("rel", "noopener noreferrer")
  })

  // إضافة خاصية target="_blank" لروابط القائمة السريعة في الفوتر
  const footerLinks = document.querySelectorAll('.footer-section a:not([href^="#"])')
  footerLinks.forEach((link) => {
    link.setAttribute("target", "_blank")
  })

  // إضافة الوظائف الجديدة
  enhanceMembershipSection()
  addGalleryDownloadFeature()

  // إضافة تأثيرات CSS للانيميشن
  addAnimationStyles()

  // Initialize animations on page load
  window.addEventListener("load", () => {
    // Trigger animations for elements above the fold
    animateOnScroll()

    // Remove page loader if exists
    const pageLoader = document.querySelector(".page-loader")
    if (pageLoader) {
      pageLoader.style.opacity = "0"
      setTimeout(() => {
        pageLoader.style.display = "none"
      }, 500)
    }
  })
})

// Add keyframe animations if not already in CSS
if (!document.querySelector("style#animation-styles")) {
  const style = document.createElement("style")
  style.id = "animation-styles"
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
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.5);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .shake-animation {
      animation: shake 0.5s ease;
    }
    
    .pulse-animation {
      animation: pulse 1s infinite;
    }
  `
  document.head.appendChild(style)
}

// Add keyframe animation for navLinkFade
if (!document.querySelector("style#nav-animations")) {
  const style = document.createElement("style")
  style.id = "nav-animations"
  style.textContent = `
    @keyframes navLinkFade {
      from {
        opacity: 0;
        transform: translateX(50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `
  document.head.appendChild(style)
}

// إضافة تأثيرات حركية متقدمة لقسم العضوية
function enhanceMembershipSection() {
  const membershipCards = document.querySelectorAll(".membership-card")

  // إضافة تأثيرات حركية متقدمة للبطاقات
  membershipCards.forEach((card, index) => {
    // إضافة تأثير الظهور التدريجي مع تأخير مختلف لكل بطاقة
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    card.style.transition = `all 0.6s ease ${index * 0.2}s`

    // إضافة تأثير التكبير عند التحويم
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.03)"
      this.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.15)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
      this.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)"
    })

    // إضافة تأثير نبض للزر عند التحويم
    const subscribeBtn = card.querySelector(".subscribe-btn")
    if (subscribeBtn) {
      subscribeBtn.addEventListener("mouseenter", function () {
        this.classList.add("pulse-animation")
      })

      subscribeBtn.addEventListener("mouseleave", function () {
        this.classList.remove("pulse-animation")
      })
    }

    // إضافة تأثير تمييز للميزات عند التحويم على البطاقة
    const features = card.querySelectorAll("ul li")
    features.forEach((feature) => {
      card.addEventListener("mouseenter", () => {
        feature.style.transform = "translateX(5px)"
        feature.style.transition = "transform 0.3s ease"
      })

      card.addEventListener("mouseleave", () => {
        feature.style.transform = "translateX(0)"
      })
    })
  })

  // إضافة تأثير ظهور البطاقات عند التمرير
  function showMembershipCards() {
    membershipCards.forEach((card) => {
      const cardPosition = card.getBoundingClientRect().top
      const screenPosition = window.innerHeight / 1.2

      if (cardPosition < screenPosition) {
        card.style.opacity = "1"
        card.style.transform = "translateY(0)"
      }
    })
  }

  // تشغيل الدالة عند التمرير وعند تحميل الصفحة
  window.addEventListener("scroll", showMembershipCards)
  window.addEventListener("load", showMembershipCards)

  // إضافة تأثير تمييز للبطاقة المميزة (إذا وجدت)
  const featuredCard = document.querySelector('.membership-card[data-featured="true"]')
  if (featuredCard) {
    featuredCard.classList.add("featured-card")

    // إضافة شارة "الأكثر شعبية"
    const badge = document.createElement("div")
    badge.className = "popular-badge"
    badge.textContent = "الأكثر شعبية"
    featuredCard.appendChild(badge)
  }
}

// إضافة إمكانية تحميل الصور من المعرض
function addGalleryDownloadFeature() {
  const galleryImages = document.querySelectorAll(".gallery-img")

  galleryImages.forEach((img) => {
    // إضافة حاوية للصورة إذا لم تكن موجودة
    if (!img.parentElement.classList.contains("gallery-item")) {
      const parent = img.parentElement
      const wrapper = document.createElement("div")
      wrapper.className = "gallery-item"
      parent.replaceChild(wrapper, img)
      wrapper.appendChild(img)
    }

    // إضافة زر التحميل
    const downloadBtn = document.createElement("button")
    downloadBtn.className = "download-btn"
    downloadBtn.innerHTML = '<i class="fas fa-download"></i>'
    downloadBtn.title = "تحميل الصورة"

    // إضافة الزر إلى حاوية الصورة
    const imgContainer = img.parentElement
    imgContainer.style.position = "relative"
    imgContainer.appendChild(downloadBtn)

    // إضافة وظيفة التحميل المحسنة
    downloadBtn.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()

      // استخدام fetch للتحميل
      fetch(img.src)
        .then((response) => response.blob())
        .then((blob) => {
          const blobUrl = window.URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = blobUrl
          link.download = "elbadawy-gym-" + new Date().getTime() + ".jpg"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(blobUrl) // تحرير الذاكرة
        })
        .catch((error) => {
          console.error("خطأ في تحميل الصورة:", error)
          // طريقة التحميل البديلة
          window.open(img.src, "_blank")
        })
    })
  })

  // إضافة أنماط CSS للأزرار
  if (!document.querySelector("style#gallery-styles")) {
    const style = document.createElement("style")
    style.id = "gallery-styles"
    style.textContent = `
      .gallery-item {
        position: relative;
        overflow: hidden;
        border-radius: 8px;
        transition: transform 0.3s ease;
        cursor: pointer;
      }
      
      .gallery-item:hover {
        transform: scale(1.03);
      }
      
      .download-btn {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background-color: var(--primary-color, #ffd700);
        color: var(--secondary-color, #1a1a1a);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        border: none;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 10;
      }
      
      .gallery-item:hover .download-btn {
        opacity: 1;
      }
      
      .download-btn:hover {
        opacity: 1;
        transform: scale(1.1);
      }
      
      .gallery-img {
        transition: transform 0.3s ease;
        width: 100%;
        height: auto;
        display: block;
      }
      
      .gallery-item:hover .gallery-img {
        transform: scale(1.05);
      }
    `
    document.head.appendChild(style)
  }
}

// إضافة أنماط CSS للتأثيرات الحركية
function addAnimationStyles() {
  if (!document.querySelector("style#animation-styles")) {
    const style = document.createElement("style")
    style.id = "animation-styles"
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
        }
      }
      
      .pulse-animation {
        animation: pulse 1s infinite;
      }
      
      .featured-card {
        border: 2px solid var(--primary-color);
        transform: scale(1.05);
      }
      
      .popular-badge {
        position: absolute;
        top: -10px;
        right: 10px;
        background-color: var(--primary-color);
        color: var(--secondary-color);
        padding: 5px 15px;
        border-radius: 20px;
        font-weight: bold;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        z-index: 1;
      }
      
      .download-btn {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background-color: var(--primary-color);
        color: var(--secondary-color);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        border: none;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 2;
      }
      
      .gallery-img:hover + .download-btn,
      .download-btn:hover {
        opacity: 1;
      }
      
      .gallery-item {
        position: relative;
        overflow: hidden;
        border-radius: 8px;
        transition: transform 0.3s ease;
      }
      
      .gallery-item:hover {
        transform: scale(1.03);
      }
      
      .gallery-item:hover .download-btn {
        opacity: 1;
      }
      
      /* تأثيرات إضافية لقسم العضوية */
      .membership-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .membership-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
      }
      
      .membership-card .price {
        transition: color 0.3s ease, transform 0.3s ease;
      }
      
      .membership-card:hover .price {
        color: var(--primary-color);
        transform: scale(1.1);
      }
      
      /* تحسين مظهر صندوق العرض */
      .enhanced-lightbox {
        backdrop-filter: blur(5px);
      }
    `
    document.head.appendChild(style)
  }
}

// Declare emailjs variable
var emailjs = {
  sendForm: (service_id, template_id, form) => {
    console.warn(
      "EmailJS is not properly integrated.  Using mock implementation.  Ensure EmailJS script is included in your HTML.",
    )
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ status: 200, text: "OK" })
      }, 500) // Simulate a network request
    })
  },
}

// تشغيل وظيفة تحميل الصور عند تحميل المستند
function setupImageDownload() {
  const galleryImages = document.querySelectorAll(".gallery-img")
  galleryImages.forEach((img) => {
    img.addEventListener("click", (e) => {
      e.preventDefault()
      window.open(img.src, "_blank")
    })
  })
}

document.addEventListener("DOMContentLoaded", setupImageDownload)

