import BaseComponent from 'app/components/base';
import CardComponent from 'app/components/card';
import PopupComponent from 'app/components/popup';
import {createCardSectionTemplate} from 'app/templates/cards';

const defaultData = {
  cards: []
};

export default class CardSectionComponent extends BaseComponent {
  constructor(data = defaultData, options = {}) {
    super(data);
    this._options = options;

    this._currentPage = 0;

    this._components = null;
    this._changeCardCallback = null;
    this._showMoreButtonElement = null;

    this._createCardComponent = this._createCardComponent.bind(this);
    this._onShowMoreClick = this._onShowMoreClick.bind(this);
  }

  get template() {
    return createCardSectionTemplate(this._options);
  }

  set onCardChange(fn) {
    this._changeCardCallback = fn;
  }

  set onCommentSubmit(fn) {
    this._сommentSubmitCallback = fn;
  }

  set onRatingSubmit(fn) {
    this._ratingSubmitCallback = fn;
  }

  _getCurrentCards() {
    const page = this._currentPage;
    const limit = this._options.cardsLimit;

    return this._data.cards.slice(page * limit, (page + 1) * limit);
  }

  _onShowMoreClick(evt) {
    evt.preventDefault();
    this._currentPage++;

    const cards = this._getCurrentCards();

    cards.forEach((card) => {
      let component = this._createCardComponent(card);
      this._components.push(component);
      this._cardsContainerElement.appendChild(component.render());
    });

  }

  _createCardComponent(card) {
    this._options.withOption = this.element.classList.contains(`films-list--extra`);

    const cardComponent = new CardComponent(card, !this._options.withOption);
    const popupComponent = new PopupComponent(card);

    const updateCardComponent = (props) => {
      const prevElement = cardComponent.element;

      cardComponent.unrender();
      cardComponent.update(props);

      this._cardsContainerElement.replaceChild(cardComponent.render(), prevElement);

      if (typeof this._changeCardCallback === `function`) {
        this._changeCardCallback(cardComponent._data);
      }
    };


    cardComponent.onCommentsClick = () => {
      popupComponent.render();
      document.body.appendChild(popupComponent.element);
    };

    cardComponent.onAddToWatchList = (isAddedToWatched) => {
      updateCardComponent({isAddedToWatched});
      popupComponent.update(card);
    };

    cardComponent.onMarkAsWatched = (isWatched) => {
      updateCardComponent({isWatched});
      popupComponent.update(card);
    };

    cardComponent.onMarkAsFavorite = (isFavorite) => {
      updateCardComponent({isFavorite});
      popupComponent.update(card);
    };

    popupComponent.onClose = () => {
      document.body.removeChild(popupComponent.element);
      popupComponent.unrender();
    };

    popupComponent.onMarkAsFavorite = (isFavorite) => {
      updateCardComponent({isFavorite});
      cardComponent.update(card);
    };

    popupComponent.onAddToWatchList = (isAddedToWatched) => {
      updateCardComponent({isAddedToWatched});
      cardComponent.update(card);
    };

    popupComponent.onMarkAsWatched = (isWatched) => {
      updateCardComponent({isWatched});
      cardComponent.update(card);
    };

    popupComponent.onSubmit = (popupData, showCommentSubmitError, enablePopup) => {
      if (typeof this._onCommentSubmit === `function`) {
        this._сommentSubmitCallback(popupData, showCommentSubmitError, enablePopup);
      }
    };

    popupComponent.onRatingSubmit = (popupData, showRatingSubmitError, showNewRating) => {
      if (typeof this._onRatingSubmit === `function`) {
        this._ratingSubmitCallback(popupData, showRatingSubmitError, showNewRating);
      }
    };

    return cardComponent;
  }

  render() {
    const sectionElement = super.render();
    const cards = this._getCurrentCards();

    this._cardsContainerElement = sectionElement.querySelector(`.films-list__container`);

    this._components = cards.map((card) => {
      const component = this._createCardComponent(card);
      this._cardsContainerElement.appendChild(component.render());
      return component;
    });

    return sectionElement;
  }

  _createListeners() {
    if (this._options.showMore) {
      this._showMoreButtonElement = this.element.querySelector(`.films-list__show-more`);
      this._showMoreButtonElement.addEventListener(`click`, this._onShowMoreClick);
    }
  }

  _removeListeners() {
    if (this._options.showMore) {
      this._showMoreButtonElement.removeEventListener(`click`, this._onShowMoreClick);
      this._showMoreButtonElement = null;
    }
  }

  unrender() {
    const containerElement = this.element.querySelector(`.films-list__container`);

    this._components.forEach((component) => {
      containerElement.removeChild(component._element);
      component.unrender();
    });

    this._components = null;
    this._cardsContainerElement = null;

    super.unrender();
  }
}
