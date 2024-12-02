class TriviaManager {
  constructor(client, questions) {
    this.client = client;
    this.questions = questions;
    this.currentQuestion = null;
    this.questionTimeout = null;
    this.answerTimeout = null;
    this.isWaitingForAnswer = false;
  }

  getRandomQuestion() {
    return this.questions[Math.floor(Math.random() * this.questions.length)];
  }

  async askQuestion() {
    if (this.isWaitingForAnswer) return;
    
    this.currentQuestion = this.getRandomQuestion();
    await this.client.say(process.env.CHANNEL_NAME, 
      `📢 Question BG3: ${this.currentQuestion.question} (Difficulté: ${this.currentQuestion.difficulty})`
    );
    this.isWaitingForAnswer = true;

    this.answerTimeout = setTimeout(async () => {
      if (this.isWaitingForAnswer) {
        await this.client.say(process.env.CHANNEL_NAME, 
          `⏰ Temps écoulé! La réponse était: ${this.currentQuestion.answer}`
        );
        this.isWaitingForAnswer = false;
      }
    }, 30000);
  }

  async handleAnswer(channel, username, message) {
    if (this.isWaitingForAnswer && this.currentQuestion) {
      if (message.toLowerCase() === this.currentQuestion.answer.toLowerCase()) {
        clearTimeout(this.answerTimeout);
        await this.client.say(channel, 
          `🎉 Félicitations @${username}! La réponse "${this.currentQuestion.answer}" est correcte!`
        );
        this.isWaitingForAnswer = false;
      }
    }
  }

  start() {
    this.askQuestion();
    this.questionTimeout = setInterval(() => this.askQuestion(), 120000);
  }

  stop() {
    clearInterval(this.questionTimeout);
    clearTimeout(this.answerTimeout);
    this.isWaitingForAnswer = false;
  }
}

module.exports = TriviaManager;