import FiltersComponent from 'app/components/filters';
import CardSectionsComponent from 'app/components/card-sections';
import LoadingComponent from 'app/components/loading';
import ErrorComponent from 'app/components/error';
import StatisticComponent from 'app/components/statistic';

import {generateFilters} from 'app/mocks/filters';

import ModelCard from 'app/models/card';
import ApiService from 'app/services/api';

const AUTHORIZATION = `Basic aadasd123asxc=`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;

const mainElement = document.querySelector(`.main`);

let cards;
let filters;
let cardSectionsComponent;
let filtersComponent;
let statisticComponent;


const api = new ApiService({
  endPoint: END_POINT,
  authorization: AUTHORIZATION
});

const loadingComponent = new LoadingComponent();
const errorComponent = new ErrorComponent();

api.getCards().then((data) => {
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


const syncCards = (cardModel) => {
  const index = cards.findIndex((item) => item.id === cardModel.id);
  if (index > -1) {
    cards[index] = Object.assign({}, cardModel);
  }
};

const updateCardsList = (updatedData, id) => {
  api.updateCard({id: updatedData.id, newData: ModelCard.toRAW(updatedData)})
    .then((cardModel) => {
      const index = cards.findIndex((item) => item.id === id);
      if (index !== -1) {
        cards[index] = Object.assign({}, cardModel);
      }
    });
};


const addCards = () => {
  cardSectionsComponent = new CardSectionsComponent({cards});
  cardSectionsComponent.onCardsChange = (updatedCards, updatedCard) => {

    updateCardsList(updatedCard, updatedCard.id);

    const prevFiltersElement = filtersComponent.element;
    filtersComponent.unrender();
    filtersComponent.update({
      cards: updatedCards,
      filters: generateFilters(updatedCards)
    });
    mainElement.replaceChild(filtersComponent.render(), prevFiltersElement);

    statisticComponent.unrender();
    statisticComponent.update(updatedCards);

    cardSectionsComponent.updatePartial();
  };

  cardSectionsComponent.onCommentSubmit = (updatedCard, showPopupError, enablePopup) => {
    api
      .updateCard({
        id: updatedCard.id,
        newData: ModelCard.toRAW(updatedCard)
      })
      .then(syncCards)
      .then(enablePopup)
      .catch(showPopupError);
  };

  cardSectionsComponent.onRatingSubmit = (updatedCard, showPopupError, enableRating) => {
    api
      .updateCard({
        id: updatedCard.id,
        newData: ModelCard.toRAW(updatedCard)
      })
      .then(syncCards)
      .then(enableRating)
      .catch(showPopupError);
  };

  mainElement.appendChild(cardSectionsComponent.render());
};

const addFilters = () => {
  filtersComponent = new FiltersComponent({filters, cards});
  mainElement.insertAdjacentElement(`afterbegin`, filtersComponent.render());
  statisticComponent = new StatisticComponent(cards);
  filtersComponent.onChange = ({filterName, filterBy}) => {
    const prevElement = cardSectionsComponent.element;

    cardSectionsComponent.unrender();
    cardSectionsComponent.update({filterBy});

    mainElement.replaceChild(cardSectionsComponent.render(), prevElement);

    if (filterName === `all`) {
      statisticComponent.hide();
      statisticComponent.unrender();
      mainElement.removeChild(mainElement.lastChild);
      cardSectionsComponent.show();
    }

    if (filterName === `stats`) {
      mainElement.appendChild(statisticComponent.render());
      statisticComponent.show();
      cardSectionsComponent.hide();
    }
  };
};

mainElement.appendChild(loadingComponent.render());
