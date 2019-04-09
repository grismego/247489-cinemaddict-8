import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import BaseComponent from './Base';

export default class ChartComponent extends BaseComponent {

  get chartSetting() {
    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._data.labels,
        datasets: [{
          data: this._data.values,
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

  render() {
    this._element = new Chart(this._data.ctx, this.chartSetting);
    return this._element;
  }

  unrender() {
    this._element.destroy();
  }
}
