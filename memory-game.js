"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);

createCards(colors);


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let color of colors) {
    let currentCard = document.createElement('div');
    currentCard.classList.add(color, 'card');
    currentCard.style.backgroundColor = 'gray';
    currentCard.addEventListener('click', handleCardClick);
    document.getElementById('game').appendChild(currentCard);
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.style.backgroundColor = card.classList[0];
}

/** Flip a card face-down. */

function unFlipCard(card1, card2) {
  card1.style.backgroundColor = 'gray'
  card2.style.backgroundColor = 'gray'
}

/** Handle clicking on a card: this could be first-card or second-card. */

// These are global variables I needed to make this work, but I'm sure there is a cleaner solution
let foundColors = ['gray'];
let current1;
let current2;

function handleCardClick(evt) {
  // Don't allow user to flip a card that is already flipped
  if (evt.target.style.backgroundColor !== 'gray') {
    return;
  }

  // Count how many cards are currently face up that haven't already been matched
  const cards = document.querySelectorAll('.card');
  let count = 0;
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].style.backgroundColor !== 'gray' && !foundColors.includes(cards[i].style.backgroundColor)) {
      count++;
    }
  }
  
  // Don't allow user to click before the two non matching cards have flipped back over
  if (count > 1) {
    return;
  }
  
  // Flip the card that was clicked
  flipCard(evt.target);

  // Save the first card that was clicked
  if (count === 0) {
    current1 = evt.target;
  // Save the second card that was clicked and check if the two card colors match
  } else if (count === 1) {
    current2 = evt.target;
    if (current1.style.backgroundColor !== current2.style.backgroundColor) {
      setTimeout(unFlipCard, 1000, current1, current2);
    } else {
      foundColors.push(current1.style.backgroundColor);
    }
    current1 = undefined;
    current2 = undefined;
  }
}

