// import {createCardTemplate} from './templates/cards';
import {createTemplate as createNavigationTemplate} from './templates/navigation';
// import {createNoControlsTemplate as createCardNoControlsTemplate} from './templates/cards';
import {createTemplate as createCardTemplate} from './templates/cards';

const CARDS = [
  {
    title: `The Assassination Of Jessie James By The Coward Robert Ford`,
    rating: 9.8,
    year: 2018,
    duration: {
      hour: 1,
      minutes: 13
    },
    genre: `Comedy`,
    poster: `./images/posters/three-friends.jpg`,
    description: `A priest with a haunted past and a novice on the threshold of her 
    final vows are sent by the Vatican to investigate the death of a young nun in Romania and confront a malevolent force in the form of a demonic nun.`,
    commentsCount: 13
  },
  {
    title: `Incredibles 2`,
    rating: 9.8,
    year: 2018,
    duration: {
      hour: 1,
      minutes: 13
    },
    genre: `Comedy`,
    poster: `./images/posters/moonrise.jpg`,
    description: `A priests Romania and confront a malevolent force in the form of a demonic nun.`,
    commentsCount: 14
  },
  {
    title: `Incredibles 3`,
    rating: 4.8,
    year: 2018,
    duration: {
      hour: 1,
      minutes: 13
    },
    genre: `Comedy`,
    poster: `./images/posters/blue-blazes.jpg`,
    description: `A priests Romania and confront a malevolent force in the form of a demonic nun.`,
    commentsCount: 25
  },
  {
    title: `Incredibles 4`,
    rating: 5.8,
    year: 2018,
    duration: {
      hour: 1,
      minutes: 56
    },
    genre: `Comedy`,
    poster: `./images/posters/three-friends.jpg`,
    description: `A priests Romania and confront a malevolent force in the form of a demonic nun.`,
    commentsCount: 23
  },
  {
    title: `Incredibles 4`,
    rating: 5.8,
    year: 2018,
    duration: {
      hour: 1,
      minutes: 13
    },
    genre: `Comedy`,
    poster: `./images/posters/three-friends.jpg`,
    description: `A priests Romania and confront a malevolent force in the form of a demonic nun.`,
    commentsCount: 88
  },
  {
    title: `Incredibles 4`,
    rating: 5.8,
    year: 2018,
    duration: {
      hour: 1,
      minutes: 17
    },
    genre: `Comedy`,
    poster: `./images/posters/three-friends.jpg`,
    description: `A priests Romania and confront a malevolent force in the form of a demonic nun.`,
    commentsCount: 99
  },
  {
    title: `Incredibles 4`,
    rating: 5.8,
    year: 2018,
    duration: {
      hour: 1,
      minutes: 13
    },
    genre: `Comedy`,
    poster: `./images/posters/three-friends.jpg`,
    description: `A priests Romania and confront a malevolent force in the form of a demonic nun.`,
    commentsCount: 44
  },
  {
    title: `Incredibles 4`,
    rating: 5.8,
    year: 2018,
    duration: {
      hour: 1,
      minutes: 13
    },
    genre: `Comedy`,
    poster: `./images/posters/three-friends.jpg`,
    description: `A priests Romania and confront a malevolent force in the form of a demonic nun.`,
    commentsCount: 110
  },
];

const FILTERS = [
  {
    name: `All movies`,
    state: `main-navigation__item--active`,
    anchor: `all`
  },
  {
    name: `Watchlist`,
    count: 13,
    anchor: `watchlist`
  },
  {
    name: `History`,
    count: 6,
    anchor: `history`
  },
  {
    name: `Favorites`,
    count: 8,
    anchor: `favorites`
  },
  {
    name: `stats`,
    classNameModificator: `main-navigation__item--additional`,
    anchor: `stats`
  }
];

const generateRandomNumber = (min, max) => Math.round(min - 0.5 + Math.random() * (max - min + 1));

const navigationElement = document.querySelector(`.main-navigation`);
const filmListElement = document.querySelector(`.films-list .films-list__container`);
const filmListRatedElement = document.querySelector(`.films-list--extra:nth-child(2) .films-list__container`);
const filmListCommentedElement = document.querySelector(`.films-list--extra:nth-child(3) .films-list__container`);


navigationElement.innerHTML = createNavigationTemplate(FILTERS);
filmListElement.innerHTML = createCardTemplate(CARDS, true);
filmListRatedElement.innerHTML = createCardTemplate(CARDS.slice(-2), false);
filmListCommentedElement.innerHTML = createCardTemplate(CARDS.slice(-2), false);

document.querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`)
.forEach((element) => {
  element.addEventListener(`click`, () => {
    filmListElement.innerHTML = createCardTemplate(
        CARDS.slice(0, generateRandomNumber(1, CARDS.length), true)
    );
  });
});
