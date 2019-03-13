import {createTemplate as createFilterTemplate} from './templates/filters';
import {createTemplates as createCardTemplate} from './templates/cards';

import {generateFilters} from './mocks/filters';
import {generateCards, generateCard} from './mocks/cards';

import Card from './components/card';
import Popup from './components/popup';

const CARD_LIMIT_DEFAULT = 10;
const CARD_LIMIT_EXTRA = 2;

const navigationElement = document.querySelector(`.main-navigation`);
const filmListElement = document.querySelector(`.films-list .films-list__container`);
const filmListRatedElement = document.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);
const filmListCommentedElement = document.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);

navigationElement.innerHTML = createFilterTemplate(generateFilters());

filmListRatedElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT_EXTRA), false);
filmListCommentedElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT_EXTRA), false);

const filtersElements = document.querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`);
// const form = document.querySelector(`.film-details__inner`);

filtersElements.forEach((element) => {
  element.addEventListener(`click`, () => {
    filmListElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT_DEFAULT), true);
  });
});

const data = generateCard();
const card = new Card(data);
const popup = new Popup(data);

filmListElement.appendChild(card.render());

card.onPopup = () => {
  popup.render();
  document.body.appendChild(popup.element);
};

popup.onClose = () => {
  document.body.removeChild(popup.element);
  popup.unrender();
};

// document.querySelectorAll(`.film-details__user-rating-input`).forEach((elem) => {
//   elem.addEventListener(`click`, function (evt) {
//     console.log(evt.target.value);
//   })
// })