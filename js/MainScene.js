import Player from "./Player.js";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }
  preload() {
    Player.preload(this);
    this.load.image("tiles", "Assets/grassland_tileset/grassland_tileset/spritesheet/spritesheet.png");
    this.load.tilemapTiledJSON("map", "Assets/map.json" );
    this.load.image('obstacle', 'Assets/Stones Pack X10/Stones Pack X10/Rocks with plants/stone_5.png');
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage(
      "spritesheet",
      "tiles",
      16,
      16,
      0,
      0
    );
    const layer2 = map.createStaticLayer("Tile Layer 2", tileset, 0, 0);
    const layer1 = map.createStaticLayer("Tile Layer 1", tileset, 0, 0);
    const layer3 = map.createStaticLayer("Tile Layer 3", tileset, 0, 0);
    layer1.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer1);
    this.player = new Player({
      scene: this,
      x: 100,
      y: 100,
      texture: "player",
      frame: "tile000",
    });

    this.player.inputKeys = this.input.keyboard.addKeys({
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
    this.player.setCollisionCategory(8);

    this.obstacles = this.add.group();
        this.obstacleTimer = this.time.addEvent({
            delay: 1000,
            callback: this.spawnObstacle, 
            callbackScope: this,
            loop: true 
        });

 this.matter.world.on('collisionstart', function (event) {
            var pairs = event.pairs;
            for (var i = 0; i < pairs.length; i++) {
                var bodyA = pairs[i].bodyA;
                var bodyB = pairs[i].bodyB;
                if ((bodyA.label === "playerCollider") ||
                (bodyB.label === "obstacleCollider") ) {
                    this.gameOver();
                }
            }
        }, this);
  }

  spawnObstacle() {
    var x = Phaser.Math.Between(520, 550);
    // var y =  170.05000138889028
    var y = 180
    var obstacle = this.matter.add.sprite(x, y, 'obstacle', null, { label: 'obstacle', });
    // obstacle.body.width  = 16
    obstacle.setBody('circle',{radius:10, isStatic: false, offset:{x:0,y:0}, angle:0, label:"obstacleCollider"})
    obstacle.setFixedRotation();
    obstacle.body.ignoreGravity = true
    obstacle.setCollisionGroup(this.obstacles);
    obstacle.setCollidesWith(this.player.body.collisionFilter.category);
    obstacle.setVelocityX(-10);
}

gameOver() {
    this.obstacleTimer.destroy();
    this.matter.world.pause();
}

  update() {
    this.player.update()
    this.obstacles.children.iterate(obstacle=>{
      if(obstacle.x<0) obstacle.destroy()
    }, this);
  }
}
