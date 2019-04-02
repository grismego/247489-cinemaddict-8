import BaseComponent from './Base';
import CardComponent from './Card';
import PopupComponent from './Popup';
import {createCardSectionTemplate} from '../templates/cards';

export default class CardSectionComponent extends BaseComponent {
  constructor(data, options = {}) {
    super(data);

    this._options = options;

    this.components = null;
    this._changeCardCallback = null;
  }

  get template() {
    return createCardSectionTemplate(
        this._options.title,
        this._options.isExtra,
        this._options.showMore
    );
  }

  set onCardChange(fn) {
    this._changeCardCallback = fn;
  }

  render() {
    const sectionElement = super.render();
    const containerElement = sectionElement.querySelector(`.films-list__container`);

    this.components = this._data.map((data) => {
      this._options
          .withOption = sectionElement.classList
                                .contains(`films-list--extra`) ? false : true;

      const cardComponent = new CardComponent(data, this._options.withOption);
      const popupComponent = new PopupComponent(data);

      const updateCardComponent = (props) => {
        const prevElement = cardComponent.element;

        cardComponent.unrender();
        cardComponent.update(props);
        cardComponent.render();

        if (typeof this._changeCardCallback === `function`) {
          this._changeCardCallback(cardComponent._data);
        }

        containerElement.replaceChild(cardComponent.element, prevElement);
      };

      containerElement.appendChild(cardComponent.render());

      cardComponent.onCommentsClick = () => {
        popupComponent.render();
        document.body.appendChild(popupComponent.element);
      };

      cardComponent.onAddToWatchList = (isAddedToWatched) => {
        updateCardComponent({isAddedToWatched});
        popupComponent.update(data);
      };

      cardComponent.onMarkAsWatched = (isWatched) => {
        updateCardComponent({isWatched});
        popupComponent.update(data);
      };

      cardComponent.onMarkAsFavorite = (isFavorite) => {
        updateCardComponent({isFavorite});
        popupComponent.update(data);
      };

      popupComponent.onSubmit = (newData) => {
        updateCardComponent(newData);
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
    const containerElement = this.element.querySelector(`.films-list__container`);
    this.components.forEach((component) => {
      containerElement.removeChild(component.element);
      component.unrender();
    });

    this.components = null;

    super.unrender();
  }
}
