/* =====================================================================
   Клуб мафии «Шеф» — чистовой JavaScript
   ---------------------------------------------------------------------
   Скрипт отвечает за:
   1) мобильное меню;
   2) модальные окна;
   3) формы записи и вопроса;
   4) переключение дня в расписании;
   5) раскрытие карточек преимуществ;
   6) автоматическое слайд-шоу на главном экране;
   7) имитацию перехода к оплате.
   ===================================================================== */

const body = document.body;
const modals = document.querySelectorAll(".modal");
const loader = document.querySelector("#paymentLoader");
const paymentUrl = "https://yookassa.ru/";

/* -----------------------------
   Мобильное меню
   ----------------------------- */
const menu = document.querySelector("[data-mobile-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuClose = document.querySelector("[data-menu-close]");

function closeMenu() {
  if (!menu || !menuToggle) return;
  menu.classList.remove("is-open");
  menu.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  body.classList.remove("menu-open");
}

function openMenu() {
  if (!menu || !menuToggle) return;
  menu.classList.add("is-open");
  menu.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");
  body.classList.add("menu-open");
}

menuToggle?.addEventListener("click", () => {
  if (menu?.classList.contains("is-open")) closeMenu();
  else openMenu();
});

menuClose?.addEventListener("click", closeMenu);
menu?.addEventListener("click", (event) => {
  if (event.target === menu || event.target.closest("a")) closeMenu();
});

/* -----------------------------
   Модальные окна
   ----------------------------- */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  body.classList.add("modal-open");
}

function closeModals() {
  modals.forEach((modal) => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  });
  body.classList.remove("modal-open");
}

document.querySelectorAll("[data-modal-open]").forEach((button) => {
  button.addEventListener("click", () => openModal(button.dataset.modalOpen));
});

document.querySelectorAll("[data-modal-close]").forEach((button) => {
  button.addEventListener("click", closeModals);
});

modals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModals();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModals();
    closeMenu();
  }
});

/* -----------------------------
   Формы
   ----------------------------- */
const bookingForm = document.querySelector("#bookingForm");
const questionForm = document.querySelector("#questionForm");

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  bookingForm.reset();
  closeModals();
  openModal("successModal");
});

questionForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  questionForm.reset();
  openModal("questionSuccessModal");
});

/* -----------------------------
   Выбор дня в расписании
   ----------------------------- */
const days = document.querySelectorAll(".day");
const dayText = document.querySelectorAll(".js-day");

days.forEach((button) => {
  button.addEventListener("click", () => {
    days.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    dayText.forEach((item) => {
      item.textContent = button.dataset.day;
    });
  });
});

/* -----------------------------
   Блок преимуществ
   На ноутбуке стрелки переключают две группы преимуществ.
   На планшете и телефоне все карточки показаны списком через CSS.
   ----------------------------- */
const advantageSlides = document.querySelectorAll(".adv-slide");
let currentAdvantageSlide = 0;

function showAdvantageSlide(index) {
  if (!advantageSlides.length) return;

  currentAdvantageSlide = (index + advantageSlides.length) % advantageSlides.length;

  advantageSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === currentAdvantageSlide);
  });

  document.querySelectorAll(".adv-card").forEach((card) => {
    card.classList.remove("is-open");
    const trigger = card.querySelector(".adv-trigger");
    trigger?.setAttribute("aria-expanded", "false");
  });
}

document.querySelector("[data-adv-prev]")?.addEventListener("click", () => {
  showAdvantageSlide(currentAdvantageSlide - 1);
});

document.querySelector("[data-adv-next]")?.addEventListener("click", () => {
  showAdvantageSlide(currentAdvantageSlide + 1);
});

document.querySelectorAll(".adv-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const card = trigger.closest(".adv-card");
    if (!card) return;

    const isOpen = card.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });
});

/* -----------------------------
   Слайд-шоу на главном экране
   ----------------------------- */
const heroImage = document.querySelector("[data-hero-image]");
const heroSlides = [
  { src: "assets/img/table.jpg", alt: "Игровой стол клуба мафии" },
  { src: "assets/img/players.jpg", alt: "Игроки за столом" },
  { src: "assets/img/woman-mask.jpg", alt: "Девушка с маской" },
  { src: "assets/img/masked-person.jpg", alt: "Человек в маске" },
  { src: "assets/img/card-hand.jpg", alt: "Карта мафии в руке" },
  { src: "assets/img/rings.jpg", alt: "Мафиозный образ" }
];

let heroIndex = 0;
let heroTimer = null;

function setHeroSlide(nextIndex) {
  if (!heroImage || !heroSlides.length) return;
  heroIndex = (nextIndex + heroSlides.length) % heroSlides.length;
  const nextSlide = heroSlides[heroIndex];

  heroImage.classList.add("is-changing");
  window.setTimeout(() => {
    heroImage.src = nextSlide.src;
    heroImage.alt = nextSlide.alt;
    heroImage.classList.remove("is-changing");
  }, 230);
}

function startHeroSlideshow() {
  if (!heroImage) return;
  window.clearInterval(heroTimer);
  heroTimer = window.setInterval(() => setHeroSlide(heroIndex + 1), 3600);
}

heroSlides.slice(1).forEach((slide) => {
  const image = new Image();
  image.src = slide.src;
});

startHeroSlideshow();

/* -----------------------------
   Кнопки покупки
   ----------------------------- */
document.querySelectorAll("[data-buy]").forEach((button) => {
  button.addEventListener("click", () => {
    closeModals();
    if (!loader) return;

    loader.classList.add("is-open");
    loader.setAttribute("aria-hidden", "false");

    window.setTimeout(() => {
      window.location.href = paymentUrl;
    }, 1600);
  });
});
