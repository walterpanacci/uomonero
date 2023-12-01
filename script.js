const playerHandEl = document.querySelector(".player-hand");
const cpuHandEl = document.querySelector(".cpu-hand");
const first = document.querySelector(".first");
const second = document.querySelector(".second");
const discarder = document.querySelector(".discarder");
const passTurn = document.querySelector(".pass-turn");

class Card {
  constructor(number, description, image) {
    this.number = number;
    this.description = description;
    this.image = image;
  }
}

let deck = [
  new Card(1, "C1", "img/C1.jpg"),
  new Card(2, "C1", "img/C1.jpg"),
  new Card(3, "C2", "img/C2.jpg"),
  new Card(4, "C2", "img/C2.jpg"),
  new Card(5, "C3", "img/C3.jpg"),
  new Card(6, "C3", "img/C3.jpg"),
  new Card(7, "C4", "img/C4.jpg"),
  new Card(8, "C4", "img/C4.jpg"),
  new Card(9, "C5", "img/C5.jpg"),
  new Card(10, "C5", "img/C5.jpg"),
  new Card(11, "C6", "img/C6.jpg"),
  new Card(12, "C6", "img/C6.jpg"),
  new Card(13, "C7", "img/C7.jpg"),
];

const nCards = deck.length;

let playerHand = [];
let cpuHand = [];
let grave = [];
let passed = false;

/* Distribuzione delle carte */

function dealCards() {
  let x = Math.round(Math.random() * (nCards - 1));
  /* Variabile per sapere a chi devono essere date le carte */
  let flag = 1;

  while (deck.length >= 1) {
    if (flag === 1) {
      playerHand.push(deck[x]);
      deck.splice(x, 1);
      x = Math.round(Math.random() * (deck.length - 1));
      flag = 0;
    } else {
      cpuHand.push(deck[x]);
      deck.splice(x, 1);
      x = Math.round(Math.random() * (deck.length - 1));
      flag = 1;
    }
  }
}

dealCards();
/* Visualizzazione delle mani */

function playerHandRender() {
  playerHandEl.innerHTML = "";
  playerHand.forEach((card, i) =>
    playerHandEl.insertAdjacentHTML(
      "beforeend",
      `<figure class="card player-card" description="${card.description}", number="${i}">
        <h1 class="card-number">${i}</h1>
        <img class="image" src="${card.image}" />
      </figure>`
    )
  );
}

function cpuHandRender() {
  cpuHandEl.innerHTML = "";
  cpuHand.forEach((card, i) =>
    cpuHandEl.insertAdjacentHTML(
      "beforeend",
      `<figure class="card cpu-card" description="${card.description}", number="${card.number}">
        <h1 class="card-number">${i}</h1>
        <img class="image" src="img/retro.jpg" />
      </figure>`
    )
  );
}

playerHandRender();
cpuHandRender();

/* Il computer scarta i suoi doppioni */

function count(card, hand) {
  return hand.reduce((acc, el) => {
    if (el.description === card.description) return acc + 1;
    else return acc;
  }, 0);
}

function initialDiscard() {
  /* Carte che compaiono in mano due volte vengono marcate come true, marcate come false altrimenti */
  cpuHand.forEach((el) => {
    if (count(el, cpuHand) === 2) el.count = true;
    else el.count = false;
  });
  /* Le carte doppie vengono messe nel 'cimitero' */
  cpuHand.forEach((el) => {
    if (el.count === true) grave.push(el);
    return;
  });
  /* Le carte doppie vengono effettivamente tolte dalla mano */
  cpuHand = cpuHand.filter((el) => el.count === false);

  /* Viene aggiornata la visualizzazione della mano */
  cpuHandRender();
}

initialDiscard();

/* Funzione con cui il giocatore scarta i doppioni */

function discard() {
  if (first.value === "" || second.value === "") {
    alert("Inserire tutti e due i numeri delle carte da scartare");
    return;
  }
  const firstDiscard = +first.value;
  const secondDiscard = +second.value;
  if (
    firstDiscard < 0 ||
    secondDiscard < 0 ||
    firstDiscard >= playerHand.length ||
    secondDiscard >= playerHand.length
  ) {
    alert("Inserire due numeri validi per le carte da scartare");
    return;
  }
  console.log(playerHand);
  const firstCard = document.querySelector(
    `.player-card[number='${firstDiscard}']`
  );
  const secondCard = document.querySelector(
    `.player-card[number='${secondDiscard}']`
  );
  console.log(
    firstDiscard,
    secondDiscard,
    firstCard.getAttribute("description"),
    secondCard.getAttribute("description")
  );
  /* Controllo se le carte selezionate sono uguali */
  if (
    firstCard.getAttribute("description") ===
    secondCard.getAttribute("description")
  ) {
    alert("ok");
    grave.push(
      ...playerHand.filter(
        (el) => el.description === firstCard.getAttribute("description")
      )
    );
    playerHand = playerHand.filter(
      (el) => el.description !== firstCard.getAttribute("description")
    );
    console.log(playerHand);
    playerHandRender();
  } else {
    console.log(
      firstCard,
      secondCard,
      firstCard.getAttribute("description"),
      secondCard.getAttribute("description")
    );
    alert("Le carte selezionate non sono uguali");

    return;
  }
  playerHand.forEach((el) => {
    if (count(el, playerHand) === 2) el.count = true;
    else el.count = false;
    return;
  });
  //SI CONTROLLA SE IL GIOCATORE HA ZERO CARTE IN MANO//
  /* Il bottone per passare il turno compare solo se il giocatore ha scartato tutti i doppioni */
  if (playerHand.every((el) => el.count === false))
    passTurn.classList.remove("hidden");
}

discarder.addEventListener("submit", function (e) {
  e.preventDefault();
  discard();
});

/* Passaggio del turno */

passTurn.addEventListener("click", function () {
  /* Il computer sceglie una carta a caso nella mano del giocatore */
  const x = Math.round(Math.random() * (playerHand.length - 1));
  /* La carta viene trasferita da una mano all'altra */
  cpuHand.push(playerHand[x]);
  playerHand.splice(x, 1);
  //IL COMPUTER SCARTA SE PUò//
  /* La visualizzazione delle mani viene aggiornata */
  cpuHandRender();
  playerHandRender();
  //SI CONTROLLA SE IL COMPUTER HA ZERO CARTE IN MANO//
  ///IL GIOCATORE DEVE SCEGLIERE UNA CARTA DEL COMPUTER (O NE VIENE SCELTA UNA CASUALMENTE AL POSTO SUO////
  ///IL BOTTONE PER PASSARE IL TURNO VIENE NASCOSTO//
});
//IL GIOCATORE SCARTA SE PUò E PASSA IL TURNO//
