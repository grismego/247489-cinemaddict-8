import BaseComponent from 'app/components/base';
import {createStatisticTemplate} from '../templates/statistics';
import ChartComponent from 'app/components/chart';

export default class StatisticComponent extends BaseComponent {
  constructor(data) {
    super(data);
    this._filteredData = this._data.filter((item) => item.isWatched);
  }

  get template() {
    return createStatisticTemplate(this._getCardsStatistics(this._data));
  }

  _getTotalDuration(cards) { // @TODO: static - читай критерии
    return cards.reduce((accumulator, card) => accumulator + card.duration, 0);
  }

  _sortObject(obj) {
    return Object.entries(obj).sort((a, b) => b[1] - a[1]);
  }

  show() {
    this._renderChart();
    this.element.classList.remove(`visually-hidden`);
  }

  hide() {
    this._unrenderChart();
    this.element.classList.add(`visually-hidden`);
  }

  _createLabels(data) {
    return this._sortObject(data).map((item) => item[0]);
  }
  _createValues(data) {
    return this._sortObject(data).map((item) => item[1]);
  }

  _getStat(cards) {
    const genresStats = {};
    const filteredCards = cards.filter((card) => card.isWatched);

    filteredCards.forEach((card) => {
      if (genresStats.hasOwnProperty([card.genre])) {
        genresStats[[card.genre]]++;
      } else {
        genresStats[[card.genre]] = 1;
      }
    });
    const BAR_HEIGHT = 50;

    const labels = this._createLabels(genresStats);
    const values = this._createValues(genresStats);

    const statChartElement = this._element.querySelector(`.statistic__chart`);

    statChartElement.getContext(`2d`);
    statChartElement.height = BAR_HEIGHT * labels.length;

    return {
      ctx: statChartElement,
      labels,
      values
    };
  }

  _getCardsStatistics(cards) {
    const filteredCards = cards.filter((card) => card.isWatched);
    const statistics = {};
    const genresStats = {};

    filteredCards.forEach((card) => {
      if (genresStats.hasOwnProperty([card.genre])) {
        genresStats[[card.genre]]++;
      } else {
        genresStats[[card.genre]] = 1;
      }
    });

    const labels = this._sortObject(genresStats).map((item) => item[0]);

    statistics.watchedAmount = filteredCards.length;
    statistics.watchedDuration = this._getTotalDuration(filteredCards);
    statistics.mostWatchedGenre = labels[0];

    return statistics;
  }

  _unrenderChart() {
    if (this._chart) {
      this._chart.unrender();
      this._chart = null;
    }
  }

  _renderChart() {
    this._chart = new ChartComponent(this._getStat(this._data));
    this._chart.render();
  }

  render() {
    const element = super.render();
    this._renderChart();

    return element;
  }

  unrender() {
    this._unrenderChart();
    super.unrender();
  }
}
