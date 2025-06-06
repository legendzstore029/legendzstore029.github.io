// Advanced Card Game Engine
class CardGameEngine {
    constructor() {
        this.deck = [];
        this.playerHand = [];
        this.dealerHand = [];
        this.gameState = 'waiting';
        this.animations = new AnimationEngine();
    }

    // Create a standard 52-card deck
    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = [
            { name: 'A', value: [1, 11] },
            { name: '2', value: [2] },
            { name: '3', value: [3] },
            { name: '4', value: [4] },
            { name: '5', value: [5] },
            { name: '6', value: [6] },
            { name: '7', value: [7] },
            { name: '8', value: [8] },
            { name: '9', value: [9] },
            { name: '10', value: [10] },
            { name: 'J', value: [10] },
            { name: 'Q', value: [10] },
            { name: 'K', value: [10] }
        ];

        this.deck = [];
        suits.forEach(suit => {
            ranks.forEach(rank => {
                this.deck.push({
                    suit: suit,
                    rank: rank.name,
                    value: rank.value,
                    id: `${rank.name}_${suit}`,
                    color: (suit === '♥' || suit === '♦') ? 'red' : 'black'
                });
            });
        });
        
        this.shuffleDeck();
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCard() {
        return this.deck.pop();
    }

    calculateHandValue(hand, game = 'blackjack') {
        if (game === 'blackjack') {
            let total = 0;
            let aces = 0;

            hand.forEach(card => {
                if (card.rank === 'A') {
                    aces++;
                    total += 11;
                } else {
                    total += card.value[0];
                }
            });

            while (total > 21 && aces > 0) {
                total -= 10;
                aces--;
            }

            return total;
        }
        
        if (game === 'baccarat') {
            let total = 0;
            hand.forEach(card => {
                total += card.value[0];
            });
            return total % 10;
        }

        return 0;
    }

    getPokerHandRank(hand) {
        const ranks = hand.map(card => card.rank);
        const suits = hand.map(card => card.suit);
        
        // Count ranks
        const rankCounts = {};
        ranks.forEach(rank => {
            rankCounts[rank] = (rankCounts[rank] || 0) + 1;
        });
        
        const counts = Object.values(rankCounts).sort((a, b) => b - a);
        const isFlush = suits.every(suit => suit === suits[0]);
        const rankValues = ranks.map(rank => {
            if (rank === 'A') return 14;
            if (rank === 'K') return 13;
            if (rank === 'Q') return 12;
            if (rank === 'J') return 11;
            return parseInt(rank);
        }).sort((a, b) => a - b);
        
        const isStraight = rankValues.every((val, i) => 
            i === 0 || val === rankValues[i - 1] + 1
        );

        // Royal Flush
        if (isFlush && isStraight && rankValues[0] === 10) {
            return { rank: 10, name: 'Royal Flush', multiplier: 800 };
        }
        
        // Straight Flush
        if (isFlush && isStraight) {
            return { rank: 9, name: 'Straight Flush', multiplier: 50 };
        }
        
        // Four of a Kind
        if (counts[0] === 4) {
            return { rank: 8, name: 'Four of a Kind', multiplier: 25 };
        }
        
        // Full House
        if (counts[0] === 3 && counts[1] === 2) {
            return { rank: 7, name: 'Full House', multiplier: 9 };
        }
        
        // Flush
        if (isFlush) {
            return { rank: 6, name: 'Flush', multiplier: 6 };
        }
        
        // Straight
        if (isStraight) {
            return { rank: 5, name: 'Straight', multiplier: 4 };
        }
        
        // Three of a Kind
        if (counts[0] === 3) {
            return { rank: 4, name: 'Three of a Kind', multiplier: 3 };
        }
        
        // Two Pair
        if (counts[0] === 2 && counts[1] === 2) {
            return { rank: 3, name: 'Two Pair', multiplier: 2 };
        }
        
        // Jacks or Better
        if (counts[0] === 2) {
            const pairRank = Object.keys(rankCounts).find(rank => rankCounts[rank] === 2);
            if (['J', 'Q', 'K', 'A'].includes(pairRank)) {
                return { rank: 2, name: 'Jacks or Better', multiplier: 1 };
            }
        }
        
        return { rank: 0, name: 'High Card', multiplier: 0 };
    }
}

// Advanced Animation Engine
class AnimationEngine {
    constructor() {
        this.activeAnimations = new Set();
    }

    animateCardDeal(cardElement, from, to, delay = 0) {
        return new Promise(resolve => {
            setTimeout(() => {
                cardElement.style.transform = `translateX(${from.x - to.x}px) translateY(${from.y - to.y}px) rotate(${Math.random() * 20 - 10}deg)`;
                cardElement.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                
                requestAnimationFrame(() => {
                    cardElement.style.transform = 'translateX(0) translateY(0) rotate(0deg)';
                });
                
                setTimeout(resolve, 600);
            }, delay);
        });
    }

    animateCardFlip(cardElement) {
        return new Promise(resolve => {
            cardElement.style.transform = 'rotateY(90deg)';
            cardElement.style.transition = 'transform 0.3s ease-in-out';
            
            setTimeout(() => {
                cardElement.style.transform = 'rotateY(0deg)';
                setTimeout(resolve, 300);
            }, 300);
        });
    }

    animateChipStack(element, amount) {
        element.style.transform = 'scale(1.2)';
        element.style.transition = 'transform 0.2s ease-out';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }

    animateWinEffect(element) {
        element.classList.add('win-animation');
        setTimeout(() => {
            element.classList.remove('win-animation');
        }, 1000);
    }

    createParticleEffect(x, y, type = 'coins') {
        const particles = [];
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}`;
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--random-x', Math.random() * 200 - 100 + 'px');
            particle.style.setProperty('--random-y', Math.random() * 200 - 100 + 'px');
            
            document.body.appendChild(particle);
            particles.push(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
}

// Advanced Blackjack Game
class AdvancedBlackjack extends CardGameEngine {
    constructor(betAmount, gameContainer) {
        super();
        this.betAmount = betAmount;
        this.container = gameContainer;
        this.createDeck();
        this.initializeGame();
    }

    initializeGame() {
        this.gameState = 'dealing';
        this.playerHand = [];
        this.dealerHand = [];
        
        this.container.innerHTML = `
            <div class="blackjack-table">
                <div class="dealer-section">
                    <h3>Dealer</h3>
                    <div class="hand dealer-hand" id="dealer-hand"></div>
                    <div class="hand-value" id="dealer-value">?</div>
                </div>
                <div class="player-section">
                    <h3>Your Hand</h3>
                    <div class="hand player-hand" id="player-hand"></div>
                    <div class="hand-value" id="player-value">0</div>
                </div>
                <div class="game-controls">
                    <button class="game-btn" id="hit-btn" onclick="this.hit()" disabled>Hit</button>
                    <button class="game-btn" id="stand-btn" onclick="this.stand()" disabled>Stand</button>
                    <button class="game-btn" id="double-btn" onclick="this.double()" disabled>Double</button>
                </div>
                <div class="game-status" id="game-status">Dealing cards...</div>
            </div>
        `;

        this.dealInitialCards();
    }

    async dealInitialCards() {
        // Deal player cards
        await this.dealCardToPlayer();
        await this.dealCardToDealer(true); // Hidden card
        await this.dealCardToPlayer();
        await this.dealCardToDealer();

        this.updateDisplay();
        this.enableControls();
        
        // Check for blackjack
        if (this.calculateHandValue(this.playerHand) === 21) {
            this.gameState = 'playerBlackjack';
            this.endGame();
        }
    }

    async dealCardToPlayer() {
        const card = this.dealCard();
        this.playerHand.push(card);
        
        const cardElement = this.createCardElement(card);
        const playerHandElement = document.getElementById('player-hand');
        playerHandElement.appendChild(cardElement);
        
        await this.animations.animateCardDeal(cardElement, 
            { x: 0, y: -100 }, 
            { x: 0, y: 0 }
        );
        
        await this.animations.animateCardFlip(cardElement);
    }

    async dealCardToDealer(hidden = false) {
        const card = this.dealCard();
        card.hidden = hidden;
        this.dealerHand.push(card);
        
        const cardElement = this.createCardElement(hidden ? null : card);
        if (hidden) cardElement.classList.add('card-back');
        
        const dealerHandElement = document.getElementById('dealer-hand');
        dealerHandElement.appendChild(cardElement);
        
        await this.animations.animateCardDeal(cardElement, 
            { x: 0, y: -100 }, 
            { x: 0, y: 0 }
        );
        
        if (!hidden) {
            await this.animations.animateCardFlip(cardElement);
        }
    }

    createCardElement(card) {
        const element = document.createElement('div');
        element.className = 'playing-card';
        
        if (card) {
            element.innerHTML = `
                <div class="card-rank top">${card.rank}</div>
                <div class="card-suit top ${card.color}">${card.suit}</div>
                <div class="card-center ${card.color}">${card.suit}</div>
                <div class="card-rank bottom">${card.rank}</div>
                <div class="card-suit bottom ${card.color}">${card.suit}</div>
            `;
        } else {
            element.innerHTML = `<div class="card-back-design">🂠</div>`;
        }
        
        return element;
    }

    hit() {
        this.dealCardToPlayer();
        
        const playerValue = this.calculateHandValue(this.playerHand);
        if (playerValue > 21) {
            this.gameState = 'playerBust';
            this.endGame();
        }
        
        this.updateDisplay();
    }

    stand() {
        this.gameState = 'dealerTurn';
        this.revealDealerCard();
        this.dealerPlay();
    }

    double() {
        this.betAmount *= 2;
        this.hit();
        if (this.gameState !== 'playerBust') {
            this.stand();
        }
    }

    async revealDealerCard() {
        const hiddenCard = this.dealerHand.find(card => card.hidden);
        if (hiddenCard) {
            hiddenCard.hidden = false;
            const cardElements = document.querySelectorAll('.dealer-hand .playing-card');
            const hiddenElement = Array.from(cardElements).find(el => el.classList.contains('card-back'));
            
            if (hiddenElement) {
                await this.animations.animateCardFlip(hiddenElement);
                hiddenElement.outerHTML = this.createCardElement(hiddenCard).outerHTML;
            }
        }
    }

    async dealerPlay() {
        while (this.calculateHandValue(this.dealerHand) < 17) {
            await this.dealCardToDealer();
            this.updateDisplay();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        this.endGame();
    }

    updateDisplay() {
        document.getElementById('player-value').textContent = this.calculateHandValue(this.playerHand);
        
        const dealerValue = this.calculateHandValue(
            this.dealerHand.filter(card => !card.hidden)
        );
        document.getElementById('dealer-value').textContent = 
            this.dealerHand.some(card => card.hidden) ? '?' : dealerValue;
    }

    enableControls() {
        document.getElementById('hit-btn').disabled = false;
        document.getElementById('stand-btn').disabled = false;
        document.getElementById('double-btn').disabled = this.playerHand.length > 2;
    }

    disableControls() {
        document.getElementById('hit-btn').disabled = true;
        document.getElementById('stand-btn').disabled = true;
        document.getElementById('double-btn').disabled = true;
    }

    endGame() {
        this.disableControls();
        
        const playerValue = this.calculateHandValue(this.playerHand);
        const dealerValue = this.calculateHandValue(this.dealerHand);
        
        let result, multiplier;
        
        if (this.gameState === 'playerBlackjack' && dealerValue !== 21) {
            result = 'Blackjack!';
            multiplier = 2.5;
        } else if (this.gameState === 'playerBust') {
            result = 'Bust! You lose.';
            multiplier = 0;
        } else if (dealerValue > 21) {
            result = 'Dealer busts! You win!';
            multiplier = 2;
        } else if (playerValue > dealerValue) {
            result = 'You win!';
            multiplier = 2;
        } else if (playerValue === dealerValue) {
            result = 'Push!';
            multiplier = 1;
        } else {
            result = 'Dealer wins.';
            multiplier = 0;
        }
        
        document.getElementById('game-status').textContent = result;
        
        if (multiplier > 1) {
            this.animations.animateWinEffect(document.querySelector('.player-section'));
            this.animations.createParticleEffect(400, 300, 'coins');
        }
        
        return { result, multiplier, payout: this.betAmount * multiplier };
    }
}

// Advanced Video Poker Game
class AdvancedVideoPoker extends CardGameEngine {
    constructor(betAmount, gameContainer) {
        super();
        this.betAmount = betAmount;
        this.container = gameContainer;
        this.heldCards = new Set();
        this.gamePhase = 'initial';
        this.createDeck();
        this.initializeGame();
    }

    initializeGame() {
        this.container.innerHTML = `
            <div class="poker-table">
                <div class="paytable">
                    <h3>Jacks or Better Paytable</h3>
                    <div class="payout-row">Royal Flush: 800x</div>
                    <div class="payout-row">Straight Flush: 50x</div>
                    <div class="payout-row">Four of a Kind: 25x</div>
                    <div class="payout-row">Full House: 9x</div>
                    <div class="payout-row">Flush: 6x</div>
                    <div class="payout-row">Straight: 4x</div>
                    <div class="payout-row">Three of a Kind: 3x</div>
                    <div class="payout-row">Two Pair: 2x</div>
                    <div class="payout-row">Jacks or Better: 1x</div>
                </div>
                <div class="poker-hand-display">
                    <div class="hand poker-hand" id="poker-hand"></div>
                    <div class="hold-buttons" id="hold-buttons"></div>
                </div>
                <div class="game-controls">
                    <button class="game-btn" id="deal-draw-btn" onclick="this.dealDraw()">Deal</button>
                </div>
                <div class="game-status" id="game-status">Click Deal to start</div>
            </div>
        `;

        this.dealInitialHand();
    }

    async dealInitialHand() {
        this.playerHand = [];
        this.heldCards.clear();
        
        for (let i = 0; i < 5; i++) {
            const card = this.dealCard();
            this.playerHand.push(card);
            
            const cardElement = this.createCardElement(card, i);
            const handElement = document.getElementById('poker-hand');
            handElement.appendChild(cardElement);
            
            await this.animations.animateCardDeal(cardElement, 
                { x: 0, y: -100 }, 
                { x: 0, y: 0 },
                i * 100
            );
        }

        this.createHoldButtons();
        this.gamePhase = 'hold';
        document.getElementById('deal-draw-btn').textContent = 'Draw';
        document.getElementById('game-status').textContent = 'Select cards to hold, then click Draw';
    }

    createCardElement(card, index) {
        const element = document.createElement('div');
        element.className = 'playing-card poker-card';
        element.dataset.index = index;
        element.onclick = () => this.toggleHold(index);
        
        element.innerHTML = `
            <div class="card-rank top">${card.rank}</div>
            <div class="card-suit top ${card.color}">${card.suit}</div>
            <div class="card-center ${card.color}">${card.suit}</div>
            <div class="card-rank bottom">${card.rank}</div>
            <div class="card-suit bottom ${card.color}">${card.suit}</div>
        `;
        
        return element;
    }

    createHoldButtons() {
        const buttonsContainer = document.getElementById('hold-buttons');
        buttonsContainer.innerHTML = '';
        
        for (let i = 0; i < 5; i++) {
            const button = document.createElement('button');
            button.className = 'hold-btn';
            button.id = `hold-btn-${i}`;
            button.textContent = 'Hold';
            button.onclick = () => this.toggleHold(i);
            buttonsContainer.appendChild(button);
        }
    }

    toggleHold(index) {
        if (this.gamePhase !== 'hold') return;
        
        const card = document.querySelector(`[data-index="${index}"]`);
        const holdBtn = document.getElementById(`hold-btn-${index}`);
        
        if (this.heldCards.has(index)) {
            this.heldCards.delete(index);
            card.classList.remove('held');
            holdBtn.classList.remove('active');
            holdBtn.textContent = 'Hold';
        } else {
            this.heldCards.add(index);
            card.classList.add('held');
            holdBtn.classList.add('active');
            holdBtn.textContent = 'Held';
        }
    }

    async dealDraw() {
        if (this.gamePhase === 'hold') {
            // Draw phase
            this.gamePhase = 'draw';
            
            for (let i = 0; i < 5; i++) {
                if (!this.heldCards.has(i)) {
                    const newCard = this.dealCard();
                    this.playerHand[i] = newCard;
                    
                    const cardElement = document.querySelector(`[data-index="${i}"]`);
                    await this.animations.animateCardFlip(cardElement);
                    cardElement.outerHTML = this.createCardElement(newCard, i).outerHTML;
                }
            }
            
            this.evaluateHand();
        } else {
            // Reset for new game
            this.initializeGame();
        }
    }

    evaluateHand() {
        const handRank = this.getPokerHandRank(this.playerHand);
        
        document.getElementById('game-status').textContent = 
            `${handRank.name} - ${handRank.multiplier}x payout`;
        
        if (handRank.multiplier > 0) {
            this.animations.animateWinEffect(document.querySelector('.poker-hand-display'));
            this.animations.createParticleEffect(400, 300, 'coins');
        }
        
        document.getElementById('deal-draw-btn').textContent = 'Deal Again';
        document.getElementById('hold-buttons').style.display = 'none';
        
        return {
            result: handRank.name,
            multiplier: handRank.multiplier,
            payout: this.betAmount * handRank.multiplier
        };
    }
}