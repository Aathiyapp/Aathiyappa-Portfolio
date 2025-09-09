// Tab switching
document.querySelectorAll(".sidebar li").forEach(li => {
  li.addEventListener("click", () => {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
    document.getElementById(li.dataset.tab).classList.remove("hidden");
  });
});

// Dark mode
const toggleBtn = document.getElementById("darkToggle");
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Date difference
document.getElementById("calcDateBtn").addEventListener("click", () => {
  const d1 = new Date(document.getElementById("date1").value);
  const d2 = new Date(document.getElementById("date2").value);
  if (!isNaN(d1) && !isNaN(d2)) {
    const diff = Math.abs((d2 - d1) / (1000*60*60*24));
    document.getElementById("dateResult").innerText = `Difference: ${diff} days`;
  }
});

// Percentage calc
document.getElementById("calcPercentBtn").addEventListener("click", () => {
  const base = parseFloat(document.getElementById("base").value);
  const pct = parseFloat(document.getElementById("percent").value);
  if (!isNaN(base) && !isNaN(pct)) {
    document.getElementById("percentResult").innerText = `${pct}% of ${base} = ${(base * pct / 100).toFixed(2)}`;
  }
});

// Translation
const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");
fetch("https://libretranslate.de/languages")
  .then(r => r.json())
  .then(langs => {
    langs.forEach(l => {
      fromLang.add(new Option(l.name, l.code));
      toLang.add(new Option(l.name, l.code));
    });
    fromLang.value = "en"; toLang.value = "hi";
  });

document.getElementById("translateBtn").addEventListener("click", () => {
  const text = document.getElementById("sourceText").value;
  fetch("https://libretranslate.de/translate", {
    method: "POST",
    body: JSON.stringify({
      q: text,
      source: fromLang.value,
      target: toLang.value,
      format: "text"
    }),
    headers: { "Content-Type": "application/json" }
  })
  .then(r => r.json())
  .then(data => document.getElementById("translateResult").innerText = data.translatedText || "Error");
});

// Currency
const fromCur = document.getElementById("fromCurrency");
const toCur = document.getElementById("toCurrency");
fetch("https://api.exchangerate.host/symbols")
  .then(r => r.json())
  .then(data => {
    Object.entries(data.symbols).forEach(([code, info]) => {
      fromCur.add(new Option(`${code} - ${info.description}`, code));
      toCur.add(new Option(`${code} - ${info.description}`, code));
    });
    fromCur.value = "USD"; toCur.value = "INR";
  });

document.getElementById("swapBtn").addEventListener("click", () => {
  const tmp = fromCur.value;
  fromCur.value = toCur.value;
  toCur.value = tmp;
});

document.getElementById("convertBtn").addEventListener("click", () => {
  const amt = document.getElementById("amount").value || 1;
  fetch(`https://api.exchangerate.host/convert?from=${fromCur.value}&to=${toCur.value}&amount=${amt}`)
    .then(r => r.json())
    .then(data => {
      document.getElementById("currencyResult").innerText = 
        `${amt} ${fromCur.value} = ${data.result.toFixed(2)} ${toCur.value}`;
    });
});

// Search filter
document.getElementById("searchLinks").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll("#linksContainer li").forEach(li => {
    li.style.display = li.innerText.toLowerCase().includes(q) ? "" : "none";
  });
});