import BaseComponent from 'app/components/base';
import {createStatisticTemplate, createStatisticListTemplate} from '../templates/statistics';
import {createElement} from 'app/lib/create-element';
import ChartComponent from 'app/components/chart';
import moment from 'moment';

const BAR_HEIGHT = 50;

export default class StatisticComponent extends BaseComponent {
  constructor(data) {
    super(data);
    this._filteredData = this._data.filter((item) => item.isWatched);

    this._onPeriodChange = this._onPeriodChange.bind(this);
  }

  get template() {
    return createStatisticTemplate(this._getCardsStatistics(this._data));
  }

  _getDataByPeriod() {
    return {
      'statistic-all-time': () => this._filteredData,
      'statistic-today': () => this._filteredData
        .filter((item) => moment(item.watchingDate) === moment()),
      'statistic-week': () => this._filteredData
        .filter((item) => moment(item.watchingDate).isAfter(moment().subtract(7, `days`))),
      'statistic-month': () => this._filteredData
        .filter((item) => moment(item.watchingDate).isAfter(moment().subtract(1, `month`))),
      'statistic-year': () => this._filteredData
        .filter((item) => moment(item.watchingDate).isAfter(moment().subtract(1, `year`)))
    };
  }

  _getTotalDuration(cards) { // @TODO: static - читай критерии
    return cards.reduce((accumulator, card) => accumulator + card.duration, 0);
  }

  _sortObject(obj) {
    return Object.entries(obj).sort((a, b) => b[1] - a[1]);
  }

  show() {
    // this._renderChart();
    this.element.classList.remove(`visually-hidden`);
  }

  hide() {
    // this._unrenderChart();
    this.element.classList.add(`visually-hidden`);
  }

  _createLabels(data) {
    return this._sortObject(data).map((item) => item[0]);
  }
  _createValues(data) {
    return this._sortObject(data).map((item) => item[1]);
  }

  static getGenres(data) {
    const genres = new Set();
    data.forEach((item) => {
      item.genre.forEach((genre) => {
        genres.add(genre);
      });
    });
    return Array.from(genres);
  }

  static getGenresCounts(data) {
    const counts = [];
    StatisticComponent.getGenres(data).forEach((genre, index) => {
      counts[index] = data.filter((item) => {
        return item.genre.some((it) => it === genre);
      }).length;
    });
    return counts;
  }

  _updateChart(filter) {
    const prevElem = this._element.querySelector(`.statistic__text-list`);
    const ctx = this._element.querySelector(`canvas`);
    const data = this._getDataByPeriod()[filter]();
    const labels = StatisticComponent.getGenres(data);
    const values = StatisticComponent.getGenresCounts(data);

    ctx.getContext(`2d`);
    ctx.height = BAR_HEIGHT * labels.length;

    this._element.replaceChild(createElement(createStatisticListTemplate(this._getCardsStatistics(data))), prevElem);

    this._chart = new ChartComponent({ctx, labels, values});
    this._chart.render();
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

  _createListeners() {
    if (this._element) {
      this._element
        .querySelectorAll(`input`).forEach((item) => {
          item.addEventListener(`change`, this._onPeriodChange);
        });
    }
  }

  _removeListeners() {
    if (this._element) {
      this._element
        .querySelectorAll(`input`).forEach((item) => {
          item.removeEventListener(`change`, this._onPeriodChange);
        });
    }
  }

  _onPeriodChange(evt) {
    evt.preventDefault();
    this._chart.unrender();
    this._updateChart(evt.target.id);
  }

  _unrenderChart() {
    if (this._chart) {
      this._chart.unrender();
      this._chart = null;
    }
  }

  render() {
    const element = super.render();
    this._updateChart(`statistic-all-time`);
    return element;
  }

  unrender() {
    this._unrenderChart();
    super.unrender();
  }
}
