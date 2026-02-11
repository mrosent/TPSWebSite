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
      <h2>Unlock Professional Class AI for Your Firm</h2>
      <button class="primary-cta">Request a Demo</button>
    </div>
    <div class="footer-divider"></div>
    <div class="footer-links">
      <div class="footer-brand">T</div>
      <div class="footer-columns">
        <div class="footer-column">
          <div class="footer-title">Solutions</div>
          <a href="#">Innovation</a>
          <a href="#">In-House</a>
          <a href="#">Transactional</a>
          <a href="#">Litigation</a>
          <a href="#">Collaboration</a>
        </div>
        <div class="footer-column">
          <div class="footer-title">About</div>
          <a href="#">Customers</a>
          <a href="#">Security</a>
          <a href="#">Company</a>
          <a href="#">Newsroom</a>
          <a href="#">Careers</a>
          <a href="#">Law Schools</a>
        </div>
        <div class="footer-column">
          <div class="footer-title">Resources</div>
          <a href="#">Blog</a>
          <a href="#">Videos</a>
          <a href="#">Guides</a>
          <a href="#">Legal</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Press Kit</a>
          <a href="#">Your Privacy Choices</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>Copyright © 2025 Trustpoint Solutions AI. All rights reserved.</span>
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

const privacyLink = document.querySelector("#privacy-policy-link");
const privacyModal = document.querySelector("#privacy-policy-modal");
const termsLink = document.querySelector("#terms-conditions-link");
const termsModal = document.querySelector("#terms-conditions-modal");
const disclaimerLink = document.querySelector("#disclaimer-link");
const disclaimerModal = document.querySelector("#disclaimer-modal");

const openModal = (modal) => {
  if (!modal) {
    return;
  }
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = (modal) => {
  if (!modal) {
    return;
  }
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
};

if (privacyLink) {
  privacyLink.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(privacyModal);
  });
}

if (termsLink) {
  termsLink.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(termsModal);
  });
}

if (disclaimerLink) {
  disclaimerLink.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(disclaimerModal);
  });
}

const handleModalClick = (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  if (target.closest("[data-modal-close]")) {
    closeModal(privacyModal);
    closeModal(termsModal);
    closeModal(disclaimerModal);
  }
};

if (privacyModal) {
  privacyModal.addEventListener("click", handleModalClick);
}

if (termsModal) {
  termsModal.addEventListener("click", handleModalClick);
}

if (disclaimerModal) {
  disclaimerModal.addEventListener("click", handleModalClick);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal(privacyModal);
    closeModal(termsModal);
    closeModal(disclaimerModal);
  }
});
