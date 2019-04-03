import BaseComponent from './Base';
import {createStatisticTemplate} from '../templates/statistics';
import ChartComponent from './Chart';

export default class StatisticComponent extends BaseComponent {
  constructor(data) {
    super(data);
  }


  get template() {
    return createStatisticTemplate(this._getAllStat(this._data));
  }

  _setChartSettings(canvas, labels, values) {
    return {
      ctx: canvas,
      labels,
      values
    };
  }

  _getTotalDuration(cards) {
    return cards.reduce((accumulator, card) => accumulator + card.duration, 0);
  }

  _sortObject(obj) {
    return Object.entries(obj).sort((a, b) => b[1] - a[1]);
  }

  _drawStat(cards) {
    return this._getStat(cards);
  }

  show() {
    this.element.classList.remove(`visually-hidden`);
    this._renderChart(this._data);
  }
  hide() {
    this._chart.unrender();
    this.element.classList.add(`visually-hidden`);
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

    const labels = this._sortObject(genresStats).map((item) => item[0]);
    const values = this._sortObject(genresStats).map((item) => item[1]);

    const statisticParams = this._setChartSettings(this._element.querySelector(`.statistic__chart`), labels,
        values);
    return statisticParams;
  }

  _getAllStat(cards) {
    const filteredCards = cards.filter((card) => card.isWatched);
    const obj = {};
    const genresStats = {};

    filteredCards.forEach((card) => {
      if (genresStats.hasOwnProperty([card.genre])) {
        genresStats[[card.genre]]++;
      } else {
        genresStats[[card.genre]] = 1;
      }
    });

    const labels = this._sortObject(genresStats).map((item) => item[0]);

    obj.watchedAmount = filteredCards.length;
    obj.watchedDuration = this._getTotalDuration(filteredCards);
    obj.mostWatchedGenre = labels[0];

    return obj;
  }

  _renderChart(data) {
    this._chart = new ChartComponent(this._getStat(data));
    this._chart.render();
  }


  render() {
    const element = super.render();
    this._renderChart(this._data);
    return element;
  }

  unrender() {
    this._chart.unrender();
    super.unrender();
  }
}
