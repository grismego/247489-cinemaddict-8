import BaseComponent from "app/components/base";
import {createErrorTemplate} from '../templates/error';

export default class ErrorComponent extends BaseComponent {
  constructor(data = {error: new Error()}) {
    super(data);
  }
  get template() {
    return createErrorTemplate(this._data.error);
  }
}
