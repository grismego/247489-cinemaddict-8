import BaseComponent from './component';
import CardComponent from './card';
import {createCardsTemplate} from '../templates/cards';
import CardPopupComponent from './popup';

export default class CardsComponent extends BaseComponent {
  constructor(data) {
    super(data);

    this.components = null;
  }

  get template() {
    return createCardsTemplate();
  }

  render() {
    const element = super.render();
    
    this.components = this._data.map((card) => {
      const component = new CardComponent(card);
      const popupComponent = new CardPopupComponent(card);

      element.querySelector(`.films-list__container`).appendChild(component.render());

      component.onCommentsClick = () => {
        popupComponent.render();
        document.body.appendChild(popupComponent.element);
      };

      popupComponent.onClose = () => {
        component.update(card);
        document.body.removeChild(popupComponent.element);
        popupComponent.unrender();
      };

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
