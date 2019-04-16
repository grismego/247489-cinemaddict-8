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

    this._createCardComponent = this._createCardComponent.bind(this);
    // this._onShowMoreClick = this._onShowMoreClick.bind(this);
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

  // _onShowMoreClick(e) {
  //   this._currentPage++;

  //   const page = this._currentPage;
  //   const limit = this._options.cardsLimit;
  //   const cards = this._data.cards.slice(page * limit, (page + 1) * limit);

  //   this._components = [
  //     ...this._components,
  //     ...cards.map(this._createCardComponent)
  //   ];
  // }

  _createCardComponent(card) {
    this._options.withOption = this.element.classList.contains(`films-list--extra`);

    const cardComponent = new CardComponent(card, !this._options.withOption);
    const popupComponent = new PopupComponent(card);

    const updateCardComponent = (props) => {
      const prevElement = cardComponent.element;

      cardComponent.unrender();
      cardComponent.update(props);
      // cardComponent.render();

      if (typeof this._changeCardCallback === `function`) {
        this._changeCardCallback(cardComponent._data);
      }

      this._cardsContainerElement.replaceChild(cardComponent.render(), prevElement);
    };

    // this._cardsContainerElement.appendChild(cardComponent.render());

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

    popupComponent.onSubmit = (popupData, showCommentSubmitError, enablePopup) => {
      if (typeof this._onCommentSubmit === `function`) {
        this._onCommentSubmit(popupData, showCommentSubmitError, enablePopup);
        updateCardComponent(popupData);
      }
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

    popupComponent.onRatingSubmit = (popupData, showRatingSubmitError, showNewRating) => {
      if (typeof this._onRatingSubmit === `function`) {
        this._onRatingSubmit(popupData, showRatingSubmitError, showNewRating);
      }
    };
    return cardComponent;
  }

  render() {
    const sectionElement = super.render();
    const cardsLimit = this._options.cardsLimit;

    this._cardsContainerElement = sectionElement.querySelector(`.films-list__container`);

    this._components = this._data.cards.slice(0, cardsLimit).map((card) => this._createCardComponent(card));

    this._components.forEach((component) => {
      this._cardsContainerElement.appendChild(component.render());
    });

    return sectionElement;
  }


  createListeners() {
    if (this.options.showMore) {
      this.element
        .querySelector(`.films-list__show-more`)
        .addEventListener(`click`, this._onShowMoreClick);
    }
  }

  removeListeners() {
    if (this.options.showMore) {
      this.element
        .querySelector(`.films-list__show-more`)
        .removeEventListener(`click`, this._onShowMoreClick);
    }
  }

  unrender() {


    const containerElement = this.element.querySelector(`.films-list__container`);


    this._components.forEach((component) => {
      containerElement.removeChild(component._element);
      component.unrender();
    });
    // this._components.forEach((component) => {
    //   const prevElement = component._element;
    //   this._element.removeChild(prevElement);
    //   component.unrender();
    // });

    this._components = null;
    this._cardsContainerElement = null;

    super.unrender();
  }
}
