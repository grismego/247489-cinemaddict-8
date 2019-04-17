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
    const createFilterFunction = (value, period) => (item) => moment(item.watchingDate).isAfter(moment().subtract(value, period));

    return {
      'statistic-all-time': () => this._filteredData,
      'statistic-today': () => this._filteredData.filter((item) => moment(item.watchingDate) === moment()),
      'statistic-week': () => this._filteredData.filter(createFilterFunction(7, `days`)),
      'statistic-month': () => this._filteredData.filter(createFilterFunction(1, `month`)),
      'statistic-year': () => this._filteredData.filter(createFilterFunction(1, `year`))
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

  static getGenreStatistics(cards) {
    return cards
      .reduce((counters, card) => {
        card.genre.forEach((genre) => {
          counters[genre] = counters[genre] ? 1 : counters[genre] + 1;
        });

        return counters;
      }, {});
  }

  _updateChart(filter) {
    const prevElem = this._element.querySelector(`.statistic__text-list`);
    const ctx = this._element.querySelector(`canvas`);
    const data = this._getDataByPeriod()[filter]();

    const genreStatistics = this.getGenreStatistics(data);
/*
    {a:1, b:2} -> map ->
    [['a', 1], ['b',2]] -> sort
    [['b',2], ['a', 1]]
      -> map key1 = labels
      -> map key = values
/*

    Object.keys(genreStatistics)

    const labels = StatisticComponent.getGenres(data).sort();
    const values = StatisticComponent.getGenresCounts(data).sort((a, b) => b - a);
*/

    const labels = Object.keys(genreStatistics);
    const values = Object.values(genreStatistics);

    this._element.replaceChild(createElement(createStatisticListTemplate(this._getCardsStatistics(data))), prevElem);
    this._chart = new ChartComponent({ctx, labels, values});
    this._chart.render();

    ctx.height = BAR_HEIGHT * labels.length;
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
