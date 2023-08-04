import Phaser from "../lib/phaser.js";
import FallingObject from "../ui/FallingObject.js";
import Laser from "../ui/Laser.js";

export default class CoronaBusterScene extends Phaser.Scene {
  constructor() {
    super("corona-buster");
  }

  init() {
    this.clouds = undefined;
    this.nav_left = false;
    this.nav_right = false;
    this.shoot = false;
    this.player = undefined;
    this.speed = 100;
    this.cursors = undefined;
    this.enemies = undefined;
    this.enemySpeed = 50;
    this.lasers = undefined;
    this.lastFired = 10;
    this.scoreLabel = undefined;
    this.score = 0;
    this.lifeLabel = undefined;
    this.life = 3;
    this.handsanitizer = undefined;
    this.backsound = undefined;
  }
  preload() {
    this.load.image("bg", "assets/bg_layer1.png");
    this.load.image("cloud", "assets/cloud.png");
    this.load.image("left-btn", "assets/left-btn.png");
    this.load.image("right-btn", "assets/right-btn.png");
    this.load.image("shoot-btn", "assets/shoot-btn.png");
    this.load.spritesheet("player", "assets/ship.png", {
      frameWidth: 66,
      frameHeight: 66,
    });
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("handsanitizer", "assets/handsanitizer.png");
    this.load.spritesheet("laser", "assets/laser-bolts.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.audio("bgsound", "assets/sfx/Backsound/AloneAgainst Enemy.ogg");
    this.load.audio("laser", "assets/sfx/sfx_laser.ogg");
    this.load.audio("destroy", "assets/sfx/destroy.mp3");
    this.load.audio("life", "assets/sfx/handsanitizer.mp3");
    this.load.audio("gameover", "assets/sfx/gameover.wav");
  }
  create() {
    const gameWidth = this.scale.width * 0.5;
    const gameHeight = this.scale.height * 0.5;
    this.add.image(gameWidth, gameHeight, "bg");
    this.clouds = this.physics.add.group({
      key: "cloud",
      repeat: 10,
    });
    Phaser.Actions.RandomRectangle(
      this.clouds.getChildren(),
      this.physics.world.bounds
    );
    this.createButton();
    this.player = this.createPlayer();
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enemies = this.physics.add.group({
      classType: FallingObject,
      maxSize: 10,
      runChildUpdate: true,
    });
    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 5000),
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });
    this.lasers = this.physics.add.group({
      classType: Laser,
      maxSize: 10,
      runChildUpdate: true,
    });
    this.physics.add.overlap(
      this.lasers,
      this.enemies,
      this.hitEnemy,
      null,
      this
    );
    this.scoreLabel = this.add
      .text(10, 10, "Score", {
        fontSize: "16px",
        fill: "red",
        backgroundColor: "white",
      })
      .setDepth(1);
    this.lifeLabel = this.add
      .text(10, 30, "Life", {
        fontSize: "16px",
        fill: "red",
        backgroundColor: "white",
      })
      .setDepth(1);
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.decreaseLife,
      null,
      this
    );
    this.handsanitizer = this.physics.add.group({
      classType: FallingObject,
      runChildUpdate: true,
    });
    this.time.addEvent({
      delay: 10000,
      callback: this.spawnHandsanitizer,
      callbackScope: this,
      loop: true,
    });
    this.physics.add.overlap(
      this.player,
      this.handsanitizer,
      this.increaseLife,
      null,
      this
    );
    this.backsound = this.sound.add("bgsound");
    var soundConfig = {
      loop: true,
      volume: 0.1,
    };
    this.backsound.play(soundConfig);
  }

  spawnEnemy() {
    const config = {
      speed: 60,
      rotation: 0.1,
    };
    const enemy = this.enemies.get(0, 0, "enemy", config);
    const positionX = Phaser.Math.Between(50, 350);
    if (enemy) {
      enemy.spawn(positionX);
    }
  }

  spawnHandsanitizer() {
    const config = {
      speed: 60,
      rotation: 0,
    };
    // @ts-ignore
    const handsanitizer = this.handsanitizer.get(0, 0, "handsanitizer", config);
    const positionX = Phaser.Math.Between(70, 330);
    if (handsanitizer) {
      handsanitizer.spawn(positionX);
    }
  }

  createButton() {
    this.input.addPointer(3);
    let shoot = this.add
      .image(320, 550, "shoot-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);
    let nav_left = this.add
      .image(50, 550, "left-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);
    let nav_right = this.add
      .image(nav_left.x + nav_left.displayWidth + 20, 550, "right-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);

    nav_left.on(
      "pointerdown",
      () => {
        this.nav_left = true;
      },
      this
    );
    nav_left.on(
      "pointerout",
      () => {
        this.nav_left = false;
      },
      this
    );
    nav_right.on(
      "pointerdown",
      () => {
        this.nav_right = true;
      },
      this
    );
    nav_right.on(
      "pointerout",
      () => {
        this.nav_right = false;
      },
      this
    );
    shoot.on(
      "pointerdown",
      () => {
        this.shoot = true;
      },
      this
    );
    shoot.on(
      "pointerout",
      () => {
        this.shoot = false;
      },
      this
    );
  }

  update(time) {
    this.clouds.children.iterate((child) => {
      child.setVelocityY(20);
      if (child.y > this.scale.height) {
        // @ts-ignore
        child.x = Phaser.Math.Between(10, 400);
        // @ts-ignore
        child.y = 0;
      }
    });
    this.movePlayer(this.player, time);
    this.scoreLabel.setText("Score : " + this.score);
    this.lifeLabel.setText("Life : " + this.life);
  }

  createPlayer() {
    const player = this.physics.add.sprite(200, 450, "player");
    player.setCollideWorldBounds(true);
    this.anims.create({
      key: "turn",
      frames: [
        {
          key: "player",
          frame: 0,
        },
      ],
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 2,
      }),
      frameRate: 10,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 2,
      }),
      frameRate: 10,
    });

    return player;
  }

  decreaseLife(player, enemy) {
    enemy.die();
    this.life--;
    if (this.life == 2) {
      player.setTint(0xff0000);
    } else if (this.life == 1) {
      player.setTint(0xff0000).setAlpha(0.2);
    } else if (this.life == 0) {
      this.sound.stopAll();
      this.sound.play("gameover");
      this.scene.start("over-scene", { score: this.score });
    }
  }

  increaseLife(player, handsanitizer) {
    handsanitizer.die();
    this.life++;
    if (this.life >= 3) {
      player.clearTint().setAlpha(2);
    }
  }

  hitEnemy(laser, enemy) {
    laser.die();
    enemy.die();
    this.score += 10;
    this.sound.play("destroy");
  }

  movePlayer(player, time) {
    if (this.cursors.left.isDown || this.nav_left) {
      this.player.setVelocityX(this.speed * -1);
      this.player.anims.play("left", true);
      this.player.setFlipX(false);
    } else if (this.cursors.right.isDown || this.nav_right) {
      this.player.setVelocityX(this.speed);
      this.player.anims.play("right", true);
      this.player.setFlipX(true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }
    if ((this.shoot && time > this.lastFired) || this.cursors.space.isDown) {
      const laser = this.lasers.get(0, 0, "laser");
      if (laser) {
        laser.fire(this.player.x, this.player.y);
        this.lastFired = time + 150;
        this.sound.play("laser");
      }
    }
  }
}
