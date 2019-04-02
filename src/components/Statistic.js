import BaseComponent from './Base';
import {createStatisticTemplate} from '../templates/statistics';
// import Chart from 'chart.js';
import ChartComponent from './Chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {createElement} from '../util';
import moment from 'moment';

export default class StatisticComponent extends BaseComponent {
  constructor(data, options = {}) {
    super(data);

    // this._data.mostWatchedGenre = data.mostWatchedGenre;
    // this._data.watchedAmount = data.watchedAmount;
    // this._data.watchedDuration = data.watchedDuration;
    this._options = options;
    // debugger
    // this._data.watchedStatistics = {
    //   mostWatchedGenre: null,
    //   watchedAmount: null,
    //   watchedDuration: null
    // };
  }


  get template() {
    const a = this._getAllStat(this._data);
    console.log(a)
    return createStatisticTemplate(this._data);
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

  _getStat(cards) {
    const genresStats = {};
    const filteredCards = cards.filter((card) => card.isWatched);
    this._options.watchedAmount = filteredCards.length;

    this._options.watchedAmount = filteredCards.length;
    this._options.watchedDuration = this._getTotalDuration(filteredCards);

    filteredCards.forEach((card) => {
      if (genresStats.hasOwnProperty([card.genre])) {
        genresStats[[card.genre]]++;
      } else {
        genresStats[[card.genre]] = 1;
      }
    });

    const labels = this._sortObject(genresStats).map((item) => item[0]);
    const values = this._sortObject(genresStats).map((item) => item[1]);
    this._options.mostWatchedGenre = labels[0];

    const statisticParams = this._setChartSettings(this._element.querySelector(`.statistic__chart`), labels,
        values);
    return statisticParams;
  }

  _getAllStat(cards) {
    const filteredCards = cards.filter((card) => card.isWatched);
    const obj = {};

    obj.watchedAmount = filteredCards.length;
    obj.watchedDuration = this._getTotalDuration(filteredCards);
    // obj.mostWatchedGenre = this._getStat(this._data).labels[0];

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
}
