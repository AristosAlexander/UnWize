const form = document.getElementById("proxy-form");
const urlInput = document.getElementById("url-input");
const swStatus = document.getElementById("sw-status");
const quickLinks = document.querySelectorAll(".quick-link");

async function registerSW() {
  if (!("serviceWorker" in navigator)) {
    swStatus.textContent = "Not Supported";
    return;
  }
  
  try {
    await navigator.serviceWorker.register("/sw.js", { scope: "/service/" });
    await navigator.serviceWorker.ready;
    
    const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
    await connection.setTransport("/epoxy/index.mjs", [{ 
      wisp: `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/bare/` 
    }]);
    
    swStatus.textContent = "Ready ✓";
    swStatus.style.color = "#4ade80";
  } catch (err) {
    console.error(err);
    swStatus.textContent = "Error";
    swStatus.style.color = "#f87171";
  }
}

function isUrl(str) {
  return /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}/i.test(str);
}

function navigate(url) {
  url = url.trim();
  if (!url) return;
  
  if (!isUrl(url)) {
    url = "https://www.google.com/search?q=" + encodeURIComponent(url);
  } else if (!url.startsWith("http")) {
    url = "https://" + url;
  }
  
  const encoded = __uv$config.encodeUrl(url);
  location.href = __uv$config.prefix + encoded;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  navigate(urlInput.value);
});

quickLinks.forEach(link => {
  link.addEventListener("click", () => navigate(link.dataset.url));
});

// Load UV config then register SW
const script = document.createElement("script");
script.src = "/uv/uv.config.js";
script.onload = registerSW;
document.head.appendChild(script);