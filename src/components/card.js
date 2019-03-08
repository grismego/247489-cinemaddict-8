import {createTemplate} from '../templates/cards';
import {createElement} from '../util';

export default class Card {
  constructor(data) {
    this._data = data;
    this._element = null;
    this._onClick = this._onClick.bind(this);
  }
  get template() {
    return createTemplate(this._data, true);
  }
  get element() {
    return this._element;
  }

  set onPopup(fn) {
    this._onPopup = fn;
  }
  _onClick() {
    return typeof this._onPopup === `function` && this._onPopup();
  }

  render() {
    this._element = createElement(this.template);
    this.bind();

    return this._element;
  }

  unrender() {
    this._element = null;
  }

  bind() {
    this._element
      .querySelector(`.film-card__comments`)
      .addEventListener(`click`, this._onClick);
  }
}
