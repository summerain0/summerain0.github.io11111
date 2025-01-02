// 画布
const game = new Phaser.Game(360, 600, Phaser.AUTO, 'game');
// 状态
game.states = {};
// 全局音乐播放标识
let isBGMPlay = true;
// 无敌模式
let invincibleMode = false;
// 舞台放大倍数
let multipleX = 1, multipleY = 1;
// 素材库
const sourcesList = {
    background: "background",
    startButton: "startButton",
    startBGM: "startBackgroundMusic",
    playBGM: "playBackgroundMusic",
    gameOverMusic: "gameOverMusic",
    beAttackedMusic: "beAttackedMusic",
    playerExplodeMusic: "playerBeAttackedMusic",
    getAwardMusic: "getAwardMusic",
    myShot: "myShot",

    myPlane: "myPlane",
    myBullet: "myBullet",
    myExplode: "myExplode",
    enemyBullet: "enemyBullet",
    enemy1: "enemy1",
    enemy2: "enemy2",
    enemy3: "enemy3",
    enemyExplode1: "enemyExplode1",
    enemyExplode2: "enemyExplode2",
    enemyExplode3: "enemyExplode3",
    boss: "boss",
    bossExplode: "bossExplode",

    startMusicButton: "startBackgroundMusic",
    stopMusicButton: "stopBackgroundMusic",

    killAward: "killAward",
    lifeAward: "lifeAward",
    levelAward: "levelAward",

    menuButtonAudio: "menuButtonAudio",
    startButtonAudio: "startButtonAudio",
    replayButton: "replayButton",
    shareButton: "shareButton"
};
// 敌人配置
const enemyTeam = {
    enemy1: {
        game: this,// 游戏对象
        selfPic: sourcesList.enemy1, // 敌人图片
        bulletPic: sourcesList.enemyBullet, // 敌人子弹
        explodePic: sourcesList.enemyExplode1, // 敌人死亡动画
        selfPool: 10, // 敌人对象池数量
        bulletPool: 50, // 敌人子弹对象池数量
        explodePool: 10, // 敌人死亡对象池数量
        life: 1, // 敌人生命值
        velocity: 100, // 敌人移动速度
        bulletX: 7.5, // 敌人子弹X轴偏移
        bulletY: 20, // 敌人子弹Y轴偏移
        bulletVelocity: 200, // 敌人子弹速度
        selfTimeInterval: 3000, // 敌人生成频率
        bulletTimeInterval: 2000, // 敌人子弹生成频率
        investigationRadius: 200,// 侦查半径
        score: 10, // 击杀获得分数
        crashSound: this.enemyExplodeSound // 敌人死亡音效
    },
    enemy2: {
        game: this,// 游戏对象
        selfPic: sourcesList.enemy2, // 敌人图片
        bulletPic: sourcesList.enemyBullet, // 敌人子弹
        explodePic: sourcesList.enemyExplode2, // 敌人死亡动画
        selfPool: 10, // 敌人对象池数量
        bulletPool: 50, // 敌人子弹对象池数量
        explodePool: 10, // 敌人死亡对象池数量
        life: 5, // 敌人生命值
        velocity: 125, // 敌人移动速度
        bulletX: 13, // 敌人子弹X轴偏移
        bulletY: 30, // 敌人子弹Y轴偏移
        bulletVelocity: 200, // 敌人子弹速度
        selfTimeInterval: 3500, // 敌人生成频率
        bulletTimeInterval: 1500, // 敌人子弹生成频率
        investigationRadius: 260,// 侦查半径
        score: 15, // 击杀获得分数
        crashSound: this.enemyExplodeSound // 敌人死亡音效
    },
    enemy3: {
        game: this,// 游戏对象
        selfPic: sourcesList.enemy3, // 敌人图片
        bulletPic: sourcesList.enemyBullet, // 敌人子弹
        explodePic: sourcesList.enemyExplode3, // 敌人死亡动画
        selfPool: 10, // 敌人对象池数量
        bulletPool: 50, // 敌人子弹对象池数量
        explodePool: 10, // 敌人死亡对象池数量
        life: 10, // 敌人生命值
        velocity: 50, // 敌人移动速度
        bulletX: 15.5, // 敌人子弹X轴偏移
        bulletY: 50, // 敌人子弹Y轴偏移
        bulletVelocity: 200, // 敌人子弹速度
        selfTimeInterval: 5000, // 敌人生成频率 3500ms
        bulletTimeInterval: 1200, // 敌人子弹生成频率
        investigationRadius: 360,// 侦查半径
        score: 30, // 击杀获得分数
        crashSound: this.enemyExplodeSound // 敌人死亡音效
    }
};
// 奖励配置
const awardTeam = {
    level: { // 升级
        selfPic: sourcesList.levelAward,
        type: "level",
        velocity: 75
    },
    life: { // 加生命
        selfPic: sourcesList.lifeAward,
        type: "life",
        velocity: 50
    },
    kill: { // 全屏秒杀
        selfPic: sourcesList.killAward,
        type: "kill",
        velocity: 100
    }
};
// 玩家配置初始化
const playerConfig = {
    game: this,// 对象
    selfPic: sourcesList.myPlane, // 贴图
    bulletPic: sourcesList.myBullet, // 子弹
    explodePic: sourcesList.myExplode, // 死亡动画
    life: 10, // 生命值
    level: 5, // 等级
    shield: 100, // 护盾
    bulletVelocity: 200, // 子弹速度
    bulletTimeInterval: 1500, // 子弹生成频率
    bulletCount: 1 // 子弹条数
}
// 最终分数
let endScore = 0;

/**
 * 主页面
 */
game.states.preload = function () {
    this.preload = function () {
        /******************************* 图片素材部分 ***************************/
        game.load.image(sourcesList.background, "assets/image/bg.png"); // 背景图
        game.load.image(sourcesList.startMusicButton, "assets/image/startMusic.png");  // 播放音乐按钮
        game.load.image(sourcesList.stopMusicButton, "assets/image/stopMusic.png");  // 暂停播放音乐按钮
        game.load.spritesheet(sourcesList.startButton, "assets/image/startButton.png", 100, 40, 2);  // 开始按钮
        game.load.spritesheet(sourcesList.replayButton, "assets/image/replayButton.png", 80, 30, 2) // 重来按钮
        game.load.spritesheet(sourcesList.shareButton, "assets/image/shareButton.png", 80, 30, 2) // 分享按钮

        game.load.spritesheet(sourcesList.myPlane, "assets/image/myPlane.png", 32, 40, 4); // 玩家飞机
        game.load.image(sourcesList.myBullet, "assets/image/myBullet.png"); // 子弹
        game.load.spritesheet(sourcesList.myExplode, "assets/image/myExplode.png", 32, 40, 4) // 玩家飞机死亡

        game.load.image(sourcesList.enemyBullet, "assets/image/bullet.png"); // 敌人子弹
        game.load.image(sourcesList.enemy1, "assets/image/enemy1.png"); // 敌人1
        game.load.image(sourcesList.enemy2, "assets/image/enemy2.png"); // 敌人2
        game.load.image(sourcesList.enemy3, "assets/image/enemy3.png"); // 敌人3
        game.load.spritesheet(sourcesList.enemyExplode1, "assets/image/explode1.png", 20, 20, 4) // 敌人1飞机死亡
        game.load.spritesheet(sourcesList.enemyExplode2, "assets/image/explode2.png", 30, 30, 4) // 敌人2飞机死亡
        game.load.spritesheet(sourcesList.enemyExplode3, "assets/image/explode3.png", 32, 50, 6) // 敌人3飞机死亡

        game.load.spritesheet(sourcesList.boss, "assets/image/boss.png", 47, 75, 2) // Boss飞机
        game.load.spritesheet(sourcesList.bossExplode, "assets/image/boss_explode.png", 48, 75, 6) // Boss飞机死亡

        game.load.image(sourcesList.killAward, "assets/image/award_kill.png"); // 全屏秒杀
        game.load.image(sourcesList.lifeAward, "assets/image/award_life.png"); // 加生命
        game.load.image(sourcesList.levelAward, "assets/image/award_level.png"); // 加等级

        /******************************* 音效部分 ***************************/
        game.load.audio(sourcesList.startBGM, "assets/music/bgm.mp3"); // 开始背景音乐
        game.load.audio(sourcesList.playBGM, 'assets/music/playback.mp3'); // 游玩背景音乐
        game.load.audio(sourcesList.menuButtonAudio, 'assets/music/button1.mp3'); // 菜单点击按钮音效
        game.load.audio(sourcesList.startButtonAudio, 'assets/music/button.mp3'); // 开始按钮点击音效
        game.load.audio(sourcesList.gameOverMusic, 'assets/music/gameOver.mp3'); // 游戏结束音乐
        game.load.audio(sourcesList.beAttackedMusic, 'assets/music/ao.mp3'); // 被击中音效
        game.load.audio(sourcesList.playerExplodeMusic, 'assets/music/explode.mp3'); // 死亡音乐
        game.load.audio(sourcesList.getAwardMusic, 'assets/music/getAward.mp3'); // 获得奖励音乐
        game.load.audio(sourcesList.myShot, 'assets/music/myShot.ogg'); // 玩家发射子弹的声音
        game.load.audio(sourcesList.bossExplode, 'assets/music/bossExplode.wav'); // 玩家发射子弹的声音
    };

    this.create = function () {
        // 全屏
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

        // 记录倍数
        multipleX = document.body.clientWidth / game.width;
        multipleY = document.body.clientHeight / game.height;

        // 滚动背景
        const bg = game.add.tileSprite(0, 0, game.width, game.height, sourcesList.background);
        bg.autoScroll(0, 60);

        // 飞机
        this.myplane = game.add.sprite(157, 150, sourcesList.myPlane);
        this.myplane.animations.add("fly");
        this.myplane.animations.play("fly", 14, true); // 14帧可循环动画

        // 背景音乐
        this.backgroundMusicPlayer = game.add.audio(sourcesList.startBGM, 0.2, true);
        if (isBGMPlay) this.backgroundMusicPlayer.play();

        // 开始按钮 日常状态，按下时，松开时
        this.startButton = game.add.button(125, 330, sourcesList.startButton, this.StartClick, this, 1, 1, 0);

        const style = {font: "12px 宋体", fill: "#ff0000"};
        this.OPtext = game.add.text(125, 400, "点我体验无敌模式", style);
        this.OPtext.inputEnabled = true;
        this.OPtext.events.onInputDown.add(function () {
            invincibleMode = true;
            alert("已开启，请点击开始按钮")
        });

        // 暂停按钮
        this.stopMusicButton = game.add.button(335, 10, sourcesList.stopMusicButton, function () {
            if (this.backgroundMusicPlayer.isPlaying) {
                isBGMPlay = false;
                this.backgroundMusicPlayer.stop();
            }
        }, this, 0, 0, 0);

        // 播放按钮
        this.startMusicButton = game.add.button(310, 10, sourcesList.startMusicButton, function () {
            if (!this.backgroundMusicPlayer.isPlaying) {
                isBGMPlay = true;
                this.backgroundMusicPlayer.play();
            }
        }, this, 0, 0, 0);
    };

    // 开始按钮事件，跳转到讲解页面
    this.StartClick = function () {
        game.add.audio(sourcesList.menuButtonAudio, 1, false).play();
        this.backgroundMusicPlayer.stop();
        game.state.start("help");
    };
}

// 游戏讲解镜头
game.states.help = function () {
    this.create = function () {
        // 滚动背景
        const bg = game.add.tileSprite(0, 0, game.width, game.height, sourcesList.background);
        bg.autoScroll(0, 60);

        // 玩家飞机
        this.myplane = game.add.sprite(80, 135, sourcesList.myPlane);
        this.myplane.animations.add("fly");
        this.myplane.animations.play("fly", 14, true); // 14帧可循环动画

        const style = {font: "12px 宋体", fill: "#ff0000"};
        game.add.text(125, 150, "玩家飞机,初始生命为10,等级为5", style);

        // 奖励
        game.add.sprite(80, 175, sourcesList.killAward);
        game.add.text(125, 185, "获得后清除所有可见敌人", style);

        game.add.sprite(85, 210, sourcesList.lifeAward);
        game.add.text(125, 220, "获得后随机增加生命或护盾", style);

        game.add.sprite(85, 250, sourcesList.levelAward);
        game.add.text(125, 260, "获得后等级+1", style);

        game.add.text(50, 320, "★玩家与敌人碰撞或每10个敌人逃脱均会减少生命\n进入Boss关卡时判定区域为飞机中间的红点", style);

        // 开始按钮
        this.startButton = game.add.button(125, 430, sourcesList.startButton, this.StartClick, this, 1, 1, 0);
    };

    this.StartClick = function () {
        game.add.audio(sourcesList.startButtonAudio, 1, false).play();
        game.state.start("main");
    };
};

// 主游戏镜头
game.states.main = function () {
    // 数据提示文字
    let dataText;
    // 字体样式
    const mainTextStyle = {font: "12px 宋体", fill: "#ff0000"};
    // 手指按下时坐标
    let mDownX = 0, mDownY = 0;
    // 触摸状态 解决Move先于Down执行问题
    let isTouching = false;
    // 玩家实体
    let playerObj;
    let determinePoint;
    let playerX = 0;
    let playerY = 0;
    // 玩家分数
    let score = 0;
    let disScore = 100;
    // 敌人逃脱个数
    let escapedEnemyCount = 0;
    let escapedEnemyCountCache = 10;
    // 敌人对象
    let enemy1Obj;
    let enemy2Obj;
    let enemy3Obj;
    // 奖励
    let awardObj;
    // Boss状态标识
    let isBossStatus = false;
    let disBossTime = 30000;
    // 护盾回复缓存
    let shieldCache = 0;
    // Boss实体
    let bossObj;

    this.create = function () {
        const bg = game.add.tileSprite(0, 0, game.width, game.height, sourcesList.background);
        bg.autoScroll(0, 60);

        // 背景音乐
        this.playBGM = game.add.audio(sourcesList.playBGM, 0.2, true);
        if (isBGMPlay) this.playBGM.play();

        // 数据初始化
        score = 0;
        isBossStatus = false;
        shieldCache = game.time.now + 1000;
        disBossTime = game.time.now + 30000;

        // 创建玩家实体
        playerObj = new Player();
        playerObj.init();

        // 判定点
        determinePoint = game.add.graphics(0, 0);
        determinePoint.beginFill(0xFF0000, 1);
        determinePoint.drawCircle(0, 0, 5);
        game.physics.arcade.enable(determinePoint);

        // 敌人实例化
        enemy1Obj = new Enemy(enemyTeam.enemy1, this);
        enemy2Obj = new Enemy(enemyTeam.enemy2, this);
        enemy3Obj = new Enemy(enemyTeam.enemy3, this);
        enemy1Obj.init(this);
        enemy2Obj.init(this);
        enemy3Obj.init(this);

        // 奖励实例化
        awardObj = new Award(awardTeam, this);
        awardObj.init();

        // Boss实例化
        bossObj = new Boss(this);

        // 数据面板
        dataText = game.add.text(5, 5, "", mainTextStyle);

        // 监听事件
        game.input.onDown.add(function (event) {
            mDownX = event.pageX / multipleX;
            mDownY = event.pageY / multipleY;
            playerX = playerObj.myPlane.x;
            playerY = playerObj.myPlane.y;
            isTouching = true;
        });
        game.input.onUp.add(function () {
            mDownX = -1;
            mDownY = -1;
            playerX = playerObj.myPlane.x;
            playerY = playerObj.myPlane.y;
            isTouching = false;
        });
        game.input.addMoveCallback(this.mouseMoveHandler, this)
    }

    this.update = function () {
        playerObj.shoot();

        // 更新判断点位置
        determinePoint.x = playerObj.myPlane.x + 17;
        determinePoint.y = playerObj.myPlane.y + 20;

        // Boss生成检测 !isBossState保证不会多个boss同框
        if (!isBossStatus && game.time.now >= disBossTime) {
            bossObj.createBoss();
        }

        if (isBossStatus) {
            game.physics.arcade.overlap(playerObj.bulletGroup, bossObj.bossPlane, bossObj.hitBoss, null, this);
            game.physics.arcade.overlap(determinePoint, bossObj.bossBulletGroup, playerObj.hitMyPlane, null, this);
            bossObj.lateralMove();
            bossObj.update();
        }

        // 敌人生成
        if (!isBossStatus) {
            enemy1Obj.createEnemy();
            enemy2Obj.createEnemy();
            enemy3Obj.createEnemy();

            if (score >= 10000) {
                enemy1Obj.nearPlayer();
                enemy2Obj.nearPlayer();
                enemy3Obj.nearPlayer();
            }

            enemy1Obj.enemyShoot();
            enemy2Obj.enemyShoot();
            enemy3Obj.enemyShoot();
        }

        // 奖励机制
        if (score >= disScore) {
            disScore += 100;
            awardObj.createAward();
        }

        // 回复护盾
        if (game.time.now >= shieldCache) {
            if (playerObj.shield < 100) playerObj.shield++;
            shieldCache += 1000;
        }

        if (!isBossStatus) { // Boss状态停止检测
            game.physics.arcade.overlap(playerObj.bulletGroup, enemy1Obj.enemyGroup, enemy1Obj.hitEnemy, null, this);
            game.physics.arcade.overlap(playerObj.bulletGroup, enemy2Obj.enemyGroup, enemy2Obj.hitEnemy, null, this);
            game.physics.arcade.overlap(playerObj.bulletGroup, enemy3Obj.enemyGroup, enemy3Obj.hitEnemy, null, this);

            game.physics.arcade.overlap(playerObj.myPlane, enemy1Obj.enemyBulletGroup, playerObj.hitMyPlane, null, this);
            game.physics.arcade.overlap(playerObj.myPlane, enemy2Obj.enemyBulletGroup, playerObj.hitMyPlane, null, this);
            game.physics.arcade.overlap(playerObj.myPlane, enemy3Obj.enemyBulletGroup, playerObj.hitMyPlane, null, this);

            game.physics.arcade.overlap(playerObj.myPlane, enemy1Obj.enemyGroup, playerObj.hitEnemy, null, this);
            game.physics.arcade.overlap(playerObj.myPlane, enemy2Obj.enemyGroup, playerObj.hitEnemy, null, this);
            game.physics.arcade.overlap(playerObj.myPlane, enemy3Obj.enemyGroup, playerObj.hitEnemy, null, this);
        }

        game.physics.arcade.overlap(playerObj.myPlane, awardObj.awardLevelGroup, awardObj.getLevelAward, null, this);
        game.physics.arcade.overlap(playerObj.myPlane, awardObj.awardLifeGroup, awardObj.getLifeAward, null, this);
        game.physics.arcade.overlap(playerObj.myPlane, awardObj.awardKillGroup, awardObj.getKillAward, null, this);

        // Boss倒计时
        let time = disBossTime !== 0 && !isBossStatus ? (disBossTime - game.time.now) / 1000 : 0;
        dataText.setText(
            "分数：" + score +
            "\n生命：" + playerObj.life +
            "\n等级：" + playerObj.level +
            "\n护盾：" + playerObj.shield +
            "\nBoss倒计时：" + time + "s" +
            "\n敌人逃脱个数：" + escapedEnemyCount
        );
    }

    // 滑动事件
    this.mouseMoveHandler = function (event) {
        if (isTouching) {
            let mTouchX = event.pageX / multipleX;
            let mTouchY = event.pageY / multipleY;
            let x = playerX + mTouchX - mDownX;
            let y = playerY + mTouchY - mDownY;
            playerObj.myPlane.x = x;
            playerObj.myPlane.y = y;
        }
    }

    // 结束游戏
    this.gotoOver = function () {
        this.playBGM.stop()
        endScore = score;
        game.state.start("end");
    }

    // 获取玩家实体
    this.getPlayerObject = function () {
        return playerObj;
    }

    this.setScore = function (s) {
        score = s;
    }

    this.getScore = function () {
        return score;
    }

    this.setEscapedEnemyCount = function (count) {
        escapedEnemyCount = count;
    }

    this.getEscapedEnemyCount = function () {
        return escapedEnemyCount
    }

    this.setEscapedEnemyCountCache = function (count) {
        escapedEnemyCountCache = count;
    }

    this.getEscapedEnemyCountCache = function () {
        return escapedEnemyCountCache
    }

    this.getEnemy = function () {
        return [enemy1Obj, enemy2Obj, enemy3Obj];
    }

    this.setBossStatus = function (status) {
        isBossStatus = status;
        disBossTime = game.time.now + 60000;
    }

    this.getBossStatus = function () {
        return isBossStatus;
    }

    this.getBossObj = function () {
        return bossObj;
    }
};

// 结束镜头
game.states.end = function () {
    this.create = function () {
        var bg = game.add.tileSprite(0, 0, game.width, game.height, sourcesList.background);
        bg.autoScroll(0, 30);
        // 音乐
        this.gameover = game.add.audio(sourcesList.gameOverMusic, 1, false);
        this.gameover.play();

        // 飞机
        this.myplane = game.add.sprite(157, 150, playerConfig.selfPic);
        this.myplane.animations.add("fly");
        this.myplane.animations.play("fly", 14, true); // 14帧可循环动画

        // 分数
        var style = {font: "40px 宋体", fill: "#ff0000"};
        this.text = game.add.text(400, 230, endScore, style);
        this.text.x = 170 - this.text.width / 2;

        // 分享和重来按钮
        this.shareButton = game.add.button(60, 350, sourcesList.shareButton, this.share, this, 0, 0, 1);
        this.replayButton = game.add.button(200, 350, sourcesList.replayButton, this.replay, this, 0, 0, 1);
    };

    this.replay = function () {
        isBossState = false;
        game.add.audio(sourcesList.startButtonAudio, 1, false).play();
        game.state.start("main");
    };

    this.share = function () {
        game.add.audio(sourcesList.startButtonAudio, 1, false).play();
        document.getElementById("shareImg").style.display = 'block';
    };
};

// 场景注册
game.state.add("preload", game.states.preload);
game.state.add("help", game.states.help);
game.state.add("main", game.states.main);
game.state.add("end", game.states.end);
game.state.start("preload");


/*********************************************** 实体类 ***********************************************/
// 玩家飞机类
function Player() {
    let self = this;

    this.init = function () {
        // 初始化玩家数据
        this.level = playerConfig.level;
        this.life = playerConfig.life;
        this.shield = playerConfig.shield;
        this.bulletVelocity = playerConfig.bulletVelocity;
        this.bulletTimeInterval = playerConfig.bulletTimeInterval;
        this.bulletCount = playerConfig.bulletCount;

        if (invincibleMode) {
            this.level = 99999;
            this.life = 99999;
            this.shield = 999999;
        }

        // 玩家飞机部分
        this.myPlane = game.add.sprite(160, 520, playerConfig.selfPic);
        this.myPlane.animations.add("fly");
        this.myPlane.animations.play("fly", 14, true); // 14帧可循环动画
        game.physics.arcade.enable(this.myPlane);
        this.myPlane.body.collideWorldBounds = true
        this.setPlaneLevel(this.level);

        // 玩家子弹对象池
        this.bulletGroup = game.add.group();
        this.bulletGroup.enableBody = true;
        this.bulletGroup.createMultiple(500, playerConfig.bulletPic);
        this.bulletGroup.setAll("outOfBoundsKill", true);
        this.bulletGroup.setAll("checkWorldBounds", true);
    }

    // 自身发射子弹逻辑
    this.shoot = function () {
        game.add.audio(sourcesList.myShot, 0.05, false).play();
        if ((this.bulletTime || 0) < game.time.now) {
            let bullet = this.bulletGroup.getFirstExists(false);
            if (bullet) {
                bullet.reset(this.myPlane.x + 14, this.myPlane.y - 12);
                bullet.body.velocity.x = 0;
                bullet.body.velocity.y = -this.bulletVelocity;
                this.bulletTime = game.time.now + this.bulletTimeInterval;
            }

            if (this.bulletCount === 3) { // 子弹条数为3时发射旁边两条子弹
                bullet = this.bulletGroup.getFirstExists(false);
                if (bullet) {
                    bullet.reset(this.myPlane.x + 3, this.myPlane.y - 1);
                    bullet.body.velocity.x = 0;
                    bullet.body.velocity.y = -this.bulletVelocity;
                }

                bullet = this.bulletGroup.getFirstExists(false);
                if (bullet) {
                    bullet.reset(this.myPlane.x + 23, this.myPlane.y - 1);
                    bullet.body.velocity.x = 0;
                    bullet.body.velocity.y = -this.bulletVelocity;
                }
            }
        }
    };

    // 被击中逻辑
    this.hitMyPlane = function (plane, bullet) {
        bullet.kill();
        // 降低飞机等级 最低1级
        if (self.level > 1) {
            self.setPlaneLevel(self.level - 1);
        }

        // 降低飞机生命值
        if (self.shield > 0) {
            let num = self.shield >= 10 ? 10 : self.shield;
            self.shield -= num;
            return;
        }

        if (self.life > 1) {
            self.life--;
            game.add.audio(sourcesList.beAttackedMusic, 2, false).play();
            return;
        }

        // 玩家死亡
        self.myexplode = game.add.sprite(plane.x, plane.y, sourcesList.myExplode);
        const anim = self.myexplode.animations.add(playerConfig.explodePic);
        self.myexplode.animations.play(playerConfig.explodePic, 14, false, true);
        anim.onComplete.add(this.gotoOver, this)
        game.add.audio(sourcesList.myExplode, 0.2, false);
        plane.kill(); // 清除实体
    }

    // 与敌机相撞
    this.hitEnemy = function (plane, enemy) {
        enemy.kill();
        if (self.shield > 0) {
            self.shield = 0;
        } else {
            self.life--;
        }

        if (self.life <= 0) {
            // 玩家死亡
            self.myexplode = game.add.sprite(plane.x, plane.y, sourcesList.myExplode);
            const anim = self.myexplode.animations.add(playerConfig.explodePic);
            self.myexplode.animations.play(playerConfig.explodePic, 14, false, true);
            anim.onComplete.add(this.gotoOver, this)
            game.add.audio(sourcesList.myExplode, 0.2, false);
            plane.kill(); // 清除实体
        }
    }

    // 设置等级 控制子弹条数 子弹速度 攻速
    this.setPlaneLevel = function (l) {
        if (l < 1) return;
        this.level = l
        switch (l) {
            case 1:
                this.bulletCount = 1;
                this.bulletVelocity = 200;
                this.bulletTimeInterval = 200;
                break;

            case 2:
                this.bulletCount = 1;
                this.bulletVelocity = 250;
                this.bulletTimeInterval = 200;
                break;

            case 3:
                this.bulletCount = 1;
                this.bulletVelocity = 250;
                this.bulletTimeInterval = 150;
                break;

            case 4:
                this.bulletCount = 1;
                this.bulletVelocity = 250;
                this.bulletTimeInterval = 150;
                break;

            case 5:
                this.bulletCount = 1;
                this.bulletVelocity = 275;
                this.bulletTimeInterval = 150;
                break;

            case 6:
                this.bulletCount = 3;
                this.bulletVelocity = 275;
                this.bulletTimeInterval = 125;
                break;

            case 7:
                this.bulletCount = 3;
                this.bulletVelocity = 275;
                this.bulletTimeInterval = 100;
                break;

            case 8:
                this.bulletCount = 3;
                this.bulletVelocity = 275;
                this.bulletTimeInterval = 75;
                break;

            case 9:
                this.bulletCount = 3;
                this.bulletVelocity = 300;
                this.bulletTimeInterval = 75;
                break;

            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
                this.bulletCount = 3;
                this.bulletVelocity = 350;
                this.bulletTimeInterval = 50;
                break;

            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
                this.bulletCount = 3;
                this.bulletVelocity = 400;
                this.bulletTimeInterval = 40;
                break;

            default:
                this.bulletCount = 3;
                this.bulletVelocity = 400;
                this.bulletTimeInterval = 20;
        }
    }

    this.getPlaneLevel = function () {
        return self.level;
    }
}

// 敌人类
function Enemy(config, main) {
    let self = this;

    this.init = function () {
        // 敌人对象池
        this.enemyGroup = game.add.group();
        this.enemyGroup.enableBody = true;
        this.enemyGroup.createMultiple(config.selfPool, config.selfPic); // 对象池数量 标志
        this.enemyGroup.setAll("outOfBoundsKill", true);
        this.enemyGroup.setAll("checkWorldBounds", true);
        this.enemyGroup.forEach(function (enemy) {
                enemy.events.onOutOfBounds.add(function () {
                    let escapedEnemyCount = main.getEscapedEnemyCount();
                    let escapedEnemyCountCache = main.getEscapedEnemyCountCache();
                    main.setEscapedEnemyCount(escapedEnemyCount + 1);
                    if (escapedEnemyCount >= escapedEnemyCountCache) {
                        main.getPlayerObject().life--;
                        main.setEscapedEnemyCountCache(escapedEnemyCountCache + 10)
                    }
                }, this);
            }
        )

        // 敌人子弹对象池
        this.enemyBulletGroup = game.add.group();
        this.enemyBulletGroup.enableBody = true;
        this.enemyBulletGroup.createMultiple(config.bulletPool, config.bulletPic); // 对象池数量 标志
        this.enemyBulletGroup.setAll("outOfBoundsKill", true);
        this.enemyBulletGroup.setAll("checkWorldBounds", true);

        // 敌人死亡动画对象池
        this.explodeGroup = game.add.group();
        this.explodeGroup.enableBody = true;
        this.explodeGroup.createMultiple(config.explodePool, config.explodePic); // 对象池数量 标志
        this.explodeGroup.setAll("outOfBoundsKill", true);
        this.explodeGroup.setAll("checkWorldBounds", true);
        this.explodeGroup.forEach(function (explode) {
            explode.animations.add(config.explodePic);
        }, this);

        // 生成标志
        this.flag = false;
        // X轴宽度最大值
        this.maxWidth = game.width - game.cache.getImage(config.selfPic).width;
    };

    // 创建敌人
    this.createEnemy = function () {
        if ((this.enemyTime || 0) < game.time.now) {
            // 阻止第一次生成
            if (this.flag === false) {
                this.flag = true;
                this.enemyTime = game.time.now + config.selfTimeInterval;
                return;
            }
            // 生成敌人
            const enemy = this.enemyGroup.getFirstExists(false);
            if (enemy) {
                enemy.life = config.life;
                const xRan = Math.round(Math.random() * this.maxWidth);
                const yRan = -game.cache.getImage(config.selfPic).height;
                enemy.reset(xRan, yRan);
                enemy.body.velocity.y = config.velocity;
                this.enemyTime = game.time.now + config.selfTimeInterval;
            }
        }
    };

    // 敌人子弹射击
    this.enemyShoot = function () {
        this.enemyGroup.forEachExists(function (enemy) {
            if ((enemy.shootTime || 0) < game.time.now) {
                var bullet = this.enemyBulletGroup.getFirstExists(false);
                if (bullet) {
                    bullet.reset(enemy.body.x + config.bulletX, enemy.body.y + config.bulletY);
                    bullet.body.velocity.y = config.bulletVelocity;
                    enemy.shootTime = game.time.now + config.bulletTimeInterval;
                }
            }
        }, this);
    };

    // 敌人侦查靠近模块及边界判断
    this.nearPlayer = function () {
        let player = main.getPlayerObject().myPlane;
        let playerX = player.body.x / multipleX;
        let playerY = player.body.y / multipleY;
        let investigationRadius = config.investigationRadius;

        this.enemyGroup.forEach(function (explode) {
            // 侦查监听
            let x = explode.body.x / multipleX;
            let y = explode.body.y / multipleY;
            let r = Math.sqrt(Math.pow(x - playerX, 2) + Math.pow(y - playerY, 2));
            if (r <= investigationRadius && Math.random() * 100 < 1) {
                explode.body.velocity.x = playerX - x
            }
        }, this);
    };

    // 被击中逻辑
    this.hitEnemy = function (bullet, enemy) {
        bullet.kill();
        if (enemy.life > 1) {
            enemy.life--;
            return;
        }

        // 动画部分
        const explode = self.explodeGroup.getFirstExists(false);
        explode.reset(enemy.body.x, enemy.body.y);
        explode.play(config.explodePic, 14, false, true);

        // 敌人死亡
        enemy.kill();

        // 加分
        main.setScore(main.getScore() + config.score);
    };
}

// 奖励类
function Award(config, main) {
    this.init = function () {
        // 奖励对象池
        this.awardLevelGroup = game.add.group();
        this.awardLevelGroup.enableBody = true;
        this.awardLevelGroup.createMultiple(20, config.level.selfPic);
        this.awardLevelGroup.setAll("outOfBoundsKill", true);
        this.awardLevelGroup.setAll("checkWorldBounds", true);

        this.awardLifeGroup = game.add.group();
        this.awardLifeGroup.enableBody = true;
        this.awardLifeGroup.createMultiple(20, config.life.selfPic);
        this.awardLifeGroup.setAll("outOfBoundsKill", true);
        this.awardLifeGroup.setAll("checkWorldBounds", true);

        this.awardKillGroup = game.add.group();
        this.awardKillGroup.enableBody = true;
        this.awardKillGroup.createMultiple(20, config.kill.selfPic);
        this.awardKillGroup.setAll("outOfBoundsKill", true);
        this.awardKillGroup.setAll("checkWorldBounds", true);
    }

    // 产生奖励
    this.createAward = function () {
        // 随机一个奖励
        const random = Math.round(Math.random() * 2);
        // 判断
        let xRan;
        let yRan;
        let award;
        switch (random) {
            case 0: // 等级
                xRan = Math.round(Math.random() * (game.width - game.cache.getImage(config.level.selfPic).width));
                yRan = game.cache.getImage(config.level.selfPic).height;
                award = this.awardLevelGroup.getFirstExists(false);
                award.reset(xRan, -yRan);
                award.body.velocity.y = config.level.velocity;
                break;

            case 1: // 生命
                xRan = Math.round(Math.random() * (game.width - game.cache.getImage(config.life.selfPic).width));
                yRan = game.cache.getImage(config.life.selfPic).height;
                award = this.awardLifeGroup.getFirstExists(false);
                award.reset(xRan, -yRan);
                award.body.velocity.y = config.life.velocity;
                break;

            case 2: // 秒杀
                xRan = Math.round(Math.random() * (game.width - game.cache.getImage(config.kill.selfPic).width));
                yRan = game.cache.getImage(config.kill.selfPic).height;
                award = this.awardKillGroup.getFirstExists(false);
                award.reset(xRan, -yRan);
                award.body.velocity.y = config.kill.velocity;
                break;
        }
    }

    // 获得奖励部分
    this.getLevelAward = function (plane, award) {
        award.kill();
        main.getPlayerObject().setPlaneLevel(main.getPlayerObject().getPlaneLevel() + 1);
        // 播放拾取奖励音效
        this.getaward = game.add.audio(sourcesList.getAwardMusic, 0.7, false);
        this.getaward.play();
    }

    this.getLifeAward = function (plane, award) {
        award.kill();
        const random = Math.random() * 100;
        if (random < 90) {
            main.getPlayerObject().life++;
        } else {
            main.getPlayerObject().shield += 100;
        }
        // 播放拾取奖励音效
        this.getaward = game.add.audio(sourcesList.getAwardMusic, 0.7, false);
        this.getaward.play();
    }

    this.getKillAward = function (plane, award) {
        award.kill();

        let enemy = main.getEnemy();
        let enemy1Obj = enemy[0];
        let enemy2Obj = enemy[1];
        let enemy3Obj = enemy[2];

        // 敌人
        enemy1Obj.enemyGroup.forEachExists(function (enemy) {
            enemy.kill();
        }, this);
        enemy2Obj.enemyGroup.forEachExists(function (enemy) {
            enemy.kill();
        }, this);
        enemy3Obj.enemyGroup.forEachExists(function (enemy) {
            enemy.kill();
        }, this);

        // 子弹
        enemy1Obj.enemyBulletGroup.forEachExists(function (bullet) {
            bullet.kill();
        }, this);
        enemy2Obj.enemyBulletGroup.forEachExists(function (bullet) {
            bullet.kill();
        }, this);
        enemy3Obj.enemyBulletGroup.forEachExists(function (bullet) {
            bullet.kill();
        }, this);

        if (main.getBossStatus()) {
            main.getBossObj().bossBulletGroup.forEachExists(function (bullet) {
                bullet.kill();
            }, this);
        }
        // 播放拾取奖励音效
        this.getaward = game.add.audio(sourcesList.getAwardMusic, 0.7, false);
        this.getaward.play();
    }

}

// Boss类
function Boss(main) {
    let isLateralMove = false;
    let isMoveRight = false;
    let healthLine;
    let timeCache = 0;
    let bossLife = 5000;
    let angle = 0;
    let isRight = true;

    // 攻击次数
    let attackTime = 0;
    // Boss状态 false休息状态 true攻击状态
    let bossState = false;
    // Boss状态切换时间点
    let bossStateChangeTime = 0;
    // 当前攻击子弹类型
    let attackType = 1;

    this.createBoss = function () {
        main.setBossStatus(true);
        this.clearAllEnemy();

        bossLife = 5000;
        isBossState = false;
        timeCache = game.time.now;
        // 记录玩家原等级
        main.getPlayerObject().setPlaneLevel(main.getPlayerObject().getPlaneLevel() + 100);

        // Boss
        this.bossPlane = game.add.sprite(game.width / 2 - 24, -96, sourcesList.boss);
        this.bossPlane.animations.add("fly");
        this.bossPlane.animations.play("fly", 7, true); // 7帧可循环动画
        game.physics.arcade.enable(this.bossPlane);
        this.bossPlane.enableBody = true;
        game.add.tween(this.bossPlane).to({y: 0}, 4000, Phaser.Easing.Sinusoidal.InOut, true);

        // 子弹对象池
        this.bossBulletGroup = game.add.group();
        this.bossBulletGroup.enableBody = true;
        this.bossBulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.bossBulletGroup.createMultiple(2000, sourcesList.enemyBullet);
        this.bossBulletGroup.setAll("outOfBoundsKill", true);
        this.bossBulletGroup.setAll("checkWorldBounds", true);

        healthLine = game.add.graphics(0, 0);
        healthLine.beginFill(0xFF0000, 1);
        healthLine.drawRect(game.width - 2, 0, game.width, game.height);
    }

    this.update = function () {
        // 状态切换
        if (game.time.now >= bossStateChangeTime) {
            bossState = !bossState;
            timeCache = game.time.now;
            bossStateChangeTime = game.time.now;
            // 休息5秒 攻击10秒
            bossStateChangeTime += bossState ? 10000 : 5000;
            // 攻击次数+1
            if (bossState) {
                attackTime++;
                attackType = Math.floor(Math.random() * 5) + 1;
            }
        }

        healthLine.height = game.height / 5000 * bossLife;
        this.shoot()
        isLateralMove = bossLife <= 2000;
    }

    this.shoot = function () {
        this.shootType(attackType)
    }

    this.hitBoss = function (boss, bullet) {
        bullet.kill();
        bossLife--
        main.setScore(main.getScore() + 1);

        if (bossLife <= 0) {
            boss.kill();
            let level = main.getPlayerObject().getPlaneLevel() - 100;
            main.getPlayerObject().setPlaneLevel(level > 0 ? level : 1);
            // Boss死亡
            this.myexplode = game.add.sprite(boss.x, boss.y, sourcesList.bossExplode);
            this.myexplode.animations.add(sourcesList.bossExplode);
            this.myexplode.animations.play(sourcesList.bossExplode, 14, false, true);
            this.player = game.add.audio(sourcesList.bossExplode, 0.2, false);
            this.player.play();
            main.setBossStatus(false);
        }
    }

    this.clearAllEnemy = function () {
        let enemy = main.getEnemy();
        let enemy1Obj = enemy[0];
        let enemy2Obj = enemy[1];
        let enemy3Obj = enemy[2];

        enemy1Obj.enemyGroup.forEachExists(function (enemy) {
            enemy.kill();
        }, this);
        enemy2Obj.enemyGroup.forEachExists(function (enemy) {
            enemy.kill();
        }, this);
        enemy3Obj.enemyGroup.forEachExists(function (enemy) {
            enemy.kill();
        }, this);
        // 子弹
        enemy1Obj.enemyBulletGroup.forEachExists(function (bullet) {
            bullet.kill();
        }, this);
        enemy2Obj.enemyBulletGroup.forEachExists(function (bullet) {
            bullet.kill();
        }, this);
        enemy3Obj.enemyBulletGroup.forEachExists(function (bullet) {
            bullet.kill();
        }, this);
    }

    this.lateralMove = function () {
        if (isLateralMove) {
            let direction = isMoveRight ? 1 : -1;
            this.bossPlane.body.x += direction;
            if (this.bossPlane.body.x <= 0 || this.bossPlane.body.x + 48 >= game.width) isMoveRight = !isMoveRight;
        }
    }

    this.shootType = function (type) {
        let bullet;
        switch (type) {
            case 1:
                bullet = this.bossBulletGroup.getFirstExists(false);
                if (bullet) {
                    bullet.reset(this.bossPlane.x + 22, this.bossPlane.y + 65);
                    bullet.body.velocity.x = Math.sin(game.time.now / 100) * 275;
                    bullet.body.velocity.y = Math.cos(game.time.now / 100) * 275;
                    this.bulletTime = game.time.now + 100;
                }

                bullet = this.bossBulletGroup.getFirstExists(false);
                if (bullet) {
                    bullet.reset(this.bossPlane.x + 22, this.bossPlane.y + 65);
                    bullet.body.velocity.x = Math.cos(game.time.now / 150 + 3.14 / 2) * 275;
                    bullet.body.velocity.y = Math.sin(game.time.now / 150 + 3.14 / 2) * 275;
                    this.bulletTime = game.time.now + 100;
                }
                break;

            case 2:
                let x = game.world.centerX + Math.cos(game.time.now / 1000) * 75
                let y = game.world.centerY / 2 + Math.sin(game.time.now / 1000) * 75
                bullet = this.bossBulletGroup.getFirstExists(false);
                if (bullet) {
                    bullet.reset(x, y);
                    bullet.body.velocity.x = Math.sin(game.time.now) * 25;
                    bullet.body.velocity.y = Math.cos(game.time.now) * 25;

                }
                break;

            case 3:
                bullet = this.bossBulletGroup.getFirstExists(false);
                if (bullet) {
                    bullet.reset(this.bossPlane.x + 22, this.bossPlane.y + 65);
                    bullet.body.velocity.x = Math.sin(game.time.now) * 100;
                    bullet.body.velocity.y = -Math.cos(game.time.now) * 100;
                    this.bulletTime = game.time.now + 20;
                }
                bullet = this.bossBulletGroup.getFirstExists(false);
                if (bullet) {
                    bullet.reset(this.bossPlane.x + 22, this.bossPlane.y + 65);
                    bullet.body.velocity.x = Math.sin(game.time.now / 2) * 100;
                    bullet.body.velocity.y = -Math.cos(game.time.now / 2) * 100;
                }
                bullet = this.bossBulletGroup.getFirstExists(false);
                if (bullet) {
                    bullet.reset(this.bossPlane.x + 22, this.bossPlane.y + 65);
                    bullet.body.velocity.x = Math.sin(game.time.now / 3) * 100;
                    bullet.body.velocity.y = -Math.cos(game.time.now / 3) * 100;
                }
                break;

            case 4:
                if (game.time.now >= timeCache) {
                    timeCache += 2000;
                    for (let i = 0; i < 100; i++) {
                        let bulletX = Math.random() * game.width;
                        let bulletY = Math.random() * 100;
                        bullet = this.bossBulletGroup.getFirstExists(false);
                        if (bullet) {
                            bullet.reset(bulletX, bulletY);
                            bullet.body.acceleration.y = 100;
                        }
                    }
                }
                break;

            case 5:
                angle += isRight ? 1 : -1;
                if (angle <= 0 || angle > 100) isRight = !isRight;

                bullet = this.bossBulletGroup.getFirstExists(false);
                if (bullet) {
                    bullet.reset(180, 300);
                    bullet.body.velocity.x = Math.cos(angle) * 70;
                    bullet.body.velocity.y = Math.sin(angle) * 70;
                }

                bullet = this.bossBulletGroup.getFirstExists(false);
                if (bullet) {
                    bullet.reset(180, 300);
                    bullet.body.velocity.x = Math.cos(angle + 3.14 / 4) * 70;
                    bullet.body.velocity.y = Math.sin(angle + 3.14 / 4) * 70;
                }

                bullet = this.bossBulletGroup.getFirstExists(false);
                if (bullet) {
                    bullet.reset(180, 300);
                    bullet.body.velocity.x = Math.cos(angle + 3.14 / 2) * 70;
                    bullet.body.velocity.y = Math.sin(angle + 3.14 / 2) * 70;
                }
                break;
        }


    }
}