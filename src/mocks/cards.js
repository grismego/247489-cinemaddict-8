import {
  generateRandomNumber,
  getRandomArrayElement,
  getRandomArrayElements
} from '../random';

import moment from 'moment';

const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`
];

const POSTERS = [
  `accused`,
  `blackmail`,
  `blue-blazes`,
  `fuga-da-new-york`,
  `moonrise`,
  `three-friends`
];

const GENRES = [
  `Comedies`,
  `History`,
  `Drama`,
  `Horror`,
  `Series`,
  `Westerns`,
  `Action`,
  `Adventure`
];

const DIRECTOR = [
  `Brad Bird`,
  `Kventin Tarantino`,
  `David Lynch`,
  `Martin Scorsese`,
  `Steven Soderbergh`,
  `Lukas Moodysson`
];

const WRITERS = [
  `Paul Savage`,
  `Richard Side`,
  `David Seidler`,
  `Dirk Wayne Summers`,
  `Keith Samples`
];

const ACTORS = [
  `Tim Robbins`,
  `Morgan Freeman`,
  `Bob Gunton`,
  `Christian Bale`,
  `Heath Ledger`,
  `Aaron Eckhart`
];

const COUNTRY = [
  `USA`,
  `RUSSIA`,
  `CHINA`,
  `FRANCE`,
  `UK`
];

const AGE_RATING = [
  0,
  6,
  12,
  16,
  18
];

const TITLES = [
  `Silence of the Lambs`,
  `Raiders of the Lost Ark`,
  `Rear Window`,
  `The Good, The Bad, and The Ugly`,
  `Matrix`,
  `Jurassic Park`,
  `White Christmas`,
  `Goodfellas`,
  `Lord of the Rings: Fellowship of the Ring`,
  `Fight Club`,
  `Star Wars: Episode V – The Empire Strikes Back`,
  `Spirited Away`
];

const COMMENTS_MIN_COUNT = 0;
const COMMENTS_MAX_COUNT = 50;

const DESCRIPTIONS_MAX_COUNT = 3;

const generateRandomRating = () => (
  `${generateRandomNumber(0, 9)}.${generateRandomNumber(0, 9)}`
);

const generateReleaseDate = () => moment(Math.floor(Math.random() * new Date().getTime())).format(`DD MMMM YYYY`);

export const generateCard = () => ({
  title: getRandomArrayElement(TITLES),
  poster: `../images/posters/${getRandomArrayElement(POSTERS)}.jpg`,
  rating: generateRandomRating(),
  description: getRandomArrayElements(DESCRIPTIONS, DESCRIPTIONS_MAX_COUNT).join(`, `),
  genre: getRandomArrayElement(GENRES),
  duration: generateRandomNumber(0, 300),
  year: generateReleaseDate(),
  commentsCount: generateRandomNumber(COMMENTS_MIN_COUNT, COMMENTS_MAX_COUNT),
  director: getRandomArrayElement(DIRECTOR),
  ageRating: getRandomArrayElement(AGE_RATING),
  actors: getRandomArrayElements(ACTORS, ACTORS.length).join(`, `),
  writers: getRandomArrayElement(WRITERS),
  country: getRandomArrayElement(COUNTRY),
  comments: [
    {
      author: `Tim Macoveev`,
      time: `20190313`,
      comment: `So long-long story, boring!`,
      emoji: `😴`,
    },
    {
      author: `Denis Popov`,
      time: `20190314`,
      comment: `Pretty good!`,
      emoji: `😀`,
    },
  ],
  isWatched: Math.random() > 0.5,
  addedToWathed: true,
  isFavorite: false
});

export const generateCards = (limit) => [...Array(limit).keys()].map(generateCard);

