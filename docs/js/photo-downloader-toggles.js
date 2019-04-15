'use strict';

// Переключение ползунков в блоке загрузки фото в мобильной версии
(function(){

  // Если блока не существует - ничего не выполнять
  if (!document.querySelector('.photo-downloader__form-list')) return;

  const block = document.querySelector('.photo-downloader__form-list'),
        items = block.querySelectorAll('.photo-downloader__form-list-item'),
        labels = block.querySelectorAll('.photo-downloader__form-list-item-label'),
        inputs = block.querySelectorAll('.photo-downloader__form-list-item-range');

  // Слушать клики в рамках блока
  block.addEventListener('mousedown', function(evt) {

    // если клик в label
    if (evt.target.closest('.photo-downloader__form-list-item-label')) {

      // получить целевой label и его номер
      const labelTarget = evt.target.closest('.photo-downloader__form-list-item-label'),
            labelNumber = labelTarget.getAttribute('data-number');

      // удалить выделение со всех label
      for (let label of labels) {
        label.classList.remove('photo-downloader__form-list-item-label--active');
      };
      // ... и добавить целевому label
      labels[labelNumber].classList.add('photo-downloader__form-list-item-label--active');

      // схлопнуть все эелементы
      for (let item of items) {
        item.classList.remove('photo-downloader__form-list-item--active');
      };
      // ... и раскрыть целевой
      items[labelNumber].classList.add('photo-downloader__form-list-item--active');


      // скрыть все range-inputs
      for (let input of inputs) {
        input.classList.remove('photo-downloader__form-list-item-range--active');
      };
      // ... и отобразить целевой
      inputs[labelNumber].classList.add('photo-downloader__form-list-item-range--active');
      
    }

  });

})();