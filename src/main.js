import FiltersComponent from './components/Filters';
import CardSectionsComponent from './components/CardSections';
import StatisticComponent from './components/Statistic';

import {generateFilters} from './mocks/filters';
import {API} from './services/Api';
import ModelCard from './models/card';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAosdasdada=`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;

const mainElement = document.querySelector(`.main`);

let cards;
let filters;
let cardSectionsComponent;
let filtersComponent;

const api = new API({
  endPoint: END_POINT,
  authorization: AUTHORIZATION
});

api.getCards()
  .then((data) => {
    cards = data;
    filters = generateFilters(data);
    addCards();
    addFilters();
  }).catch((err) => {
    console.error(err);
  // @TODO
  });

const updateCardsList = (updatedData, id) => {
  api.updateCard({id: updatedData.id, newData: ModelCard.toRAW(updatedData)})
      .then((cardModel) => {
        const index = cards.findIndex((item) => item.id === id);
        cards[index] = Object.assign({}, cardModel);
      });
};

const addCards = () => {
  cardSectionsComponent = new CardSectionsComponent({cards});
  mainElement.appendChild(cardSectionsComponent.render());

  cardSectionsComponent.onCardsChange = (updatedCards, updatedCard) => {
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

    updateCardsList(updatedCard, updatedCard.id);

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

mainElement.appendChild(statisticComponent.render());

