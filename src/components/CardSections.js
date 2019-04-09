import BaseComponent from './Base';
import CardSection from './CardSection';
// import {filterCardsByRating, filterCardsByComments} from '../util';

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

    this.componentSectionRated.update(this.filterCardsByRating(this._data.cards).slice(0, 2));
    this.componentSectionTopComment.update(this.filterCardsByComments(this._data.cards).slice(0, 2));

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
        if (card.id === updatedCard.id) {
          return updatedCard;
        }

        return card;
      });

      if (typeof this._cardsChangeCallback === `function`) {
        this._cardsChangeCallback(this._data.cards);
      }

      this.componentSectionAll.update(this._getFilteredCards());
    };

    this.componentSectionAll.onCardChange = onCardChange;
    this.componentSectionRated.onCardChange = onCardChange;
    this.componentSectionTopComment.onCardChange = onCardChange;

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
