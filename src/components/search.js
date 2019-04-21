import {createSearchTemplate} from 'app/templates/search';
import BaseComponent from 'app/components/base';

export default class SearchComponent extends BaseComponent {
  constructor(data) {
    super(data);
    this._onSearch = this._onSearch.bind(this);
  }

  get template() {
    return createSearchTemplate();
  }

  set onSearch(fn) {
    this._searchCallback = fn;
  }

  _onSearch(evt) {
    evt.preventDefault();
    if (typeof this._searchCallback === `function`) {
      this._searchCallback(evt.target.value);
    }
  }

  _createListeners() {
    if (this._element) {
      this
        ._element
        .querySelector(`input`)
        .addEventListener(`input`, this._onSearch);
    }
  }

  _removeListeners() {
    if (this._element) {
      this
        ._element
        .querySelector(`input`)
        .removeEventListener(`input`, this._onSearch);
    }
  }
}
