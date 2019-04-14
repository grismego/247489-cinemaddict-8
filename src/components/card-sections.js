import BaseComponent from 'app/components/base';
import CardSection from 'app/components/card-section';

export default class CardSectionsComponent extends BaseComponent {
  constructor(data) {
    super(data);
    this.componentSectionAll = null;
    this.componentSectionRated = null;
    this.componentSectionTopComment = null;

    this._cardsChangeCallback = null;
    this._data.filterBy = null;
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

  _filterCardsByComments(cards) {
    return cards.slice().sort((a, b) => b.comments.length - a.comments.length);
  }

  _filterCardsByRating(cards) {
    return cards.slice().sort((a, b) => b.rating - a.rating);
  }

  show() {
    this.element.classList.remove(`visually-hidden`);
  }

  hide() {
    this.element.classList.add(`visually-hidden`);
  }

  updatePartial() {
    const prevElementRated = this.componentSectionRated.element;
    const prevElementComment = this.componentSectionTopComment.element;

    this.componentSectionRated.unrender();
    this.componentSectionTopComment.unrender();

    this.componentSectionRated.update(this._filterCardsByRating(this._data.cards).slice(0, 2));
    this.componentSectionTopComment.update(this._filterCardsByComments(this._data.cards).slice(0, 2));

    this.element.replaceChild(this.componentSectionRated.render(), prevElementRated);
    this.element.replaceChild(this.componentSectionTopComment.render(), prevElementComment);
  }

  _getFilteredCards() {
    const {cards, filterBy} = this._data;
    return filterBy ? cards.filter(filterBy) : cards;
  }

  render() {
    const element = super.render();
    const {cards} = this._data;

    this.componentSectionAll = new CardSection(this._getFilteredCards(), {
      title: `All Movies`,
      showMore: true
    });

    this.componentSectionRated = new CardSection(this._filterCardsByRating(cards).slice(0, 2), {
      title: `Top rated`,
      isExtra: true
    });

    this.componentSectionTopComment = new CardSection(this._filterCardsByComments(cards).slice(0, 2), {
      title: `Top Comment`,
      isExtra: true
    });

    const onCardChange = (updatedCard) => {
      this._data.cards = this._data.cards.map((card) => {
        return card.id === updatedCard.id ? updatedCard : card;
      });

      if (typeof this._cardsChangeCallback === `function`) {
        this._cardsChangeCallback(this._data.cards, updatedCard);
      }

      this.componentSectionAll.update(this._getFilteredCards());
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

    this.componentSectionAll.onCardChange = onCardChange;
    this.componentSectionRated.onCardChange = onCardChange;
    this.componentSectionTopComment.onCardChange = onCardChange;

    this.componentSectionAll.onCommentSubmit = submitComment;
    this.componentSectionAll.onRatingSubmit = submitRating;

    element.appendChild(this.componentSectionAll.render());
    element.appendChild(this.componentSectionRated.render());
    element.appendChild(this.componentSectionTopComment.render());

    return element;
  }

  unrender() {
    const prevElementAll = this.componentSectionAll.element;
    const prevElementRated = this.componentSectionRated.element;
    const prevElementTopComment = this.componentSectionTopComment.element;

    this.componentSectionAll.unrender();
    this.componentSectionRated.unrender();
    this.componentSectionTopComment.unrender();

    this.element.removeChild(prevElementAll);
    this.element.removeChild(prevElementRated);
    this.element.removeChild(prevElementTopComment);

    super.unrender();
  }
}
