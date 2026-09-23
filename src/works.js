const track = document.querySelector('[data-track]');
const slides = [...document.querySelectorAll('.project-slide')];
const current = document.querySelector('[data-current]');
const total = document.querySelector('[data-total]');
const previous = document.querySelector('[data-prev]');
const next = document.querySelector('[data-next]');
let index = 0;

total.textContent = String(slides.length).padStart(2, '0');

function showSlide(nextIndex) {
  index = (nextIndex + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === index;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', String(!isActive));
    slide.inert = !isActive;
  });
  current.textContent = String(index + 1).padStart(2, '0');
}

previous.addEventListener('click', () => showSlide(index - 1));
next.addEventListener('click', () => showSlide(index + 1));

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showSlide(index - 1);
  if (event.key === 'ArrowRight') showSlide(index + 1);
});

let touchStart = 0;
track.addEventListener('touchstart', (event) => { touchStart = event.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].clientX - touchStart;
  if (Math.abs(distance) > 50) showSlide(index + (distance < 0 ? 1 : -1));
}, { passive: true });

showSlide(0);
