import {createTemplate as createFilterTemplate} from './templates/filters';
import {createTemplate as createCardTemplate} from './templates/cards';

import {generateFilters} from './mocks/filters';
import {generateCards} from './mocks/cards';

const CARD_LIMIT_DEFAULT = 10;
const CARD_LIMIT_EXTRA = 2;

const navigationElement = document.querySelector(`.main-navigation`);
const filmListElement = document.querySelector(`.films-list .films-list__container`);
const filmListRatedElement = document.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);
const filmListCommentedElement = document.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);

navigationElement.innerHTML = createFilterTemplate(generateFilters());

filmListElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT_DEFAULT), true);
filmListRatedElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT_EXTRA), false);
filmListCommentedElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT_EXTRA), false);

const filtersElements = document.querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`);

filtersElements.forEach((element) => {
  element.addEventListener(`click`, () => {
    filmListElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT_DEFAULT), true);
  });
});
