'use strict';

// Переключение столбцов таблицы в мобильной версии
(function(){

    // Если блока с отзывами не существует - ничего не выполнять.
    if(!document.querySelector('.prices')) return;

    const buttonBlock = document.querySelector('.prices__toggles'),
          buttons = buttonBlock.querySelectorAll('.slider-toggles__item'),
          table = document.querySelector('.prices__table');
      let numButton = 1; // по умолчанию открыта средняя колонка

    // Брейкпоинт на планшетную версию
    const tabletWidth = parseInt(
      getComputedStyle(
        document.querySelector(':root')
      ).getPropertyValue('--tablet-width')
    );

    // Двигать таблицу
    function slideTable(evt) {

      // Если клик по кнопке внутри блока
      if (evt.target.tagName == 'BUTTON' &&
      evt.target.classList.contains('slider-toggles__item')) {

        // получить номер кнопки
        numButton = evt.target.getAttribute('data-number');
    
        // удалить выделение со всех кнопок
        for (let button of buttons) {
          button.classList.remove('slider-toggles__item--active');
        };
        // ... и добавить активной кнопке
        buttons[numButton].classList.add('slider-toggles__item--active');

        // сдвинуть таблицу
        table.style.marginLeft = `-${numButton}00%`;
      }
    }

    // Обрабатывать клики
    buttonBlock.addEventListener('click', slideTable);

    // Слушать изменение ширины вьюпорта
    window.addEventListener('resize', function() {

      // и обнулять сдвиг таблицы на планшетной и десктопной верстке
      if (window.innerWidth >= tabletWidth) {
        table.style.marginLeft = '';
        buttonBlock.removeEventListener('click', slideTable);
      };
      
      // возвращать сдвиг на мобильной верстке
      if (window.innerWidth < tabletWidth) {
        table.style.marginLeft = `-${numButton}00%`;
        buttonBlock.addEventListener('click', slideTable);
      };
    });

})();