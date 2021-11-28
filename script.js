const dealBtn = document.querySelector("#deal-btn");
const betBtn = document.querySelector("#bet-btn");
const hitBtn = document.querySelector("#hit-btn");
const stayBtn = document.querySelector("#stay-btn");
const actionBtns = document.querySelector(".action");
let deckCount = document.getElementById("deck-count");
const betAmounts = document.getElementById("bet-amounts");
let betTotal = document.getElementById("bet-total");
let bet = 0;
let playerCards = document.getElementById("player-cards");
let playerSplitCards = document.getElementById("player-split-cards")
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
    
    let suits = ['spades', 'diamonds', 'clubs', 'hearts'];
    let rank = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < rank.length; j++) {
            let card = {rank: rank[j], suit: suits[i]}
            deck.push(card)
        }
    }
    deckCount.innerHTML = deck.length
    shuffleDeck(deck)
}

//shuffles deck that was created in createDeck
function shuffleDeck(deck) {
    for(let i = 0; i < deck.length; i++) {
        
        let randCard = deck[i];
        let randomIndex = Math.floor(Math.random() * 52);
        deck[i] = deck[randomIndex];
        deck[randomIndex] = randCard;
    }
    console.log(deck)
    return deck
}

//deals cards to player's and dealer's hands
function deal(deck) {
    console.log(`dealing deck`)
    while (playersHand.length < 2 && dealersHand.length < 2) {
        playersHand.push(deck.shift());
        dealersHand.push(deck.shift());
    };
    console.log(playersHand)
    console.log(dealersHand)

    playersHand.forEach((card) => {
        playerCards.appendChild(createCard(card))
    })

    dealersHand.forEach((card) => {
        dealerCards.appendChild(createCard(card))
    })

    let hiddenCard = document.createElement('div');
    hiddenCard.className = "hidden-card";
    dealerCards.lastChild.appendChild(hiddenCard)

    deckCount.innerHTML = deck.length;

    isBlackJack(playersHand);

    //evoke function to check if the player has 2 cards with the same value to create option to split hand
    isTwoOfAKind(playersHand);
}

//function to check if splitting is an option
function isTwoOfAKind (hand) {
    if(hand[0].rank === hand[1].rank) {
        console.log("we have a match")
        let splitBtn = document.createElement('button');
        splitBtn.className = "action-btn";
        splitBtn.innerText = "Split";
        splitBtn.setAttribute('id', 'split-btn')
        actionBtns.appendChild(splitBtn);
        splitBtn.addEventListener("click", function(event) {
            handleSplitBtn();
        })
    } else {
        return
    }
}


//function checks for blackjack
function isBlackJack(hand) {
    let handTotal = sumOfCards(hand);
    if (handTotal === 21) {
        hitBtn.disabled = true;
        stayBtn.disabled = true;
        dealerCards.lastChild.lastChild.remove();
        setTimeout(() => {
            alert(`Blackjack! You win!`)
        }, 500)
        playerWins();
    }
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
            } else  {
                handTotal += 1
            }
        } else {
            handTotal += parseInt(card.rank)
        }
    });
    console.log('this is the player hand total ' + handTotal)

    if (handTotal > 21) {
        for ( let i = 0; i < hand.length; i++) {
            if (hand[i].rank === "A") {
                handTotal -= 10
                console.log('adjusted hand total ' + handTotal)
                return handTotal
            }
        }
    }
    return handTotal
}

//this function creates a card element from the card object
function createCard(card) {
    let cardEl = document.createElement('div');
    let rank = document.createElement('div');
    let suit = document.createElement('div');
    cardEl.className = 'card';
    rank.className = 'rank';
    suit.className = 'suit ' + card.suit;

    rank.innerHTML = card.rank;
    
    cardEl.appendChild(rank);
    cardEl.appendChild(suit);
    return cardEl
}

//checks when the hand busts
function checkForBust(total) {
    if (total > 21) {
        hitBtn.disabled = true;
        stayBtn.disabled = true;
        dealerCards.lastChild.lastChild.remove();
        setTimeout(() => {
            alert(`Bust! You lose!`)
        }, 500);
        playerLoses();
    }
}

//play the dealers hand
function playDealersHand() {
    dealersHandTotal = sumOfCards(dealersHand)
    console.log(dealersHandTotal)
    while (dealersHandTotal < 17) {
        dealersHand.push(deck.shift());
        dealerCards.append(createCard(dealersHand[dealersHand.length - 1]));
        dealersHandTotal = sumOfCards(dealersHand);
    }
    if (dealersHandTotal === 21) {
        setTimeout(() => {
            alert(`Dealer has blackjack! You lose!`);
            playerLoses();
        }, 1000);
        
    } else if (dealersHandTotal < 21) {
        compareHands()
    } else {
        setTimeout(() => {
            alert(`Dealer busts. You win!`)
            playerWins();
        }, 1000)
    }
}

//compares the totals of the hands to determine a winner
function compareHands() {
    playersHandTotal = sumOfCards(playersHand)
    if (dealersHandTotal >= playersHandTotal) {
        setTimeout(() => {
            alert("Dealer Wins!")
            playerLoses();
        }, 1000)
    } else {
        setTimeout(() => {
            alert("You Win!")
            playerWins();
        }, 1000)
    }
}

//player is the winner. add bet times 2 to players cash
function playerWins() {
    hitBtn.disabled = true;
    stayBtn.disabled = true;
    betBtn.disabled = false;
    cash += (bet * 2);
    playerCash.innerHTML = cash
    betTotal.innerHTML = '';
}

//player loses and loses bet money
function playerLoses() {
    hitBtn.disabled = true;
    stayBtn.disabled = true;
    betBtn.disabled = false;
    betTotal.innerHTML = '';
}

//handles split btn functions
function handleSplitBtn() {
    console.log("event listener is working");
    let newHand = playersHand[1];
    playerSplitCards.appendChild(createCard(newHand))
}

//stay btn event listener
stayBtn.addEventListener("click", function(event) {
    handleStayBtn();
})
//handles stay btn functions
function handleStayBtn() {
    dealerCards.lastChild.lastChild.remove();
    playDealersHand();
}

//hit btn event listener
hitBtn.addEventListener("click", function(event) {
    handleHitBtn();
})

//handles hit btn functions
function handleHitBtn() {
    playersHand.push(deck.shift())
    playerCards.append(createCard(playersHand[playersHand.length - 1]))
    playersHandTotal = sumOfCards(playersHand);
    deckCount.innerHTML = deck.length
    isBlackJack(playersHand)
    checkForBust(playersHandTotal);
}

//dealBtn listener
dealBtn.addEventListener("click", function(event) {
    if (bet > cash) {
        alert(`You don't have enough money to place this bet!`);
    } else {
        handleDealBtn();
    }
})

//handles dealbtn functionality
function handleDealBtn() {
    
    cash -= bet
    playerCash.innerHTML = cash
    if (bet === 0) {
        alert('Please place a bet to be dealt cards.')
    } else {
        dealBtn.disabled = true
        hitBtn.disabled = false;
        stayBtn.disabled = false;
        while (betAmounts.firstChild) {
            betAmounts.removeChild(betAmounts.firstChild)
        }
        if (deck.length < 15) {
            deck = []
            createDeck();
            deal(deck);
        } else {
            deal(deck);
        }
    }
}


//starts the betting process
betBtn.addEventListener("click", function(event) {
    if (cash === 0) {
        alert(`Looks like you are out of chips. Sorry, you're broke!`)
    }
    handleBetBtn();
    betTotal.innerHTML = '';
    bet = 0
})

function handleBetBtn() {
    dealBtn.disabled = false;
    betBtn.disabled = true;
    clearHands();
    createChips();
}

//removes cards from the hand arrays and the hand elements
function clearHands() {
    while (dealerCards.firstChild) {
        dealerCards.removeChild(dealerCards.firstChild);
        dealersHand.pop();
    }
    while (playerCards.firstChild) {
        playerCards.removeChild(playerCards.firstChild);
        playersHand.pop()
    }
    console.log(dealersHand);
    console.log(playersHand)
}

//creating the chip buttons so bets can be placed
function createChips() {
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
    let resetBet = document.createElement("button");
    resetBet.innerHTML = `Reset`;
    resetBet.classList.add('chip');
    betAmounts.appendChild(resetBet)
    resetBet.addEventListener("click", function(event) {
        console.log(betCount)
        bet -= bet
        console.log(bet)
        betCount = []
        console.log(betCount)
        betTotal.innerHTML = '';
    })
}

//initializes game by creating a deck and then shuffling it
function init() {
    createDeck();
}

init();