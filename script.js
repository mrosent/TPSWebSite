const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const header = document.querySelector(".site-header");
const heroMedia = document.querySelector(".hero-media");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const updateHeaderHeight = () => {
  if (!header) {
    return;
  }
  document.documentElement.style.setProperty(
    "--header-height",
    `${header.offsetHeight}px`
  );
};

const updateHeaderState = () => {
  if (!header) {
    return;
  }
  const shouldCompact = window.scrollY > 10;
  header.classList.toggle("is-compact", shouldCompact);
  updateHeaderHeight();
};

const setupHeroVideo = () => {
  if (!heroMedia) {
    return;
  }

  const video = heroMedia.querySelector("video");
  if (!video) {
    return;
  }

  const overlay = heroMedia.querySelector(".hero-video-overlay");
  const overlayText = heroMedia.querySelector(".hero-video-text");

  const updateOverlayText = () => {
    if (!overlayText) {
      return;
    }
    overlayText.textContent = heroMedia.classList.contains("has-played")
      ? "Play again"
      : "Play video";
  };

  const markPlaying = () => {
    heroMedia.classList.add("is-playing");
    heroMedia.classList.add("has-played");
    updateOverlayText();
  };

  video.addEventListener("play", markPlaying);
  video.addEventListener("pause", () => {
    heroMedia.classList.remove("is-playing");
    updateOverlayText();
  });

  video.addEventListener("ended", () => {
    heroMedia.classList.remove("is-playing");
    updateOverlayText();
  });

  if (overlay) {
    overlay.addEventListener("click", () => {
      video.play().then(markPlaying).catch(() => {});
    });
  }

  video.addEventListener("click", () => {
    if (video.paused) {
      video.play().then(markPlaying).catch(() => {});
    } else {
      video.pause();
    }
  });

  const observer = new IntersectionObserver(
    ([entry]) => {
      heroMedia.classList.toggle("in-view", entry.isIntersecting);
      if (entry.isIntersecting) {
        if (!heroMedia.classList.contains("has-played")) {
          video.play().then(markPlaying).catch(() => {});
        }
      } else {
        video.pause();
      }
    },
    { threshold: 0.35 }
  );

  observer.observe(heroMedia);
};

updateHeaderHeight();
window.addEventListener("resize", updateHeaderHeight);
window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();
setupHeroVideo();

const setupCookieBanner = () => {
  const banner = document.querySelector(".cookie-banner");
  if (!banner) {
    return;
  }

  const manageButton = banner.querySelector(".cookie-manage");
  const acceptButton = banner.querySelector(".cookie-accept");
  const saveButton = banner.querySelector(".cookie-save");
  const preferences = banner.querySelector(".cookie-preferences");
  const analyticsInput = banner.querySelector('input[name="analytics"]');
  const marketingInput = banner.querySelector('input[name="marketing"]');
  const storageKey = "tp-cookie-consent";

  const hideBanner = () => {
    banner.classList.add("is-hidden");
  };

  const showBanner = () => {
    banner.classList.remove("is-hidden");
  };

  const saveConsent = (consent) => {
    localStorage.setItem(storageKey, JSON.stringify(consent));
    hideBanner();
  };

  const existing = localStorage.getItem(storageKey);
  if (existing) {
    hideBanner();
  } else {
    showBanner();
  }

  if (manageButton && preferences) {
    manageButton.addEventListener("click", () => {
      const isOpen = !preferences.hasAttribute("hidden");
      if (isOpen) {
        preferences.setAttribute("hidden", "");
      } else {
        preferences.removeAttribute("hidden");
      }
      manageButton.setAttribute("aria-expanded", String(!isOpen));
    });
  }

  if (acceptButton) {
    acceptButton.addEventListener("click", () => {
      saveConsent({
        essential: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString(),
      });
    });
  }

  if (saveButton) {
    saveButton.addEventListener("click", () => {
      saveConsent({
        essential: true,
        analytics: Boolean(analyticsInput && analyticsInput.checked),
        marketing: Boolean(marketingInput && marketingInput.checked),
        timestamp: new Date().toISOString(),
      });
    });
  }
};

setupCookieBanner();

const ensureFooter = () => {
  if (document.querySelector(".site-footer")) {
    return;
  }

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="footer-cta">
      <div class="footer-cta-text">
        <h2>Professional-Grade AI. Real-World Execution.</h2>
        <p>From intake to automation to performance tracking, we implement intelligent systems that help businesses respond faster and convert more consistently.</p>
      </div>
      <button class="primary-cta">Request a Demo</button>
    </div>
    <div class="footer-divider"></div>
    <div class="footer-links">
      <div class="footer-columns">
        <div class="footer-column">
          <div class="footer-title">Solutions</div>
          <a href="solutions.html#foundation-system">Foundation System</a>
          <a href="solutions.html#follow-up-booking-system">Follow-Up &amp; Booking System</a>
          <a href="solutions.html#visibility-transparency-system">Visibility &amp; Transparency System</a>
        </div>
        <div class="footer-column">
          <div class="footer-title">Pages</div>
          <a href="location.html">Location</a>
          <a href="about-us.html">About Us</a>
          <a href="faq.html">FAQ</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>Copyright © 2025 Trustpoint Solutions AI. All rights reserved.</span>
      <div class="footer-legal">
        <a href="privacy-policy.html">Privacy Policy</a>
        <span aria-hidden="true">|</span>
        <a href="terms-conditions.html">Terms &amp; Conditions</a>
        <span aria-hidden="true">|</span>
        <a href="disclaimer.html">Disclaimer</a>
      </div>
      <div class="footer-social">
        <a href="#">X</a>
        <a href="#">LinkedIn</a>
        <a href="#">YouTube</a>
      </div>
    </div>
  `;

  document.body.appendChild(footer);
};

ensureFooter();

const setupCTAModal = () => {
  const modal = document.createElement("div");
  modal.className = "modal cta-form-modal";
  modal.id = "cta-form-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal-backdrop cta-form-close"></div>
    <div class="modal-dialog cta-form-dialog">
      <button class="modal-close cta-form-close" type="button" aria-label="Close">×</button>
      <div class="cta-form-container">
        <iframe
          src="https://link.trustpointsolutionsai.com/widget/form/6MSg5bZVm4Y3yAbrI1uK"
          style="width:100%;height:1304px;border:none;border-radius:0px"
          id="inline-6MSg5bZVm4Y3yAbrI1uK"
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name="CRM Software Registration"
          data-height="1304"
          data-layout-iframe-id="inline-6MSg5bZVm4Y3yAbrI1uK"
          data-form-id="6MSg5bZVm4Y3yAbrI1uK"
          title="CRM Software Registration">
        </iframe>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const formScript = document.createElement("script");
  formScript.src = "https://link.trustpointsolutionsai.com/js/form_embed.js";
  document.body.appendChild(formScript);

  const openModal = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  modal.querySelectorAll(".cta-form-close").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  document.body.addEventListener("click", (e) => {
    const target = e.target.closest(".primary-cta, .secondary-cta");
    if (!target) return;
    if (target.closest(".cookie-banner")) return;
    e.preventDefault();
    openModal();
  });
};

setupCTAModal();
