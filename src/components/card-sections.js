import BaseComponent from 'app/components/base';
import CardSection from 'app/components/card-section';

const CARDS_EXTRA_LIMIT = 2;
const PAGE_SIZE = 5;

const defaultData = {
  cards: [],
  filterBy: null,
  searchBy: null
};

export default class CardSectionsComponent extends BaseComponent {
  constructor(data = defaultData) {
    super(Object.assign({}, defaultData, data));

    this._components = null;
    this._cardsChangeCallback = null;

    this.updatePartial = this.updatePartial.bind(this);
  }

  get template() {
    return (
      `<section class="films"></section>`
    );
  }

  set onCardChange(fn) {
    this._cardsChangeCallback = fn;
  }

  set onCommentSubmit(fn) {
    this._commentSubmitCallback = fn;
  }

  set onRatingSubmit(fn) {
    this._ratingSubmitCallback = fn;
  }

  show() {
    this.element.classList.remove(`visually-hidden`);
  }

  hide() {
    this.element.classList.add(`visually-hidden`);
  }

  updatePartial() {
    this.components.forEach((component, index) => {
      const prevElement = component.element;
      const section = CardSectionsComponent.sections[index];
      const cards = section.filterFunction(this._data.cards, this._data.filterBy, this._data.searchBy);

      component.unrender();
      component.update({cards});

      this.element.replaceChild(component.render(), prevElement);
    });
  }

  render() {
    const element = super.render();
    const documentFragment = document.createDocumentFragment();

    const onCardChange = (updatedCard) => {
      this._data.cards = this._data.cards.map((card) => (
        card.id === updatedCard.id ? updatedCard : card
      ));

      if (typeof this._cardsChangeCallback === `function`) {
        this._cardsChangeCallback(this._data.cards, updatedCard);
      }

      this.components.forEach((component) => {
        component.update(this._data.cards);
      });
    };

    const updateCard = (newData) => {
      const index = this._data.cards.findIndex((item) => item.id === newData.id);
      if (index === -1) {
        return false;
      }
      this._data.cards[index] = Object.assign({}, newData);

      return true;
    };

    const submitComment = (newData, showCommentSubmitError, enableCommentForm) => {
      if (updateCard(newData) && (typeof this._commentSubmitCallback === `function`)) {
        this._commentSubmitCallback(newData, showCommentSubmitError, enableCommentForm);
      }
    };

    const submitRating = (newData, showRatingSubmitError, showNewRating) => {
      if (updateCard(newData) && typeof this._ratingSubmitCallback === `function`) {
        this._ratingSubmitCallback(newData, showRatingSubmitError, showNewRating);
      }
    };

    this.components = CardSectionsComponent.sections.map((section) => {
      const cards = section.filterFunction(this._data.cards, this._data.filterBy, this._data.searchBy);
      const component = new CardSection({cards}, section.options);

      component.onCommentSubmit = submitComment;
      component.onCommentRemove = onCardChange;

      component.onCardChange = onCardChange;
      component.onRatingSubmit = submitRating;

      documentFragment.appendChild(component.render());

      return component;
    });

    element.appendChild(documentFragment);

    return element;
  }

  unrender() {
    this.components.forEach((component) => {
      const prevElement = component.element;
      this.element.removeChild(prevElement);
      component.unrender();
    });

    super.unrender();
  }

  static get sections() {
    return [
      {
        filterFunction: CardSectionsComponent.filterCardsByCustomFilter,
        options: {
          title: `All Movies`,
          showMore: true,
          cardsLimit: PAGE_SIZE,
        }
      },
      {
        filterFunction: CardSectionsComponent.filterCardsByRating,
        options: {
          title: `Top rated`,
          isExtra: true,
          cardsLimit: CARDS_EXTRA_LIMIT,
        }
      },
      {
        filterFunction: CardSectionsComponent.filterCardsByComments,
        options: {
          title: `Top Comment`,
          isExtra: true,
          cardsLimit: CARDS_EXTRA_LIMIT,
        }
      }
    ];
  }

  static filterCardsByComments(cards) {
    return cards.slice().sort((a, b) => b.comments.length - a.comments.length);
  }

  static filterCardsByRating(cards) {
    return cards.slice().sort((a, b) => b.rating - a.rating);
  }

  static filterCardsByCustomFilter(originalCards, filterBy, searchBy) {
    let cards = originalCards.slice();

    if (filterBy) {
      cards = cards.filter(filterBy);
    }

    if (searchBy) {
      cards = cards.filter(searchBy);
    }

    return cards;
  }
}
