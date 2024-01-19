const playerHandEl = document.querySelector(".player-hand");
const cpuHandEl = document.querySelector(".cpu-hand");
const first = document.querySelector(".first");
const second = document.querySelector(".second");
const discarder = document.querySelector(".discarder");
const passTurn = document.querySelector(".pass-turn");
const draw1 = document.querySelector(".draw-1");
const discardDoubles = document.querySelector(".discard-doubles");
const overlay1 = document.querySelector(".overlay-1");
const overlayDoubles = document.querySelector(".overlay-doubles");
const closeModal1 = document.querySelector(".close-modal-1");
const closeModalDoubles = document.querySelector(".close-modal-doubles");
const winModal = document.querySelector(".win");
const loseModal = document.querySelector(".lose");
const otherGameLose = document.querySelector(".other-game-lose");
const otherGameWin = document.querySelector(".other-game-win");
const instructionsButton = document.querySelector(".instructions-button");
const closeInstructions = document.querySelector(".close-instructions");
const instructions = document.querySelector(".instructions");

class Card {
  constructor(number, description, image) {
    this.number = number;
    this.description = description;
    this.image = image;
    this.count = false;
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
  new Card(14, "C8", "img/C8.jpg"),
  new Card(15, "C8", "img/C8.jpg"),
  new Card(16, "C9", "img/C9.jpg"),
  new Card(17, "C9", "img/C9.jpg"),
  new Card(18, "C10", "img/C10.jpg"),
  new Card(19, "C10", "img/C10.jpg"),
];

function newDeck() {
  deck = [
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
    new Card(14, "C8", "img/C8.jpg"),
    new Card(15, "C8", "img/C8.jpg"),
    new Card(16, "C9", "img/C9.jpg"),
    new Card(17, "C9", "img/C9.jpg"),
    new Card(18, "C10", "img/C10.jpg"),
    new Card(19, "C10", "img/C10.jpg"),
  ];
}

const nCards = deck.length;

let playerHand = [];
let cpuHand = [];
let grave = [];
let passed = false;
let drawPhase = false;

/* Funzione per mischiare gli elementi di un vettore */

function shuffle(array) {
  let copy = [];
  let n = array.length;
  let i = 0;

  // While there remain elements to shuffle…
  while (n >= 1) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * n--);

    // And move it to the new array.
    copy.push(array.splice(i, 1)[0]);
  }

  return copy;
}

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

  //SI CONTROLLA SE CPU NON HA PIù CARTR//

  if (cpuHand.length === 0) {
    loseModal.classList.remove("hidden");
    overlay1.classList.remove("hidden");
  }
}

/* Funzione per inizializzare il gioco */

function init() {
  dealCards();
  playerHandRender();
  cpuHandRender();
  initialDiscard();
  /* Viene controllato se il giocatore non ha doppioni: in quel caso può subito passare il turno */
  playerHand.forEach((el) => {
    if (count(el, playerHand) === 2) el.count = true;
    else el.count = false;
    return;
  });

  /* Il bottone per passare il turno compare solo se il giocatore ha scartato tutti i doppioni */
  if (playerHand.every((el) => el.count === false))
    passTurn.classList.remove("hidden");
}

init();

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
  const firstCard = document.querySelector(
    `.player-card[number='${firstDiscard}']`
  );
  const secondCard = document.querySelector(
    `.player-card[number='${secondDiscard}']`
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
    playerHandRender();
  } else {
    alert("Le carte selezionate non sono uguali");

    return;
  }

  //SI CONTROLLA SE IL GIOCATORE HA ZERO CARTE IN MANO//

  playerHand.forEach((el) => {
    if (count(el, playerHand) === 2) el.count = true;
    else el.count = false;
    return;
  });

  /* Il bottone per passare il turno compare solo se il giocatore ha scartato tutti i doppioni */
  if (playerHand.every((el) => el.count === false)) {
    if (playerHand.length === 0) {
      winModal.classList.remove("hidden");
      overlay1.classList.remove("hidden");
    }
    passTurn.classList.remove("hidden");
  }
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
  const draw = playerHand[x];
  cpuHand.push(draw);
  playerHand.splice(x, 1);

  /* Il computer scarta se può*/
  if (count(draw, cpuHand) === 2) {
    grave.push(draw);
    const discarded = cpuHand.filter(
      (el) => el.description === draw.description
    );
    grave.push(...discarded);
    cpuHand = cpuHand.filter((el) => el.description !== draw.description);
  }

  /* Il computer mischia le carte che ha in mano */
  //console.log(cpuHand);
  cpuHand = shuffle(cpuHand);
  //console.log(cpuHand);

  /* La visualizzazione delle mani viene aggiornata */
  cpuHandRender();
  playerHandRender();
  if (playerHand.length === 0) {
    winModal.classList.remove("hidden");
    overlay1.classList.remove("hidden");
    return;
  }
  /* Si controlla se il computer ha 0 carte in mano*/
  if (cpuHand.length === 0) {
    loseModal.classList.remove("hidden");
    overlay1.classList.remove("hidden");
    return;
  }
  draw1.classList.remove("hidden");
  overlay1.classList.remove("hidden");

  /*draw2.classList.remove("hidden");
  overlay2.classList.remove("hidden");*/
  drawPhase = true;
 passTurn.classList.add("hidden");////
  ///IL BOTTONE PER PASSARE IL TURNO VIENE NASCOSTO//
});
//IL GIOCATORE SCARTA SE PUò E PASSA IL TURNO//
cpuHandEl.addEventListener("click", function (e) {
  passTurn.classList.add("hidden");
  if (!drawPhase) return;
  const cardDrawn = e.target.closest(".cpu-card");
  if (!cardDrawn) alert("Clicca una carta per pescarla!");
  /* Viene individuato l'indice della carta pescata */
  const x = cpuHand.findIndex(
    (el) => el.description === cardDrawn.getAttribute("description")
  );
  /* La carta pescata viene messa nella mano del giocatore, tolta da quella del computer, e la visualizzazione delle mani viene aggiornata */
  playerHand.push(cpuHand[x]);
  cpuHand.splice(x, 1);

  playerHandRender();
  cpuHandRender();
  if (cpuHand.length === 0) {
    loseModal.classList.remove("hidden");
    overlay1.classList.remove("hidden");
    return;
  }
  drawPhase = false;

  discardDoubles.classList.remove("hidden");
  overlay1.classList.remove("hidden");
  /* Viene controllato se il giocatore non ha doppioni: in quel caso può subito passare il turno */
  playerHand.forEach((el) => {
    if (count(el, playerHand) === 2) el.count = true;
    else el.count = false;
    return;
  });
  //console.log(playerHand);

  /* Il bottone per passare il turno compare solo se il giocatore ha scartato tutti i doppioni */
  if (playerHand.every((el) => el.count === false))
    passTurn.classList.remove("hidden");
});

closeModal1.addEventListener("click", function (e) {
  draw1.classList.add("hidden");
  overlay1.classList.add("hidden");
});

closeModalDoubles.addEventListener("click", function () {
  discardDoubles.classList.add("hidden");
  overlay1.classList.add("hidden");
});

otherGameLose.addEventListener("click", function () {
  loseModal.classList.add("hidden");
  overlay1.classList.add("hidden");
  passTurn.classList.add("hidden");
  newDeck();
  playerHand = [];
  cpuHand = [];
  grave = [];
  passed = false;
  drawPhase = false;
  init();
});

otherGameWin.addEventListener("click", function () {
  winModal.classList.add("hidden");
  overlay1.classList.add("hidden");
  passTurn.classList.add("hidden");
  newDeck();
  playerHand = [];
  cpuHand = [];
  grave = [];
  passed = false;
  drawPhase = false;
  init();
});

/* Aprire/chiudere la finestra con le istruzioni */

instructionsButton.addEventListener("click", function () {
  instructions.classList.remove("hidden");
  overlay1.classList.remove("hidden");
});

closeInstructions.addEventListener("click", function () {
  instructions.classList.add("hidden");
  overlay1.classList.add("hidden");
});
