(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  var toggleUse = toggle.querySelector("use");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggleUse.setAttribute("href", open ? "#i-x" : "#i-menu");
  }
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia("(min-width: 900px)").addEventListener("change", function (mq) {
    if (mq.matches) setMenu(false);
  });

  /* ---------- Active nav link ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.main-nav a[href^="#"]:not(.btn)'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute("href") === "#" + entry.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  if (!reduceMotion && "IntersectionObserver" in window) {
    var groups = [".service-card", ".project", ".package", ".review", ".process-list > li", ".stat"];
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    groups.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        el.classList.add("reveal");
        el.style.transitionDelay = Math.min(i % 4, 3) * 40 + "ms";
        revealObserver.observe(el);
      });
    });
  }

  /* ---------- Original review dialog ---------- */
  var dialog = document.getElementById("review-dialog");
  var dialogImg = dialog.querySelector(".dialog-img");
  var dialogTitle = dialog.querySelector("#review-dialog-title");
  var lastTrigger = null;

  document.querySelectorAll(".review-proof").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var name = btn.getAttribute("data-name");
      lastTrigger = btn;
      dialogImg.src = btn.getAttribute("data-img");
      dialogImg.alt = "Screenshot of the original 5-star review from " + name;
      if (btn.closest(".review").querySelector('.stars[aria-label*="4 out"]')) {
        dialogImg.alt = "Screenshot of the original 4-star review from " + name;
      }
      dialogTitle.textContent = "Original review from " + name;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else window.open(dialogImg.src, "_blank", "noopener");
    });
  });

  dialog.querySelector(".dialog-close").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) dialog.close(); // click on backdrop
  });
  dialog.addEventListener("close", function () {
    if (lastTrigger) lastTrigger.focus();
  });

  /* ---------- Copy email ---------- */
  var copyBtn = document.querySelector(".copy-email");
  var status = document.querySelector(".sr-status");
  if (copyBtn) {
    var label = copyBtn.querySelector(".copy-label");
    var original = label.textContent;
    var timer;
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email");
      var done = function (ok) {
        label.textContent = ok ? "Email copied" : email;
        status.textContent = ok ? "Email address copied to clipboard" : "Copy failed. The email is " + email;
        clearTimeout(timer);
        timer = setTimeout(function () { label.textContent = original; }, 2500);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
