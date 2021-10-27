const dealBtn = document.querySelector(".deal-btn");
const betBtn = document.querySelector(".bet-btn");
const hitBtn = document.querySelector(".hit-btn");
const stayBtn = document.querySelector(".stay-btn");
let deckCount = document.getElementById("deck-count");
const betAmounts = document.getElementById("bet-amounts");
let betTotal = document.getElementById("bet-total");
let bet = 0;
let playerCards = document.getElementById("player-cards");
let dealerCards = document.getElementById("dealer-cards");
let playerTotal = document.getElementById("player-total");
let playerCash = document.getElementById("player-cash");
let cash = 1000;
let deck = [];
let playersHand = [];
let playersHandTotal = 0;
let dealersHandTotal = 0;
let dealersHand = [];
dealBtn.disabled = true;
hitBtn.disabled = true;
stayBtn.disabled = true;

playerCash.innerHTML = cash

//function creates a single deck of 52
function createDeck() {
    
    let suits = ['S', 'H', 'C', 'D'];
    let rank = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < rank.length; j++) {
            let card = {rank: rank[j], suit: suits[i]}
            deck.push(card)
        }
    }
    deckCount.innerHTML = deck.length
    return deck;
}


//function invokes the createDeck function creating a single deck and then shuffling that deck
function shuffleDeck() {
    deck = createDeck();

    for(let i = 0; i < deck.length; i++) {
        
        let randCard = deck[i];
        let randomIndex = Math.floor(Math.random() * 52);
        deck[i] = deck[randomIndex];
        deck[randomIndex] = randCard;
    }
    console.log(deck)
    deal(deck)
}

//function deals the top card of the shuffled deck to the player and then one to the dealer. Once both the player and dealer have 2 cards the loop finishes
function deal(deck) {
    // let playersHand = [];
    // let playersHandTotal = 0;
    // let dealersHand = [];

    //this loop deals the cards
    while (playersHand.length < 2 && dealersHand.length < 2) {
        playersHand.push(deck.shift());
        dealersHand.push(deck.shift());
    };

    console.log(playersHand)
    console.log(dealersHand)
    //checks totals so we can see if we have a blackjack or bust off the deal
    playersHandTotal = sumOfCards(playersHand);

    if (playersHandTotal === 21) {
        return "Blackjack! Player wins!";
    } 

    playersHand.forEach((card) => {
        playerCards.appendChild(createCard(card))
    })

    dealersHand.forEach((card) => {
        dealerCards.appendChild(createCard(card))
    })
    dealerCards.lastChild.classList.add("hidden-card")

    deckCount.innerHTML = deck.length;

    playThisHand(deck, playersHand, dealersHand);
}

//this function creates a card element from the card object
function createCard(card) {
    let cardEl = document.createElement('p');
    cardEl.innerHTML = card.rank + card.suit;
    return cardEl
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
    return handTotal
}

//this function takes the shuffled deck, players hand, and dealers hand and allows the player to play their hand. they can choose to either hit or stay. if they hit another card is added to their hand. if they stay the playDealersHand function is fired off
function playThisHand(deck, playersHand, dealersHand) {
    console.log(deck)
    stayBtn.addEventListener("click", function(event) {
        dealerCards.lastChild.classList.remove("hidden-card")
        playDealersHand(deck, dealersHand, playersHand);
    })

    hitBtn.addEventListener("click", function(event) {
        playersHand.push(deck.shift())
        console.log(playersHand)
        playerCards.append(createCard(playersHand[playersHand.length - 1]))
        playersHandTotal = sumOfCards(playersHand);
        deckCount.innerHTML = deck.length

        if (playersHandTotal > 21) {
            playerLoses();
            hitBtn.disabled = true;
            stayBtn.disabled = true;
        } else if (playersHandTotal === 21) {
            playerWins();
        }
    })
}

function playDealersHand(deck, dealersHand, playersHand) {
    dealersHandTotal = sumOfCards(dealersHand)
    playersHandTotal = sumOfCards(playersHand)
    console.log(`this is the dealers total ` + dealersHandTotal);
    while (dealersHandTotal < 17) {
        dealersHand.push(deck.shift())
        dealerCards.append(createCard(dealersHand[dealersHand.length - 1]))
        dealersHandTotal = sumOfCards(dealersHand);
        console.log(dealersHandTotal)
    }
    if (dealersHandTotal >= 17 && dealersHandTotal <= 21) {
        compareHands(dealersHandTotal, playersHandTotal);
    } else if (dealersHandTotal > 21) {
        playerWins();
    }
}

function compareHands(dealersHandTotal, playersHandTotal) {
    console.log(`this is happening`)
    if (playersHandTotal > dealersHandTotal) {
        playerWins();
    } else if (dealersHandTotal >= playersHandTotal) {
        playerLoses();
    }
}

function playerLoses() {
    console.log("Bust. You Lose!");
    betTotal.innerHTML = '';
    betBtn.disabled = false;
    dealerCards.lastChild.classList.remove("hidden-card");
    bet = 0
}

function playerWins() {
    cash += (bet*2)
    playerCash.innerHTML = cash
    console.log("You Win")
    betBtn.disabled = false;
    betTotal.innerHTML = '';
    dealerCards.lastChild.classList.remove("hidden-card");
}

function resetTable() {

}
//initializes hand
//when the hand begins, the option to bet is removed until after the player or dealer wins the hand
dealBtn.addEventListener("click", function(event) {
    hitBtn.disabled = false;
    stayBtn.disabled = false;
    if (bet === 0) {
        alert('Please place a bet to be dealt cards.')
    } else {
        dealBtn.disabled = true
        handInPlay = true;
        while (betAmounts.firstChild) {
            betAmounts.removeChild(betAmounts.firstChild)
        }
        if (deck.length === 0) {
            shuffleDeck();  
        } else {
            deal(deck)
        }
        
    }
    cash -= bet
    playerCash.innerHTML = cash
})

//button reveals new buttons to select bet amounts
betBtn.addEventListener("click", function(event) {
    dealBtn.disabled = false;
    betBtn.disabled = true
    while (dealerCards.firstChild) {
        dealerCards.removeChild(dealerCards.firstChild)
    }
    while (playerCards.firstChild) {
        playerCards.removeChild(playerCards.firstChild)
    }
    for (let i = 0; i <= playersHand.length; i++) {
        playersHand.pop()
    }
    for (let i = 0; i <= dealersHand.length; i++) {
        dealersHand.pop()
    }
    console.log(dealersHand);
    console.log(playersHand)

    let amounts = [5, 10, 25, 100];
    let betCount = [];
    console.log('bet count is' + betCount)
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
});


