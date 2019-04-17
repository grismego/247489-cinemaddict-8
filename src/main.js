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

const api = new ApiService({
  endPoint: END_POINT,
  authorization: AUTHORIZATION
});

let cardSectionsComponent;
let filtersComponent;
let statisticComponent;

const searchComponent = new SearchComponent();
let loadingComponent = new LoadingComponent();
const errorComponent = new ErrorComponent();

const createFilterBySearch = (value) => (card) => card.title.toLowerCase().search(value) !== -1;
const updateUserRank = (cards) => userRangElement.innerHTML = setUserRang(cards.filter((card) => card.isWatched).length); // @TODO

searchComponent.onSearch = (value) => {
  cardSectionsComponent.update({
    filterBy: value ? createFilterBySearch(value.toLowerCase()) : null
  });
  cardSectionsComponent.updatePartial();
};

api.getCards().then((cards) => {
  mainElement.removeChild(loadingComponent.element);
  loadingComponent.unrender();
  loadingComponent = null;

  createCardSectionsComponent(cards);
  createFiltersComponents(cards, generateFilters(cards));
  updateUserRank(cards);
}).catch((err) => {
  console.log(err);
  mainElement.innerHTML = ``;
  mainElement.appendChild(errorComponent.render());
});

const createCardSectionsComponent = (cards) => {
  cardSectionsComponent = new CardSectionsComponent({cards});

  cardSectionsComponent.onCardsChange = (updatedCards, updatedCard) => {
    api
      .updateCard({
        id: updatedCard.id,
        newData: ModelCard.toRAW(updatedCard)
      })
      .then(() => updateUserRank(updatedCards))
      .then(() => {
        const prevFiltersElement = filtersComponent.element;

        filtersComponent.unrender();
        filtersComponent.update({
          cards: updatedCards,
          filters: generateFilters(updatedCards)
        });
        mainElement.replaceChild(filtersComponent.render(), prevFiltersElement);

        statisticComponent.unrender();
        statisticComponent.update(updatedCards);
        // @TODO: render statictic

        cardSectionsComponent.updatePartial();
      });
  };

  cardSectionsComponent.onCommentSubmit = (updatedCard, showPopupError, enablePopup) => {
    api
      .updateCard({
        id: updatedCard.id,
        newData: ModelCard.toRAW(updatedCard)
      })
      .then(cardSectionsComponent.updatePartial)
      .then(enablePopup)
      .catch((err) => {
        showPopupError();
        console.log(err);
      });
  };

  cardSectionsComponent.onRatingSubmit = (updatedCard, showPopupError, enableRating) => {
    api
      .updateCard({
        id: updatedCard.id,
        newData: ModelCard.toRAW(updatedCard)
      })
      .then(enableRating)
      .catch(showPopupError);
  };

  mainElement.appendChild(cardSectionsComponent.render());
};

const createFiltersComponents = (cards, filters) => {
  filtersComponent = new FiltersComponent({filters, cards});
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

  mainElement.insertAdjacentElement(`afterbegin`, filtersComponent.render());
};

// addSearch();
mainElement.appendChild(loadingComponent.render());
headerElement.insertBefore(searchComponent.render(), profileElement);
