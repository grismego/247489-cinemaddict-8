import BaseComponent from 'app/components/base';
import CardComponent from 'app/components/card';
import PopupComponent from 'app/components/popup';
import {createCardSectionTemplate} from 'app/templates/cards';

export default class CardSectionComponent extends BaseComponent {
  constructor(data, options = {}) {
    super(data);

    this._options = options;

    this.components = null;
    this._changeCardCallback = null;

    this._onShowMoreClick = this._onShowMoreClick.bind(this);
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

  set onCommentSubmit(fn) {
    this._onCommentSubmit = fn;
  }

  set onRatingSubmit(fn) {
    this._onRatingSubmit = fn;
  }

  render() {
    const sectionElement = super.render();
    const containerElement = sectionElement.querySelector(`.films-list__container`);

    this.components = this._data.map((data) => {
      this._options.withOption = sectionElement.classList.contains(`films-list--extra`);

      const cardComponent = new CardComponent(data, !this._options.withOption);

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

      popupComponent.onSubmit = (popupData, showCommentSubmitError, enablePopup) => {
        // updateCardComponent(popupData);
        if (typeof this._onCommentSubmit === `function`) {
          this._onCommentSubmit(popupData, showCommentSubmitError, enablePopup);
        } else {
          enablePopup();
        }
      };

      popupComponent.onClose = () => {
        // updateCardComponent(popupData);
        document.body.removeChild(popupComponent.element);
        popupComponent.unrender();
      };

      popupComponent.onMarkAsFavorite = (isFavorite) => {
        updateCardComponent({isFavorite});
        cardComponent.update(data);
      };

      popupComponent.onAddToWatchList = (isAddedToWatched) => {
        updateCardComponent({isAddedToWatched});
        cardComponent.update(data);
      };

      popupComponent.onMarkAsWatched = (isWatched) => {
        updateCardComponent({isWatched});
        cardComponent.update(data);
      };

      popupComponent.onRatingSubmit = (popupData, showRatingSubmitError, showNewRating) => {
        if (typeof this._onRatingSubmit === `function`) {
          this._onRatingSubmit(popupData, showRatingSubmitError, showNewRating);
        }
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
