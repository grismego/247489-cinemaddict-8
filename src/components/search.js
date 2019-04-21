import {createSearchTemplate} from 'app/templates/search';
import BaseComponent from 'app/components/base';

export default class SearchComponent extends BaseComponent {
  constructor(data) {
    super(data);
    this._onSearchInput = this._onSearchInput.bind(this);
  }

  get template() {
    return createSearchTemplate();
  }

  set onSearch(fn) {
    this._searchCallback = fn;
  }

  _onSearchInput(evt) {
    evt.preventDefault();
    if (typeof this._searchCallback === `function`) {
      this._searchCallback(evt.target.value);
    }
  }

  _createListeners() {
    if (this._element) {
      this._inputSearchElement = this._element.querySelector(`input`);

      this._inputSearchElement
        .addEventListener(`input`, this._onSearchInput);
    }
  }

  _removeListeners() {
    if (this._element) {
      this._inputSearchElement.removeEventListener(`input`, this._onSearchInput);
      this._inputSearchElement = null;
    }
  }
}
