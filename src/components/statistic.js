import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import BaseComponent from 'app/components/base';
import {createStatisticTemplate, createStatisticListTemplate} from '../templates/statistics';
import {createElement} from 'app/lib/create-element';
import {setUserRang} from 'app/lib/user-rang';

import moment from 'moment';

const BAR_HEIGHT = 50;
const defaultData = {
  cards: []
};

export default class StatisticComponent extends BaseComponent {
  constructor(data = defaultData) {
    super(data);
    this._cardsStatistics = StatisticComponent.getCardsStatistics(this._data.cards);
    this._filteredData = this._data.cards.filter((item) => item.isWatched);
    this._onPeriodChange = this._onPeriodChange.bind(this);
  }

  get template() {
    return createStatisticTemplate(this._cardsStatistics);
  }

  _getDataByPeriod() {
    const createFilterFunction = (value, period) => (item) => moment(item.watchingDate).isAfter(moment().subtract(value, period));
    return {
      'statistic-all-time': () => this._filteredData,
      'statistic-today': () => this._filteredData.filter(createFilterFunction(24, `hours`)),
      'statistic-week': () => this._filteredData.filter(createFilterFunction(7, `days`)),
      'statistic-month': () => this._filteredData.filter(createFilterFunction(1, `month`)),
      'statistic-year': () => this._filteredData.filter(createFilterFunction(1, `year`))
    };
  }

  _createChart(filterName) {
    const data = this._getDataByPeriod()[filterName]();

    const labels = StatisticComponent.getGenres(data).sort();
    const values = StatisticComponent.getGenresCounts(data).sort((a, b) => b - a);

    this._canvasElement.height = BAR_HEIGHT * labels.length;

    this._chart = new Chart(
        this._canvasElement,
        StatisticComponent.createChartSetting(labels, values)
    );

    this._cardsStatistics = StatisticComponent.getCardsStatistics(data);

  }

  _destroyChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  _createListeners() {
    if (this._element) {
      this._canvasElement = this._element.querySelector(`canvas`);
      this._inputElements = this._element.querySelectorAll(`input`);
      this._rankLabelElement = this._element.querySelector(`.statistic__rank-label`);
      this._textListElement = this._element.querySelector(`.statistic__text-list`);

      this._inputElements.forEach((element) => {
        element.addEventListener(`change`, this._onPeriodChange);
      });
    }
  }

  _removeListeners() {
    if (this._element) {
      this._inputElements.forEach((element) => {
        element.removeEventListener(`change`, this._onPeriodChange);
      });

      this._canvasElement = null;
      this._inputElements = null;
      this._rankLabelElement = null;
      this._textListElement = null;
    }
  }

  _onPeriodChange(evt) {
    evt.preventDefault();
    const filterName = evt.target.id;

    this._destroyChart();
    this._createChart(filterName);

    const prevElement = this._element.querySelector(`.statistic__text-list`);

    this._element.replaceChild(createElement(
        createStatisticListTemplate(this._cardsStatistics)
    ), prevElement);
  }

  update(data) {
    super.update(data);
    this._filteredData = this._data.cards.filter((item) => item.isWatched);
    this._cardsStatistics = StatisticComponent.getCardsStatistics(this._data.cards);
  }

  render() {
    const element = super.render();
    this._createChart(`statistic-all-time`);

    this._rankLabelElement.innerHTML = setUserRang(this._filteredData.length);

    return element;
  }

  unrender() {
    this._destroyChart();
    super.unrender();
  }

  static getCardsStatistics(cards) {
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

  static getGenres(data) {
    const genres = new Set();
    data.forEach((item) => {
      item.genre.forEach((genre) => {
        genres.add(genre);
      });
    });
    return Array.from(genres);
  }

  static createChartSetting(labels, data) {
    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `tomato`,
          anchor: `start`
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 24
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    };
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

  static getTotalDuration(cards) {
    return cards.reduce((accumulator, card) => accumulator + card.duration, 0);
  }
}
