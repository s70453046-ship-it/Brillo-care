/* ==========================================
   BRILOCARE — WEBSITE INTERACTIONS
   Vanilla JavaScript — no dependencies
   ========================================== */
/*
  IMPORTANT:
  Replace the placeholder with the real business email
  when it is available. Do not invent an email address.
*/
const BUSINESS_EMAIL = "REPLACE_WITH_BUSINESS_EMAIL";
/* ------------------------------------------
   MOBILE NAVIGATION
   ------------------------------------------ */
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
function closeMobileMenu() {
  if (!menuToggle || !primaryNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  primaryNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}
if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded =
      menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute(
      "aria-label",
      isExpanded ? "Open navigation" : "Close navigation"
    );
    primaryNav.classList.toggle("is-open", !isExpanded);
    document.body.classList.toggle("menu-open", !isExpanded);
  });
  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMobileMenu();
    }
  });
}
/* ------------------------------------------
   HERO IMAGE CAROUSEL
   ------------------------------------------ */
const heroSlides = Array.from(
  document.querySelectorAll(".hero-slide")
);
const slideDots = Array.from(
  document.querySelectorAll(".slide-dot")
);
const previousSlideButton = document.querySelector("#prev-slide");
const nextSlideButton = document.querySelector("#next-slide");
const currentSlideLabel = document.querySelector("#slide-current");
const heroTitle = document.querySelector("#hero-title");
const heroCopy = document.querySelector("#hero-copy");
const heroMessages = [
  {
    title: "A cleaner space.<br><em>A calmer mind.</em>",
    copy: "Thoughtful professional cleaning for homes, holiday rentals and workplaces across Malta."
  },
  {
    title: "Come home to<br><em>fresh beginnings.</em>",
    copy: "Considered cleaning for comfortable homes and welcoming holiday rentals."
  },
  {
    title: "A workspace that<br><em>feels ready.</em>",
    copy: "Professional cleaning enquiries for offices and commercial spaces across Malta."
  }
];
let currentSlide = 0;
let carouselTimer = null;
const reducedMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);
function showSlide(index) {
  if (heroSlides.length === 0) return;
  currentSlide =
    (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === currentSlide;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });
  slideDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === currentSlide;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-pressed", String(isActive));
  });
  if (currentSlideLabel) {
    currentSlideLabel.textContent =
      String(currentSlide + 1).padStart(2, "0");
  }
  const message = heroMessages[currentSlide];
  if (message && heroTitle && heroCopy) {
    heroTitle.innerHTML = message.title;
    heroCopy.textContent = message.copy;
  }
}
function stopCarousel() {
  if (carouselTimer !== null) {
    window.clearInterval(carouselTimer);
    carouselTimer = null;
  }
}
function startCarousel() {
  stopCarousel();
  if (
    reducedMotionQuery.matches ||
    heroSlides.length < 2 ||
    document.hidden
  ) {
    return;
  }
  carouselTimer = window.setInterval(() => {
    showSlide(currentSlide + 1);
  }, 6000);
}
if (heroSlides.length > 0) {
  showSlide(0);
  startCarousel();
  if (previousSlideButton) {
    previousSlideButton.addEventListener("click", () => {
      showSlide(currentSlide - 1);
      startCarousel();
    });
  }
  if (nextSlideButton) {
    nextSlideButton.addEventListener("click", () => {
      showSlide(currentSlide + 1);
      startCarousel();
    });
  }
  slideDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const requestedSlide = Number(dot.dataset.slide);
      if (Number.isInteger(requestedSlide)) {
        showSlide(requestedSlide);
        startCarousel();
      }
    });
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopCarousel();
    } else {
      startCarousel();
    }
  });
  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", startCarousel);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(startCarousel);
  }
}
/* ------------------------------------------
   INTERACTIVE SERVICE FINDER
   ------------------------------------------ */
const serviceChoices = Array.from(
  document.querySelectorAll(".choice")
);
const recommendationTitle = document.querySelector(
  "#recommendation-title"
);
const recommendationCopy = document.querySelector(
  "#recommendation-copy"
);
const recommendationLink = document.querySelector(
  "#recommendation-link"
);
const recommendations = {
  regular: {
    title: "Home Cleaning",
    copy: "A regular home clean may be a good fit for keeping your living space feeling fresh and in order.",
    service: "Home Cleaning"
  },
  rental: {
    title: "Airbnb Turnovers",
    copy: "A between-guest cleaning request can help you plan the preparation of your holiday rental.",
    service: "Airbnb Turnovers"
  },
  moving: {
    title: "End of Tenancy",
    copy: "A move-in or move-out cleaning enquiry is a useful starting point for discussing handover requirements.",
    service: "End of Tenancy"
  },
  workplace: {
    title: "Office Cleaning",
    copy: "Tell us about your workplace, its size and the cleaning arrangements you would like to discuss.",
    service: "Office Cleaning"
  },
  renovation: {
    title: "Post-Construction",
    copy: "Share details about the renovation, remaining dust and property condition so the required work can be discussed.",
    service: "Post-Construction"
  }
};
function updateRecommendation(choiceKey) {
  const recommendation = recommendations[choiceKey];
  if (!recommendation) return;
  serviceChoices.forEach((choice) => {
    const isSelected = choice.dataset.choice === choiceKey;
    choice.classList.toggle("is-selected", isSelected);
    choice.setAttribute("aria-pressed", String(isSelected));
  });
  if (recommendationTitle) {
    recommendationTitle.textContent = recommendation.title;
  }
  if (recommendationCopy) {
    recommendationCopy.textContent = recommendation.copy;
  }
  if (recommendationLink) {
    recommendationLink.dataset.service = recommendation.service;
  }
}
serviceChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    updateRecommendation(choice.dataset.choice);
  });
});
/* ------------------------------------------
   SERVICE LINKS PRESELECT THE FORM
   ------------------------------------------ */
const serviceSelect = document.querySelector("#service-required");
document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    const requestedService = link.dataset.service;
    if (!serviceSelect || !requestedService) return;
    const matchingOption = Array.from(serviceSelect.options).find(
      (option) => option.value === requestedService ||
        option.textContent.trim() === requestedService
    );
    if (matchingOption) {
      serviceSelect.value = matchingOption.value;
    }
  });
});
/* ------------------------------------------
   QUOTE FORM VALIDATION AND EMAIL DRAFT
   ------------------------------------------ */
const quoteForm = document.querySelector("#quote-form");
const formStatus = document.querySelector("#form-status");
const requiredFields = [
  {
    id: "full-name",
    message: "Please enter your full name."
  },
  {
    id: "email",
    message: "Please enter a valid email address."
  },
  {
    id: "property-type",
    message: "Please select a property type."
  },
  {
    id: "service-required",
    message: "Please select the service you need."
  },
  {
    id: "location",
    message: "Please enter the property location in Malta."
  }
];
function getFieldError(field) {
  const value = field.value.trim();
  if (!value) {
    return "This field is required.";
  }
  if (field.type === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return "Please enter a valid email address.";
    }
  }
  return "";
}
function displayFieldError(field, message) {
  const errorElement = document.querySelector(
    `#${field.id}-error`
  );
  field.setAttribute(
    "aria-invalid",
    message ? "true" : "false"
  );
  if (errorElement) {
    errorElement.textContent = message;
  }
}
if (quoteForm) {
  requiredFields.forEach(({ id }) => {
    const field = document.getElementById(id);
    if (!field) return;
    field.addEventListener("blur", () => {
      let message = "";
      if (field.value.trim() === "") {
        message = "This field is required.";
      } else if (field.type === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value.trim())) {
          message = "Please enter a valid email address.";
        }
      }
      displayFieldError(field, message);
    });
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        displayFieldError(field, getFieldError(field));
      }
    });
    field.addEventListener("change", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        displayFieldError(field, getFieldError(field));
      }
    });
  });
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (formStatus) {
      formStatus.textContent = "";
    }
    let firstInvalidField = null;
    let isValid = true;
    requiredFields.forEach(({ id, message: requiredMessage }) => {
      const field = document.getElementById(id);
      if (!field) return;
      let message = "";
      if (!field.value.trim()) {
        message = requiredMessage;
      } else if (field.type === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value.trim())) {
          message = "Please enter a valid email address.";
        }
      }
      displayFieldError(field, message);
      if (message) {
        isValid = false;
        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      }
    });
    if (!isValid) {
      if (formStatus) {
        formStatus.textContent =
          "Please check the highlighted fields and try again.";
      }
      firstInvalidField?.focus();
      return;
    }
    if (
      !BUSINESS_EMAIL ||
      BUSINESS_EMAIL === "REPLACE_WITH_BUSINESS_EMAIL" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(BUSINESS_EMAIL)
    ) {
      if (formStatus) {
        formStatus.textContent =
          "The form is valid, but BrilloCare's email address has not been configured yet. Please contact the website owner to complete this setup.";
      }
      return;
    }
    const formData = new FormData(quoteForm);
    const emailSubject = "BrilloCare — Cleaning Quote Request";
    const emailBody = [
      "BRILOCARE — CLEANING QUOTE REQUEST",
      "",
      `Full name: ${formData.get("fullName") || ""}`,
      `Email: ${formData.get("email") || ""}`,
      `Phone: ${formData.get("phone") || "Not provided"}`,
      `Property type: ${formData.get("propertyType") || ""}`,
      `Service required: ${formData.get("serviceRequired") || ""}`,
      `Location in Malta: ${formData.get("location") || ""}`,
      `Preferred date: ${formData.get("preferredDate") || "Not specified"}`,
      `Cleaning frequency: ${formData.get("frequency") || "Not specified"}`,
      `Property size and requirements: ${formData.get("size") || "Not specified"}`,
      "",
      "Additional message:",
      formData.get("message") || "No additional message.",
      "",
      "This request was prepared through the BrilloCare website."
    ].join("\n");
    const mailtoURL =
      `mailto:${BUSINESS_EMAIL}` +
      `?subject=${encodeURIComponent(emailSubject)}` +
      `&body=${encodeURIComponent(emailBody)}`;
    if (formStatus) {
      formStatus.textContent =
        "Your details are ready. Your email application should open so you can review and send the request. This website does not send the email itself.";
    }
    /*
      mailto opens the visitor's configured email application.
      It does not guarantee that an email will be sent.
    */
    window.location.href = mailtoURL;
  });
}
/* ------------------------------------------
   FOOTER YEAR
   ------------------------------------------ */
const yearElement = document.querySelector("#current-year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
/* ------------------------------------------
   FAQ: KEEP ONE ANSWER OPEN AT A TIME
   ------------------------------------------ */
const faqItems = Array.from(
  document.querySelectorAll(".faq-item")
);
faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    faqItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.open = false;
      }
    });
  });
});