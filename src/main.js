import FiltersComponent from './components/Filters';
import CardSectionsComponent from './components/CardSections';
import StatisticComponent from './components/Statistic';

import {generateFilters} from './mocks/filters';
import {generateCards} from './mocks/cards';
import {API} from './services/Api';
import ModelCards from './services/model-cards';

const CARD_LIMIT_DEFAULT = 10;


const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAosdasdada=`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;


const mainElement = document.querySelector(`.main`);

let cards = generateCards(CARD_LIMIT_DEFAULT);
let filters = generateFilters(cards);
let cardSectionsComponent;
let filtersComponent;
// const filtersComponent = new FiltersComponent({filters, cards});
// const cardSectionsComponent = new CardSectionsComponent({cards});
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

api.getData()
  .then((data) => {
    cards = data;
    filters = generateFilters(data);
    addCards();
    addFilters();
    console.log(cards);
  }).catch(() => {
    console.log('asdasdasd');
  });

// api.updateData({id})

const addCards = () => {
  cardSectionsComponent = new CardSectionsComponent({cards});
  mainElement.appendChild(cardSectionsComponent.render());

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
};

const addFilters = () => {
  filtersComponent = new FiltersComponent({filters, cards});
  mainElement.insertAdjacentElement(`afterbegin`, filtersComponent.render());

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
};


const statisticComponent = new StatisticComponent(cards);

// cardSectionsComponent.onCardsChange = (updatedCards) => {
//   const prevFiltersElement = filtersComponent.element;
//   filtersComponent.unrender();
//   filtersComponent.update({
//     cards: updatedCards,
//     filters: generateFilters(updatedCards)
//   });

//   mainElement.replaceChild(filtersComponent.render(), prevFiltersElement);

//   const prevStatisticElement = statisticComponent.element;
//   statisticComponent.unrender();
//   statisticComponent.update(updatedCards);

//   cardSectionsComponent.updatePartial();

//   mainElement.replaceChild(statisticComponent.render(), prevStatisticElement);
// };


// mainElement.insertAdjacentElement(`afterbegin`, filtersComponent.render());
mainElement.appendChild(statisticComponent.render());

