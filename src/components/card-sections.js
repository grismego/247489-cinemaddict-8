import BaseComponent from 'app/components/base';
import CardSection from 'app/components/card-section';

const CARDS_EXTRA_LIMIT = 2;
const PAGE_SIZE = 5;

const defaultData = {
  cards: [],
  filterBy: null
};

export default class CardSectionsComponent extends BaseComponent {
  constructor(data = defaultData) {
    super(Object.assign({}, defaultData, data));

    this.componentSectionAll = null;
    this.componentSectionRated = null;
    this.componentSectionTopComment = null;

    this._components = null;

    this._cardsChangeCallback = null;
    //this._onShowMoreClick = this._onShowMoreClick.bind(this);
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

  get template() {
    return (
      `<section class="films"></section>`
    );
  }

  set onCardsChange(fn) {
    this._cardsChangeCallback = fn;
  }

  set onCommentSubmit(fn) {
    this._onCommentSubmit = fn;
  }

  set onRatingSubmit(fn) {
    this._onRatingSubmit = fn;
  }

  static filterCardsByComments(cards) {
    return cards.slice().sort((a, b) => b.comments.length - a.comments.length);
  }

  static filterCardsByRating(cards) {
    return cards.slice().sort((a, b) => b.rating - a.rating);
  }

  static filterCardsByCustomFilter(cards, filterBy) {
    return filterBy ? cards.filter(filterBy) : cards.slice();
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
      const cards = section.filterFunction(this._data.cards, this._data.filterBy);
      component.unrender();
      component.update({cards});

      this.element.replaceChild(component.render(), prevElement);
    });
  }

  render() {
    const element = super.render();

    const onCardChange = (updatedCard) => {
      this._data.cards = this._data.cards.map((card) => (
        card.id === updatedCard.id ? updatedCard : card
      ));

      if (typeof this._cardsChangeCallback === `function`) {
        this._cardsChangeCallback(this._data.cards, updatedCard);
      }

      this.components.forEach((component) => {
        component.update(this._data.cards)
      });
      // this.componentSectionAll.update(this._data.cards);
    };

    const submitComment = (newData, showCommentSubmitError, enableCommentForm) => {
      const index = this._data.cards.findIndex((item) => item.id === newData.id);
      if (index !== -1) {
        this._data[index] = Object.assign({}, newData);
        if (typeof this._onCommentSubmit === `function`) {
          this._onCommentSubmit(this._data[index], showCommentSubmitError, enableCommentForm);
        }
      }
    };

    const submitRating = (newData, showRatingSubmitError, showNewRating) => {
      const index = this._data.cards.findIndex((item) => item.id === newData.id);
      if (index !== -1) {
        this._data.cards[index] = Object.assign({}, newData);
        if (typeof this._onRatingSubmit === `function`) {
          this._onRatingSubmit(this._data.cards[index], showRatingSubmitError, showNewRating);
        }
      }
    };

    this.components = CardSectionsComponent.sections.map((section) => {
      const cards = section.filterFunction(this._data.cards, this._data.filterBy);
      const component = new CardSection({cards}, section.options);

      component.onCardChange = onCardChange;
      component.onCommentSubmit = submitComment;
      component.onRatingSubmit = submitRating;

      element.appendChild(component.render());

      return component;
    });

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
}
