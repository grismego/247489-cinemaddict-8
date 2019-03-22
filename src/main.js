import {createTemplate as createFilterTemplate} from './templates/filters';
import {createTemplates as createCardTemplate} from './templates/cards';

import {generateFilters} from './mocks/filters';
import {generateCards, generateCard} from './mocks/cards';

import CardComponent from './components/card';
import PopupComponent from './components/popup';
import FilterComponent from './components/filter';

const CARD_LIMIT_DEFAULT = 10;
const CARD_LIMIT_EXTRA = 2;

const navigationElement = document.querySelector(`.main-navigation`);
const filmListElement = document.querySelector(`.films-list .films-list__container`);
const filmListRatedElement = document.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);
const filmListCommentedElement = document.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);

const statBoard = document.querySelector(`.statistic`);
const filmBoard = document.querySelector(`.films`);

// navigationElement.innerHTML = createFilterTemplate(generateFilters());

filmListRatedElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT_EXTRA), false);
filmListCommentedElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT_EXTRA), false);

const filtersElements = document.querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`);

// filtersElements.forEach((element) => {
//   element.addEventListener(`click`, () => {
//     filmListElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT_DEFAULT), true);
//   });
// });

// const data = generateCard();
// const card = new CardComponent(data);
// const popup = new PopupComponent(data);


const filterCards = (cards, filterName) => {
  switch (filterName) {
    case `All`:
      statBoard.classList.remove(`visually-hidden`);
      filmBoard.classList.add(`visually-hidden`);
      return cards;

    case `Watchlist`:
      return cards.filter((it) => it.addedToWathed);

    case `History`:
      return cards.filter((it) => it.isWatched);

    case `Favorites`:
      return cards.filter((it) => it.isFavorite);

    default:
      return cards;
  }
};


const filtersData = generateFilters();

filtersData.forEach((item) => {
  const filter = new FilterComponent(item);
  navigationElement.appendChild(filter.render());

  filter.onFilter = (evt) => {
    const filterName = evt.target.textContent;
    const filteredCards = filterCards(initialCards, filterName);

    filteredCards.forEach((card) => renderCards(card));
  };
});


// card.render();
// filmListElement.appendChild(card.render());

const initialCards = generateCards(7);

const renderCards = (cards) => {
  for (const data of cards) {
    const card = new CardComponent(data);
    const popup = new PopupComponent(data);

    filmListElement.appendChild(card.render());

    card.onCommentsClick = () => {
      popup.render();
      document.body.appendChild(popup.element);
    };

    card.onAddToWatchList = (boolean) => {
      data.addedToWathed = boolean;
      popup.update(data);
    };

    card.onMarkAsWatched = (boolean) => {
      data.isWatched = boolean;
      popup.update(data);
    };

    card.onMarkAsFavorite = (boolean) => {
      data.isFavorite = boolean;
      popup.update(data);
    };

    popup.onSubmit = (newData) => {
      filmListElement.removeChild(card.element);
      card.unrender();
      card.update(newData);
      card.render();
      filmListElement.appendChild(card.element);

      document.body.removeChild(popup.element);
      popup.unrender();
    };

    popup.onClose = () => {
      card.update(data);
      document.body.removeChild(popup.element);
      popup.unrender();
    };
  }
};

renderCards(initialCards);

// card.onCommentsClick = () => {
//   popup.render();
//   document.body.appendChild(popup.element);
// };

// card.onAddToWatchList = (boolean) => {
//   data.addedToWathed = boolean;
//   popup.update(data);
// };

// card.onMarkAsWatched = (boolean) => {
//   data.isWatched = boolean;
//   popup.update(data);
// };

// card.onMarkAsFavorite = (boolean) => {
//   data.isFavorite = boolean;
//   popup.update(data);
// };

// popup.onSubmit = (newData) => {
//   filmListElement.removeChild(card.element);
//   card.unrender();
//   card.update(newData);
//   card.render();
//   filmListElement.appendChild(card.element);
//   document.body.removeChild(popup.element);
//   popup.unrender();
// };

// popup.onClose = () => {
//   card.update(data);
//   document.body.removeChild(popup.element);
//   popup.unrender();
// };
