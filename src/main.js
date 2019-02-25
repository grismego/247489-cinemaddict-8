import {createTemplate as createFilterTemplate} from './templates/filters';
import {createTemplate as createCardTemplate} from './templates/cards';
import {DATA as FILTERS} from './mocks/filters';
import {DATA as CARDS} from './mocks/cards';

const generateRandomNumber = (min, max) => Math.round(min - 0.5 + Math.random() * (max - min + 1));

const navigationElement = document.querySelector(`.main-navigation`);
const filmListElement = document.querySelector(`.films-list .films-list__container`);
const filmListRatedElement = document.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);
const filmListCommentedElement = document.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);


navigationElement.innerHTML = createFilterTemplate(FILTERS);
filmListElement.innerHTML = createCardTemplate(CARDS, true);
filmListRatedElement.innerHTML = createCardTemplate(CARDS.slice(-2), false);
filmListCommentedElement.innerHTML = createCardTemplate(CARDS.slice(-2), false);

document.querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`)
.forEach((element) => {
  element.addEventListener(`click`, () => {
    filmListElement.innerHTML = createCardTemplate(
        CARDS.slice(0, generateRandomNumber(1, CARDS.length), true)
    );
  });
});
