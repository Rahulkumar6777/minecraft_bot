const mineflayer = require('mineflayer');

let bot;

// Function to create and connect the bot
function createBot() {
  bot = mineflayer.createBot({
    host: 'shop-introducing.joinmc.link', // Replace with your server IP or address
    port: 25565, // Default Minecraft port
    username: 'BotName', // Bot's username
    version: '1.21.1' // Set to match your server version
  });

  // Basic event handlers
  bot.on('spawn', () => {
    console.log('Bot has spawned and is ready!');
    bot.chat('/afk'); // Enter AFK mode upon connecting
    bot.chat('Hello, I am a bot!');

    // Make the bot jump every 20 seconds
    setInterval(() => {
      bot.setControlState('jump', true); // Start jumping
      setTimeout(() => {
        bot.setControlState('jump', false); // Stop jumping after a short time
      }, 500); // Adjust this time (in ms) for jump duration
    }, 20000); // Jump every 20 seconds
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    if (message === 'hello') {
      bot.chat(`Hello, ${username}!`);
    } else if (message === 'follow me') {
      const player = bot.players[username];
      if (player && player.entity) {
        bot.pathfinder.setGoal(new GoalFollow(player.entity, 1));
        bot.chat(`Following ${username}`);
      } else {
        bot.chat("I can't see you!");
      }
    }
  });

  bot.on('kicked', (reason) => {
    console.log(`Kicked: ${reason}`);
    scheduleReconnect();
  });

  bot.on('error', (err) => {
    console.log(`Error: ${err.message}`);
    scheduleReconnect();
  });
}

// Function to schedule reconnection every 30 seconds if the bot is disconnected
function scheduleReconnect() {
  console.log('Bot will attempt to reconnect in 30 seconds...');
  setTimeout(() => {
    console.log('Reconnecting bot...');
    createBot(); // Recreate and reconnect the bot
  }, 30 * 1000); // 30 seconds in milliseconds
}

// Initial bot creation
createBot();
