const config = {
  twitch: {
    options: { debug: true },
    identity: {
      username: process.env.TWITCH_USERNAME,
      password: process.env.TWITCH_OAUTH_TOKEN
    },
    channels: [process.env.CHANNEL_NAME]
  },
  timing: {
    questionInterval: 120000, // 2 minutes
    answerTimeout: 30000     // 30 seconds
  }
};

module.exports = config;