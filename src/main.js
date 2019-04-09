import FiltersComponent from './components/Filters';
import CardSectionsComponent from './components/CardSections';
import StatisticComponent from './components/Statistic';

import {generateFilters} from './mocks/filters';
import {generateCards} from './mocks/cards';

const CARD_LIMIT_DEFAULT = 10;

const mainElement = document.querySelector(`.main`);

let cards = generateCards(CARD_LIMIT_DEFAULT);
let filters = generateFilters(cards);

const filtersComponent = new FiltersComponent({filters, cards});
const cardSectionsComponent = new CardSectionsComponent({cards});

const statisticComponent = new StatisticComponent(cards);

filtersComponent.onChange = ({filterName, filterBy}) => {
  const prevElement = cardSectionsComponent.element;

  cardSectionsComponent.unrender();
  cardSectionsComponent.update({filterBy});

  mainElement.replaceChild(cardSectionsComponent.render(), prevElement);

  if (filterName === `all`) {
    statisticComponent.hide();
    cardSectionsComponent.show();
  }

  if (filterName === `stats`) {
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

  mainElement.replaceChild(statisticComponent.render(), prevStatisticElement);
};

mainElement.appendChild(cardSectionsComponent.render());
mainElement.insertAdjacentElement(`afterbegin`, filtersComponent.render());
mainElement.appendChild(statisticComponent.render());
