import {createTemplates as createCardTemplate} from './templates/cards';

import {generateFilters} from './mocks/filters';
import {generateCards} from './mocks/cards';

import CardComponent from './components/card';
import PopupComponent from './components/popup';
import FilterComponent from './components/filter';
import {drawStat, watchedStatistics} from './stat';

const CARD_LIMIT_DEFAULT = 10;
const CARD_LIMIT_EXTRA = 2;

const navigationElement = document.querySelector(`.main-navigation`);
const filmListElement = document.querySelector(`.films-list .films-list__container`);
const filmListRatedElement = document.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);
const filmListCommentedElement = document.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);

const filmBoard = document.querySelector(`.films`);
const statBoard = document.querySelector(`.statistic`);
const textStatistic = document.querySelectorAll(`p.statistic__item-text`);
const rankLabelElement = document.querySelector(`.statistic__rank-label`);
const profileRankElement = document.querySelector(`.profile__rating`);

filmListRatedElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT_EXTRA), false);
filmListCommentedElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT_EXTRA), false);


const countDuration = (duration) => (
  [
    Math.floor(duration / 60),
    duration % 60
  ]
);

const filterCards = (cards, filterName) => {
  switch (filterName) {
    case `All movies`:
      statBoard.classList.add(`visually-hidden`);
      filmBoard.classList.remove(`visually-hidden`);
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
const initialCards = generateCards(CARD_LIMIT_DEFAULT);

const renderCards = (cards) => {
  for (const data of cards) {
    const cardComponent = new CardComponent(data);
    const popupComponent = new PopupComponent(data);

    filmListElement.appendChild(cardComponent.render());

    cardComponent.onCommentsClick = () => {
      popupComponent.render();
      document.body.appendChild(popupComponent.element);
    };

    cardComponent.onAddToWatchList = (boolean) => {
      data.addedToWathed = boolean;
      popupComponent.update(data);
    };

    cardComponent.onMarkAsWatched = (boolean) => {
      data.isWatched = boolean;
      popupComponent.update(data);
    };

    cardComponent.onMarkAsFavorite = (boolean) => {
      data.isFavorite = boolean;
      popupComponent.update(data);
    };

    popupComponent.onSubmit = (newData) => {
      const editElement = cardComponent.element;

      cardComponent.unrender();
      cardComponent.update(newData);
      cardComponent.render();

      filmListElement.replaceChild(cardComponent.render(), editElement);
      document.body.removeChild(popupComponent.element);
      popupComponent.unrender();
    };


    popupComponent.onClose = () => {
      cardComponent.update(data);
      document.body.removeChild(popupComponent.element);
      popupComponent.unrender();
    };
  }
};

const getRankLabel = (genre) => {
  switch (genre) {
    case `Comedy`:
      return `ComedyMan`;

    case `History`:
      return `HistoryLover`;

    case `Drama`:
      return `DramaTic`;

    case `Horror`:
      return `HorrorAble`;

    case `Series`:
      return `SeriesLonger`;

    case `Western`:
      return `Gunner`;

    case `Action`:
      return `ActionEr`;

    case `Adventure`:
      return `Driver`;

    default:
      return `Uups`;
  }
};

renderCards(initialCards);

filtersData.forEach((item) => {
  const filterComponent = new FilterComponent(item);
  navigationElement.appendChild(filterComponent.render());

  filterComponent.onFilter = (evt) => {
    const filterName = evt.target.textContent.replace(/\d+/g, ``).trim();
    const filteredCards = filterCards(initialCards, filterName);
    filmListElement.innerHTML = ``;
    renderCards(filteredCards);
  };
});

drawStat(initialCards);
let rankLabel = getRankLabel(watchedStatistics.mostWatchedGenre);
profileRankElement.innerHTML = rankLabel;


const onStatClick = () => {

  drawStat(initialCards);
  rankLabel = getRankLabel(watchedStatistics.mostWatchedGenre);
  profileRankElement.innerHTML = rankLabel;

  statBoard.classList.remove(`visually-hidden`);
  filmBoard.classList.add(`visually-hidden`);

  textStatistic[0]
    .innerHTML = `${watchedStatistics.watchedAmount} <span class="statistic__item-description">movies</span>`;

  const [hours, mins] = countDuration(watchedStatistics.watchedDuration);

  textStatistic[1]
    .innerHTML = `${hours} <span class="statistic__item-description">h</span> ${mins} <span class="statistic__item-description">m</span>`;
  textStatistic[2]
    .innerHTML = watchedStatistics.mostWatchedGenre;

  rankLabelElement.innerHTML = rankLabel;
};

document.querySelector(`.main-navigation__item--additional`)
  .addEventListener(`click`, onStatClick);
