import Phaser from "./lib/phaser.js";
import CoronaBusterScene from "./scenes/CoronaBusterScene.js";
import GameOverScene from "./scenes/GameOverScene.js";
export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 400,
  height: 620,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [CoronaBusterScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
});
