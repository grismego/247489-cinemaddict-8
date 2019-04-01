import BaseComponent from './Base';
import {createStatisticTemplate} from '../templates/statistics';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

export default class Statistic extends BaseComponent {
  constructor(data) {
    super(data);

  }

  get template() {
    return createStatisticTemplate(this._data);
  }

  render() {
    const drawStat = (ctx, cards) => {
      const genresStat = getStat(cards);
    
      // eslint-disable-next-line no-unused-vars
      const myChart = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: `horizontalBar`,
        data: {
          labels: genresStat.labels,
          datasets: [{
            data: genresStat.values,
            backgroundColor: `#ffe800`,
            hoverBackgroundColor: `tomato`,
            anchor: `start`
          }]
        },
        options: {
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
      });
    };
  }
}
