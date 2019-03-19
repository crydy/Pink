// Скрипт обрабатывает открытие и закрытие меню главной навигации:
// с

let pageHeader = document.querySelector('.page-header');
let menuToggle = document.querySelector('.site-list__toggle');
let navItems = document.querySelectorAll('.site-list__item');
let navLotoItem = document.querySelector('.site-list__item--logo');
let nav = document.querySelector('.site-list');
let tabletWidth = 660;
let desktopWidth = 1200;

// загрузились на десктопе?
let startInDesktop = (window.innerWidth >= desktopWidth) ? true : false;

// Показать и скрыть элементы списка
function showListItems(show) {
  if (show) {
    for (item of navItems) {
      if (item.classList.contains('site-list__item--logo')) {
        item.classList.remove('site-list__item--logo-closed');
        item.classList.add('site-list__item--logo-open');
        continue;
      };
      item.style.display = '';
    }
    return;
  }
  if (!show) {
    for (item of navItems) {
      if (item.classList.contains('site-list__item--logo')) {
        item.classList.remove('site-list__item--logo-open');
        item.classList.add('site-list__item--logo-closed');
        continue;
      };
      item.style.display = 'none';
    }
  }
}

// Переключать классы в кнопке (для смены вида)
// и списке (для управления прозрачностью закрытой менюшки)
function buttonsClassToggle() {
  if (menuToggle.classList.contains('site-list__toggle--open')) {
    menuToggle.classList.remove('site-list__toggle--open');
    menuToggle.classList.add('site-list__toggle--closed');

    nav.classList.remove('site-list--open');
    nav.classList.add('site-list--closed');
    return;
  }
  if (menuToggle.classList.contains('site-list__toggle--closed')) {
    menuToggle.classList.remove('site-list__toggle--closed');
    menuToggle.classList.add('site-list__toggle--open');

    nav.classList.remove('site-list--closed');
    nav.classList.add('site-list--open');
  }
}

// Отобразить кнопку ибо js функционирует
menuToggle.classList.remove('site-list__toggle--no-js');

// Закрыть меню если мы не на десктопе
if (window.innerWidth <= desktopWidth) {
  // Установить "классы закрытости"
  buttonsClassToggle();

  // Закрыть меню
  showListItems(false);
  // Сдвинуть фон
  pageHeader.style.backgroundPosition = '50% 0';
}

// Обрабатывать клип по кнопке
menuToggle.addEventListener('click', function(evt) {
  evt.preventDefault();

  if (menuToggle.classList.contains('site-list__toggle--closed')) {
    buttonsClassToggle();

    showListItems(true);
    // Свдигать фон на размер пункта меню с логотипом
    pageHeader.style.backgroundPosition = `50% ${nav.offsetHeight - navLotoItem.offsetHeight}px`
    return;
  };

  if (menuToggle.classList.contains('site-list__toggle--open')) {
    buttonsClassToggle();

    showListItems(false);
    pageHeader.style.backgroundPosition = '50% 0';
  };

});

// Слушать изменение ширины вьюпорта и возвращать меню на десктопной версии
window.addEventListener('resize', function() {
  if (window.innerWidth >= desktopWidth) {
    showListItems(true);
    pageHeader.style.backgroundPosition = '50% 0';
  };

  // Уход с досктопной верстки
  if (window.innerWidth <= desktopWidth) {

    // Скрыть меню, если загружались с десктопной версии
    // и вьюпорт уменьшился
    if (startInDesktop) {
      startInDesktop = false;
      buttonsClassToggle();
      showListItems(false);
      pageHeader.style.backgroundPosition = `50% ${nav.offsetHeight - navLotoItem.offsetHeight}px`
      return;
    }

    // Скрыть меню при уменьшении вьюпорта в иных случаях
    if (menuToggle.classList.contains('site-list__toggle--closed')) {
      showListItems(false);
    } else {
      pageHeader.style.backgroundPosition = `50% ${nav.offsetHeight - navLotoItem.offsetHeight}px`
    }
  };
});

