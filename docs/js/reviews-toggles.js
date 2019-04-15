'use strict';

// Управление переключением отзывов на главной странице
(function(){

  // Если блок с отзывами не существует - ничего не выполняем.
  if(!document.querySelector('.reviews__wrapper')) return;

  const block = document.querySelector('.reviews__wrapper'),
        reviews = block.querySelectorAll('.reviews__item'),
        buttons = block.querySelectorAll('.slider-toggles__item');

  // Функция перелистывания слайдов.
  // (Если backward true - листаем назад)
  function showNext(backward) {
    
    // перебрать коллекцию
    for (let i = 0; i < reviews.length; i++) {

      // при нахождении активного элемента
      if (reviews[i].classList.contains('reviews__item--active')) {

        // деактивировать найденный
        reviews[i].classList.remove('reviews__item--active');
        buttons[i].classList.remove('slider-toggles__item--active');

        // нужно листать назад?
        if (!backward) {

          // если это последний элемент в коллекции, активировать первый
          if (i + 1 == reviews.length) {
            reviews[0].classList.add('reviews__item--active');
            buttons[0].classList.add('slider-toggles__item--active');
            return;
          };

          // если нет, активировать следующий за найденным
          reviews[i + 1].classList.add('reviews__item--active');
          buttons[i + 1].classList.add('slider-toggles__item--active');
          return;

        } else { // листаем вперед

          // если это первый элемент в коллекции, активировать последний
          if (i == 0) {
            reviews[reviews.length - 1].classList.add('reviews__item--active');
            buttons[reviews.length - 1].classList.add('slider-toggles__item--active');
            return;
          };

          // если нет, активировать предыдущий
          reviews[i - 1].classList.add('reviews__item--active');
          buttons[i - 1].classList.add('slider-toggles__item--active');
          return;
        }
      }
    }
  }


  // Прослушка клика на блоке с отзывами
  block.addEventListener('click', function(evt) {

    // если клик по кнопке из блока
    if (evt.target.tagName == 'BUTTON' &&
        evt.target.classList.contains('slider-toggles__item')) {  

      // получить номер кнопки
      const numButton = evt.target.getAttribute('data-number');
  
      // удалить выделение со всех кнопок
      for(let button of buttons) {
        button.classList.remove('slider-toggles__item--active');
      };
      // ... и добавить активной кнопке
      buttons[numButton].classList.add('slider-toggles__item--active');
      
      // выключить все отзывы
      for (let item of reviews) {
        item.classList.remove('reviews__item--active');
      }
      // включить отзыв, соответствующий номеру кнопки
      reviews[numButton].classList.add('reviews__item--active');
    }

    // если клик по отдельным кнопкам на десктопе
    if (evt.target.tagName == 'BUTTON' &&
        evt.target.classList.contains('reviews__toggles-desktop--right')) {
      showNext();
    };
    if (evt.target.tagName == 'BUTTON' &&
        evt.target.classList.contains('reviews__toggles-desktop--left')) {
      showNext(true);
    };

  });

})();