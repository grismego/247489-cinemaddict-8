import {createTemplate as createFilterTemplate} from './templates/filters';
import {createTemplates as createCardTemplate} from './templates/cards';

import {generateFilters} from './mocks/filters';
import {generateCards, generateCard} from './mocks/cards';
import moment from 'moment';
import CardComponent from './components/card';
import PopupComponent from './components/popup';

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

filtersElements.forEach((element) => {
  element.addEventListener(`click`, () => {
    filmListElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT_DEFAULT), true);
  });
});

const data = generateCard();
const card = new CardComponent(data);
const popup = new PopupComponent(data);

let cardElement = card.render();
let popupElement;

filmListElement.appendChild(cardElement);

card.onCommentsClick = () => {
  popupElement = popup.render();
  document.body.appendChild(popupElement);
};

popup.onSubmit = (newData) => {
  filmListElement.removeChild(cardElement);
  card.unrender();
  card.update(newData);
  cardElement = card.render();
  filmListElement.appendChild(cardElement);
  document.body.removeChild(popupElement);
  popupElement = null;
  popup.unrender();
};

popup.onClose = () => {
  card.update(data);
  document.body.removeChild(popup.element);
  popup.unrender();
};
