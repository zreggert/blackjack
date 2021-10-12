//function creates a single deck of 52
function createDeck() {
    let deckOfFiftyTwo = [];
    let suit = ['S', 'H', 'C', 'D'];
    let rank = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

    for (suitCount = 0; suitCount < 4; suitCount++) {
        for (rankCount = 0; rankCount < 13; rankCount++) {
        //console.log(rank[rankCount] + suit[suitCount]);
            deckOfFiftyTwo.push(rank[rankCount] + suit[suitCount]);
        }
    }
    return deckOfFiftyTwo;
}


//function invokes the createDeck function creating a single deck and then shuffling that deck
function shuffleDeck() {
    let deck = createDeck();

    console.log(deck)

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
    let playersHand = [];
    let dealersHand = [];

    while (playersHand.length < 2 && dealersHand.length < 2) {
        playersHand.push(deck.shift());
        dealersHand.push(deck.shift());
    }

    console.log(playersHand);
    console.log(dealersHand);
    console.log(deck.length)
}


//initializes game
function init() {
    shuffleDeck();
    console.log('initializing');
};

init();


