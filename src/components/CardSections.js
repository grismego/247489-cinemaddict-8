import BaseComponent from './Base';
import CardSection from './CardSection';
import {filterCardsByRating, filterCardsByComments} from '../util';

export default class CardSectionsComponent extends BaseComponent {
  constructor(data) { // {cards, filterId}
    super(data);

    this.componentSectionAll = null;
    this.componentSectionRated = null;

    this._cardsChangeCallback = null;

    this._extraCards = Object.assign({}, data);
  }

  get template() {
    return (
      `<section class="films"></section>`
    );
  }

  set onCardsChange(fn) {
    this._cardsChangeCallback = fn;
  }

  show() {
    this.element.classList.remove(`visually-hidden`);
  }

  hide() {
    this.element.classList.add(`visually-hidden`);
  }

  _filter(cards) {
    return cards.slice();
  }

  render() {
    const element = super.render();
    // const cards = this._filter ? this._filter(this._data.cards) : this._data.cards;

    this.componentSectionAll = new CardSection(this._data.cards, {
      title: `All Movies`,
      showMore: true
    });

    // this.componentSectionRated = new CardSection(filterCardsByComments(this._data.cards).slice(0, 2), {
    //   title: `Top rated`,
    //   isExtra: true,
    // });

    // this.componentSectionTopComment = new CardSection(filterCardsByComments(this._data.cards).slice(0, 2), {
    //   title: `Top Comment`,
    //   isExtra: true,
    // });

    
    // this.componentSectionRated = new CardSection(filterCardsByRating(cards).slice(0, 2), {
    //   title: `Top rated`,
    //   isExtra: true,
    // });

    // this.componentSectionTopComment = new CardSection(filterCardsByComments(cards).slice(0, 2), {
    //   title: `Top Comment`,
    //   isExtra: true,
    // });

    this.componentSectionRated = new CardSection(filterCardsByRating(this._extraCards.cards).slice(0, 2), {
      title: `Top rated`,
      isExtra: true,
    });

    this.componentSectionTopComment = new CardSection(filterCardsByComments(this._extraCards.cards).slice(0, 2), {
      title: `Top Comment`,
      isExtra: true,
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

    this.element.removeChild(this.componentSectionAll.element);
    this.element.removeChild(this.componentSectionRated.element);
    this.element.removeChild(this.componentSectionTopComment.element);

    this.componentSectionAll.unrender();
    this.componentSectionRated.unrender();
    this.componentSectionTopComment.unrender();

    /*
    const prevElementAll = this.componentSectionAll.element;
    const prevElementRated = this.componentSectionRated.element;

    this.componentSectionAll.unrender();
    this.componentSectionRated.unrender();

    this.element.removeChild(prevElementAll);
    this.element.removeChild(prevElementRated);
    */

    super.unrender();
  }
}
