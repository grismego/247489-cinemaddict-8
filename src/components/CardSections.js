import BaseComponent from './Base';
import CardSection from './CardSection';

export default class CardSectionsComponent extends BaseComponent {
  constructor(data) { // {cards, filterId}
    super(data);

    this.componentSectionAll = null;
    this.componentSectionRated = null;

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

  render() {
    const element = super.render();

    this.componentSectionAll = new CardSection(this._data.cards, {
      title: `All Movies`,
    });

    this.componentSectionRated = new CardSection(this._data.cards, {
      title: `test2`
    });

    const onCardChange = (updatedCard) => {
      this._data = this._data.cards.map((card) => {
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

    element.appendChild(this.componentSectionAll.render());
    element.appendChild(this.componentSectionRated.render());

    return element;
  }

  unrender() {

    this.element.removeChild(this.componentSectionAll.element);
    this.element.removeChild(this.componentSectionRated.element);

    this.componentSectionAll.unrender();
    this.componentSectionRated.unrender();

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
