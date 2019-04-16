import BaseComponent from 'app/components/base';
import {createStatisticTemplate, createStatisticListTemplate} from '../templates/statistics';
import {createElement} from 'app/lib/create-element';
import ChartComponent from 'app/components/chart';
import {setUserRang} from 'app/lib/user-rang';

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

  static getTotalDuration(cards) { 
    return cards.reduce((accumulator, card) => accumulator + card.duration, 0);
  }

  show() {
    this._updateChart(`statistic-all-time`);
    this.element.classList.remove(`visually-hidden`);
  }

  hide() {
    this._unrenderChart();
    this.element.classList.add(`visually-hidden`);
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
    const labels = StatisticComponent.getGenres(data).sort();
    const values = StatisticComponent.getGenresCounts(data).sort((a, b) => b - a);

    ctx.getContext(`2d`);

    this._element.replaceChild(createElement(createStatisticListTemplate(this._getCardsStatistics(data))), prevElem);

    this._chart = new ChartComponent({ctx, labels, values});
    ctx.height = BAR_HEIGHT * labels.length;
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

    statistics.watchedAmount = filteredCards.length;
    statistics.watchedDuration = StatisticComponent.getTotalDuration(filteredCards);
    statistics.mostWatchedGenre = StatisticComponent.getTopGenre(filteredCards);

    return statistics;
  }

  static getTopGenre(data) {
    const counts = StatisticComponent.getGenresCounts(data);
    const index = counts.indexOf(Math.max(...counts));
    return StatisticComponent.getGenres(data)[index];
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
    this._unrenderChart();
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
    
    element.querySelector(`.statistic__rank-label`).innerHTML = setUserRang(this._filteredData.length);
    return element;
  }

  unrender() {
    this._unrenderChart();
    super.unrender();
  }
}
