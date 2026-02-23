(function () {
  function isLikelyPhone() {
    var ua = navigator.userAgent || "";
    var mobileUA = /Android|iPhone|iPod|IEMobile|Opera Mini|Mobile/i.test(ua);
    var smallScreen = window.matchMedia && window.matchMedia("(max-width: 900px)").matches;
    var coarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    return (mobileUA || coarsePointer) && smallScreen;
  }

  function dismissed() {
    try {
      return localStorage.getItem("desktopPromptDismissed") === "1";
    } catch (e) {
      return false;
    }
  }

  function markDismissed() {
    try {
      localStorage.setItem("desktopPromptDismissed", "1");
    } catch (e) {}
  }

  function buildPrompt() {
    if (document.querySelector(".mobile-desktop-prompt")) return;

    var prompt = document.createElement("div");
    prompt.className = "mobile-desktop-prompt";
    prompt.setAttribute("role", "status");
    prompt.setAttribute("aria-live", "polite");

    var text = document.createElement("p");
    text.className = "mobile-desktop-prompt-text";
    text.textContent = "Best viewed on desktop (or use your browser's Desktop Site mode).";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mobile-desktop-prompt-btn";
    btn.textContent = "Got it";
    btn.addEventListener("click", function () {
      markDismissed();
      prompt.remove();
    });

    prompt.appendChild(text);
    prompt.appendChild(btn);
    document.body.appendChild(prompt);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!isLikelyPhone()) return;
    if (dismissed()) return;
    buildPrompt();
  });
})();

