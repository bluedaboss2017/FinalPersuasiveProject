
        const pokemonCards = [
            // One Star (30 cards)
            {name: "Rattata", rarity: "one-star", id: "019"}, {name: "Pidgey", rarity: "one-star", id: "016"}, {name: "Weedle", rarity: "one-star", id: "013"},
            {name: "Caterpie", rarity: "one-star", id: "010"}, {name: "Magikarp", rarity: "one-star", id: "129"}, {name: "Zubat", rarity: "one-star", id: "041"},
            {name: "Geodude", rarity: "one-star", id: "074"}, {name: "Machop", rarity: "one-star", id: "066"}, {name: "Bellsprout", rarity: "one-star", id: "069"},
            {name: "Oddish", rarity: "one-star", id: "043"}, {name: "Poliwag", rarity: "one-star", id: "060"}, {name: "Abra", rarity: "one-star", id: "063"},
            {name: "Gastly", rarity: "one-star", id: "092"}, {name: "Onix", rarity: "one-star", id: "095"}, {name: "Drowzee", rarity: "one-star", id: "096"},
            {name: "Voltorb", rarity: "one-star", id: "100"}, {name: "Magnemite", rarity: "one-star", id: "081"}, {name: "Farfetchd", rarity: "one-star", id: "083"},
            {name: "Doduo", rarity: "one-star", id: "084"}, {name: "Seel", rarity: "one-star", id: "086"}, {name: "Grimer", rarity: "one-star", id: "088"},
            {name: "Shellder", rarity: "one-star", id: "090"}, {name: "Krabby", rarity: "one-star", id: "098"}, {name: "Horsea", rarity: "one-star", id: "116"},
            {name: "Goldeen", rarity: "one-star", id: "118"}, {name: "Staryu", rarity: "one-star", id: "120"}, {name: "Psyduck", rarity: "one-star", id: "054"},
            {name: "Mankey", rarity: "one-star", id: "056"}, {name: "Growlithe", rarity: "one-star", id: "058"}, {name: "Tentacool", rarity: "one-star", id: "072"},
            
            // Two Star (12 cards)
            {name: "Pikachu", rarity: "two-star", id: "025"}, {name: "Squirtle", rarity: "two-star", id: "007"}, {name: "Bulbasaur", rarity: "two-star", id: "001"},
            {name: "Charmander", rarity: "two-star", id: "004"}, {name: "Eevee", rarity: "two-star", id: "133"}, {name: "Ditto", rarity: "two-star", id: "132"},
            {name: "Snorlax", rarity: "two-star", id: "143"}, {name: "Lapras", rarity: "two-star", id: "131"}, {name: "Jigglypuff", rarity: "two-star", id: "039"},
            {name: "Clefairy", rarity: "two-star", id: "035"}, {name: "Mr-Mime", rarity: "two-star", id: "122"}, {name: "Scyther", rarity: "two-star", id: "123"},
            
            // Three Star (5 cards)
            {name: "Gyarados", rarity: "three-star", id: "130"}, {name: "Dragonite", rarity: "three-star", id: "149"}, {name: "Alakazam", rarity: "three-star", id: "065"},
            {name: "Machamp", rarity: "three-star", id: "068"}, {name: "Gengar", rarity: "three-star", id: "094"},
            
            // Four Star (2 cards)
            {name: "Articuno", rarity: "four-star", id: "144"}, {name: "Zapdos", rarity: "four-star", id: "145"},
            
            // Five Star (1 card)
            {name: "Mew", rarity: "five-star", id: "151"}
        ];

        let gameState = {
            packsOpened: 0,
            freePacks: 2,
            collection: new Set(),
            newCards: new Set(),
            timerEnd: null,
            isOpening: false
        };

        const rarityWeights = {
            "one-star": 0.70,
            "two-star": 0.20,
            "three-star": 0.07,
            "four-star": 0.025,
            "five-star": 0.005
        };

        function updateUI() {
            document.getElementById('packsOpened').textContent = gameState.packsOpened;
            document.getElementById('cardsCollected').textContent = `${gameState.collection.size}/50`;
            document.getElementById('freePacks').textContent = gameState.freePacks;
            
            const freeBtn = document.getElementById('freePackBtn');
            const buyBtn = document.getElementById('buyPackBtn');
            const nextBtn = document.getElementById('nextBtn');
            
            freeBtn.disabled = gameState.isOpening || (gameState.freePacks === 0 && gameState.timerEnd && Date.now() < gameState.timerEnd);
            buyBtn.disabled = gameState.isOpening;
            
            // Show "Next" button after 5 packs opened
            if (gameState.packsOpened >= 5) {
                nextBtn.style.display = 'inline-block';
            }
            
            updateTimer();
            updateCollection();
        }

        function updateTimer() {
            const timerEl = document.getElementById('timer');
            if (gameState.timerEnd && Date.now() < gameState.timerEnd) {
                const remaining = Math.ceil((gameState.timerEnd - Date.now()) / 1000);
                timerEl.textContent = `Next free pack in: ${remaining}s`;
            } else if (gameState.freePacks === 0) {
                timerEl.textContent = "Free pack available!";
                gameState.freePacks = 1;
                updateUI();
            } else {
                timerEl.textContent = "";
            }
        }

        function updateCollection() {
            const grid = document.getElementById('collectionGrid');
            grid.innerHTML = '';
            
            pokemonCards.forEach(card => {
                const cardEl = document.createElement('div');
                cardEl.className = `collection-card ${card.rarity}`;
                
                if (gameState.collection.has(card.name)) {
                    cardEl.innerHTML = `
                        <img src="${getPokemonImageUrl(card.id)}" alt="${card.name}" class="pokemon-image" style="width: 60px; height: 60px;" onerror="this.style.display='none'" />
                        <div class="card-name" style="font-size: 0.8em;">${card.name}</div>
                        <div class="stars" style="font-size: 1.1em; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">${getStars(card.rarity)}</div>
                    `;
                    if (gameState.newCards.has(card.name)) {
                        const indicator = document.createElement('div');
                        indicator.className = 'new-indicator';
                        indicator.textContent = 'NEW';
                        cardEl.style.position = 'relative';
                        cardEl.appendChild(indicator);
                    }
                } else {
                    cardEl.style.opacity = '0.3';
                    cardEl.innerHTML = `
                        <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 8px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; font-size: 2em;">?</div>
                        <div class="card-name" style="font-size: 0.8em;">???</div>
                        <div class="stars" style="font-size: 1.1em; color: #666;">? ? ?</div>
                    `;
                }
                
                grid.appendChild(cardEl);
            });
        }

        function getStars(rarity) {
            const starCount = parseInt(rarity.split('-')[0]);
            return '★'.repeat(starCount);
        }

        function getPokemonImageUrl(id) {
            // Using PokeAPI sprites - more reliable
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${parseInt(id)}.png`;
        }

        function getRandomCard(guaranteedRare = false) {
            if (guaranteedRare) {
                // For the 5th card, increase rare+ chances
                const rareCards = pokemonCards.filter(c => ['three-star', 'four-star', 'five-star'].includes(c.rarity));
                const rand = Math.random();
                if (rand < 0.6) { // 60% chance for rare+
                    return rareCards[Math.floor(Math.random() * rareCards.length)];
                }
            }
            
            const rand = Math.random();
            let cumulative = 0;
            
            for (const [rarity, weight] of Object.entries(rarityWeights)) {
                cumulative += weight;
                if (rand <= cumulative) {
                    const cardsOfRarity = pokemonCards.filter(c => c.rarity === rarity);
                    return cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
                }
            }
        }

        function openPack() {
            if (gameState.isOpening) return; // Prevent spam clicking
            
            gameState.isOpening = true;
            updateUI();
            
            const pack = document.getElementById('packToPopen');
            const container = document.getElementById('cardsContainer');
            
            pack.classList.add('opening');
            container.innerHTML = '';
            
            setTimeout(() => {
                pack.classList.remove('opening');
                
                const packCards = [];
                for (let i = 0; i < 5; i++) {
                    const card = getRandomCard(i === 4); // 5th card has better odds
                    packCards.push(card);
                    
                    if (!gameState.collection.has(card.name)) {
                        gameState.newCards.add(card.name);
                    }
                    gameState.collection.add(card.name);
                }
                
                packCards.forEach((card, index) => {
                    setTimeout(() => {
                        const cardEl = document.createElement('div');
                        cardEl.className = `card ${card.rarity}`;
                        cardEl.innerHTML = `
                            <img src="${getPokemonImageUrl(card.id)}" alt="${card.name}" class="pokemon-image" onerror="this.style.display='none'" />
                            <div class="card-name">${card.name}</div>
                            <div class="stars">${getStars(card.rarity)}</div>
                        `;
                        
                        if (gameState.newCards.has(card.name)) {
                            const indicator = document.createElement('div');
                            indicator.className = 'new-indicator';
                            indicator.textContent = 'NEW';
                            cardEl.style.position = 'relative';
                            cardEl.appendChild(indicator);
                        }
                        
                        container.appendChild(cardEl);
                    }, index * 200);
                });
                
                gameState.packsOpened++;
                
                // Re-enable buttons after animation completes
                setTimeout(() => {
                    gameState.isOpening = false;
                    updateUI();
                }, 1200); // Wait for all cards to appear
                
                setTimeout(() => {
                    gameState.newCards.clear();
                    updateCollection();
                }, 3000);
                
            }, 500);
        }

        document.getElementById('freePackBtn').addEventListener('click', () => {
            if (gameState.freePacks > 0 || (gameState.timerEnd && Date.now() >= gameState.timerEnd)) {
                gameState.freePacks = Math.max(0, gameState.freePacks - 1);
                
                if (gameState.freePacks === 0) {
                    gameState.timerEnd = Date.now() + 30000; // 30 seconds
                }
                
                openPack();
            }
        });

        document.getElementById('buyPackBtn').addEventListener('click', () => {
            openPack();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            document.querySelector('.container').style.display = 'none';
            document.getElementById('educationPage').style.display = 'block';
        });

        document.getElementById('backBtn').addEventListener('click', () => {
            document.querySelector('.container').style.display = 'block';
            document.getElementById('educationPage').style.display = 'none';
        });

        // Timer update loop
        setInterval(updateTimer, 1000);
        
        // Initialize
        updateUI();