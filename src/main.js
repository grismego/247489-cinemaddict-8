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
const cardSectionsComponent = new CardSectionsComponent({cards});

filtersComponent.onChange = ({filterId, filteredCards}) => {
  if (filterId === `all`) {
    // statBoardElement.classList.add(`visually-hidden`);
    cardSectionsComponent.element.classList.remove(`visually-hidden`);
  }

  const prevElement = cardSectionsComponent.element;
  cardSectionsComponent.unrender();
  cardSectionsComponent.update({cards: filteredCards});

  const nextElement = cardSectionsComponent.render();
  mainElement.replaceChild(nextElement, prevElement);
};

cardSectionsComponent.onCardsChange = (updatedCards) => {
  const prevElement = filtersComponent.element;
  // const prevRatedElem = cardSectionsComponent.componentSectionRated.element;

  filtersComponent.unrender();
  filtersComponent.update({
    cards: updatedCards,
    filters: generateFilters(updatedCards)
  });
  // cardSectionsComponent.componentSectionRated.unrender();
  // cardSectionsComponent.componentSectionRated.update(updatedCards);
  // cardSectionsComponent.element.replaceChild(cardSectionsComponent.componentSectionRated.render(),
  //     prevRatedElem);
  // cardSectionsComponent.componentSectionTopComment.update(updatedCards);
  // cardSectionsComponent.componentSectionRated.render();

  // console.log(cardSectionsComponent);
  // todo update/unrender TopComment TopRated
  mainElement.replaceChild(filtersComponent.render(), prevElement);
};

mainElement.appendChild(cardSectionsComponent.render());
mainElement.insertAdjacentElement(`afterbegin`, filtersComponent.render());

const a = new StatisticComponent(cards);

document.body.appendChild(a.render());
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
