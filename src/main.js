// import {createTemplates as createCardTemplate} from './templates/cards';

// import {createStatisticTemplate, createStatisticListTemplate} from './templates/statistics';
// import {drawStat, watchedStatistics} from './stat';

import FiltersComponent from './components/Filters';
import CardSectionsComponent from './components/CardSections';
import StatisticComponent from './components/Statistic';

import {generateFilters} from './mocks/filters';
import {generateCards} from './mocks/cards';

const CARD_LIMIT_DEFAULT = 10;
const CARD_LIMIT_EXTRA = 2;
const BAR_HEIGHT = 50;

const mainElement = document.querySelector(`.main`);
const statBoardElement = document.querySelector(`.statistic`);

let cards = generateCards(CARD_LIMIT_DEFAULT);
let filters = generateFilters(cards);

const filtersComponent = new FiltersComponent({filters, cards});
const cardSectionsComponent = new CardSectionsComponent({
  allCards: cards,
  filteredCards: cards,
});

const statisticComponent = new StatisticComponent(cards);

filtersComponent.onChange = ({filterId, filteredCards}) => {
  const prevElement = cardSectionsComponent.element;

  cardSectionsComponent.unrender();
  cardSectionsComponent.update({filteredCards});

  const nextElement = cardSectionsComponent.render();
  mainElement.replaceChild(nextElement, prevElement);

  if (filterId === `all`) {
    statisticComponent.hide();
    cardSectionsComponent.show();
  }

  if (filterId === `stats`) {
    statisticComponent.show();
    cardSectionsComponent.hide();
  }
};

cardSectionsComponent.onCardsChange = (updatedCards) => {

  const prevFiltersElement = filtersComponent.element;
  filtersComponent.unrender();
  filtersComponent.update({
    cards: updatedCards,
    filters: generateFilters(updatedCards)
  });
  mainElement.replaceChild(filtersComponent.render(), prevFiltersElement);

  const prevStatisticElement = statisticComponent.element;
  statisticComponent.unrender();
  statisticComponent.update(updatedCards);
 
  cardSectionsComponent.updatePartial();


  // debugger;
  // const prevRatedSectionComponent = cardSectionsComponent.componentSectionRated.element;
  // cardSectionsComponent.componentSectionRated.unrender();
  // console.log(cardSectionsComponent.componentSectionRated)
  // cardSectionsComponent.componentSectionRated.update({allCards: updatedCards});

  // mainElement.querySelector(`.films`).replaceChild(cardSectionsComponent.componentSectionRated.render(), prevRatedSectionComponent);

  mainElement.replaceChild(statisticComponent.render(), prevStatisticElement);
};

mainElement.appendChild(cardSectionsComponent.render());
mainElement.insertAdjacentElement(`afterbegin`, filtersComponent.render());
mainElement.appendChild(statisticComponent.render());

/*

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
