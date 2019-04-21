import {createSearchTemplate} from 'app/templates/search';
import BaseComponent from 'app/components/base';

export default class SearchComponent extends BaseComponent {
  constructor(data) {
    super(data);
    this._onSearchChange = this._onSearchChange.bind(this);
  }

  get template() {
    return createSearchTemplate();
  }

  set onSearch(fn) {
    this._searchCallback = fn;
  }

  _onSearchChange(evt) {
    evt.preventDefault();
    if (typeof this._searchCallback === `function`) {
      this._searchCallback(evt.target.value);
    }
  }

  _createListeners() {
    if (this._element) {
      this._inputSearchElement = this._element.querySelector(`input`);

      this._inputSearchElement
        .addEventListener(`input`, this._onSearchChange);
    }
  }

  _removeListeners() {
    if (this._element) {
      this._inputSearchElement.removeEventListener(`input`, this._onSearchChange);
      this._inputSearchElement = null;
    }
  }
}
