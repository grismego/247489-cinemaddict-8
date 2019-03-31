import BaseComponent from './component';
import CardsComponent from './components/cards';

export default class CardSectionsComponent extends BaseComponent {
  constructor(data) {
    super(data);
  }

  get template() {
    return (
      `<div></div>`
    );
  }


  render() {
    const element = super.render();

    this._data;
    // filter data

    const cardsAllComponent = new CardsComponent(data, {title: `test`});
    const cardsTopCommentComponent = new CardsComponent(data, {title: `test2`, true});
    const cardsFavoritedComponent = new CardsComponent(data, {title: `test3`, true});

    cardsAllComponent.onChange = (updatedCard) => {

    }

    if (typeof this._changeCallback === `function`) {
      this._changeCallback(this._data);
    }

    element.appendChild(cardsAllComponent.render());
    element.appendChild(cardsRatedComponent.render());


    return element;
  }

}