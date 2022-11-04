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

let foundColors = [];
let current1;
let current2;

function handleCardClick(evt) {
  if (evt.target.style.backgroundColor !== 'gray') {
    return;
  }
  const cards = document.querySelectorAll('.card');
  let remainingCards = cards.length;
  let count = 0;
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].style.backgroundColor !== 'gray') {
      count++;
    }
  }
  flipCard(evt.target);
  if (count % 2 === 0) {
    current1 = evt.target;
  } else if (count % 2 === 1) {
    current2 = evt.target;
    let card1Color;
    let card2Color;
    for (let i = 0; i < cards.length; i++) {
      if (card1Color === undefined) {
        if (cards[i].style.backgroundColor !== 'gray' && !foundColors.includes(cards[i].style.backgroundColor)) {
          card1Color = cards[i].style.backgroundColor;
        }
      } else {
        if (cards[i].style.backgroundColor !== 'gray' && !foundColors.includes(cards[i].style.backgroundColor)) {
          card2Color = cards[i].style.backgroundColor;
        }
      }
    }
    if (card1Color !== card2Color) {
      let card1 = document.getElementsByClassName(card1Color);
      let card2 = document.getElementsByClassName(card2Color);
      setTimeout(unFlipCard, 1000, current1, current2);
    } else {
      foundColors.push(card1Color);
      remainingCards = remainingCards - 2;
    }
    current1 = undefined;
    current2 = undefined;
  }
}

