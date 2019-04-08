import BaseComponent from './Base';
import CardSection from './CardSection';
import {filterCardsByRating, filterCardsByComments} from '../util';

export default class CardSectionsComponent extends BaseComponent {
  constructor(data) {
    super(data);

    this._data.allCards = data.allCards;

    this.componentSectionAll = null;
    this.componentSectionRated = null;
    this.componentSectionTopComment = null;

    this._cardsChangeCallback = null;

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

  updatePartial() {
    const prevElementRated = this.componentSectionRated.element;
    const prevElementComment = this.componentSectionTopComment.element;

    this.componentSectionRated.unrender();
    this.componentSectionTopComment.unrender();

    this.componentSectionRated.update(filterCardsByRating(this._data.allCards).slice(0, 2));
    this.componentSectionTopComment.update(filterCardsByComments(this._data.allCards).slice(0, 2));

    this.element.replaceChild(this.componentSectionRated.render(), prevElementRated);
    this.element.replaceChild(this.componentSectionTopComment.render(), prevElementComment);
  }


  render() {
    const element = super.render();

    this.componentSectionAll = new CardSection(this._data.filteredCards, {
      title: `All Movies`,
      showMore: true
    });

    this.componentSectionRated = new CardSection(filterCardsByRating(this._data.allCards).slice(0, 2), {
      title: `Top rated`,
      isExtra: true,
    });

    this.componentSectionTopComment = new CardSection(filterCardsByComments(this._data.allCards).slice(0, 2), {
      title: `Top Comment`,
      isExtra: true,
    });

    const onCardChange = (updatedCard) => {
      this._data.allCards = this._data.allCards.map((card) => {
        if (card.id === updatedCard.id) {
          return updatedCard;
        }

        return card;
      });

      if (typeof this._cardsChangeCallback === `function`) {
        this._cardsChangeCallback(this._data.allCards);
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
