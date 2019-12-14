class FirstScene extends Phaser.Scene {
    player;
    cursors;
    platforms;
    stars;
    bombs;
    scoreText;
    score = 0;
    gameOver = false;
    baddie;
    constructor(config) {
        super(config);
    }
    preload() {
        this.load.image('background', 'assets/Background.png');
        this.load.image('ground-1600', 'assets/platform-1600.png');
        this.load.image('ground-100S', 'assets/platform-100S.png');
        this.load.image('wall', 'assets/wall.png');
        this.load.image('coin', 'assets/coin.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('baddie', 'assets/baddie2.png');
        this.load.spritesheet('dude', 'assets/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        });
    }
    create() {

        //INITIAL!!
        this.cameras.main.setBounds(0, 0, 1600, 600);
        this.physics.world.setBounds(0, 0, 1600, 600);
        this.add.image(800, 300, 'background');
        this.player = this.physics.add.sprite(50, 200, 'dude');
        this.player.jumpCount = 0;
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        this.player.setSize(30, 40).setOffset(1, 8);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.platforms = this.physics.add.staticGroup();
        this.physics.add.collider(this.player, this.platforms);

        //BLOCKS!!
        this.platforms.create(800, 586, 'ground-1600');
        this.platforms.create(40, 285, 'ground-100S');
        this.platforms.create(130, 285, 'ground-100S');
        this.platforms.create(203, 285, 'ground-100S');
        this.platforms.create(203, 410, 'ground-100S');
        this.platforms.create(193, 410, 'ground-100S');
        this.platforms.create(60, 410, 'ground-100S');
        this.platforms.create(330, 350, 'ground-100S');
        this.platforms.create(490, 440, 'ground-100S');
        this.platforms.create(630, 480, 'ground-100S');
        this.platforms.create(720, 480, 'ground-100S');
        this.platforms.create(810, 480, 'ground-100S');
        this.platforms.create(900, 480, 'ground-100S');
        this.platforms.create(920, 480, 'ground-100S');
        this.platforms.create(1635, 380, 'ground-100S');
        this.platforms.create(1045, 443, 'ground-100S');
        this.platforms.create(1545, 380, 'ground-100S');
        this.platforms.create(1455, 380, 'ground-100S');
        this.platforms.create(1365, 380, 'ground-100S');
        this.platforms.create(1275, 380, 'ground-100S');
        this.platforms.create(1220, 413, 'wall');
        this.platforms.create(1220, 423, 'wall');
        this.platforms.create(956, 520, 'wall');
        this.platforms.create(235, 340, 'wall');
        this.platforms.create(235, 360, 'wall');

        //OTHER!!
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.overlap(this.player, this.bombs, this.endGame, null, this);
        this.stars = this.physics.add.group(
            {
                key: 'coin',
                repeat: 31,
                setXY: {
                    x: 25,
                    y: 0,
                    stepX: 50
                }
            }
        );
        this.stars.children.iterate(
            function (child) {
                child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            }
        );
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        }).setScrollFactor(0);
        this.makeBomb();

        //BADDIE!!
        let origin = { x: 900, y: 550 };
        let dest = { x: 16, y: 550 }
        let line = new Phaser.Curves.Line(origin, dest);
        this.baddie = this.add.follower(line, origin.x, origin.y, 'baddie');
        this.physics.add.existing(this.baddie);
        this.baddie.body.allowGravity = false;
        this.physics.add.overlap(this.player, this.baddie, this.endGame, null, this);
        this.baddie.startFollow({
            duration: 6000,
            repeat: -1,
            yoyo: true,
            ease: 'sine.easeInOut'
        })
        origin = { x: 1250, y: 350 };
        dest = { x: 1600, y: 350 }
        line = new Phaser.Curves.Line(origin, dest);
        this.baddie = this.add.follower(line, origin.x, origin.y, 'baddie');
        this.physics.add.existing(this.baddie);
        this.baddie.body.allowGravity = false;
        this.physics.add.overlap(this.player, this.baddie, this.endGame, null, this);
        this.baddie.startFollow({
            duration: 4000,
            repeat: -1,
            yoyo: true,
            ease: 'sine.easeInOut'
        })
        origin = { x: 620, y: 450 };
        dest = { x:900, y: 450 }
        line = new Phaser.Curves.Line(origin, dest);
        this.baddie = this.add.follower(line, origin.x, origin.y, 'baddie');
        this.physics.add.existing(this.baddie);
        this.baddie.body.allowGravity = false;
        this.physics.add.overlap(this.player, this.baddie, this.endGame, null, this);
        this.baddie.startFollow({
            duration: 4000,
            repeat: -1,
            yoyo: true,
            ease: 'sine.easeInOut'
        })
        
        //anims
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 0,
                end: 3
            }),

            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{
                key: 'dude',
                frame: 4
            }]

        })
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 5,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });
    }
    update() {
        if (!this.gameOver) {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-160);
                this.player.anims.play('left', true);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(160);
                this.player.anims.play('right', true);
            } else {
                this.player.setVelocityX(0);
                this.player.anims.play('turn');
            }
            if (Phaser.Input.Keyboard.JustDown(this.cursors.space) && this.player.jumpCount < 1) {
                this.player.jumpCount++;
                this.player.setVelocityY(-250);
            }
            if (this.player.body.touching.down) {
                this.player.jumpCount = 0;
            }
        }
    }
    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('score: ' + this.score);
        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(
                function (child) {
                    child.enableBody(true, child.x, 0, true, true);
                }
            )
            this.makeBomb();
        }
    }
    makeBomb() {
        let x = (this.player.x < 600) ? Phaser.Math.Between(600, 1200) : Phaser.Math.Between(0, 600);
        let bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-400, 400), 20);
        bomb.allowGravity = false;

    }
    endGame() {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');
        this.gameOver = true;
        this.baddie.stopFollow();
    }
} 