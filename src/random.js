export const generateRandomNumber = (min, max) => (
  Math.floor(min + Math.random() * (max - min + 1))
);

export const getRandomArrayElement = (array) => (
  array[generateRandomNumber(0, array.length - 1)]
);

export const getRandomArrayElements = (array, limit) => (
  array
  .sort(() => Math.random() - 0.5)
  .slice(0, generateRandomNumber(1, limit))
);
