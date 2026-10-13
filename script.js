/* ============================================================
   مقبلات ومشروبات الرافدين — TV Menu Logic
   ============================================================ */

const IMG_PATH = "images/";

const CATEGORIES = [
  {
    name: "المقبلات الباردة",
    items: [
      ["حمص", 15, [["15","طبق"]], "hummus.jpg"],
      ["متبل", 15, [["15","طبق"]], "mutabbal.jpg"],
      ["طحينة", 13, [["13","طبق"]], "tahina.jpg"],
      ["ثوم", 14, [["14","طبق"]], "thoum.jpg"],
      ["خيار باللبن", 15, [["15","طبق"]], "khiyar-laban.jpg"],
      ["بابا غنوج", 15, [["15","طبق"]], "baba-ghanoush.jpg"],
      ["سلطة خضرا", 14, [["14","طبق"]], "salata-khadra.jpg"],
      ["سلطة ملفوف", 14, [["14","طبق"]], "salata-malfouf.jpg"],
      ["ورق عنب", 15, [["15","نفر"],["24","وسط"],["34","كبير"]], "warak-enab.jpg"],
      ["فتوش", 16, [["16","نفر"],["24","وسط"],["34","كبير"]], "fattoush.jpg"],
      ["مقبلات صغير", 19, [["19","طبق"]], "muqabalat-saghir.jpg"],
      ["سلطة زيتون", 14, [["14","طبق"]], "salata-zaytoun.jpg"],
      ["حمص بيروتي", 17, [["17","طبق"]], "hummus-beiruti.jpg"],
      ["سلطة جرجير", 16, [["16","طبق"]], "salata-jarjir.jpg"],
      ["سلطة شمندر رمان", 16, [["16","طبق"]], "salata-shamandar-rumman.jpg"],
      ["تبولة", 16, [["16","طبق"]], "tabbouleh.jpg"],
      ["متبل شمندر", 16, [["16","طبق"]], "mutabbal-shamandar.jpg"],
      ["محمرة حلبية", 16, [["16","طبق"]], "muhammara-halabiya.jpg"]
    ]
  },
  {
    name: "المقبلات الساخنة",
    items: [
      ["بطاطس مقلية", 12, [["12","عادي"],["17","كبير"]], "batatis-maqliya.jpg"],
      ["كبة مشوية", 25, [["25","حبة"]], "kubba-mashwiya.jpg"],
      ["كبة مقلية", 25, [["25","حبة"]], "kubba-maqliya.jpg"],
      ["كبة رمانية", 25, [["25","حبة"]], "kubba-rummaniya.jpg"],
      ["شوربة", 17, [["17","طبق"]], "shorba.jpg"],
      ["لازانيا", 39, [["39","طبق"]], "lasagna.jpg"],
      ["الفريدو فيتوتشيني", 38, [["38","طبق"]], "alfredo-fettuccine.jpg"],
      ["بنك ليدي باستا", 37, [["37","طبق"]], "pink-lady-pasta.jpg"],
      ["سباغيتي بولونيز", 37, [["37","طبق"]], "spaghetti-bolognese.jpg"]
    ]
  },
  {
    name: "العصيرات",
    items: [
      ["رمان", 14, [["14","كأس"],["35","جالون"]], "rumman.jpg"],
      ["شمندر رمان", 14, [["14","كأس"],["35","جالون"]], "shamandar-rumman.jpg"],
      ["كوكتيل الرافدين", 14, [["14","كأس"],["35","جالون"]], "cocktail-rafidain.jpg"],
      ["برتقال", 14, [["14","كأس"],["35","جالون"]], "burtuqal.jpg"],
      ["ليمون", 14, [["14","كأس"],["35","جالون"]], "laymoun.jpg"],
      ["ليمون نعناع", 14, [["14","كأس"],["35","جالون"]], "laymoun-nanaa.jpg"],
      ["مانجو", 14, [["14","كأس"],["35","جالون"]], "mango.jpg"],
      ["مانجو فرولة", 14, [["14","كأس"],["35","جالون"]], "mango-farawla.jpg"],
      ["فرولة حليب", 14, [["14","كأس"],["35","جالون"]], "farawla-halib.jpg"],
      ["موهيتو", 15, [["15","صغير"],["20","كبير"]], "mojito.jpg"]
    ]
  },
  {
    name: "المشروبات الغازية",
    items: [
      ["ببسي", 3, [["3","عادي"],["9","كبير"]], "pepsi.jpg"],
      ["حمضيات", 3, [["3","عادي"],["9","كبير"]], "hamdiyat.jpg"],
      ["ديو", 3, [["3","عادي"],["9","كبير"]], "dew.jpg"],
      ["ببسي دايت", 3, [["3","عادي"],["9","كبير"]], "pepsi-diet.jpg"],
      ["سفن دايت", 3, [["3","عادي"],["9","كبير"]], "seven-diet.jpg"]
    ]
  }
];

/* ============================================================
   TIMING
   ============================================================ */
const OPTION_SECONDS = 1.0;
const SINGLE_OPTION_SECONDS = 1.5;
const CARD_BASE_MS = 200;

/* ============================================================
   DOM
   ============================================================ */
const app = document.getElementById("app");
const stageWrap = document.getElementById("stageWrap");
const stage = document.getElementById("stage");
const categoryTitle = document.getElementById("categoryTitle");
const progressBar = document.getElementById("progressBar");
const countdown = document.getElementById("countdown");
const transition = document.getElementById("transition");
const pageDots = document.getElementById("pageDots");
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const exitFs = document.getElementById("exitFs");

/* ============================================================
   STATE
   ============================================================ */
let categoryIndex = 0;
let activeItemIndex = 0;
let activeOptionIndex = 0;
let pageStarted = 0;
let itemStarted = 0;
let optionStarted = 0;
let running = false;
let raf = 0;
let transitioning = false;
let currentPageDuration = 0;
let fullscreenLock = false;

/* ============================================================
   HELPERS
   ============================================================ */
function getOptionCount(item) {
  const opts = (item[2] && item[2].length) ? item[2] : [[item[1], "سعر"]];
  return opts.length;
}
function getItemDuration(item) {
  const count = getOptionCount(item);
  if (count <= 1) return SINGLE_OPTION_SECONDS * 1000 + CARD_BASE_MS;
  return count * OPTION_SECONDS * 1000 + CARD_BASE_MS;
}
function computePageDuration(items) {
  let total = 0;
  for (const it of items) total += getItemDuration(it);
  return total;
}

/* ============================================================
   RENDER
   ============================================================ */
function renderDots() {
  pageDots.innerHTML = CATEGORIES.map((_, i) =>
    `<div class="dot ${i === categoryIndex ? "active" : ""}"></div>`
  ).join("");
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function makeCard(item, i) {
  const [name, basePrice, options, img] = item;
  const optionList = (options && options.length) ? options : [[basePrice, "سعر"]];
  const isSolo = optionList.length === 1;

  const optionsHTML = optionList.map(o => `
    <div class="option ${isSolo ? 'solo' : ''}" data-opt="${esc(o[0])}">
      <b>${esc(o[0])}</b>
      <span>${esc(o[1])}</span>
    </div>
  `).join("");

  const imgHTML = img
    ? `<img src="${IMG_PATH}${esc(img)}" alt="" loading="eager" decoding="async"
         onload="this.classList.add('loaded')"
         onerror="this.style.display='none'">`
    : "";

  return `
    <article class="card ${i === activeItemIndex ? "active" : "dim"}" data-index="${i}">
      <div class="activePulse"></div>
      <div class="cardImage">
        ${imgHTML}
        <div class="placeholder">IMAGE</div>
        <div class="itemNameOverlay">
          <div class="itemName">${esc(name)}</div>
        </div>
      </div>
      <div class="cardBody">
        <div class="options">${optionsHTML}</div>
      </div>
    </article>`;
}

function render() {
  const cat = CATEGORIES[categoryIndex];
  categoryTitle.textContent = cat.name;
  stage.innerHTML = cat.items.map(makeCard).join("");
  stage.style.transform = "translateY(0)";
  renderDots();
  activeItemIndex = 0;
  activeOptionIndex = 0;
  currentPageDuration = computePageDuration(cat.items);
  requestAnimationFrame(() => {
    applyActiveStates();
    scrollToActive(false);
  });
}

function scrollToActive(smooth) {
  const activeCard = stage.children[activeItemIndex];
  if (!activeCard) return;
  const wrapH = stageWrap.clientHeight;
  const cardTop = activeCard.offsetTop;
  const cardH = activeCard.offsetHeight;
  const cardCenter = cardTop + cardH / 2;
  let targetY = cardCenter - wrapH / 2;
  const maxScroll = Math.max(0, stage.scrollHeight - wrapH);
  targetY = Math.max(0, Math.min(maxScroll, targetY));
  stage.style.transition = smooth ? "transform .7s var(--ease)" : "none";
  stage.style.transform = `translateY(${-targetY}px)`;
  if (!smooth) {
    void stage.offsetHeight;
    stage.style.transition = "transform .7s var(--ease)";
  }
}

function applyActiveStates() {
  const cards = [...stage.children];
  cards.forEach((card, i) => {
    card.classList.toggle("active", i === activeItemIndex);
    card.classList.toggle("dim", i !== activeItemIndex);
  });
  const activeCard = cards[activeItemIndex];
  if (!activeCard) return;
  const pills = activeCard.querySelectorAll(".option");
  pills.forEach((pill, idx) => {
    pill.classList.toggle("active", idx === activeOptionIndex);
  });
}
function clearAllOptionHighlights() {
  stage.querySelectorAll(".option.active").forEach(el => el.classList.remove("active"));
}
function activateItem(index) {
  activeItemIndex = index;
  activeOptionIndex = 0;
  applyActiveStates();
  scrollToActive(true);
}
function activateOption(index) {
  activeOptionIndex = index;
  applyActiveStates();
}

/* ============================================================
   CATEGORY SWITCH
   ============================================================ */
function goNextCategory() {
  if (transitioning) return;
  transitioning = true;
  transition.classList.add("show");
  categoryTitle.classList.add("fade-out");
  stageWrap.style.opacity = "0";

  setTimeout(() => {
    categoryIndex = (categoryIndex + 1) % CATEGORIES.length;
    activeItemIndex = 0;
    activeOptionIndex = 0;
    render();
    const now = performance.now();
    pageStarted = now;
    itemStarted = now;
    optionStarted = now;
    categoryTitle.classList.remove("fade-out");
    stageWrap.style.opacity = "1";
    setTimeout(() => {
      transition.classList.remove("show");
      transitioning = false;
    }, 90);
  }, 420);
}

/* ============================================================
   ANIMATION LOOP
   ============================================================ */
function tick(now) {
  if (!running) { raf = requestAnimationFrame(tick); return; }
  if (transitioning) { raf = requestAnimationFrame(tick); return; }

  const elapsedTotal = now - pageStarted;
  const remainingMs = Math.max(0, currentPageDuration - elapsedTotal);
  countdown.textContent = Math.ceil(remainingMs / 1000);
  progressBar.style.transform = `scaleX(${Math.max(0, remainingMs / currentPageDuration)})`;

  const currentCard = stage.children[activeItemIndex];
  if (currentCard) {
    const pillCount = currentCard.querySelectorAll(".option").length;
    const itemDuration = (pillCount <= 1)
      ? (SINGLE_OPTION_SECONDS * 1000 + CARD_BASE_MS)
      : (pillCount * OPTION_SECONDS * 1000 + CARD_BASE_MS);
    const elapsedItem = now - itemStarted;

    if (elapsedItem >= itemDuration) {
      clearAllOptionHighlights();
      itemStarted = now;
      optionStarted = now;
      const totalItems = CATEGORIES[categoryIndex].items.length;
      const nextItem = (activeItemIndex + 1) % totalItems;
      activateItem(nextItem);
    } else if (pillCount > 1) {
      const elapsedOptions = now - optionStarted;
      if (elapsedOptions >= OPTION_SECONDS * 1000) {
        optionStarted = now;
        const nextOpt = activeOptionIndex + 1;
        if (nextOpt < pillCount) {
          activateOption(nextOpt);
        }
      }
    }
  }

  if (elapsedTotal >= currentPageDuration) goNextCategory();
  raf = requestAnimationFrame(tick);
}

/* ============================================================
   FULLSCREEN
   ============================================================ */
async function enterFullscreen() {
  try {
    if (document.documentElement.requestFullscreen) {
      fullscreenLock = true;
      await document.documentElement.requestFullscreen();
      setTimeout(() => { fullscreenLock = false; }, 800);
    }
  } catch (e) { fullscreenLock = false; }

  document.body.classList.add("fs");
  startScreen.classList.add("hide");
  app.classList.add("running");

  running = true;
  transitioning = false;
  categoryIndex = 0;
  activeItemIndex = 0;
  activeOptionIndex = 0;
  render();
  const now = performance.now();
  pageStarted = now;
  itemStarted = now;
  optionStarted = now;
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(tick);
}

function exitFullscreen() {
  running = false;
  transitioning = false;
  cancelAnimationFrame(raf);
  if (document.fullscreenElement && document.exitFullscreen) {
    fullscreenLock = true;
    document.exitFullscreen().catch(() => {});
    setTimeout(() => { fullscreenLock = false; }, 800);
  }
  document.body.classList.remove("fs");
  startScreen.classList.remove("hide");
  app.classList.remove("running");
}

startBtn.addEventListener("click", enterFullscreen);
exitFs.addEventListener("click", exitFullscreen);

document.addEventListener("fullscreenchange", () => {
  if (fullscreenLock) return;
  if (!document.fullscreenElement && running) exitFullscreen();
});

window.addEventListener("resize", () => {
  if (running) scrollToActive(false);
});

render();