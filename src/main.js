// import {createTemplates as createCardTemplate} from './templates/cards';

// import {createStatisticTemplate, createStatisticListTemplate} from './templates/statistics';

import {generateFilters} from './mocks/filters';
import {generateCards} from './mocks/cards';

// import CardComponent from './components/card';
// import PopupComponent from './components/popup';
import FiltersComponent from './components/filters';

// import {drawStat, watchedStatistics} from './stat';
// import {createElement} from './util';

const CARD_LIMIT_DEFAULT = 10;
const CARD_LIMIT_EXTRA = 2;
const BAR_HEIGHT = 50;

const mainElement = document.querySelector(`.main`);
const statBoardElement = document.querySelector(`.statistic`);
const filmBoardElement = document.querySelector(`.films`);

/*
const filmListElement = document.querySelector(`.films-list .films-list__container`);
const filmListRatedElement = document.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);
const filmListCommentedElement = document.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);

filmListRatedElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT_EXTRA), false);
filmListCommentedElement.innerHTML = createCardTemplate(generateCards(CARD_LIMIT_EXTRA), false);
*/

// / const cardsComponent = new CardsComponent(cards


const cards = generateCards(CARD_LIMIT_DEFAULT);
const filters = generateFilters(cards);

const filtersComponent = new FiltersComponent({ filters, cards });
const cardsComponent = new CardsComponent({ cards });

filtersComponent.onChange = ({ filterId, filteredCards }) => {
  if (filterId === `all`) {
    statBoardElement.classList.add(`visually-hidden`);
    filmBoard.classList.remove(`visually-hidden`);
  }

  filmListElement.innerHTML = ``;
  renderCards(filteredCards)
};

mainElement.insertAdjacentElement(`afterbegin`, filtersComponent.render());

const renderCards = (cards) => {
  cards.forEach((card) => {
    const component = new ComposedCardComponent(card)

    component.onChange = (prevElement, nextElement) => {
      filmListElement.replaceChild(nextElement, prevElement);
    }

    filmListElement.appendChild(component.render());
  })
}
/*


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

const RankLabels = {
  Comedies: `ComedyMan`,
  History: `HistoryLover`,
  Drama: `DramaTic`,
  Horror: `HorrorAble`,
  Series: `SeriesLonger`,
  Westerns: `Gunner`,
  Action: `ActionEr`,
  Adventure: `Driver`
};

renderCards(initialCards);

const statisticElement = createElement(createStatisticTemplate(watchedStatistics));
mainElement.appendChild(statisticElement);

const rankLabelElement = document.querySelector(`.statistic__rank-label`);
const profileRankElement = document.querySelector(`.profile__rating`);

const statisticCtx = document.querySelector(`.statistic__chart`);
statisticCtx.height = BAR_HEIGHT * 5;

drawStat(statisticCtx, initialCards);

profileRankElement.innerHTML = RankLabels[watchedStatistics.mostWatchedGenre];

const onStatClick = () => {
  const prevStatisticList = statisticElement.querySelector(`.statistic__text-list`);
  const nextStatisticList = createElement(createStatisticListTemplate(watchedStatistics));

  drawStat(statisticCtx, initialCards);
  profileRankElement.innerHTML = RankLabels[watchedStatistics.mostWatchedGenre];
  statBoard.replaceChild(nextStatisticList, prevStatisticList);

  statBoard.classList.remove(`visually-hidden`);
  filmBoard.classList.add(`visually-hidden`);

  rankLabelElement.innerHTML = rankLabels[watchedStatistics.mostWatchedGenre];
};

document.querySelector(`.main-navigation__item--additional`)
  .addEventListener(`click`, onStatClick);
*/
