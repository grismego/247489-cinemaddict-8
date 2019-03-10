import {createPopupTemplate} from '../templates/popup';
import {Component} from './component';

export default class CardPopup extends Component {
  constructor(data) {
    super();
    this._data = data;
    this._onCloseClick = this._onCloseClick.bind(this);
  }

  get template() {
    return createPopupTemplate(this._data);
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  _onCloseClick() {
    return typeof this._onClose === `function` && this._onClose();
  }

  bind() {
    this._element.querySelector(`.film-details__close-btn`).addEventListener(`click`, this._onCloseClick);
  }
  unbind() {
    this._element.querySelector(`.film-details__close-btn`).removeEventListener(`click`, this._onCloseClick);
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}
