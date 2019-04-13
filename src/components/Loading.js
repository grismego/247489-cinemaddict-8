import BaseComponent from "./Base";
import {createLoadingTemplate} from '../templates/loading';
export default class LoadComponent extends BaseComponent {
  get template() {
    return createLoadingTemplate();
  }
}
