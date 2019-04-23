import FiltersComponent from 'app/components/filters';
import CardSectionsComponent from 'app/components/card-sections';
import LoadingComponent from 'app/components/loading';
import ErrorComponent from 'app/components/error';
import StatisticComponent from 'app/components/statistic';
import SearchComponent from 'app/components/search';
import Provider from 'app/services/provider';
import Store from 'app/services/store';
import {generateFilters} from 'app/mocks/filters';

import {setUserRang} from 'app/lib/user-rang';

import ModelCard from 'app/models/card';
import ApiService from 'app/services/api';

const AUTHORIZATION = `Basic aadas1231231sdxc=`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;
const DATA_STORE_KEY = `Moowle`;

const mainElement = document.querySelector(`.main`);
const userRangElement = document.querySelector(`.profile__rating`);
const headerElement = document.querySelector(`.header`);
const profileElement = headerElement.querySelector(`.profile`);
const footerStatisticsElement = document.querySelector(`.footer__statistics`);

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

const store = new Store({key: DATA_STORE_KEY, storage: localStorage});
const provider = new Provider({api, store});

const updateUserRank = (cards) => {
  userRangElement.innerHTML = setUserRang(cards.filter((card) => card.isWatched).length);
};

filtersComponent.onChange = (filterName, filterBy) => {
  cardSectionsComponent.update({searchBy: null});
  if (filterName === `stats`) {
    cardSectionsComponent.hide();
    if (!statisticComponent.element) {
      mainElement.appendChild(statisticComponent.render());
    }
  } else {
    const {prevElement, nextElement} = cardSectionsComponent.rerender({filterBy});
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
  provider
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
  provider
    .updateCard({
      id: card.id,
      newData: ModelCard.toRAW(card)
    })
    .then(enablePopup)
    .then(cardSectionsComponent.updatePartial())
    .catch(showPopupError);
};

cardSectionsComponent.onRatingSubmit = (card, showPopupError, enableRating) => {
  provider
    .updateCard({
      id: card.id,
      newData: ModelCard.toRAW(card)
    })
    .then(enableRating)
    .then(cardSectionsComponent.updatePartial())
    .catch(showPopupError);
};

provider.getCards().then((cards) => {
  mainElement.removeChild(loadingComponent.element);
  loadingComponent.unrender();

  cardSectionsComponent.update({cards});
  statisticComponent.update({cards});
  filtersComponent.update({cards, filters: generateFilters(cards)});

  updateUserRank(cards);
  footerStatisticsElement.innerHTML = `${cards.length} movies inside`;
  mainElement.insertAdjacentElement(`afterbegin`, filtersComponent.render());
  mainElement.appendChild(cardSectionsComponent.render());
}).catch((error) => {
  mainElement.innerHTML = ``;
  errorComponent.update({error});
  mainElement.appendChild(errorComponent.render());
});

window.addEventListener(`offline`, () => {
  document.title = `${document.title} [OFFLINE]`;
});
window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncData();
});

mainElement.appendChild(loadingComponent.render());
headerElement.insertBefore(searchComponent.render(), profileElement);

// init();

// if (`serviceWorker` in navigator) {
//   // Весь код регистрации у нас асинхронный.
//   navigator.serviceWorker.register(`sw.js`)
//     .then(() => navigator.serviceWorker.ready.then((worker) => {
//       worker.sync.register(`syncdata`);
//     }))
//     .catch((err) => console.log(err));
// }

// navigator.serviceWorker.register(`sw.js`)
//   .then((reg) => {
//   console.log(`reg succes ${reg.scope}`);
// }).catch((err) => {
//   console.log(`reg fail ${err}`);
// });


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`/sw.js`).then((registration) => {
      console.log('SW registered: ', registration);
    }).catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}