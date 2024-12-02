require('dotenv').config();
const tmi = require('tmi.js');
const questions = require('./questions');
const config = require('./config');
const TriviaManager = require('./trivia-manager');

async function main() {
  try {
    // Create Twitch client
    const client = new tmi.Client(config.twitch);
    
    // Create trivia manager
    const triviaManager = new TriviaManager(client, questions);

    // Set up message handler
    client.on('message', async (channel, tags, message, self) => {
      if (self) return;
      await triviaManager.handleAnswer(channel, tags.username, message);
    });

    // Connect to Twitch
    console.log('Connecting to Twitch...');
    await client.connect();
    console.log('Connected successfully!');

    // Start the trivia
    triviaManager.start();

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down...');
      triviaManager.stop();
      await client.disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error('Error starting the bot:', error);
    process.exit(1);
  }
}

// Start the application
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});