export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const filterCardsByComments = (cards) => cards.slice().sort((a, b) => b.comments.length - a.comments.length);

export const filterCardsByRating = (cards) => cards.slice().sort((a, b) => b.rating - a.rating);
