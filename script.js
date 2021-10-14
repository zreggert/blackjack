const dealBtn = document.querySelector(".deal-btn");
const betBtn = document.querySelector(".bet-btn");
const hitBtn = document.querySelector(".hit-btn");
const stayBtn = document.querySelector(".stay-btn");
let deckCount = document.getElementById("deck-count");
const betAmounts = document.getElementById("bet-amounts");
let betTotal = document.getElementById("bet-total");
let bet = 0;
let handInPlay = false;
let playerCards = document.getElementById("player-cards");
let dealerCards = document.getElementById("dealer-cards");
let playerTotal = document.getElementById("player-total");

//function creates a single deck of 52
function createDeck() {
    let deck = [];
    let suits = ['S', 'H', 'C', 'D'];
    let rank = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < rank.length; j++) {
            let card = {rank: rank[j], suit: suits[i]}
            deck.push(card)
        }
    }
    deckCount.append(deck.length)
    console.log(deck)
    return deck;

}


//function invokes the createDeck function creating a single deck and then shuffling that deck
function shuffleDeck() {
    let deck = createDeck();

    for(let i = 0; i < deck.length; i++) {
        
        let randCard = deck[i];
        let randomIndex = Math.floor(Math.random() * 52);
        deck[i] = deck[randomIndex];
        deck[randomIndex] = randCard;
    }
    deal(deck)
}

//function deals the top card of the shuffled deck to the player and then one to the dealer. Once both the player and dealer have 2 cards the loop finishes
function deal(deck) {
    let playersHand = [];
    let playersHandTotal = 0;
    let dealersHand = [];
    let dealersHandTotal = 0;

    while (playersHand.length < 2 && dealersHand.length < 2) {
        playersHand.push(deck.shift());
        dealersHand.push(deck.shift());
    };

    playersHandTotal = sumOfCards(playersHand);
    dealersHandTotal = sumOfCards(dealersHand);

    playersHand.forEach((card) => {
        let cardEl = document.createElement('p');
        cardEl.innerHTML = card.rank + card.suit;
        playerCards.appendChild(cardEl)
    })

    dealersHand.forEach((card) => {
        let cardEl = document.createElement('p');
        cardEl.innerHTML = card.rank + card.suit;
        dealerCards.appendChild(cardEl)
    })

    console.log(playersHand)
    console.log(playersHandTotal)
    console.log(dealersHand)
    console.log(dealersHandTotal)

    deckCount.innerHTML = deck.length;
}

//takes either the player's or dealer's hand as an arguement and returns the sum of the ranks of the cards
function sumOfCards(hand) {
    let handTotal = 0;
    hand.forEach((card) => {
        if (card.rank === "T" || card.rank === "J" || card.rank === "Q" || card.rank === "K") {
            handTotal += 10
        } else if (card.rank === "A") {
            if (handTotal <= 10) {
                handTotal += 11
            } else {
                handTotal += 1
            }
        } else {
            handTotal += parseInt(card.rank)
        }
    });
    if (handTotal > 21) {
        losingHand();
    } else if (handTotal === 21) {
        blackJack();
    } else {
        return handTotal
    }
    
}

//initializes game
//when the hand begins, the option to bet is removed until after the player or dealer wins the hand
dealBtn.addEventListener("click", function(event) {
    if (bet === 0) {
        alert('Please place a bet to be dealt cards.')
    } else {
        handInPlay = true;
        while (betAmounts.firstChild) {
            betAmounts.removeChild(betAmounts.firstChild)
        }
        shuffleDeck();  
    }
})

//button reveals new buttons to select bet amounts
betBtn.addEventListener("click", function(event) {
    if (handInPlay === true) {
        alert('Cannot bet until after this hand is finished.')
    } else {
        
        let amounts = [5, 10, 25, 100];
        let betCount = [];
        let reducer = (previous, current) => previous + current;
    
        //creates buttons for each of the chip amounts
        //each button has an event listener to add up the total value of the amount the player would llike to bet
        for (let i = 0; i < amounts.length; i++) {
            let chip = document.createElement("button");
            chip.innerHTML = amounts[i]
            chip.value = parseInt(amounts[i])
            chip.classList.add('chip')
            betAmounts.appendChild(chip)
    
            chip.addEventListener("click", function(event) {
                betCount.push(parseInt(chip.value))
                console.log(betCount.reduce(reducer));
                bet = betCount.reduce(reducer)
                betTotal.innerHTML = betCount.reduce(reducer)
            })
        }
    }
});


