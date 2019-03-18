// Скрипт открывает и закрывает меню главной навигации

let pageHeader = document.querySelector('.page-header');
let menuToggle = document.querySelector('.site-list__toggle');
let navItems = document.querySelectorAll('.site-list__item');
let desktopWidth = 1200;

// Показать и скрыть элементы списка
function showListItems(show) {
  if (show) {
    for (item of navItems) {
      if (item.classList.contains('site-list__item--logo')) continue;
      item.style.display = '';
    }
    return;
  }
  if (!show) {
    for (item of navItems) {
      if (item.classList.contains('site-list__item--logo')) continue;
      item.style.display = 'none';
    }
  }
}

// Переключить классы в кнопке
function buttonClassToggle() {
  if (menuToggle.classList.contains('site-list__toggle--open')) {
    menuToggle.classList.remove('site-list__toggle--open');
    menuToggle.classList.add('site-list__toggle--closed');
    return;
  }
  if (menuToggle.classList.contains('site-list__toggle--closed')) {
    menuToggle.classList.remove('site-list__toggle--closed');
    menuToggle.classList.add('site-list__toggle--open');
  }
}

// Отобразить кнопку - js работает
menuToggle.classList.remove('site-list__toggle--no-js');

// Переключатель в положение "закрыто"
buttonClassToggle()
// Закрыть меню если мы не на десктопе
if (window.innerWidth <= desktopWidth) {
  showListItems(false);
  pageHeader.style.backgroundPosition = '50% 63px';
}

// Переключать по клику
menuToggle.addEventListener('click', function(evt) {
  evt.preventDefault();

  if (menuToggle.classList.contains('site-list__toggle--closed')) {
    buttonClassToggle();
    showListItems(true);
    return;
  };

  if (menuToggle.classList.contains('site-list__toggle--open')) {
    buttonClassToggle();
    showListItems(false);
  };

});

// Возвращать меню на десктопной версии
window.addEventListener('resize', function() {
  if (window.innerWidth >= desktopWidth) {
    showListItems(true);
  }
  if (window.innerWidth <= desktopWidth && menuToggle.classList.contains('site-list__toggle--closed')) {
    showListItems(false);
  }
})