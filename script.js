document.addEventListener("DOMContentLoaded", () => {
  // التنقل والقائمة للشاشات الصغيرة
  const navSlide = () => {
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links li");

    burger.addEventListener("click", () => {
      // تبديل القائمة
      nav.classList.toggle("nav-active");

      // تحريك الروابط
      navLinks.forEach((link, index) => {
        if (link.style.animation) {
          link.style.animation = "";
          
        } else {
          link.style.animation = `navLinkFade 0.5s ease forwards ${
            index / 7 + 0.3
          }s`;
        }
      });

      // تحريك زر البرجر
      burger.classList.toggle("toggle");
    });
    let links__nav = document.querySelectorAll(".nav-links li a");
    links__nav.forEach((el) => {
      el.addEventListener("click", () => {
        nav.classList.remove("nav-active");
        burger.classList.remove("toggle");
      });
    })
  };

  navSlide();

  // التمرير السلس للروابط الداخلية
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // التحقق من صحة النموذج وإرساله
  const form = document.getElementById("contact-form");
  const formInputs = form.querySelectorAll("input, select, textarea");

  formInputs.forEach((input) => {
    input.addEventListener("input", () => {
      validateInput(input);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm()) {
      // هنا يمكنك إضافة كود لإرسال بيانات النموذج إلى الخادم
      alert("تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.");
      form.reset();
    }
  });

  function validateInput(input) {
    const errorElement = document.getElementById(`${input.id}-error`);
    if (input.validity.valid) {
      errorElement.textContent = "";
      input.classList.remove("invalid");
    } else {
      showError(input, errorElement);
    }
  }

  function showError(input, errorElement, message) {
    errorElement.textContent = message || "هذا الحقل مطلوب";
    input.classList.add("invalid");
  }

  function validateForm() {
    let isValid = true;
    formInputs.forEach((input) => {
      if (!input.validity.valid) {
        isValid = false;
        showError(input, document.getElementById(`${input.id}-error`));
      }
    });

    // التحقق من الشروط الإضافية
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;

    if (!email.includes("@")) {
      isValid = false;
      showError(
        document.getElementById("email"),
        document.getElementById("email-error"),
        "يجب أن يحتوي البريد الإلكتروني على @"
      );
    }

    if (phone.length < 10) {
      isValid = false;
      showError(
        document.getElementById("phone"),
        document.getElementById("phone-error"),
        "يجب أن يكون رقم الهاتف 10 أرقام على الأقل"
      );
    }

    if (message.length < 10) {
      isValid = false;
      showError(
        document.getElementById("message"),
        document.getElementById("message-error"),
        "يجب أن تكون الرسالة 10 أحرف على الأقل"
      );
    }

    return isValid;
  }

  // تهيئة الخريطة
  const map = L.map("map").setView([24.7136, 46.6753], 13); // إحداثيات الرياض، السعودية

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([24.7136, 46.6753])
    .addTo(map)
    .bindPopup("صالة البدوي الرياضية")
    .openPopup();

  // معرض الصور المصغر
  // const galleryImages = document.querySelectorAll(".gallery-img");
  // galleryImages.forEach((img) => {
  //   img.addEventListener("click", () => {
  //     const lightbox = document.createElement("div");
  //     lightbox.id = "lightbox";
  //     document.body.appendChild(lightbox);

  //     const lightboxImage = document.createElement("img");
  //     lightboxImage.src = img.src;
  //     lightbox.appendChild(lightboxImage);

  //     lightbox.addEventListener("click", () => {
  //       document.body.removeChild(lightbox);
  //     });
  //   });
  // });

  // تحريك الخدمات عند التمرير
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".service-card, .membership-card, .trainer-card"
    );
    elements.forEach((element) => {
      if (isElementInViewport(element)) {
        element.classList.add("animate", "fade-in-up");
      }
    });
  };

  window.addEventListener("scroll", animateOnScroll);
  window.addEventListener("load", animateOnScroll);

  // العد التنازلي للعرض الخاص
  const countDownDate = new Date("2023-12-31T23:59:59").getTime();
  const countdownElement = document.getElementById("countdown");

  const countdownTimer = setInterval(() => {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    if (distance < 0) {
      clearInterval(countdownTimer);
      countdownElement.innerHTML = "انتهى العرض";
    }
  }, 1000);
  // زر العودة إلى الأعلى
  const backToTopButton = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 100) {
      backToTopButton.classList.remove("hidden");
    } else {
      backToTopButton.classList.add("hidden");
    }
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // تحسين تأثيرات التمرير
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function handleScrollAnimation() {
    const elements = document.querySelectorAll(
      ".service-card, .membership-card, .trainer-card"
    );
    elements.forEach((el) => {
      if (isElementInViewport(el)) {
        el.classList.add("animate", "fade-in-up");
      }
    });
  }

  window.addEventListener("scroll", handleScrollAnimation);
  window.addEventListener("load", handleScrollAnimation);

  // إضافة تأثير التمرير للشريط العلوي
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  });

  // إضافة وظيفة البحث
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      const sectionText = section.textContent.toLowerCase();
      if (sectionText.includes(searchTerm)) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});

