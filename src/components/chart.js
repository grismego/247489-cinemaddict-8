
import BaseComponent from 'app/components/base';

export default class ChartComponent extends BaseComponent {

  render() {
    return this._chart;
  }

  unrender() {
    this._chart.destroy();
    this._chart = null;
  }
}
