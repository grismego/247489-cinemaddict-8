// import {createTemplate as createFilterTemplate} from './templates/filters';
import {createTemplate as createCardTemplate} from './templates/cards';

import {generateFilters} from './mocks/filters';
import {generateCards} from './mocks/cards';

// import FILTERS from './mocks/filters';
// import CARDS from './mocks/cards';

// const generateRandomNumber = (min, max) => Math.round(min - 0.5 + Math.random() * (max - min + 1));
const CARD_LIMIT = {
  default: 10,
  extra: 2
};

const navigationElement = document.querySelector(`.main-navigation`);
const filmListElement = document.querySelector(`.films-list .films-list__container`);
const filmListRatedElement = document.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);
const filmListCommentedElement = document.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);


// navigationElement.innerHTML = createFilterTemplate(FILTERS);

filmListElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT.default), true);
filmListRatedElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT.extra), false);
filmListCommentedElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT.extra), false);

// @TODO
// document.querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`)
// .forEach((element) => {
//   element.addEventListener(`click`, () => {
//     filmListElement.innerHTML = createCardTemplate(
//         CARDS.slice(0, generateRandomNumber(1, CARDS.length), true)
//     );
//   });
// });
