import {createPopupTemplate} from '../templates/popup';
import {createElement} from '../util';

export class CardPopup {
  constructor(data) {
    this._data = data;
  }
  get template() {
    return createPopupTemplate(this._data);
  }
  get element() {
    return this._element;
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  _onCloseClick() {
    return typeof this._onClose === `function` && this._onClose();
  }

  bind() {
    this._element.querySelector(`.film-details__close-btn`).addEventListener(`click`, this._onCloseClick.bind(this));
  }
  unbind() {
    this._element.querySelector(`.film-details__close-btn`).removeEventListener(`click`, this._onCloseClick.bind(this));
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }
  unrender() {
    this.unbind();
    this._element = null;
  }
}
