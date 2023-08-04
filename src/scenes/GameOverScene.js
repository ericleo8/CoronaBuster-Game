import Phaser from "../lib/phaser.js";
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("over-scene");
  }
  init(data) {
    this.replayButton = undefined;
    this.score = data.score;
  }
  preload() {
    this.load.image("background", "assets/bg_layer1.png");
    this.load.image("gameover", "assets/gameover.png");
    this.load.image("replay-button", "assets/replay.png");
  }
  create() {
    this.add.image(200, 320, "background");
    this.add.image(200, 200, "gameover");
    this.add.text(100, 300, "Score: " + this.score, {
      fontSize: "32px",
      fill: "black",
    });
    this.replayButton = this.add
      .image(200, 400, "replay-button")
      .setInteractive()
      .setScale(0.5);
    this.replayButton.once(
      "pointerup",
      () => {
        this.scene.start("corona-buster");
      },
      this
    );
  }
}
