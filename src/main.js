import FiltersComponent from './components/Filters';
import CardSectionsComponent from './components/CardSections';
import LoadingComponent from './components/Loading';
import ErrorComponent from './components/Error';
// import StatisticComponent from './components/Statistic';

import {generateFilters} from './mocks/filters';
import {API} from './services/Api';
import ModelCard from './models/card';


const AUTHORIZATION = `Basic dXNlck1asd29yZAad4a=`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;

const mainElement = document.querySelector(`.main`);

let cards;
let filters;
let cardSectionsComponent;
let filtersComponent;

const loadingComponent = new LoadingComponent();
const errorComponent = new ErrorComponent();

const api = new API({
  endPoint: END_POINT,
  authorization: AUTHORIZATION
});

mainElement.appendChild(loadingComponent.render());
api.getCards()
  .then((data) => {
    cards = data;
    filters = generateFilters(data);
    mainElement.removeChild(loadingComponent.element);
    loadingComponent.unrender();
    addCards();
    addFilters();
  }).catch(() => {
    mainElement.innerHTML = ``;
    mainElement.appendChild(errorComponent.render());
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

  cardSectionsComponent.onCardsChange = (updatedCards) => {
    const prevFiltersElement = filtersComponent.element;
    filtersComponent.unrender();
    filtersComponent.update({
      cards: updatedCards,
      filters: generateFilters(updatedCards)
    });
    mainElement.replaceChild(filtersComponent.render(), prevFiltersElement);

    // const prevStatisticElement = statisticComponent.element;
    // statisticComponent.unrender();
    // statisticComponent.update(updatedCards);

    // updateCardsList(updatedCard, updatedCard.id);

    cardSectionsComponent.updatePartial();

    // mainElement.replaceChild(statisticComponent.render(), prevStatisticElement);


  };

  cardSectionsComponent.onCommentSubmit = (updatedCard, cardPopup) => {
    api.updateCard({id: updatedCard.id, newData: ModelCard.toRAW(updatedCard)})
    .then(updatedCard, updatedCard.id)
    .catch(cardPopup.showCommentSubmitError);
  };

  cardSectionsComponent.onRatingSubmit = (updatedCard, cardPopup) => {
    api.updateCard({id: updatedCard.id, newData: ModelCard.toRAW(updatedCard)})
    .then(updateCardsList(updatedCard, updatedCard.id))
    .catch(cardPopup.showRatingSubmitError);
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
      // statisticComponent.hide();
      cardSectionsComponent.show();
    }

    if (filterName === `stats`) {
      // statisticComponent.show();
      cardSectionsComponent.hide();
    }
  };
};

// const statisticComponent = new StatisticComponent(cards);

// mainElement.appendChild(statisticComponent.render());

