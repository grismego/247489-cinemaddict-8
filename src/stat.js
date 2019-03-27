import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

let watchedStatistics = {};

export const drawStat = (ctx, cards) => {
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

const getTotalDuration = (cards) => cards.reduce((accumulator, card) => accumulator + card.duration, 0);

const sortObject = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]);

const getStat = (cards) => {
  const genresStats = {};
  const filteredCards = cards.filter((card) => card.isWatched);
  watchedStatistics.watchedAmount = filteredCards.length;
  watchedStatistics.watchedDuration = getTotalDuration(filteredCards);
  filteredCards.forEach((card) => {
    if (genresStats.hasOwnProperty([card.genre])) {
      genresStats[[card.genre]]++;
    } else {
      genresStats[[card.genre]] = 1;
    }
  });

  const labels = sortObject(genresStats).map((item) => item[0]);
  const values = sortObject(genresStats).map((item) => item[1]);

  watchedStatistics.mostWatchedGenre = labels[0];

  return {labels, values};
};

export {watchedStatistics};
