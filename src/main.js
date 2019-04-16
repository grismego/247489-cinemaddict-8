import FiltersComponent from 'app/components/filters';
import CardSectionsComponent from 'app/components/card-sections';
import LoadingComponent from 'app/components/loading';
import ErrorComponent from 'app/components/error';
import StatisticComponent from 'app/components/statistic';
import SearchComponent from 'app/components/search';
import {generateFilters} from 'app/mocks/filters';

import {setUserRang} from 'app/lib/user-rang';

import ModelCard from 'app/models/card';
import ApiService from 'app/services/api';

const AUTHORIZATION = `Basic aadasd123asxc=`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;

const mainElement = document.querySelector(`.main`);
const userRangElement = document.querySelector(`.profile__rating`);
const headerElement = document.querySelector(`.header`);
const profileElement = headerElement.querySelector(`.profile`);

let cards;
let filters;

let cardSectionsComponent;
let filtersComponent;
let statisticComponent;

const searchComponent = new SearchComponent();
const loadingComponent = new LoadingComponent();
const errorComponent = new ErrorComponent();

const createFilterBySearch = (value) => (card) => card.title.toLowerCase().search(value) !== -1;

searchComponent.onSearch = (value) => {
  cardSectionsComponent.update({
    filterBy: value ? createFilterBySearch(value.toLowerCase()) : null
  });
  cardSectionsComponent.updatePartial();
};

const api = new ApiService({
  endPoint: END_POINT,
  authorization: AUTHORIZATION
});

api.getCards().then((data) => {
  cards = data;
  filters = generateFilters(data);
  mainElement.removeChild(loadingComponent.element);
  loadingComponent.unrender();
  addCards();
  addFilters();
  userRangElement.innerHTML = setUserRang(cards.filter((card) => card.isWatched).length);
}).catch((err) => {
  console.log(err);
  mainElement.innerHTML = ``;
  mainElement.appendChild(errorComponent.render());
});

const syncCards = (cardModel) => {
  const index = cards.findIndex((item) => item.id === cardModel.id);
  if (index > -1) {
    cards[index] = Object.assign({}, cardModel);
  }
};

// const updateCardsList = (updatedData, id) => {
//   api.updateCard({id: updatedData.id, newData: ModelCard.toRAW(updatedData)})
//     .then((cardModel) => {
//       const index = cards.findIndex((item) => item.id === id);
//       if (index !== -1) {
//         cards[index] = Object.assign({}, cardModel);
//         userRangElement.innerHTML = setUserRang(cards.filter((card) => card.isWatched).length);
//       }
//     });
// };


const addCards = () => {
  cardSectionsComponent = new CardSectionsComponent({cards});
  cardSectionsComponent.onCardsChange = (updatedCards) => {

    // updateCardsList(updatedCard, updatedCard.id);

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
      .then(()=> {
        cardSectionsComponent.updatePartial();
      })
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

    mainElement.replaceChild(cardSectionsComponent.render(filterBy), prevElement);


    if (statisticComponent.element) {
      mainElement.removeChild(statisticComponent.element);
      statisticComponent.unrender();
    }

    if (filterName === `stats`) {
      mainElement.appendChild(statisticComponent.render());
      statisticComponent.show();
      cardSectionsComponent.hide();
    }
  };
};

// addSearch();
mainElement.appendChild(loadingComponent.render());
headerElement.insertBefore(searchComponent.render(), profileElement);
