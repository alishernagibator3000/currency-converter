const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");
const fromAmount = document.getElementById("fromAmount");
const toAmount = document.getElementById("toAmount");
const rateText = document.getElementById("exchangeRate");
const swapBtn = document.getElementById("swapBtn");

let currentRate = 0;

const flagMap = {
  USD: "us", EUR: "eu", GBP: "gb", KGS: "kg",
  KZT: "kz", UZS: "uz", RUB: "ru", AED: "ae"
};

function updateFlags() {
  const fromCode = flagMap[fromSelect.value];
  const toCode = flagMap[toSelect.value];
  
  fromFlag.src = `https://flagcdn.com/w40/${fromCode}.png`;
  toFlag.src = `https://flagcdn.com/w40/${toCode}.png`;
  
  fromFlag.alt = `${fromSelect.value} flag`;
  toFlag.alt = `${toSelect.value} flag`;
}

function calculate() {
  const amount = parseFloat(fromAmount.value);
  
  if (!amount || isNaN(amount)) {
    toAmount.value = "";
    return;
  }
  
  if (currentRate > 0) {
    toAmount.value = (amount * currentRate).toFixed(2);
  }
}

async function fetchExchangeRate() {
  const fromVal = fromSelect.value;
  const toVal = toSelect.value;
  
  if (fromVal === toVal) {
    currentRate = 1;
    rateText.textContent = `1 ${fromVal} = 1.0000 ${toVal}`;
    calculate();
    return;
  }

  rateText.textContent = "Loading...";
  const fromCodeLower = fromVal.toLowerCase();
  const toCodeLower = toVal.toLowerCase();
  const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCodeLower}.json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");
    
    const data = await res.json();
    const rate = data[fromCodeLower][toCodeLower];
    
    if (!rate) throw new Error("Rate missing");

    currentRate = rate;
    rateText.textContent = `1 ${fromVal} = ${rate.toFixed(4)} ${toVal}`;
    calculate();
    
  } catch (error) {
    console.error("Fetch error:", error);
    rateText.textContent = "Error loading rate";
    currentRate = 0;
    toAmount.value = "";
  }
}

fromSelect.addEventListener("change", () => {
  updateFlags();
  fetchExchangeRate();
});

toSelect.addEventListener("change", () => {
  updateFlags();
  fetchExchangeRate();
});

fromAmount.addEventListener("input", calculate);

swapBtn.addEventListener("click", () => {
  const tempCurr = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = tempCurr;
  
  updateFlags();
  fetchExchangeRate();
});

window.addEventListener("load", () => {
  updateFlags();
  fetchExchangeRate();
});