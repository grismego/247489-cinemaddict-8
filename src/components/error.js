import BaseComponent from "app/components/base";
import {createErrorTemplate} from '../templates/error';

export default class ErrorComponent extends BaseComponent {
  get template() {
    return createErrorTemplate();
  }
}
