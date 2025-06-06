// Global application state
class BettingApp {
    constructor() {
        this.userData = {
            name: 'Caleb Eccleston',
            balance: 2500.00,
            bitcoinBalance: 0.125,
            ethereumBalance: 2.35,
            totalWins: 47,
            totalLosses: 23,
            additionalCurrency: 850.00,
            totalProfit: 1250.00,
            largestWin: 500.00,
            currentStreak: 3,
            longestStreak: 8,
            avgBetSize: 45.50,
            totalBetsPlaced: 70,
            vipLevel: 'Gold',
            joinDate: '2023-03-15',
            lastLogin: new Date().toISOString(),
            preferences: {
                currency: 'USD',
                notifications: true,
                autoWithdraw: false,
                twoFactorAuth: true
            }
        };
        
        this.bettingHistory = this.generateInitialHistory();
        this.currentBet = null;
        this.currentGameData = null;
        this.liveOdds = {};
        this.notifications = [];
        
        this.loadUserData();
        this.initializeApp();
        this.startLiveOddsUpdates();
    }

    // Initialize the application
    initializeApp() {
        this.updateDisplay();
        this.generateSportsMatches();
        this.setupEventListeners();
        this.updateRecentActivity();
        this.updateBettingHistory();
        this.showWelcomeMessage();
        this.updateVipStatus();
    }

    // Load user data from localStorage
    loadUserData() {
        const savedData = localStorage.getItem('bettingAppData');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            this.userData = { ...this.userData, ...parsed.userData };
            this.bettingHistory = parsed.bettingHistory || this.bettingHistory;
            this.notifications = parsed.notifications || [];
        }
    }

    // Save user data to localStorage
    saveUserData() {
        const dataToSave = {
            userData: this.userData,
            bettingHistory: this.bettingHistory,
            notifications: this.notifications
        };
        localStorage.setItem('bettingAppData', JSON.stringify(dataToSave));
    }

    // Generate initial betting history for realism
    generateInitialHistory() {
        const history = [];
        const sports = ['NFL', 'NBA', 'MLB', 'NHL', 'Premier League', 'Champions League'];
        const teams = [
            'Chiefs vs Bills', 'Lakers vs Celtics', 'Yankees vs Red Sox', 
            'Rangers vs Bruins', 'Arsenal vs Chelsea', 'Barcelona vs Real Madrid'
        ];
        const outcomes = ['won', 'lost'];
        
        for (let i = 0; i < 25; i++) {
            const isWin = Math.random() > 0.4;
            const amount = Math.random() * 200 + 10;
            const odds = Math.random() * 3 + 1.2;
            
            history.push({
                id: Date.now() - (i * 86400000),
                type: Math.random() > 0.7 ? 'arcade' : 'sports',
                selection: teams[Math.floor(Math.random() * teams.length)],
                league: sports[Math.floor(Math.random() * sports.length)],
                amount: amount,
                odds: odds,
                result: isWin ? 'won' : 'lost',
                payout: isWin ? amount * odds : 0,
                profit: isWin ? (amount * odds) - amount : -amount,
                date: new Date(Date.now() - (i * 86400000)).toLocaleString()
            });
        }
        
        return history;
    }

    // Update all display elements
    updateDisplay() {
        document.getElementById('username').textContent = this.userData.name;
        document.getElementById('balance-amount').textContent = `$${this.userData.balance.toFixed(2)}`;
        document.getElementById('total-wins').textContent = this.userData.totalWins;
        document.getElementById('total-losses').textContent = this.userData.totalLosses;
        document.getElementById('bitcoin-balance').textContent = this.userData.bitcoinBalance.toFixed(3);
        
        const totalBets = this.userData.totalWins + this.userData.totalLosses;
        const winRate = totalBets > 0 ? ((this.userData.totalWins / totalBets) * 100).toFixed(1) : 0;
        document.getElementById('win-rate').textContent = `${winRate}%`;

        // Update additional stats
        if (document.getElementById('ethereum-balance')) {
            document.getElementById('ethereum-balance').textContent = this.userData.ethereumBalance.toFixed(3);
        }
        if (document.getElementById('total-profit')) {
            document.getElementById('total-profit').textContent = `$${this.userData.totalProfit.toFixed(2)}`;
        }
        if (document.getElementById('current-streak')) {
            document.getElementById('current-streak').textContent = this.userData.currentStreak;
        }
        if (document.getElementById('vip-level')) {
            document.getElementById('vip-level').textContent = this.userData.vipLevel;
        }
    }

    // Show welcome message
    showWelcomeMessage() {
        const lastLogin = new Date(this.userData.lastLogin);
        const now = new Date();
        const hoursSinceLogin = (now - lastLogin) / (1000 * 60 * 60);
        
        if (hoursSinceLogin > 24) {
            this.showToast(`Welcome back, ${this.userData.name.split(' ')[0]}! You've been away for ${Math.floor(hoursSinceLogin)} hours.`, 'info');
        }
        
        this.userData.lastLogin = now.toISOString();
        this.saveUserData();
    }

    // Update VIP status
    updateVipStatus() {
        const totalBets = this.userData.totalBetsPlaced;
        const totalProfit = this.userData.totalProfit;
        
        let newLevel = 'Bronze';
        if (totalBets > 50 && totalProfit > 500) newLevel = 'Silver';
        if (totalBets > 100 && totalProfit > 1000) newLevel = 'Gold';
        if (totalBets > 200 && totalProfit > 2500) newLevel = 'Platinum';
        if (totalBets > 500 && totalProfit > 5000) newLevel = 'Diamond';
        
        if (newLevel !== this.userData.vipLevel) {
            this.userData.vipLevel = newLevel;
            this.showToast(`Congratulations! You've been promoted to ${newLevel} VIP status!`, 'success');
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Bet amount input listener for potential payout calculation
        const betAmountInput = document.getElementById('bet-amount');
        if (betAmountInput) {
            betAmountInput.addEventListener('input', () => {
                this.updatePotentialPayout();
            });
        }

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });
    }

    // Generate realistic sports matches with live-updating odds
    generateSportsMatches() {
        const sportsData = {
            football: [
                {
                    id: 'nfl1',
                    league: 'NFL - Week 15',
                    time: 'LIVE',
                    team1: 'Kansas City Chiefs',
                    team2: 'Buffalo Bills',
                    score: '14-10',
                    odds: { team1: 1.85, draw: null, team2: 1.95 },
                    status: 'live'
                },
                {
                    id: 'nfl2',
                    league: 'NFL - Week 15',
                    time: 'Today 4:30 PM EST',
                    team1: 'Green Bay Packers',
                    team2: 'Dallas Cowboys',
                    score: null,
                    odds: { team1: 2.10, draw: null, team2: 1.75 },
                    status: 'upcoming'
                },
                {
                    id: 'nfl3',
                    league: 'College Football',
                    time: 'Today 8:00 PM EST',
                    team1: 'Alabama Crimson Tide',
                    team2: 'Georgia Bulldogs',
                    score: null,
                    odds: { team1: 1.90, draw: null, team2: 1.90 },
                    status: 'upcoming'
                }
            ],
            basketball: [
                {
                    id: 'nba1',
                    league: 'NBA - Regular Season',
                    time: 'LIVE',
                    team1: 'Los Angeles Lakers',
                    team2: 'Boston Celtics',
                    score: '89-92',
                    odds: { team1: 1.80, draw: null, team2: 2.00 },
                    status: 'live'
                },
                {
                    id: 'nba2',
                    league: 'NBA - Regular Season',
                    time: 'Today 9:30 PM EST',
                    team1: 'Golden State Warriors',
                    team2: 'Phoenix Suns',
                    score: null,
                    odds: { team1: 1.95, draw: null, team2: 1.85 },
                    status: 'upcoming'
                },
                {
                    id: 'nba3',
                    league: 'College Basketball',
                    time: 'Today 6:00 PM EST',
                    team1: 'Duke Blue Devils',
                    team2: 'North Carolina Tar Heels',
                    score: null,
                    odds: { team1: 1.75, draw: null, team2: 2.05 },
                    status: 'upcoming'
                }
            ],
            tennis: [
                {
                    id: 'atp1',
                    league: 'ATP Masters 1000',
                    time: 'LIVE - Set 2',
                    team1: 'Novak Djokovic',
                    team2: 'Rafael Nadal',
                    score: '6-4, 3-2',
                    odds: { team1: 1.65, draw: null, team2: 2.25 },
                    status: 'live'
                },
                {
                    id: 'wta1',
                    league: 'WTA Championship',
                    time: 'Today 2:00 PM EST',
                    team1: 'Serena Williams',
                    team2: 'Naomi Osaka',
                    score: null,
                    odds: { team1: 2.10, draw: null, team2: 1.70 },
                    status: 'upcoming'
                }
            ],
            soccer: [
                {
                    id: 'epl1',
                    league: 'Premier League',
                    time: 'LIVE - 67\'',
                    team1: 'Manchester United',
                    team2: 'Liverpool',
                    score: '1-2',
                    odds: { team1: 2.40, draw: 3.20, team2: 2.90 },
                    status: 'live'
                },
                {
                    id: 'ucl1',
                    league: 'Champions League',
                    time: 'Tomorrow 3:00 PM EST',
                    team1: 'Barcelona',
                    team2: 'Real Madrid',
                    score: null,
                    odds: { team1: 2.15, draw: 3.40, team2: 3.10 },
                    status: 'upcoming'
                },
                {
                    id: 'laliga1',
                    league: 'La Liga',
                    time: 'Tomorrow 12:30 PM EST',
                    team1: 'Atletico Madrid',
                    team2: 'Valencia',
                    score: null,
                    odds: { team1: 1.85, draw: 3.60, team2: 4.20 },
                    status: 'upcoming'
                }
            ]
        };

        this.sportsData = sportsData;
        this.showSportsCategory('football');
    }

    // Start live odds updates
    startLiveOddsUpdates() {
        setInterval(() => {
            this.updateLiveOdds();
        }, 3000); // Update every 3 seconds
    }

    // Update live odds with small fluctuations
    updateLiveOdds() {
        Object.keys(this.sportsData).forEach(sport => {
            this.sportsData[sport].forEach(match => {
                if (match.status === 'live') {
                    // Small random fluctuations in odds
                    const fluctuation = 0.05;
                    match.odds.team1 += (Math.random() - 0.5) * fluctuation;
                    match.odds.team2 += (Math.random() - 0.5) * fluctuation;
                    
                    if (match.odds.draw) {
                        match.odds.draw += (Math.random() - 0.5) * fluctuation;
                    }
                    
                    // Ensure odds don't go below 1.1
                    match.odds.team1 = Math.max(1.1, Math.round(match.odds.team1 * 100) / 100);
                    match.odds.team2 = Math.max(1.1, Math.round(match.odds.team2 * 100) / 100);
                    if (match.odds.draw) {
                        match.odds.draw = Math.max(1.1, Math.round(match.odds.draw * 100) / 100);
                    }
                }
            });
        });
        
        // Update display if sports section is active
        const activeCategory = document.querySelector('.category-btn.active');
        if (activeCategory && document.getElementById('sports').classList.contains('active')) {
            const category = activeCategory.textContent.toLowerCase();
            this.refreshSportsDisplay(category);
        }
    }

    // Refresh sports display without changing active category
    refreshSportsDisplay(category) {
        const matchesContainer = document.getElementById('sports-matches');
        const matches = this.sportsData[category] || [];

        matchesContainer.innerHTML = matches.map(match => `
            <div class="match-card ${match.status}">
                <div class="match-header">
                    <span class="match-time ${match.status === 'live' ? 'live' : ''}">${match.time}</span>
                    <span class="match-league">${match.league}</span>
                </div>
                <div class="match-teams">
                    <span class="team">${match.team1}</span>
                    <span class="vs">${match.score || 'vs'}</span>
                    <span class="team">${match.team2}</span>
                </div>
                <div class="betting-options">
                    <button class="bet-option" onclick="app.showBetSlip('${match.team1}', ${match.odds.team1}, '${match.league}')">
                        <span class="label">${match.team1.split(' ').pop()}</span>
                        <span class="odds">${match.odds.team1}</span>
                    </button>
                    ${match.odds.draw ? `
                        <button class="bet-option" onclick="app.showBetSlip('Draw', ${match.odds.draw}, '${match.league}')">
                            <span class="label">Draw</span>
                            <span class="odds">${match.odds.draw}</span>
                        </button>
                    ` : '<div></div>'}
                    <button class="bet-option" onclick="app.showBetSlip('${match.team2}', ${match.odds.team2}, '${match.league}')">
                        <span class="label">${match.team2.split(' ').pop()}</span>
                        <span class="odds">${match.odds.team2}</span>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Show sports matches for a specific category
    showSportsCategory(category) {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[onclick="showSportsCategory('${category}')"]`).classList.add('active');
        this.refreshSportsDisplay(category);
    }

    // Show bet slip modal
    showBetSlip(selection, odds, league) {
        this.currentBet = { selection, odds, league };
        
        const betDetails = document.getElementById('bet-details');
        betDetails.innerHTML = `
            <h4>${selection}</h4>
            <p>League: ${league}</p>
            <p>Odds: ${odds}</p>
            <p class="potential-return">Risk/Reward Ratio: ${(odds - 1).toFixed(2)}:1</p>
        `;

        document.getElementById('bet-amount').value = '';
        document.getElementById('potential-payout').textContent = '0.00';
        document.getElementById('bet-slip-modal').classList.add('active');
    }

    // Update potential payout
    updatePotentialPayout() {
        const betAmount = parseFloat(document.getElementById('bet-amount').value) || 0;
        const payout = this.currentBet ? (betAmount * this.currentBet.odds).toFixed(2) : '0.00';
        const profit = this.currentBet ? ((betAmount * this.currentBet.odds) - betAmount).toFixed(2) : '0.00';
        document.getElementById('potential-payout').textContent = payout;
        
        const potentialPayoutDiv = document.querySelector('.potential-payout');
        if (potentialPayoutDiv) {
            potentialPayoutDiv.innerHTML = `
                <div>Potential Payout: $${payout}</div>
                <div>Potential Profit: $${profit}</div>
            `;
        }
    }

    // Enhanced bet placement with more realistic outcomes
    placeBet() {
        const betAmount = parseFloat(document.getElementById('bet-amount').value);
        
        if (!betAmount || betAmount <= 0) {
            this.showToast('Please enter a valid bet amount', 'error');
            return;
        }

        if (betAmount > this.userData.balance) {
            this.showToast('Insufficient balance', 'error');
            return;
        }

        // More sophisticated win/loss calculation based on odds
        const impliedProbability = 1 / this.currentBet.odds;
        const houseEdge = 0.05; // 5% house edge
        const trueProbability = impliedProbability - houseEdge;
        const isWin = Math.random() < trueProbability;
        
        const payout = isWin ? betAmount * this.currentBet.odds : 0;
        const profit = payout - betAmount;

        // Update user balance and stats
        this.userData.balance -= betAmount;
        this.userData.totalBetsPlaced++;
        this.userData.avgBetSize = ((this.userData.avgBetSize * (this.userData.totalBetsPlaced - 1)) + betAmount) / this.userData.totalBetsPlaced;
        
        if (isWin) {
            this.userData.balance += payout;
            this.userData.totalWins++;
            this.userData.totalProfit += profit;
            this.userData.currentStreak++;
            this.userData.longestStreak = Math.max(this.userData.longestStreak, this.userData.currentStreak);
            
            if (profit > this.userData.largestWin) {
                this.userData.largestWin = profit;
                this.showToast(`New personal record! Largest win: $${profit.toFixed(2)}`, 'success');
            }
        } else {
            this.userData.totalLosses++;
            this.userData.totalProfit += profit; // Profit will be negative
            this.userData.currentStreak = 0;
        }

        // Add to betting history
        const betRecord = {
            id: Date.now(),
            type: 'sports',
            selection: this.currentBet.selection,
            league: this.currentBet.league,
            amount: betAmount,
            odds: this.currentBet.odds,
            result: isWin ? 'won' : 'lost',
            payout: payout,
            profit: profit,
            date: new Date().toLocaleString()
        };

        this.bettingHistory.unshift(betRecord);
        this.saveUserData();
        this.updateDisplay();
        this.updateRecentActivity();
        this.updateBettingHistory();
        this.updateVipStatus();

        // Show result with more detail
        const resultMessage = isWin 
            ? `🎉 Bet Won! Profit: +$${profit.toFixed(2)} | Streak: ${this.userData.currentStreak}` 
            : `💔 Bet Lost: -$${betAmount.toFixed(2)} | Streak reset`;
        this.showToast(resultMessage, isWin ? 'success' : 'error');

        this.hideBetSlip();
    }

    // Hide bet slip modal
    hideBetSlip() {
        document.getElementById('bet-slip-modal').classList.remove('active');
        this.currentBet = null;
    }

    // Enhanced arcade games with more variety
    playArcadeGame(gameType) {
        this.currentGameData = { type: gameType };
        
        const modal = document.getElementById('arcade-modal');
        const title = document.getElementById('arcade-game-title');
        const content = document.getElementById('arcade-game-content');

        const gameConfigs = {
            coinflip: {
                title: 'Coin Flip - Double or Nothing',
                content: this.getCoinFlipContent()
            },
            dice: {
                title: 'Lucky Dice - Roll to Win',
                content: this.getDiceContent()
            },
            roulette: {
                title: 'Mini Roulette - Red or Black',
                content: this.getRouletteContent()
            },
            scratch: {
                title: 'Scratch Card - Instant Win',
                content: this.getScratchContent()
            },
            slots: {
                title: 'Lucky Slots - Triple Match',
                content: this.getSlotsContent()
            },
            blackjack: {
                title: 'Blackjack - Beat the Dealer',
                content: this.getBlackjackContent()
            },
            poker: {
                title: 'Video Poker - Jacks or Better',
                content: this.getPokerContent()
            },
            baccarat: {
                title: 'Baccarat - High Stakes',
                content: this.getBaccaratContent()
            },
            crash: {
                title: 'Crash - Risk vs Reward',
                content: this.getCrashContent()
            },
            plinko: {
                title: 'Plinko - Drop and Win',
                content: this.getPlinkoContent()
            },
            mines: {
                title: 'Mines - Find the Gems',
                content: this.getMinesContent()
            }
        };

        const config = gameConfigs[gameType];
        title.textContent = config.title;
        content.innerHTML = config.content;
        modal.classList.add('active');
    }

    // Get enhanced coin flip game content
    getCoinFlipContent() {
        return `
            <div class="arcade-game-content">
                <div class="game-area">
                    <div class="game-result" id="coin-result">🪙</div>
                    <p>Choose heads or tails and double your bet!</p>
                    <div class="game-stats">
                        <span>Win Rate: 50%</span> | <span>Payout: 2.00x</span>
                    </div>
                </div>
                <div class="game-controls">
                    <div class="game-bet-input">
                        <label>Bet Amount: $</label>
                        <input type="number" id="arcade-bet-amount" placeholder="0.00" step="0.01" min="0.01" max="${this.userData.balance}">
                    </div>
                    <div class="quick-bet-buttons">
                        <button onclick="document.getElementById('arcade-bet-amount').value = '10'">$10</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '25'">$25</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '50'">$50</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '100'">$100</button>
                    </div>
                    <div class="game-choice-buttons">
                        <button class="choice-btn" onclick="app.playArcadeRound('heads')">🟡 Heads</button>
                        <button class="choice-btn" onclick="app.playArcadeRound('tails')">⚪ Tails</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Get enhanced dice game content
    getDiceContent() {
        return `
            <div class="arcade-game-content">
                <div class="game-area">
                    <div class="game-result" id="dice-result">🎲</div>
                    <p>Choose your number and win up to 6x your bet!</p>
                    <div class="game-stats">
                        <span>Win Rate: 16.7%</span> | <span>Max Payout: 6.00x</span>
                    </div>
                </div>
                <div class="game-controls">
                    <div class="game-bet-input">
                        <label>Bet Amount: $</label>
                        <input type="number" id="arcade-bet-amount" placeholder="0.00" step="0.01" min="0.01" max="${this.userData.balance}">
                    </div>
                    <div class="quick-bet-buttons">
                        <button onclick="document.getElementById('arcade-bet-amount').value = '10'">$10</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '25'">$25</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '50'">$50</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '100'">$100</button>
                    </div>
                    <div class="game-choice-buttons">
                        <button class="choice-btn" onclick="app.playArcadeRound('1')">1️⃣</button>
                        <button class="choice-btn" onclick="app.playArcadeRound('2')">2️⃣</button>
                        <button class="choice-btn" onclick="app.playArcadeRound('3')">3️⃣</button>
                        <button class="choice-btn" onclick="app.playArcadeRound('4')">4️⃣</button>
                        <button class="choice-btn" onclick="app.playArcadeRound('5')">5️⃣</button>
                        <button class="choice-btn" onclick="app.playArcadeRound('6')">6️⃣</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Get enhanced roulette game content
    getRouletteContent() {
        return `
            <div class="arcade-game-content">
                <div class="game-area">
                    <div class="game-result" id="roulette-result">🔴</div>
                    <p>Choose red, black, or green for different payouts!</p>
                    <div class="game-stats">
                        <span>Red/Black: 1.95x</span> | <span>Green: 14.00x</span>
                    </div>
                </div>
                <div class="game-controls">
                    <div class="game-bet-input">
                        <label>Bet Amount: $</label>
                        <input type="number" id="arcade-bet-amount" placeholder="0.00" step="0.01" min="0.01" max="${this.userData.balance}">
                    </div>
                    <div class="quick-bet-buttons">
                        <button onclick="document.getElementById('arcade-bet-amount').value = '10'">$10</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '25'">$25</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '50'">$50</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '100'">$100</button>
                    </div>
                    <div class="game-choice-buttons">
                        <button class="choice-btn red-btn" onclick="app.playArcadeRound('red')">🔴 Red</button>
                        <button class="choice-btn black-btn" onclick="app.playArcadeRound('black')">⚫ Black</button>
                        <button class="choice-btn green-btn" onclick="app.playArcadeRound('green')">🟢 Green</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Get enhanced scratch card content
    getScratchContent() {
        return `
            <div class="arcade-game-content">
                <div class="game-area">
                    <div class="game-result" id="scratch-result">🎫</div>
                    <p>Scratch to reveal your multiplier (1x to 100x)!</p>
                    <div class="game-stats">
                        <span>Average: 2.5x</span> | <span>Max: 100x</span>
                    </div>
                </div>
                <div class="game-controls">
                    <div class="game-bet-input">
                        <label>Bet Amount: $</label>
                        <input type="number" id="arcade-bet-amount" placeholder="0.00" step="0.01" min="0.01" max="${this.userData.balance}">
                    </div>
                    <div class="quick-bet-buttons">
                        <button onclick="document.getElementById('arcade-bet-amount').value = '10'">$10</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '25'">$25</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '50'">$50</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '100'">$100</button>
                    </div>
                    <div class="game-choice-buttons">
                        <button class="choice-btn" onclick="app.playArcadeRound('scratch')">🎫 Scratch Card</button>
                    </div>
                </div>
            </div>
        `;
    }

    // New slots game content
    getSlotsContent() {
        return `
            <div class="arcade-game-content">
                <div class="game-area">
                    <div class="slots-display" id="slots-result">
                        <span>🍒</span><span>🍊</span><span>🍇</span>
                    </div>
                    <p>Match 3 symbols for big wins!</p>
                    <div class="game-stats">
                        <span>🍒🍒🍒: 5x</span> | <span>💎💎💎: 50x</span> | <span>7️⃣7️⃣7️⃣: 100x</span>
                    </div>
                </div>
                <div class="game-controls">
                    <div class="game-bet-input">
                        <label>Bet Amount: $</label>
                        <input type="number" id="arcade-bet-amount" placeholder="0.00" step="0.01" min="0.01" max="${this.userData.balance}">
                    </div>
                    <div class="quick-bet-buttons">
                        <button onclick="document.getElementById('arcade-bet-amount').value = '10'">$10</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '25'">$25</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '50'">$50</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '100'">$100</button>
                    </div>
                    <div class="game-choice-buttons">
                        <button class="choice-btn" onclick="app.playArcadeRound('spin')">🎰 SPIN</button>
                    </div>
                </div>
            </div>
        `;
    }

    // New blackjack game content
    getBlackjackContent() {
        return `
            <div class="arcade-game-content">
                <div class="game-area">
                    <div class="blackjack-table" id="blackjack-result">
                        <div class="dealer-cards">Dealer: 🂠 🎴</div>
                        <div class="player-cards">You: Click Deal to start</div>
                    </div>
                    <p>Get closer to 21 than the dealer without going over!</p>
                    <div class="game-stats">
                        <span>Blackjack: 2.5x</span> | <span>Win: 2x</span> | <span>Push: 1x</span>
                    </div>
                </div>
                <div class="game-controls">
                    <div class="game-bet-input">
                        <label>Bet Amount: $</label>
                        <input type="number" id="arcade-bet-amount" placeholder="0.00" step="0.01" min="0.01" max="${this.userData.balance}">
                    </div>
                    <div class="quick-bet-buttons">
                        <button onclick="document.getElementById('arcade-bet-amount').value = '10'">$10</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '25'">$25</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '50'">$50</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '100'">$100</button>
                    </div>
                    <div class="game-choice-buttons">
                        <button class="choice-btn" onclick="app.playArcadeRound('deal')">🃏 Deal</button>
                        <button class="choice-btn" onclick="app.playArcadeRound('hit')" style="display:none" id="hit-btn">Hit</button>
                        <button class="choice-btn" onclick="app.playArcadeRound('stand')" style="display:none" id="stand-btn">Stand</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Get video poker game content
    getPokerContent() {
        return `
            <div class="arcade-game-content">
                <div class="game-area">
                    <div class="poker-hand" id="poker-result">
                        <div class="poker-cards">
                            <div class="card">🂠</div>
                            <div class="card">🂠</div>
                            <div class="card">🂠</div>
                            <div class="card">🂠</div>
                            <div class="card">🂠</div>
                        </div>
                        <div class="poker-hand-name">Draw cards to start</div>
                    </div>
                    <p>Jacks or Better - Hold cards and redraw!</p>
                    <div class="game-stats">
                        <span>Royal Flush: 800x</span> | <span>Straight Flush: 50x</span> | <span>Four of a Kind: 25x</span>
                    </div>
                </div>
                <div class="game-controls">
                    <div class="game-bet-input">
                        <label>Bet Amount: $</label>
                        <input type="number" id="arcade-bet-amount" placeholder="0.00" step="0.01" min="0.01" max="${this.userData.balance}">
                    </div>
                    <div class="quick-bet-buttons">
                        <button onclick="document.getElementById('arcade-bet-amount').value = '10'">$10</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '25'">$25</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '50'">$50</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '100'">$100</button>
                    </div>
                    <div class="game-choice-buttons">
                        <button class="choice-btn" onclick="app.playArcadeRound('deal')">🃏 Deal Cards</button>
                        <button class="choice-btn" onclick="app.playArcadeRound('draw')" style="display:none" id="draw-btn">Draw</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Get baccarat game content
    getBaccaratContent() {
        return `
            <div class="arcade-game-content">
                <div class="game-area">
                    <div class="baccarat-table" id="baccarat-result">
                        <div class="baccarat-hands">
                            <div class="hand">
                                <h4>Player</h4>
                                <div class="cards">🂠 🂠</div>
                                <div class="total">0</div>
                            </div>
                            <div class="hand">
                                <h4>Banker</h4>
                                <div class="cards">🂠 🂠</div>
                                <div class="total">0</div>
                            </div>
                        </div>
                    </div>
                    <p>Bet on Player, Banker, or Tie</p>
                    <div class="game-stats">
                        <span>Player: 1.95x</span> | <span>Banker: 1.95x</span> | <span>Tie: 8x</span>
                    </div>
                </div>
                <div class="game-controls">
                    <div class="game-bet-input">
                        <label>Bet Amount: $</label>
                        <input type="number" id="arcade-bet-amount" placeholder="0.00" step="0.01" min="0.01" max="${this.userData.balance}">
                    </div>
                    <div class="quick-bet-buttons">
                        <button onclick="document.getElementById('arcade-bet-amount').value = '10'">$10</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '25'">$25</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '50'">$50</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '100'">$100</button>
                    </div>
                    <div class="game-choice-buttons">
                        <button class="choice-btn" onclick="app.playArcadeRound('player')">👤 Player</button>
                        <button class="choice-btn" onclick="app.playArcadeRound('banker')">🏦 Banker</button>
                        <button class="choice-btn" onclick="app.playArcadeRound('tie')">🤝 Tie</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Get crash game content
    getCrashContent() {
        return `
            <div class="arcade-game-content">
                <div class="game-area">
                    <div class="crash-display" id="crash-result">
                        <div class="crash-multiplier">1.00x</div>
                        <div class="crash-rocket">🚀</div>
                        <div class="crash-status">Click START to begin</div>
                    </div>
                    <p>Watch the multiplier rise and cash out before it crashes!</p>
                    <div class="game-stats">
                        <span>Auto Cash Out: Set target multiplier</span> | <span>Max: No limit</span>
                    </div>
                </div>
                <div class="game-controls">
                    <div class="game-bet-input">
                        <label>Bet Amount: $</label>
                        <input type="number" id="arcade-bet-amount" placeholder="0.00" step="0.01" min="0.01" max="${this.userData.balance}">
                    </div>
                    <div class="game-bet-input">
                        <label>Auto Cash Out at:</label>
                        <input type="number" id="crash-target" placeholder="2.00" step="0.01" min="1.01">
                    </div>
                    <div class="quick-bet-buttons">
                        <button onclick="document.getElementById('arcade-bet-amount').value = '10'">$10</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '25'">$25</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '50'">$50</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '100'">$100</button>
                    </div>
                    <div class="game-choice-buttons">
                        <button class="choice-btn" onclick="app.playArcadeRound('start')" id="crash-start">🚀 START</button>
                        <button class="choice-btn" onclick="app.playArcadeRound('cashout')" style="display:none" id="crash-cashout">💰 CASH OUT</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Get plinko game content
    getPlinkoContent() {
        return `
            <div class="arcade-game-content">
                <div class="game-area">
                    <div class="plinko-board" id="plinko-result">
                        <div class="plinko-pegs">
                            ● ● ● ● ●<br>
                            ● ● ● ●<br>
                            ● ● ●<br>
                            ● ●<br>
                            ●
                        </div>
                        <div class="plinko-multipliers">
                            <span>1000x</span><span>130x</span><span>26x</span><span>9x</span><span>4x</span><span>2x</span><span>0.2x</span><span>0.2x</span><span>2x</span><span>4x</span><span>9x</span><span>26x</span><span>130x</span><span>1000x</span>
                        </div>
                    </div>
                    <p>Drop the ball and watch it bounce to a multiplier!</p>
                    <div class="game-stats">
                        <span>Risk Level: High</span> | <span>Max Win: 1000x</span>
                    </div>
                </div>
                <div class="game-controls">
                    <div class="game-bet-input">
                        <label>Bet Amount: $</label>
                        <input type="number" id="arcade-bet-amount" placeholder="0.00" step="0.01" min="0.01" max="${this.userData.balance}">
                    </div>
                    <div class="quick-bet-buttons">
                        <button onclick="document.getElementById('arcade-bet-amount').value = '10'">$10</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '25'">$25</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '50'">$50</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '100'">$100</button>
                    </div>
                    <div class="game-choice-buttons">
                        <button class="choice-btn" onclick="app.playArcadeRound('drop')">⚪ Drop Ball</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Get mines game content
    getMinesContent() {
        return `
            <div class="arcade-game-content">
                <div class="game-area">
                    <div class="mines-grid" id="mines-result">
                        ${Array(25).fill(0).map((_, i) => `<div class="mine-cell" onclick="app.revealMine(${i})">?</div>`).join('')}
                    </div>
                    <div class="mines-info">
                        <div>Mines: <span id="mine-count">3</span></div>
                        <div>Current Multiplier: <span id="mines-multiplier">1.00x</span></div>
                        <div>Gems Found: <span id="gems-found">0</span></div>
                    </div>
                    <p>Find gems and avoid mines! More gems = higher multiplier</p>
                    <div class="game-stats">
                        <span>3 Mines</span> | <span>22 Gems</span> | <span>Max: 5000x</span>
                    </div>
                </div>
                <div class="game-controls">
                    <div class="game-bet-input">
                        <label>Bet Amount: $</label>
                        <input type="number" id="arcade-bet-amount" placeholder="0.00" step="0.01" min="0.01" max="${this.userData.balance}">
                    </div>
                    <div class="quick-bet-buttons">
                        <button onclick="document.getElementById('arcade-bet-amount').value = '10'">$10</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '25'">$25</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '50'">$50</button>
                        <button onclick="document.getElementById('arcade-bet-amount').value = '100'">$100</button>
                    </div>
                    <div class="game-choice-buttons">
                        <button class="choice-btn" onclick="app.playArcadeRound('start')" id="mines-start">💎 Start Game</button>
                        <button class="choice-btn" onclick="app.playArcadeRound('cashout')" style="display:none" id="mines-cashout">💰 Cash Out</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Enhanced arcade game round with professional card mechanics
    playArcadeRound(choice) {
        const betAmount = parseFloat(document.getElementById('arcade-bet-amount').value);
        
        if (!betAmount || betAmount <= 0) {
            this.showToast('Please enter a valid bet amount', 'error');
            return;
        }

        if (betAmount > this.userData.balance) {
            this.showToast('Insufficient balance', 'error');
            return;
        }

        // For advanced card games, use the professional game engines
        if (this.currentGameData.type === 'blackjack') {
            return this.playAdvancedBlackjack(betAmount, choice);
        }
        
        if (this.currentGameData.type === 'poker') {
            return this.playAdvancedPoker(betAmount, choice);
        }

        // Disable buttons during play for other games
        document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = true);

        let result, isWin, multiplier, resultDisplay;

        switch (this.currentGameData.type) {
            case 'coinflip':
                result = Math.random() > 0.5 ? 'heads' : 'tails';
                isWin = result === choice;
                multiplier = isWin ? 2 : 0;
                resultDisplay = result === 'heads' ? '🟡' : '⚪';
                document.getElementById('coin-result').textContent = resultDisplay;
                break;

            case 'dice':
                result = Math.floor(Math.random() * 6) + 1;
                isWin = result.toString() === choice;
                multiplier = isWin ? 6 : 0;
                resultDisplay = `${result}️⃣`;
                document.getElementById('dice-result').textContent = resultDisplay;
                break;

            case 'roulette':
                const rouletteResults = ['red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'green'];
                result = rouletteResults[Math.floor(Math.random() * rouletteResults.length)];
                isWin = result === choice;
                if (choice === 'green') {
                    multiplier = isWin ? 14 : 0;
                } else {
                    multiplier = isWin ? 1.95 : 0;
                }
                resultDisplay = result === 'red' ? '🔴' : result === 'black' ? '⚫' : '🟢';
                document.getElementById('roulette-result').textContent = resultDisplay;
                break;

            case 'scratch':
                const multipliers = [0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 5, 10, 25, 50, 100];
                multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
                isWin = multiplier > 0;
                resultDisplay = multiplier > 0 ? `${multiplier}x 🎉` : '0x 💔';
                document.getElementById('scratch-result').textContent = resultDisplay;
                break;

            case 'slots':
                const symbols = ['🍒', '🍊', '🍇', '🍋', '⭐', '💎', '7️⃣'];
                const reels = [
                    symbols[Math.floor(Math.random() * symbols.length)],
                    symbols[Math.floor(Math.random() * symbols.length)],
                    symbols[Math.floor(Math.random() * symbols.length)]
                ];
                
                document.getElementById('slots-result').innerHTML = reels.map(s => `<span>${s}</span>`).join('');
                
                if (reels[0] === reels[1] && reels[1] === reels[2]) {
                    isWin = true;
                    switch (reels[0]) {
                        case '🍒': multiplier = 5; break;
                        case '🍊': multiplier = 10; break;
                        case '🍇': multiplier = 15; break;
                        case '🍋': multiplier = 20; break;
                        case '⭐': multiplier = 25; break;
                        case '💎': multiplier = 50; break;
                        case '7️⃣': multiplier = 100; break;
                    }
                } else {
                    isWin = false;
                    multiplier = 0;
                }
                break;

            case 'blackjack':
                // Enhanced blackjack logic
                const playerCard1 = Math.floor(Math.random() * 10) + 1;
                const playerCard2 = Math.floor(Math.random() * 10) + 1;
                const dealerCard = Math.floor(Math.random() * 10) + 1;
                const playerTotal = playerCard1 + playerCard2;
                
                document.getElementById('blackjack-result').innerHTML = `
                    <div class="dealer-cards">Dealer: ${dealerCard} 🎴</div>
                    <div class="player-cards">You: ${playerCard1} + ${playerCard2} = ${playerTotal}</div>
                `;
                
                if (playerTotal === 21) {
                    isWin = true;
                    multiplier = 2.5;
                } else if (playerTotal > 21) {
                    isWin = false;
                    multiplier = 0;
                } else {
                    const dealerTotal = dealerCard + Math.floor(Math.random() * 10) + 1;
                    isWin = playerTotal > dealerTotal || dealerTotal > 21;
                    multiplier = isWin ? 2 : 0;
                }
                break;

            case 'poker':
                // Video poker logic - simplified jacks or better
                const suits = ['♠', '♥', '♦', '♣'];
                const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
                const hand = [];
                for (let i = 0; i < 5; i++) {
                    hand.push({
                        rank: ranks[Math.floor(Math.random() * ranks.length)],
                        suit: suits[Math.floor(Math.random() * suits.length)]
                    });
                }
                
                // Check for poker hands (simplified)
                const rankCounts = {};
                hand.forEach(card => {
                    rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
                });
                
                const counts = Object.values(rankCounts).sort((a, b) => b - a);
                
                if (counts[0] === 4) {
                    multiplier = 25; // Four of a kind
                    resultDisplay = "Four of a Kind!";
                    isWin = true;
                } else if (counts[0] === 3 && counts[1] === 2) {
                    multiplier = 9; // Full house
                    resultDisplay = "Full House!";
                    isWin = true;
                } else if (counts[0] === 3) {
                    multiplier = 3; // Three of a kind
                    resultDisplay = "Three of a Kind!";
                    isWin = true;
                } else if (counts[0] === 2 && counts[1] === 2) {
                    multiplier = 2; // Two pair
                    resultDisplay = "Two Pair!";
                    isWin = true;
                } else if (counts[0] === 2) {
                    const pairRank = Object.keys(rankCounts).find(rank => rankCounts[rank] === 2);
                    if (['J', 'Q', 'K', 'A'].includes(pairRank)) {
                        multiplier = 1; // Jacks or better
                        resultDisplay = "Jacks or Better!";
                        isWin = true;
                    } else {
                        multiplier = 0;
                        resultDisplay = "No winning hand";
                        isWin = false;
                    }
                } else {
                    multiplier = 0;
                    resultDisplay = "No winning hand";
                    isWin = false;
                }
                
                document.getElementById('poker-result').innerHTML = `
                    <div class="poker-cards">
                        ${hand.map(card => `<div class="card">${card.rank}${card.suit}</div>`).join('')}
                    </div>
                    <div class="poker-hand-name">${resultDisplay}</div>
                `;
                break;

            case 'baccarat':
                // Baccarat logic
                const playerScore = (Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9)) % 10;
                const bankerScore = (Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9)) % 10;
                
                document.getElementById('baccarat-result').innerHTML = `
                    <div class="baccarat-hands">
                        <div class="hand">
                            <h4>Player</h4>
                            <div class="cards">🂠 🂠</div>
                            <div class="total">${playerScore}</div>
                        </div>
                        <div class="hand">
                            <h4>Banker</h4>
                            <div class="cards">🂠 🂠</div>
                            <div class="total">${bankerScore}</div>
                        </div>
                    </div>
                `;
                
                if (choice === 'player') {
                    isWin = playerScore > bankerScore;
                    multiplier = isWin ? 1.95 : 0;
                } else if (choice === 'banker') {
                    isWin = bankerScore > playerScore;
                    multiplier = isWin ? 1.95 : 0;
                } else if (choice === 'tie') {
                    isWin = playerScore === bankerScore;
                    multiplier = isWin ? 8 : 0;
                }
                break;

            case 'crash':
                // Crash game logic
                const crashPoint = Math.pow(Math.random(), -0.04); // Exponential distribution
                const targetMultiplier = parseFloat(document.getElementById('crash-target')?.value) || 2.0;
                
                if (choice === 'start') {
                    // Simulate crash progression
                    let currentMultiplier = 1.0;
                    const interval = setInterval(() => {
                        currentMultiplier += 0.01;
                        document.querySelector('.crash-multiplier').textContent = `${currentMultiplier.toFixed(2)}x`;
                        
                        if (currentMultiplier >= crashPoint) {
                            clearInterval(interval);
                            document.querySelector('.crash-status').textContent = `CRASHED at ${currentMultiplier.toFixed(2)}x`;
                            if (currentMultiplier >= targetMultiplier) {
                                isWin = true;
                                multiplier = targetMultiplier;
                            } else {
                                isWin = false;
                                multiplier = 0;
                            }
                            return;
                        }
                        
                        if (currentMultiplier >= targetMultiplier) {
                            clearInterval(interval);
                            document.querySelector('.crash-status').textContent = `Cashed out at ${targetMultiplier.toFixed(2)}x`;
                            isWin = true;
                            multiplier = targetMultiplier;
                            return;
                        }
                    }, 100);
                    
                    // For immediate result in this simplified version
                    isWin = targetMultiplier <= crashPoint;
                    multiplier = isWin ? targetMultiplier : 0;
                }
                break;

            case 'plinko':
                // Plinko logic - simulate ball bouncing
                const plinkoMultipliers = [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000];
                const plinkoResult = plinkoMultipliers[Math.floor(Math.random() * plinkoMultipliers.length)];
                
                isWin = plinkoResult >= 1;
                multiplier = plinkoResult;
                resultDisplay = `Ball landed on ${plinkoResult}x`;
                
                setTimeout(() => {
                    document.querySelector('.plinko-multipliers').style.background = 'linear-gradient(to right, transparent, gold, transparent)';
                }, 500);
                break;

            case 'mines':
                // Mines game would need more complex state management
                // For now, simplified version
                const minePositions = new Set();
                while (minePositions.size < 3) {
                    minePositions.add(Math.floor(Math.random() * 25));
                }
                
                const selectedPosition = Math.floor(Math.random() * 25);
                if (minePositions.has(selectedPosition)) {
                    isWin = false;
                    multiplier = 0;
                    resultDisplay = "💣 BOOM! Hit a mine!";
                } else {
                    isWin = true;
                    const gemsFound = Math.floor(Math.random() * 10) + 1;
                    multiplier = Math.pow(1.2, gemsFound);
                    resultDisplay = `💎 Found gem! ${gemsFound} gems total`;
                }
                break;
        }

        // Add mines game initialization
        if (this.currentGameData.type === 'mines' && choice === 'start') {
            this.startMinesGame();
            return;
        }

        if (this.currentGameData.type === 'mines' && choice === 'cashout') {
            multiplier = this.endMinesGame(true);
            isWin = multiplier > 0;
        }

        // Calculate payout
        const payout = betAmount * multiplier;
        const profit = payout - betAmount;

        // Update user stats
        this.userData.balance -= betAmount;
        this.userData.totalBetsPlaced++;
        
        if (isWin && multiplier > 0) {
            this.userData.balance += payout;
            this.userData.totalWins++;
            this.userData.totalProfit += profit;
            this.userData.currentStreak++;
        } else {
            this.userData.totalLosses++;
            this.userData.totalProfit += profit; // Will be negative
            this.userData.currentStreak = 0;
        }

        // Add to betting history
        const betRecord = {
            id: Date.now(),
            type: 'arcade',
            selection: `${this.currentGameData.type} - ${choice}`,
            league: 'Arcade Games',
            amount: betAmount,
            odds: multiplier || 0,
            result: isWin ? 'won' : 'lost',
            payout: payout,
            profit: profit,
            date: new Date().toLocaleString()
        };

        this.bettingHistory.unshift(betRecord);
        this.saveUserData();
        this.updateDisplay();
        this.updateRecentActivity();

        // Show result
        setTimeout(() => {
            const resultMessage = isWin 
                ? `🎉 You won ${multiplier}x! +$${profit.toFixed(2)}` 
                : `💔 You lost $${betAmount.toFixed(2)}`;
            this.showToast(resultMessage, isWin ? 'success' : 'error');
            
            // Re-enable buttons
            document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = false);
        }, 1000);
    }

    // Hide arcade game modal
    hideArcadeGame() {
        document.getElementById('arcade-modal').classList.remove('active');
        this.currentGameData = null;
        this.minesGameActive = false;
    }

    // Advanced Blackjack integration
    playAdvancedBlackjack(betAmount, choice) {
        if (choice === 'deal') {
            const gameContainer = document.getElementById('arcade-game-content');
            const blackjackGame = new AdvancedBlackjack(betAmount, gameContainer);
            
            // Store reference for integration
            this.activeCardGame = blackjackGame;
            
            // Override the game's methods to integrate with our betting system
            const originalEndGame = blackjackGame.endGame.bind(blackjackGame);
            blackjackGame.endGame = () => {
                const result = originalEndGame();
                setTimeout(() => {
                    this.processGameResult(result.result, result.multiplier, betAmount, 'blackjack');
                }, 2000);
                return result;
            };
            
            return blackjackGame;
        }
    }

    // Advanced Poker integration
    playAdvancedPoker(betAmount, choice) {
        if (choice === 'deal') {
            const gameContainer = document.getElementById('arcade-game-content');
            const pokerGame = new AdvancedVideoPoker(betAmount, gameContainer);
            
            // Store reference for integration
            this.activeCardGame = pokerGame;
            
            return pokerGame;
        }
    }

    // Process game results for advanced games
    processGameResult(resultName, multiplier, betAmount, gameType) {
        const payout = betAmount * multiplier;
        const profit = payout - betAmount;
        const isWin = multiplier > 0;

        // Update user balance and stats
        this.userData.balance -= betAmount;
        this.userData.totalBetsPlaced++;
        this.userData.avgBetSize = ((this.userData.avgBetSize * (this.userData.totalBetsPlaced - 1)) + betAmount) / this.userData.totalBetsPlaced;
        
        if (isWin) {
            this.userData.balance += payout;
            this.userData.totalWins++;
            this.userData.totalProfit += profit;
            this.userData.currentStreak++;
            this.userData.longestStreak = Math.max(this.userData.longestStreak, this.userData.currentStreak);
            
            if (profit > this.userData.largestWin) {
                this.userData.largestWin = profit;
                this.showToast(`New personal record! Largest win: $${profit.toFixed(2)}`, 'success');
            }
        } else {
            this.userData.totalLosses++;
            this.userData.totalProfit += profit;
            this.userData.currentStreak = 0;
        }

        // Add to betting history
        const betRecord = {
            id: Date.now(),
            type: 'arcade',
            selection: `${gameType} - ${resultName}`,
            league: 'Advanced Casino Games',
            amount: betAmount,
            odds: multiplier || 0,
            result: isWin ? 'won' : 'lost',
            payout: payout,
            profit: profit,
            date: new Date().toLocaleString()
        };

        this.bettingHistory.unshift(betRecord);
        this.saveUserData();
        this.updateDisplay();
        this.updateRecentActivity();
        this.updateVipStatus();

        // Show result
        const resultMessage = isWin 
            ? `${resultName}! Profit: +$${profit.toFixed(2)}` 
            : `${resultName} - Lost: $${betAmount.toFixed(2)}`;
        this.showToast(resultMessage, isWin ? 'success' : 'error');
    }

    // Enhanced mines game with interactive cells
    revealMine(index) {
        if (!this.minesGameActive) return;
        
        const cell = document.querySelector(`.mine-cell:nth-child(${index + 1})`);
        if (cell.classList.contains('revealed')) return;
        
        const isMine = this.minePositions.has(index);
        cell.classList.add('revealed');
        
        if (isMine) {
            cell.classList.add('mine');
            cell.textContent = '💣';
            this.endMinesGame(false);
        } else {
            cell.classList.add('gem');
            cell.textContent = '💎';
            this.gemsFound++;
            this.updateMinesMultiplier();
        }
    }

    // Start mines game
    startMinesGame() {
        this.minesGameActive = true;
        this.gemsFound = 0;
        this.minePositions = new Set();
        
        // Place 3 random mines
        while (this.minePositions.size < 3) {
            this.minePositions.add(Math.floor(Math.random() * 25));
        }
        
        // Reset all cells
        document.querySelectorAll('.mine-cell').forEach(cell => {
            cell.classList.remove('revealed', 'gem', 'mine');
            cell.textContent = '?';
        });
        
        this.updateMinesMultiplier();
        document.getElementById('mines-start').style.display = 'none';
        document.getElementById('mines-cashout').style.display = 'inline-block';
    }

    // Update mines multiplier
    updateMinesMultiplier() {
        const multiplier = Math.pow(1.41, this.gemsFound);
        document.getElementById('mines-multiplier').textContent = `${multiplier.toFixed(2)}x`;
        document.getElementById('gems-found').textContent = this.gemsFound;
    }

    // End mines game
    endMinesGame(cashOut) {
        this.minesGameActive = false;
        const multiplier = cashOut ? Math.pow(1.41, this.gemsFound) : 0;
        
        // Reveal all mines
        this.minePositions.forEach(index => {
            const cell = document.querySelector(`.mine-cell:nth-child(${index + 1})`);
            if (!cell.classList.contains('revealed')) {
                cell.classList.add('revealed', 'mine');
                cell.textContent = '💣';
            }
        });
        
        document.getElementById('mines-start').style.display = 'inline-block';
        document.getElementById('mines-cashout').style.display = 'none';
        
        return multiplier;
    }

    // Mobile touch optimizations
    setupMobileOptimizations() {
        // Prevent zoom on double-tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Add visual touch feedback
        const touchElements = [
            '.game-card', '.bet-option', '.choice-btn', '.nav-btn', 
            '.mine-cell', '.playing-card', '.hold-btn', '.category-btn',
            '.quick-bet-buttons button', '.game-btn'
        ];

        touchElements.forEach(selector => {
            document.addEventListener('touchstart', function(e) {
                if (e.target.matches(selector) || e.target.closest(selector)) {
                    const element = e.target.matches(selector) ? e.target : e.target.closest(selector);
                    element.style.transform = 'scale(0.95)';
                    element.style.transition = 'transform 0.15s ease';
                    element.style.opacity = '0.8';
                }
            });

            document.addEventListener('touchend', function(e) {
                if (e.target.matches(selector) || e.target.closest(selector)) {
                    const element = e.target.matches(selector) ? e.target : e.target.closest(selector);
                    setTimeout(() => {
                        element.style.transform = 'scale(1)';
                        element.style.opacity = '1';
                    }, 150);
                }
            });
        });

        // Mobile device detection and optimization
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            document.body.classList.add('mobile-device');
            
            // Safe area support for notched devices
            if (window.CSS && CSS.supports('padding-top: env(safe-area-inset-top)')) {
                document.documentElement.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
                document.documentElement.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
            }

            // Optimize scrolling for mobile
            document.querySelectorAll('.sports-categories, .modal-body').forEach(element => {
                element.style.webkitOverflowScrolling = 'touch';
            });
        }

        // Enhanced haptic feedback simulation
        this.addHapticFeedback();
    }

    // Simulate haptic feedback on supported devices
    addHapticFeedback() {
        if ('vibrate' in navigator) {
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('choice-btn') || 
                    e.target.classList.contains('game-btn') ||
                    e.target.classList.contains('mine-cell')) {
                    navigator.vibrate(50);
                }
            });
        }
    }

    // Hide all modals
    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        this.currentBet = null;
        this.currentGameData = null;
    }

    // Enhanced recent activity display
    updateRecentActivity() {
        const recentBets = this.bettingHistory.slice(0, 5);
        const container = document.getElementById('recent-bets');
        
        if (recentBets.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chart-line"></i>
                    <p>No recent activity</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentBets.map(bet => `
            <div class="bet-item">
                <div class="bet-info">
                    <h4>${bet.selection}</h4>
                    <p>${bet.league} • ${bet.date}</p>
                </div>
                <div class="bet-result">
                    <div class="bet-amount ${bet.result}">${bet.result === 'won' ? '+' : '-'}$${Math.abs(bet.profit).toFixed(2)}</div>
                    <div class="bet-status ${bet.result}">${bet.result.toUpperCase()}</div>
                </div>
            </div>
        `).join('');
    }

    // Enhanced betting history with filters
    updateBettingHistory() {
        const filter = document.getElementById('history-filter')?.value || 'all';
        const period = document.getElementById('history-period')?.value || 'all';
        
        let filteredHistory = [...this.bettingHistory];
        
        // Apply result filter
        if (filter !== 'all') {
            filteredHistory = filteredHistory.filter(bet => bet.result === filter);
        }
        
        // Apply period filter
        const now = new Date();
        if (period === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredHistory = filteredHistory.filter(bet => new Date(bet.date) > weekAgo);
        } else if (period === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filteredHistory = filteredHistory.filter(bet => new Date(bet.date) > monthAgo);
        }
        
        const container = document.getElementById('betting-history');
        
        if (filteredHistory.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>No betting history available for selected filters</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredHistory.map(bet => `
            <div class="bet-item detailed">
                <div class="bet-info">
                    <h4>${bet.selection}</h4>
                    <p>${bet.league} • ${bet.date}</p>
                    <div class="bet-details-small">
                        <span>Bet: $${bet.amount.toFixed(2)}</span>
                        <span>Odds: ${bet.odds}</span>
                        <span>Type: ${bet.type}</span>
                    </div>
                </div>
                <div class="bet-result">
                    <div class="bet-amount ${bet.result}">${bet.result === 'won' ? '+' : '-'}$${Math.abs(bet.profit).toFixed(2)}</div>
                    <div class="bet-payout">Payout: $${bet.payout.toFixed(2)}</div>
                    <div class="bet-status ${bet.result}">${bet.result.toUpperCase()}</div>
                </div>
            </div>
        `).join('');
    }

    // Enhanced toast notifications
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        }[type];
        
        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;
        
        document.getElementById('toast-container').appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    // Add funds to wallet
    addFunds(amount) {
        this.userData.balance += amount;
        this.saveUserData();
        this.updateDisplay();
        this.showToast(`$${amount.toFixed(2)} added to your wallet`, 'success');
    }

    // Withdraw funds
    withdrawFunds(amount) {
        if (amount > this.userData.balance) {
            this.showToast('Insufficient balance for withdrawal', 'error');
            return false;
        }
        
        this.userData.balance -= amount;
        this.saveUserData();
        this.updateDisplay();
        this.showToast(`$${amount.toFixed(2)} withdrawn from your wallet`, 'info');
        return true;
    }
}

// Global functions for HTML onclick handlers
let app;

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add('active');
}

function showSportsCategory(category) {
    app.showSportsCategory(category);
}

function playArcadeGame(gameType) {
    app.playArcadeGame(gameType);
}

function showProfile() {
    // Update profile header
    document.getElementById('profile-display-name').textContent = app.userData.name;
    
    // Update overview tab
    document.getElementById('overview-balance').textContent = `$${app.userData.balance.toFixed(2)}`;
    document.getElementById('overview-wins').textContent = app.userData.totalWins;
    document.getElementById('overview-profit').textContent = `$${app.userData.totalProfit.toFixed(2)}`;
    document.getElementById('overview-streak').textContent = app.userData.currentStreak;
    
    // Update account tab
    document.getElementById('profile-name').value = app.userData.name;
    
    // Update wallet tab
    document.getElementById('wallet-usd').textContent = `$${app.userData.balance.toFixed(2)}`;
    document.getElementById('wallet-btc').textContent = `${app.userData.bitcoinBalance.toFixed(3)} BTC`;
    document.getElementById('wallet-eth').textContent = `${app.userData.ethereumBalance.toFixed(3)} ETH`;
    
    // Update admin controls if they exist
    if (document.getElementById('admin-wins')) {
        document.getElementById('admin-wins').value = app.userData.totalWins;
        document.getElementById('admin-losses').value = app.userData.totalLosses;
        document.getElementById('admin-bitcoin').value = app.userData.bitcoinBalance;
        document.getElementById('admin-ethereum').value = app.userData.ethereumBalance;
        document.getElementById('admin-streak').value = app.userData.currentStreak;
        document.getElementById('admin-profit').value = app.userData.totalProfit;
        document.getElementById('admin-balance').value = app.userData.balance;
        document.getElementById('admin-vip').value = app.userData.vipLevel;
    }
    
    // Reset to overview tab
    switchProfileTab('overview');
    
    // Reset advanced settings
    document.getElementById('advanced-settings').classList.remove('visible');
    document.getElementById('admin-controls').style.display = 'none';
    document.querySelector('.security-input').style.display = 'block';
    document.getElementById('admin-password').value = '';
    
    document.getElementById('profile-modal').classList.add('active');
}

function hideProfile() {
    document.getElementById('profile-modal').classList.remove('active');
}

function toggleAdminControls() {
    const adminControls = document.getElementById('admin-controls');
    adminControls.style.display = adminControls.style.display === 'none' ? 'block' : 'none';
}

function saveProfile() {
    // Save basic profile information
    app.userData.name = document.getElementById('profile-name').value;
    
    // Save advanced settings if they are visible and unlocked
    if (document.getElementById('admin-controls').style.display === 'block') {
        app.userData.totalWins = parseInt(document.getElementById('admin-wins').value) || 0;
        app.userData.totalLosses = parseInt(document.getElementById('admin-losses').value) || 0;
        app.userData.bitcoinBalance = parseFloat(document.getElementById('admin-bitcoin').value) || 0;
        app.userData.ethereumBalance = parseFloat(document.getElementById('admin-ethereum').value) || 0;
        app.userData.currentStreak = parseInt(document.getElementById('admin-streak').value) || 0;
        app.userData.totalProfit = parseFloat(document.getElementById('admin-profit').value) || 0;
        app.userData.balance = parseFloat(document.getElementById('admin-balance').value) || 0;
        app.userData.vipLevel = document.getElementById('admin-vip').value;
    }
    
    app.saveUserData();
    app.updateDisplay();
    app.showToast('Profile updated successfully', 'success');
    hideProfile();
}

function showDepositModal() {
    document.getElementById('available-balance').textContent = app.userData.balance.toFixed(2);
    document.getElementById('deposit-modal').classList.add('active');
}

function hideDepositModal() {
    document.getElementById('deposit-modal').classList.remove('active');
}

function showWithdrawModal() {
    document.getElementById('available-balance').textContent = app.userData.balance.toFixed(2);
    updateWithdrawCalculation();
    document.getElementById('withdraw-modal').classList.add('active');
}

function hideWithdrawModal() {
    document.getElementById('withdraw-modal').classList.remove('active');
}

function setDepositAmount(amount) {
    document.getElementById('deposit-amount').value = amount;
}

function updateWithdrawCalculation() {
    const withdrawAmount = parseFloat(document.getElementById('withdraw-amount').value) || 0;
    const fee = 2.50;
    const netAmount = Math.max(0, withdrawAmount - fee);
    document.getElementById('net-withdrawal').textContent = netAmount.toFixed(2);
}

function processDeposit() {
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    
    if (!amount || amount < 10) {
        app.showToast('Minimum deposit amount is $10', 'error');
        return;
    }
    
    if (amount > 10000) {
        app.showToast('Maximum deposit amount is $10,000', 'error');
        return;
    }
    
    // Apply bonus for deposits over $100
    let finalAmount = amount;
    if (amount >= 100) {
        finalAmount = amount * 1.05; // 5% bonus
        app.showToast(`Deposit successful! Bonus applied: +$${(finalAmount - amount).toFixed(2)}`, 'success');
    } else {
        app.showToast(`Deposit successful! $${amount.toFixed(2)} added to your wallet`, 'success');
    }
    
    app.userData.balance += finalAmount;
    app.saveUserData();
    app.updateDisplay();
    hideDepositModal();
    
    // Clear the input
    document.getElementById('deposit-amount').value = '';
}

function processWithdrawal() {
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    const fee = 2.50;
    const totalDeduction = amount + fee;
    
    if (!amount || amount < 10) {
        app.showToast('Minimum withdrawal amount is $10', 'error');
        return;
    }
    
    if (totalDeduction > app.userData.balance) {
        app.showToast('Insufficient balance for withdrawal including fees', 'error');
        return;
    }
    
    app.userData.balance -= totalDeduction;
    app.saveUserData();
    app.updateDisplay();
    app.showToast(`Withdrawal processed! $${amount.toFixed(2)} will arrive in 1-3 business days`, 'info');
    hideWithdrawModal();
    
    // Clear the input
    document.getElementById('withdraw-amount').value = '';
}

function hideBetSlip() {
    app.hideBetSlip();
}

function hideArcadeGame() {
    app.hideArcadeGame();
}

// Profile tab management
function switchProfileTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.profile-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.profile-section').forEach(section => section.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding section
    document.querySelector(`[onclick="switchProfileTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`profile-${tabName}`).classList.add('active');
}

// Advanced settings security
function requestAdvancedAccess() {
    const advancedSettings = document.getElementById('advanced-settings');
    if (advancedSettings.classList.contains('visible')) {
        advancedSettings.classList.remove('visible');
    } else {
        advancedSettings.classList.add('visible');
    }
}

function verifyAdvancedAccess() {
    const password = document.getElementById('admin-password').value;
    const correctPassword = 'admin123'; // In a real app, this would be more secure
    
    if (password === correctPassword) {
        document.getElementById('admin-controls').style.display = 'block';
        document.querySelector('.security-input').style.display = 'none';
        app.showToast('Advanced settings unlocked', 'success');
    } else {
        app.showToast('Invalid security code', 'error');
        document.getElementById('admin-password').value = '';
    }
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', () => {
    app = new BettingApp();
    
    // Add event listeners for history filters
    const historyFilter = document.getElementById('history-filter');
    const historyPeriod = document.getElementById('history-period');
    
    if (historyFilter) {
        historyFilter.addEventListener('change', () => app.updateBettingHistory());
    }
    
    if (historyPeriod) {
        historyPeriod.addEventListener('change', () => app.updateBettingHistory());
    }

    // Add event listeners for withdrawal calculations
    document.addEventListener('input', (e) => {
        if (e.target.id === 'withdraw-amount') {
            updateWithdrawCalculation();
        }
    });

    // Add payment option selection functionality
    document.addEventListener('click', (e) => {
        if (e.target.closest('.payment-option')) {
            const option = e.target.closest('.payment-option');
            const container = option.parentElement;
            
            // Remove active class from all options in this container
            container.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            option.classList.add('active');
        }
    });
});