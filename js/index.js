import MainScene from "./MainScene.js";

const config = {
  width: 512,
  height: 256,
  backgroundColor: "#999999",
  type: Phaser.AUTO,
  parent: "game-screen",
  scene: [MainScene],
  scale: {
    zoom: 2,
  },
  physics: {
    default: "matter",
    matter: {
        // debug: true,
      gravity: { y: 5},
    },
  },
};
new Phaser.Game(config);
