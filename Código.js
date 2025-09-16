// Estado do jogo
let gameState = {
    player: {
        name: '',
        level: 1,
        hp: 100,
        maxHP: 100,
        mp: 50,
        maxMP: 50,
        xp: 0,
        xpToNext: 100,
        attack: 15,
        defense: 10,
        gold: 50,
        class: null,
        classEmoji: '🧙‍♂️'
    },
    location: 'town',
    inCombat: false,
    currentEnemy: null,
    inventory: {
        potion: 3,
        manaPotion: 2
    },
    statusEffects: {
        bearForm: 0,
        reviveReady: false,
        reviveCooldown: 0
    },
    summons: {
        ghost: null
    }
};

// Definição das classes
const classes = {
    knight: {
        name: 'Cavaleiro',
        emoji: '🧔🏼',
        bonuses: { hp: 30, attack: 5, defense: 3, mp: 0 },
        spells: []
    },
    mage: {
        name: 'Mago',
        emoji: '🧙‍♂️',
        bonuses: { hp: 0, attack: 0, defense: 0, mp: 50 },
        spells: ['fireball', 'iceShard', 'lightning']
    },
    necromancer: {
        name: 'Necromante',
        emoji: '🧙‍♀️',
        bonuses: { hp: 0, attack: 2, defense: 1, mp: 40 },
        spells: ['summonGhost', 'curse', 'revive', 'lifeDrain']
    },
    druid: {
        name: 'Druida',
        emoji: '🧝‍♂️',
        bonuses: { hp: 15, attack: 0, defense: 2, mp: 35 },
        spells: ['hurricane', 'natureHealing', 'bearForm', 'natureMagic']
    }
};

// Definição das magias
const spells = {
    // Mago
    fireball: { name: 'Bola de Fogo', cost: 15, damage: [20, 30], emoji: '🔥', type: 'damage' },
    iceShard: { name: 'Fragmento de Gelo', cost: 12, damage: [15, 25], emoji: '❄️', type: 'damage' },
    lightning: { name: 'Raio', cost: 18, damage: [25, 35], emoji: '⚡', type: 'damage' },
    
    // Necromante
    summonGhost: { name: 'Invocar Fantasma', cost: 20, emoji: '👻', type: 'summon' },
    curse: { name: 'Maldição', cost: 15, damage: [12, 20], emoji: '💀', type: 'curse' },
    revive: { name: 'Reviver', cost: 25, emoji: '⚰️', type: 'revive' },
    lifeDrain: { name: 'Sugar Vida', cost: 18, damage: [15, 25], emoji: '🩸', type: 'lifedrain' },
    
    // Druida
    hurricane: { name: 'Furacão', cost: 22, damage: [18, 28], emoji: '🌪️', type: 'damage' },
    natureHealing: { name: 'Cura da Natureza', cost: 16, heal: [25, 40], emoji: '🌿', type: 'heal' },
    bearForm: { name: 'Forma de Urso', cost: 20, emoji: '🐻', type: 'transform' },
    natureMagic: { name: 'Magia da Natureza', cost: 14, damage: [16, 24], emoji: '🍃', type: 'damage' }
};

// Inimigos
const enemies = {
    goblin: { name: 'Goblin', hp: 40, attack: 12, defense: 5, xp: 25, gold: 15, emoji: '👹' },
    orc: { name: 'Orc', hp: 70, attack: 18, defense: 8, xp: 40, gold: 25, emoji: '👺' },
    skeleton: { name: 'Esqueleto', hp: 50, attack: 15, defense: 6, xp: 30, gold: 20, emoji: '💀' },
    zombie: { name: 'Zumbi', hp: 60, attack: 14, defense: 4, xp: 35, gold: 18, emoji: '🧟' },
    ghost: { name: 'Fantasma', hp: 45, attack: 16, defense: 2, xp: 40, gold: 30, emoji: '👻' },
    demon: { name: 'Demônio', hp: 90, attack: 22, defense: 10, xp: 60, gold: 40, emoji: '😈' },
    vampire: { name: 'Vampiro', hp: 80, attack: 20, defense: 8, xp: 55, gold: 35, emoji: '🧛' },
    werewolf: { name: 'Lobisomem', hp: 85, attack: 24, defense: 9, xp: 65, gold: 45, emoji: '🐺' },
    dragon: { name: 'Dragão Jovem', hp: 150, attack: 30, defense: 15, xp: 100, gold: 100, emoji: '🐉' },
    lich: { name: 'Lich', hp: 120, attack: 28, defense: 12, xp: 85, gold: 80, emoji: '☠️' },
    bandits: { name: 'Bandidos', hp: 65, attack: 16, defense: 7, xp: 45, gold: 35, emoji: '🏴‍☠️' }
};

// Localizações
const locations = {
    town: {
        name: 'Cidade Inicial',
        description: 'Você está na praça central de uma pequena cidade. Aventureiros se reúnem aqui antes de partir para suas jornadas.',
        enemies: ['goblin', 'orc', 'bandits']
    },
    forest: {
        name: 'Floresta Sombria',
        description: 'Uma floresta densa onde criaturas perigosas se escondem entre as árvores.',
        enemies: ['goblin', 'orc', 'skeleton', 'zombie', 'bandits']
    },
    cave: {
        name: 'Caverna Misteriosa',
        description: 'Uma caverna escura que ecoa com sons estranhos vindos das profundezas.',
        enemies: ['skeleton', 'zombie', 'ghost', 'demon']
    },
    mountain: {
        name: 'Montanha Gelada',
        description: 'Picos nevados onde apenas os mais corajosos se aventuram.',
        enemies: ['vampire', 'werewolf', 'dragon', 'bandits']
    },
    cemetery: {
        name: 'Cemitério Assombrado',
        description: 'Um cemitério antigo onde os mortos não descansam em paz.',
        enemies: ['skeleton', 'zombie', 'ghost', 'vampire']
    },
    dungeon: {
        name: 'Masmorra Profunda',
        description: 'Uma masmorra cheia de perigos e tesouros perdidos.',
        enemies: ['demon', 'lich', 'dragon', 'vampire']
    }
};

// Itens da loja
const shopItems = {
    potion: { name: 'Poção de Vida', price: 20, emoji: '🧪', description: 'Restaura 40 HP' },
    manaPotion: { name: 'Poção de Mana', price: 25, emoji: '🔮', description: 'Restaura 30 MP' },
    sword: { name: 'Espada Melhorada', price: 100, emoji: '⚔️', description: '+5 Ataque', effect: 'attack', value: 5 },
    shield: { name: 'Escudo de Ferro', price: 80, emoji: '🛡️', description: '+3 Defesa', effect: 'defense', value: 3 },
    armor: { name: 'Armadura de Couro', price: 150, emoji: '🦺', description: '+20 HP máximo', effect: 'maxHP', value: 20 }
};

// Função para selecionar classe
function selectClass(classType) {
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) {
        alert('Por favor, digite um nome para seu personagem!');
        return;
    }
    
    const selectedClass = classes[classType];
    gameState.player.name = playerName;
    gameState.player.class = selectedClass.name;
    gameState.player.classEmoji = selectedClass.emoji;
    
    // Aplicar bônus da classe
    gameState.player.maxHP += selectedClass.bonuses.hp;
    gameState.player.hp += selectedClass.bonuses.hp;
    gameState.player.maxMP += selectedClass.bonuses.mp;
    gameState.player.mp += selectedClass.bonuses.mp;
    gameState.player.attack += selectedClass.bonuses.attack;
    gameState.player.defense += selectedClass.bonuses.defense;
    
    // Configurar habilidades especiais
    if (classType === 'necromancer') {
        gameState.statusEffects.reviveReady = true;
        gameState.statusEffects.reviveCooldown = 0;
    }
    
    // Esconder seleção e mostrar jogo
    document.getElementById('classSelection').style.display = 'none';
    document.getElementById('gameBoard').style.display = 'grid';
    
    addMessage(`Bem-vindo, ${playerName}! Você escolheu a classe ${selectedClass.name}!`, 'success');
    updateUI();
    updateInventoryDisplay();
}

// Função para adicionar mensagens
function addMessage(text, type = 'info') {
    const messageLog = document.getElementById('messageLog');
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    messageLog.appendChild(message);
    messageLog.scrollTop = messageLog.scrollHeight;
}

// Atualizar inventário
function updateInventoryDisplay() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    inventoryGrid.innerHTML = '';
    
    for (let i = 0; i < 12; i++) {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        
        const items = Object.keys(gameState.inventory);
        if (i < items.length && gameState.inventory[items[i]] > 0) {
            const itemKey = items[i];
            const item = shopItems[itemKey];
            if (item) {
                slot.className += ' has-item';
                slot.innerHTML = item.emoji;
                slot.title = item.name;
                slot.onclick = () => useItem(itemKey);
                
                if (gameState.inventory[itemKey] > 1) {
                    const quantity = document.createElement('div');
                    quantity.className = 'item-quantity';
                    quantity.textContent = gameState.inventory[itemKey];
                    slot.appendChild(quantity);
                }
            }
        }
        inventoryGrid.appendChild(slot);
    }
}

// Atualizar efeitos de status
function updateStatusEffects() {
    const statusContainer = document.getElementById('statusEffects');
    const activeEffectsContainer = document.getElementById('activeEffects');
    
    let hasEffects = false;
    activeEffectsContainer.innerHTML = '';
    
    if (gameState.statusEffects.bearForm > 0) {
        const effect = document.createElement('div');
        effect.className = 'status-effect';
        effect.style.background = 'rgba(139, 69, 19, 0.8)';
        effect.textContent = `🐻 Forma de Urso (${gameState.statusEffects.bearForm} turnos)`;
        activeEffectsContainer.appendChild(effect);
        hasEffects = true;
    }
    
    if (gameState.summons.ghost && gameState.summons.ghost.hp > 0) {
        const effect = document.createElement('div');
        effect.className = 'status-effect';
        effect.style.background = 'rgba(108, 92, 231, 0.8)';
        effect.textContent = `👻 Fantasma (${gameState.summons.ghost.hp} HP)`;
        activeEffectsContainer.appendChild(effect);
        hasEffects = true;
    }
    
    if (gameState.statusEffects.reviveCooldown > 0) {
        const effect = document.createElement('div');
        effect.className = 'status-effect';
        effect.style.background = 'rgba(45, 52, 54, 0.8)';
        effect.textContent = `⚰️ Reviver em ${gameState.statusEffects.reviveCooldown} turnos`;
        activeEffectsContainer.appendChild(effect);
        hasEffects = true;
    }
    
    statusContainer.style.display = hasEffects ? 'block' : 'none';
}

// Atualizar UI
function updateUI() {
    document.getElementById('playerLevel').textContent = gameState.player.level;
    document.getElementById('playerClass').textContent = gameState.player.class || 'Aventureiro';
    document.getElementById('currentHP').textContent = gameState.player.hp;
    document.getElementById('maxHP').textContent = gameState.player.maxHP;
    document.getElementById('currentMP').textContent = gameState.player.mp;
    document.getElementById('maxMP').textContent = gameState.player.maxMP;
    document.getElementById('currentXP').textContent = gameState.player.xp;
    document.getElementById('xpToNext').textContent = gameState.player.xpToNext;
    
    // Ataque com bônus da forma de urso
    let displayAttack = gameState.player.attack;
    if (gameState.statusEffects.bearForm > 0) {
        displayAttack += 15;
    }
    document.getElementById('playerAttack').textContent = displayAttack;
    document.getElementById('playerDefense').textContent = gameState.player.defense;
    document.getElementById('playerGold').textContent = gameState.player.gold;
    
    if (gameState.player.name) {
        document.getElementById('playerNameDisplay').textContent = gameState.player.name;
    }
    if (gameState.player.classEmoji) {
        document.getElementById('playerEmoji').textContent = gameState.player.classEmoji;
    }

    // Barras de progresso
    const hpPercent = (gameState.player.hp / gameState.player.maxHP) * 100;
    const mpPercent = (gameState.player.mp / gameState.player.maxMP) * 100;
    const xpPercent = (gameState.player.xp / gameState.player.xpToNext) * 100;

    document.getElementById('hpBar').style.width = hpPercent + '%';
    document.getElementById('mpBar').style.width = mpPercent + '%';
    document.getElementById('xpBar').style.width = xpPercent + '%';

    // Localização
    const location = locations[gameState.location];
    if (location) {
        document.getElementById('locationName').textContent = location.name;
        document.getElementById('locationDescription').textContent = location.description;
    }
    
    updateStatusEffects();
}

// Explorar
function explore() {
    if (Math.random() < 0.15) {
        triggerTrap();
        return;
    }

    const locationKeys = Object.keys(locations);
    const randomLocation = locationKeys[Math.floor(Math.random() * locationKeys.length)];
    gameState.location = randomLocation;

    const events = [
        'Você encontrou uma pequena quantia de ouro!',
        'Você descobriu uma poção escondida!',
        'Você encontrou um local seguro para descansar.',
        'Você ouviu ruídos estranhos na distância...',
        'Você encontrou pegadas de criaturas desconhecidas.'
    ];
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    
    if (randomEvent.includes('ouro')) {
        const goldFound = Math.floor(Math.random() * 20) + 5;
        gameState.player.gold += goldFound;
        addMessage(`Você encontrou ${goldFound} moedas de ouro!`, 'success');
    } else if (randomEvent.includes('poção')) {
        addMessage('Você encontrou uma poção de vida!', 'success');
        gameState.inventory.potion = (gameState.inventory.potion || 0) + 1;
    } else {
        addMessage(randomEvent, 'info');
    }

    document.getElementById('gameContent').innerHTML = `
        <p>Você explorou uma nova área e descobriu: <strong>${locations[randomLocation].name}</strong></p>
        <p>${randomEvent}</p>
        <p>Continue explorando ou procure por inimigos para ganhar experiência!</p>
    `;

    updateUI();
    updateInventoryDisplay();
}

// Procurar inimigo
function findEnemy() {
    if (Math.random() < 0.10) {
        triggerTrap();
        return;
    }
    
    const currentLocation = locations[gameState.location];
    const possibleEnemies = currentLocation.enemies;
    const randomEnemyKey = possibleEnemies[Math.floor(Math.random() * possibleEnemies.length)];
    const enemy = { ...enemies[randomEnemyKey] };
    
    gameState.currentEnemy = enemy;
    gameState.inCombat = true;

    startCombat();
}

// Armadilhas
function triggerTrap() {
    const traps = [
        { name: 'Poço Oculto', emoji: '🕳️', damage: [10, 20], description: 'Você caiu em um poço disfarçado!' },
        { name: 'Dardos Venenosos', emoji: '🏹', damage: [8, 15], description: 'Dardos venenosos foram disparados das paredes!' },
        { name: 'Pedra Rolante', emoji: '🪨', damage: [15, 25], description: 'Uma pedra gigante rolou em sua direção!' },
        { name: 'Espinhos no Chão', emoji: '🌵', damage: [5, 12], description: 'Você pisou em espinhos afiados escondidos!' },
        { name: 'Gás Tóxico', emoji: '☠️', damage: [12, 18], description: 'Você inalou um gás tóxico!' }
    ];
    
    const randomTrap = traps[Math.floor(Math.random() * traps.length)];
    const damage = Math.floor(Math.random() * (randomTrap.damage[1] - randomTrap.damage[0] + 1)) + randomTrap.damage[0];
    
    gameState.player.hp = Math.max(1, gameState.player.hp - damage);

    document.getElementById('gameContent').innerHTML = `
        <div style="text-align: center; padding: 30px;">
            <div style="font-size: 5rem; margin-bottom: 20px;">${randomTrap.emoji}</div>
            <h3 style="color: #ff4757; margin-bottom: 15px;">ARMADILHA!</h3>
            <h4>${randomTrap.name}</h4>
            <p style="margin: 20px 0;">${randomTrap.description}</p>
            <p style="color: #ff6b7a; font-weight: bold;">Você perdeu ${damage} HP!</p>
        </div>
    `;

    addMessage(`Armadilha ativada: ${randomTrap.name}! Perdeu ${damage} HP.`, 'combat');
    updateUI();
}

// Iniciar combate
function startCombat() {
    const enemy = gameState.currentEnemy;
    
    document.getElementById('gameContent').innerHTML = `
        <div class="combat-area">
            <div class="character-card">
                <div class="character-avatar">${gameState.player.classEmoji}</div>
                <h3>${gameState.player.name}</h3>
                <div>HP: ${gameState.player.hp}/${gameState.player.maxHP}</div>
                <div>Ataque: ${gameState.statusEffects.bearForm > 0 ? gameState.player.attack + 15 : gameState.player.attack}</div>
                <div>Defesa: ${gameState.player.defense}</div>
            </div>
            <div class="enemy-card">
                <div class="enemy-avatar">${enemy.emoji}</div>
                <h3>${enemy.name}</h3>
                <div>HP: ${enemy.hp}</div>
                <div>Ataque: ${enemy.attack}</div>
                <div>Defesa: ${enemy.defense}</div>
            </div>
        </div>
        <p>Um ${enemy.name} selvagem apareceu! Prepare-se para a batalha!</p>
    `;

    // Botões de combate
    let combatButtons = `
        <button class="btn btn-danger" onclick="attack()">⚔️ Atacar</button>
        <button class="btn btn-primary" onclick="useItem('potion')">🧪 Usar Poção</button>
        <button class="btn btn-success" onclick="defend()">🛡️ Defender</button>
        <button class="btn btn-primary" onclick="flee()">🏃‍♂️ Fugir</button>
    `;
    
    // Adicionar magias da classe
    const classKey = Object.keys(classes).find(key => classes[key].name === gameState.player.class);
    if (classKey && classes[classKey].spells.length > 0) {
        combatButtons += '<div class="spell-buttons" style="grid-column: 1 / -1;">';
        
        classes[classKey].spells.forEach(spellKey => {
            const spell = spells[spellKey];
            let buttonClass = 'spell-btn';
            let disabled = gameState.player.mp < spell.cost ? 'disabled' : '';
            
            // Classe CSS baseada no tipo de magia
            if (['fireball'].includes(spellKey)) buttonClass += ' spell-fire';
            else if (['iceShard'].includes(spellKey)) buttonClass += ' spell-ice';
            else if (['lightning'].includes(spellKey)) buttonClass += ' spell-lightning';
            else if (['summonGhost', 'curse', 'revive', 'lifeDrain'].includes(spellKey)) buttonClass += ' spell-necromancy';
            else if (['hurricane', 'natureHealing', 'bearForm', 'natureMagic'].includes(spellKey)) buttonClass += ' spell-nature';
            
            // Verificar cooldowns especiais
            if (spellKey === 'revive' && gameState.statusEffects.reviveCooldown > 0) {
                disabled = 'disabled';
            }
            
            combatButtons += `<button class="${buttonClass}" onclick="castSpell('${spellKey}')" ${disabled}>${spell.emoji} ${spell.name} (${spell.cost} MP)</button>`;
        });
        
        combatButtons += '</div>';
    }

    document.getElementById('actionButtons').innerHTML = combatButtons;
    addMessage(`Combate iniciado contra ${enemy.name}!`, 'combat');
}

// Atacar
function attack() {
    let playerAttack = gameState.player.attack;
    
    // Bônus da forma de urso
    if (gameState.statusEffects.bearForm > 0) {
        playerAttack += 15;
    }
    
    const enemy = gameState.currentEnemy;
    const damage = Math.max(1, playerAttack - enemy.defense + Math.floor(Math.random() * 10) - 5);
    
    enemy.hp -= damage;
    addMessage(`Você causou ${damage} de dano ao ${enemy.name}!`, 'combat');

    // Ataque do fantasma
    if (gameState.summons.ghost && gameState.summons.ghost.hp > 0) {
        const ghostDamage = Math.max(1, 12 - enemy.defense + Math.floor(Math.random() * 6) - 3);
        enemy.hp -= ghostDamage;
        addMessage(`Seu fantasma causou ${ghostDamage} de dano!`, 'combat');
    }

    if (enemy.hp <= 0) {
        victory();
        return;
    }

    enemyAttack();
}

// Ataque do inimigo
function enemyAttack() {
    const enemy = gameState.currentEnemy;
    
    // Escolher alvo (jogador ou fantasma)
    let target = 'player';
    if (gameState.summons.ghost && gameState.summons.ghost.hp > 0 && Math.random() < 0.4) {
        target = 'ghost';
    }
    
    const damage = Math.max(1, enemy.attack - gameState.player.defense + Math.floor(Math.random() * 8) - 4);
    
    if (target === 'ghost') {
        gameState.summons.ghost.hp -= damage;
        addMessage(`${enemy.name} causou ${damage} de dano ao seu fantasma!`'combat');
