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

const AUTHORIZATION = `Basic aadasdadsasdxc=`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;

const mainElement = document.querySelector(`.main`);
const userRangElement = document.querySelector(`.profile__rating`);
const headerElement = document.querySelector(`.header`);
const profileElement = headerElement.querySelector(`.profile`);

const api = new ApiService({
  endPoint: END_POINT,
  authorization: AUTHORIZATION
});

const loadingComponent = new LoadingComponent();
const cardSectionsComponent = new CardSectionsComponent();
const searchComponent = new SearchComponent();
const errorComponent = new ErrorComponent();
const filtersComponent = new FiltersComponent();
const statisticComponent = new StatisticComponent();

const updateUserRank = (cards) => {
  userRangElement.innerHTML = setUserRang(cards.filter((card) => card.isWatched).length);
};

filtersComponent.onChange = (filterName, filterBy) => {
  if (filterName === `stats`) {
    cardSectionsComponent.hide();
    if (!statisticComponent.element) {
      mainElement.appendChild(statisticComponent.render());
    }
  } else {
    const {prevElement, nextElement} = cardSectionsComponent.rerender({filterBy}); // @TODO
    mainElement.replaceChild(nextElement, prevElement);

    if (statisticComponent.element) {
      mainElement.removeChild(statisticComponent.element);
      statisticComponent.unrender();
    }
  }
};

searchComponent.onSearch = (value) => {
  const createFilterBySearch = (card) => (
    card.title.toLowerCase().search(value.toLowerCase()) !== -1
  );

  cardSectionsComponent.update({
    searchBy: value ? createFilterBySearch : null});
  cardSectionsComponent.updatePartial();
};

cardSectionsComponent.onCardChange = (cards, card) => {
  api
    .updateCard({
      id: card.id,
      newData: ModelCard.toRAW(card)
    })
    .then(() => updateUserRank(cards))
    .then(() => {
      const {prevElement, nextElement} = filtersComponent.rerender({
        cards,
        filters: generateFilters(cards)
      });

      mainElement.replaceChild(nextElement, prevElement);
      statisticComponent.update({cards});
    });
};

cardSectionsComponent.onCommentSubmit = (card, showPopupError, enablePopup) => {
  api
    .updateCard({
      id: card.id,
      newData: ModelCard.toRAW(card)
    })
    .then(enablePopup)
    .catch(showPopupError);
};

cardSectionsComponent.onRatingSubmit = (card, showPopupError, enableRating) => {
  api
    .updateCard({
      id: card.id,
      newData: ModelCard.toRAW(card)
    })
    .then(enableRating)
    .catch(showPopupError);
};

api.getCards().then((cards) => {
  mainElement.removeChild(loadingComponent.element);
  loadingComponent.unrender();

  cardSectionsComponent.update({cards});
  statisticComponent.update({cards});
  filtersComponent.update({cards, filters: generateFilters(cards)});

  updateUserRank(cards);

  mainElement.insertAdjacentElement(`afterbegin`, filtersComponent.render());
  mainElement.appendChild(cardSectionsComponent.render());
}).catch((error) => {
  mainElement.innerHTML = ``;
  errorComponent.update({error});
  mainElement.appendChild(errorComponent.render());
});

mainElement.appendChild(loadingComponent.render());
headerElement.insertBefore(searchComponent.render(), profileElement);
