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
    return deck
}

