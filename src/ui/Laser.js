import Phaser from "../lib/phaser.js";
export default class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.setScale(2);
  }
  fire(x, y) {
    this.setPosition(x, y - 50);
    this.setActive(true);
    this.setVisible(true);
  }
  die() {
    this.destroy();
  }
  update(time) {
    this.setVelocityY(-200);
    if (this.y < -10) {
      this.die();
    }
  }
}
