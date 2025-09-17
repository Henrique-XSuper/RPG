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
        addMessage(`${enemy.name} causou ${damage} de dano ao seu fantasma!`, 'combat');
        
        if (gameState.summons.ghost.hp <= 0) {
            addMessage('Seu fantasma foi destruído!', 'combat');
            gameState.summons.ghost = null;
        }
    } else {
        gameState.player.hp -= damage;
        addMessage(`${enemy.name} causou ${damage} de dano em você!`, 'combat');
        
        if (gameState.player.hp <= 0) {
            // Reviver automático do necromante
            if (gameState.player.class === 'Necromante' && gameState.statusEffects.reviveReady) {
                gameState.player.hp = 5;
                gameState.statusEffects.reviveReady = false;
                gameState.statusEffects.reviveCooldown = 2;
                addMessage('Você foi revivido magicamente com 5 HP!', 'success');
            } else {
                defeat();
                return;
            }
        }
    }
    
    updateTurnEffects();
    updateUI();
    updateCombatDisplay();
}

// Atualizar efeitos por turno
function updateTurnEffects() {
    if (gameState.statusEffects.bearForm > 0) {
        gameState.statusEffects.bearForm--;
        if (gameState.statusEffects.bearForm === 0) {
            addMessage('Você voltou à forma normal.', 'info');
        }
    }
    
    if (gameState.statusEffects.reviveCooldown > 0) {
        gameState.statusEffects.reviveCooldown--;
        if (gameState.statusEffects.reviveCooldown === 0) {
            gameState.statusEffects.reviveReady = true;
            addMessage('Reviver está novamente disponível!', 'info');
        }
    }
}

// Atualizar display de combate
function updateCombatDisplay() {
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
        <p>A batalha continua! Escolha sua próxima ação.</p>
    `;
}

// Lançar magia
function castSpell(spellType) {
    const spell = spells[spellType];
    
    if (gameState.player.mp < spell.cost) {
        addMessage('Você não tem mana suficiente!', 'info');
        return;
    }
    
    if (spellType === 'revive' && gameState.statusEffects.reviveCooldown > 0) {
        addMessage(`Reviver em cooldown! Aguarde ${gameState.statusEffects.reviveCooldown} turnos.`, 'info');
        return;
    }

    gameState.player.mp -= spell.cost;
    const enemy = gameState.currentEnemy;
    
    switch (spell.type) {
        case 'damage':
            const damage = Math.floor(Math.random() * (spell.damage[1] - spell.damage[0] + 1)) + spell.damage[0];
            const finalDamage = Math.max(1, damage - enemy.defense);
            enemy.hp -= finalDamage;
            addMessage(`${spell.name} causou ${finalDamage} de dano!`, 'combat');
            break;
            
        case 'summon':
            gameState.summons.ghost = { hp: 25, attack: 12 };
            addMessage('Você invocou um fantasma!', 'success');
            break;
            
        case 'curse':
            const curseDamage = Math.floor(Math.random() * (spell.damage[1] - spell.damage[0] + 1)) + spell.damage[0];
            const finalCurseDamage = Math.max(1, curseDamage - enemy.defense);
            enemy.hp -= finalCurseDamage;
            enemy.attack = Math.max(1, enemy.attack - 3);
            addMessage(`Maldição causou ${finalCurseDamage} de dano e enfraqueceu o inimigo!`, 'combat');
            break;
            
        case 'lifedrain':
            const drainDamage = Math.floor(Math.random() * (spell.damage[1] - spell.damage[0] + 1)) + spell.damage[0];
            const finalDrainDamage = Math.max(1, drainDamage - enemy.defense);
            enemy.hp -= finalDrainDamage;
            const healAmount = Math.floor(finalDrainDamage * 0.6);
            gameState.player.hp = Math.min(gameState.player.maxHP, gameState.player.hp + healAmount);
            addMessage(`Sugou ${finalDrainDamage} de vida e recuperou ${healAmount} HP!`, 'combat');
            break;
            
        case 'revive':
            gameState.statusEffects.reviveReady = true;
            addMessage('Preparou-se para reviver em caso de morte!', 'success');
            break;
            
        case 'heal':
            const healingAmount = Math.floor(Math.random() * (spell.heal[1] - spell.heal[0] + 1)) + spell.heal[0];
            gameState.player.hp = Math.min(gameState.player.maxHP, gameState.player.hp + healingAmount);
            addMessage(`Cura da natureza restaurou ${healingAmount} HP!`, 'success');
            break;
            
        case 'transform':
            gameState.statusEffects.bearForm = 3;
            addMessage('Transformou-se em urso! +15 ataque por 3 turnos!', 'success');
            break;
    }

    if (enemy.hp <= 0) {
        victory();
        return;
    }

    enemyAttack();
}

// Usar item
function useItem(itemType) {
    if (!gameState.inventory[itemType] || gameState.inventory[itemType] <= 0) {
        addMessage(`Você não tem ${shopItems[itemType]?.name || itemType}!`, 'info');
        return;
    }

    if (itemType === 'potion') {
        const healAmount = 40;
        gameState.player.hp = Math.min(gameState.player.maxHP, gameState.player.hp + healAmount);
        gameState.inventory[itemType]--;
        addMessage(`Poção restaurou ${healAmount} HP!`, 'success');
    } else if (itemType === 'manaPotion') {
        const manaAmount = 30;
        gameState.player.mp = Math.min(gameState.player.maxMP, gameState.player.mp + manaAmount);
        gameState.inventory[itemType]--;
        addMessage(`Poção de mana restaurou ${manaAmount} MP!`, 'success');
    }
    
    updateUI();
    updateInventoryDisplay();
    
    if (gameState.inCombat) {
        enemyAttack();
    }
}

// Defender
function defend() {
    addMessage('Você se defendeu!', 'info');
    
    const enemy = gameState.currentEnemy;
    const damage = Math.max(1, Math.floor((enemy.attack - gameState.player.defense) / 2));
    
    gameState.player.hp -= damage;
    addMessage(`Defesa reduziu o dano para ${damage}!`, 'combat');

    if (gameState.player.hp <= 0) {
        if (gameState.player.class === 'Necromante' && gameState.statusEffects.reviveReady) {
            gameState.player.hp = 5;
            gameState.statusEffects.reviveReady = false;
            gameState.statusEffects.reviveCooldown = 2;
            addMessage('Revivido magicamente com 5 HP!', 'success');
        } else {
            defeat();
            return;
        }
    }

    updateTurnEffects();
    updateUI();
    updateCombatDisplay();
}

// Fugir
function flee() {
    if (Math.random() > 0.3) {
        addMessage('Você fugiu com sucesso!', 'success');
        endCombat();
    } else {
        addMessage('Não conseguiu fugir!', 'combat');
        enemyAttack();
    }
}

// Vitória
function victory() {
    const enemy = gameState.currentEnemy;
    gameState.player.xp += enemy.xp;
    gameState.player.gold += enemy.gold;

    addMessage(`Derrotou ${enemy.name}! +${enemy.xp} XP, +${enemy.gold} ouro`, 'success');

    checkLevelUp();
    endCombat();
}

// Derrota
function defeat() {
    gameState.player.hp = 1;
    gameState.player.gold = Math.max(0, gameState.player.gold - 20);
    
    gameState.statusEffects.bearForm = 0;
    gameState.summons.ghost = null;
    
    addMessage('Você foi derrotado! -20 ouro', 'combat');
    gameState.location = 'town';
    endCombat();
}

// Verificar level up
function checkLevelUp() {
    if (gameState.player.xp >= gameState.player.xpToNext) {
        gameState.player.level++;
        gameState.player.xp -= gameState.player.xpToNext;
        gameState.player.xpToNext = gameState.player.level * 100;
        
        gameState.player.maxHP += 20;
        gameState.player.hp = gameState.player.maxHP;
        gameState.player.maxMP += 10;
        gameState.player.mp = gameState.player.maxMP;
        gameState.player.attack += 3;
        gameState.player.defense += 2;

        addMessage(`Level Up! Agora nível ${gameState.player.level}!`, 'success');
    }
}

// Terminar combate
function endCombat() {
    gameState.inCombat = false;
    gameState.currentEnemy = null;

    document.getElementById('gameContent').innerHTML = `
        <p>O combate terminou. Continue sua aventura!</p>
    `;

    document.getElementById('actionButtons').innerHTML = `
        <button class="btn btn-primary" onclick="explore()">🗺️ Explorar</button>
        <button class="btn btn-danger" onclick="findEnemy()">⚔️ Procurar Inimigo</button>
        <button class="btn btn-success" onclick="rest()">🏠 Descansar</button>
        <button class="btn btn-primary" onclick="shop()">🛒 Loja</button>
    `;

    updateUI();
}

// Descansar
function rest() {
    const hpRestored = Math.min(gameState.player.maxHP - gameState.player.hp, 50);
    const mpRestored = Math.min(gameState.player.maxMP - gameState.player.mp, 30);
    
    gameState.player.hp += hpRestored;
    gameState.player.mp += mpRestored;

    document.getElementById('gameContent').innerHTML = `
        <p>Você descansou em um local seguro.</p>
        <p>HP restaurado: ${hpRestored}</p>
        <p>MP restaurado: ${mpRestored}</p>
        <p>Você se sente revigorado!</p>
    `;

    addMessage(`Descansou: +${hpRestored} HP, +${mpRestored} MP`, 'success');
    updateUI();
}

// Loja
function shop() {
    let shopHTML = `
        <h3>🛒 Loja do Aventureiro</h3>
        <p>Compre itens úteis para sua jornada!</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
    `;
    
    Object.keys(shopItems).forEach(itemKey => {
        const item = shopItems[itemKey];
        shopHTML += `
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <div style="font-size: 2rem; text-align: center;">${item.emoji}</div>
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <p><strong>Preço: ${item.price} ouro</strong></p>
                <button class="btn btn-success" onclick="buyItem('${itemKey}')" style="width: 100%; margin-top: 10px;">Comprar</button>
            </div>
        `;
    });
    
    shopHTML += '</div>';
    document.getElementById('gameContent').innerHTML = shopHTML;
}

// Comprar item
function buyItem(itemType) {
    const item = shopItems[itemType];
    
    if (gameState.player.gold < item.price) {
        addMessage('Ouro insuficiente!', 'info');
        return;
    }

    gameState.player.gold -= item.price;

    if (gameState.inventory[itemType]) {
        gameState.inventory[itemType]++;
    } else {
        gameState.inventory[itemType] = 1;
    }

    // Aplicar efeitos de equipamentos
    if (item.effect) {
        if (item.effect === 'attack') {
            gameState.player.attack += item.value;
            gameState.inventory[itemType] = 0;
            addMessage(`${item.name} equipado! +${item.value} Ataque`, 'success');
        } else if (item.effect === 'defense') {
            gameState.player.defense += item.value;
            gameState.inventory[itemType] = 0;
            addMessage(`${item.name} equipado! +${item.value} Defesa`, 'success');
        } else if (item.effect === 'maxHP') {
            gameState.player.maxHP += item.value;
            gameState.player.hp += item.value;
            gameState.inventory[itemType] = 0;
            addMessage(`${item.name} equipado! +${item.value} HP máximo`, 'success');
        }
    } else {
        addMessage(`Comprou ${item.name} por ${item.price} ouro!`, 'success');
    }
    
    updateUI();
    updateInventoryDisplay();
}

// Inicialização do jogo
updateUI();
updateInventoryDisplay();
