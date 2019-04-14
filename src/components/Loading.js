import BaseComponent from "app/components/base";
import {createLoadingTemplate} from 'app/templates/loading';

export default class LoadComponent extends BaseComponent {
  get template() {
    return createLoadingTemplate();
  }
}
