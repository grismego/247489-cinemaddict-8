const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. 
Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis
sed finibus eget, sollicitudin eget ante. Phasellus eros mauris,
condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit,
eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut
dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam
erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus
sit amet tempus`;

const POSTERS = [`accused`, `blackmail`, `blue-blazes`, `fuga-da-new-york`, `moonrise`, `three-friends`];

const GENRES = [`Action`, `Adventure `, `Comedies`, `Horror`, `Westerns`, `Comedy`];

const TITLES = [`Silence of the Lambs`, `Raiders of the Lost Ark`, `Rear Window`, `The Good, The Bad, and The Ugly`, `Matrix`, `Jurassic Park`, `White Christmas`,
  `Goodfellas`, `Lord of the Rings: Fellowship of the Ring`, `Fight Club`, `Star Wars: Episode V – The Empire Strikes Back`, `Star Wars: Episode V – The Empire Strikes Back`, `Spirited Away`];

const generateRandomNumber = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

const generateRandomRating = () => (
  `${generateRandomNumber(0, 9)}.${generateRandomNumber(0, 9)}`
);

const generateRandomDuration = () => (
  `${generateRandomNumber(0, 3)}h ${generateRandomNumber(0, 59)}m`
);

const getRandomArrayElement = (array) => array[generateRandomNumber(0, array.length - 1)];
const getRandomArrayElements = (array, limit) => (
  array
    .sort(() => Math.random() - 0.5)
    .slice(0, generateRandomNumber(1, limit))
);

export const generateCards = () => TITLES.map((title) => {
  const rating = generateRandomRating();
  const poster = `../images/posters/${getRandomArrayElement(POSTERS)}.jpg`;

  return {
    title,
    poster,
    rating,
    description: getRandomArrayElements(description.split(`. `), 3).join(` `),
    genre: getRandomArrayElement(GENRES),
    duration: generateRandomDuration(),
    year: generateRandomNumber(1900, 2019),
    commentsCount: generateRandomNumber(0, 50)
  };
});
