import BaseComponent from './component';
import CardComponent from './card';
import {createCardsTemplate} from '../templates/cards';

export default class CardsComponent extends BaseComponent {
  constructor(data) {
    super(data);
    this.components = null;
  }

  get template() {
    return createCardsTemplate(this._data.filters);
  }

  render() {
    const element = super.render();
    this.components = this._data.map((card) => {
      const component = new CardComponent(card);
      console.log(component);
      element.querySelector(`.films-list__container`).appendChild(component.render());
      return component;
    });


    return element;
  }

  unrender() {
    this.components.forEach((component) => {
      this.element.removeChild(component.element);
      component.unrender();
    });

    this.components = null;

    super.unrender();
  }

  _bind() {
  }

  _unbind() {
  }
}
