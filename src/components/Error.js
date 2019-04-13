import BaseComponent from "./Base";
import {createErrorTemplate} from '../templates/error';
export default class ErrorComponent extends BaseComponent {
  get template() {
    return createErrorTemplate();
  }
}
