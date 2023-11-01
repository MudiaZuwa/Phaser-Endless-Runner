export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(data) {
    let { scene, x, y, texture, frame } = data;
    super(scene.matter.world, x, y, texture, frame);
    this.scene.add.existing(this);  
    console.log(this.body.collisionFilter.category)

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    var playerCollider = Bodies.rectangle(this.x, this.y, 12,12, {
      isSensor: false,
      label: "playerCollider",
    });
    const compoundBody = Body.create({
      parts: [playerCollider],
      frictionAir: 0.35,
    });
    this.setExistingBody(compoundBody);
    this.setFixedRotation();
  }

  static preload(scene) {
    scene.load.atlas("player", "Assets/player.png", "Assets/player_atlas.json");
    scene.load.animation("player_anim", "Assets/player_anim.json");
  }

  get velocity() {
    return this.body.velocity;
  }

  update() {
    const speed = 2.5;
    let playerVelocity = new Phaser.Math.Vector2();
    var onGround = this.velocity.y === 0
    var jumpForce=  50
    if (onGround && this.inputKeys.jump.isDown) {
      this.setVelocityY(-jumpForce);
    }
    playerVelocity.normalize();
    playerVelocity.scale(speed);
    
    if (this.velocity.y < -0.1) {
      this.anims.play("jump", true);
    } else if (this.velocity.y > 0.1) {
      this.anims.play("fall", true);
    } else {
      this.anims.play("run", true);
    }
  }
}
