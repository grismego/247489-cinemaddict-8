import BaseComponent from './component';
import CardComponent from './card';
import PopupComponent from './popup';
import FiltersComponent from './filters';
import {createCardSectionTemplate} from '../templates/cards';


export default class CardsComponent extends BaseComponent {
  constructor(data) {
    super(data);

    this.components = null;
    this._changeCallback = null;
  }

  get template() {
    return createCardSectionTemplate(`All movies`, false, true);
  }

  set onChange(fn) { // onCardChange
    this._changeCallback = fn; // @TODO: _changeCardCallback
  }

  _bind() { }

  _unbind() { }

  render() {
    const sectionElement = super.render();
    const containerElement = sectionElement.querySelector(`.films-list__container`);

    this.components = this._data.map((data) => {
      const cardComponent = new CardComponent(data);
      const popupComponent = new PopupComponent(data);
      const filterComponent = new FiltersComponent(data);

      containerElement.appendChild(cardComponent.render());

      cardComponent.onCommentsClick = () => {
        popupComponent.render();
        if (typeof this._changeCallback === `function`) {
          this._changeCallback(this._data);
        }
        document.body.appendChild(popupComponent.element);
      };

      cardComponent.onAddToWatchList = (isAddedToWatched) => {
        data.isAddedToWatched = isAddedToWatched;
        if (typeof this._changeCallback === `function`) {
          this._changeCallback(this._data);
        }
        popupComponent.update(data);
        filterComponent.update(data);
      };

      cardComponent.onMarkAsWatched = (isWatched) => {
        data.isWatched = isWatched;
        if (typeof this._changeCallback === `function`) {
          this._changeCallback(this._data);
        }
        popupComponent.update(data);
        filterComponent.update(data);
      };

      cardComponent.onMarkAsFavorite = (isFavorite) => {
        data.isFavorite = isFavorite;
        if (typeof this._changeCallback === `function`) {
          this._changeCallback(this._data);
        }
        popupComponent.update(data);
        filterComponent.update(data);
      };

      popupComponent.onSubmit = (newData) => {
        const editElement = cardComponent.element;

        cardComponent.unrender();
        cardComponent.update(newData);
        cardComponent.render();

        if (typeof this._changeCallback === `function`) {
          this._changeCallback(this._data);
        }

        containerElement.replaceChild(cardComponent.render(), editElement);
        document.body.removeChild(popupComponent.element);
        popupComponent.unrender();
      };

      popupComponent.onClose = () => {
        document.body.removeChild(popupComponent.element);
        popupComponent.unrender();
      };

      return cardComponent;
    });

    return sectionElement;
  }

  unrender() {
    this.components.forEach((component) => {
      this.element.removeChild(component.element);
      component.unrender();
    });

    this.components = null;

    super.unrender();
  }
}
