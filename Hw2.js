//Particle displacement using the phaser engine.  
//modified from phaser example by Tien Ortman Tmo8@uw.edu




var config = {
    type: Phaser,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            useTree: false,
            gravity: { y: 100 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var controls;
var player;
var group;
var spriteBounds;
var myX;
var myY;



var game = new Phaser.Game(config);



function preload ()
{
    this.load.image('chunk', 'particle.png');
    this.load.image('crate', 'box.png');
}

function release ()
{
    for (var i = 0; i < 100; i++)
    {
        var pos = Phaser.Geom.Rectangle.Random(spriteBounds);

        var block = group.create(pos.x, pos.y, 'chunk');

        block.setBounce(1);
        block.setCollideWorldBounds(true);
        block.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-100, -200));
        block.setMaxVelocity(300);
        block.setBlendMode(1);
    }

    
}

function create ()
{
    var graphics = this.add.graphics();
    graphics.fillStyle(0x000044);
    graphics.fillRect(0,0,800,200);

    this.physics.world.setBounds(0, 0, 800, 600);

    spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), -10, -200);
    spriteBounds.y += 100;

    group = this.physics.add.group();
    group.runChildUpdate = false;
    console.log(group);

    
    this.time.addEvent({ delay: 500, callback: release, callbackScope: this, repeat: (10000 / 100) - 1 });

    cursors = this.input.keyboard.createCursorKeys();

    player = this.physics.add.image(400, 100, 'crate').setScale(5);

    player.setImmovable();
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, group);

    
}

function update ()
{
    player.setVelocity(0);

    if (cursors.left.isDown)
    {
        player.setVelocityX(-500);
        
        
        
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(500);
    }

    if (cursors.up.isDown)
    {
        player.setVelocityY(-500);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(500);
    }

    
}


window.onload = function () {
    
    var socket = io.connect("http://24.16.255.56:8888");
  
    socket.on("load", function (data) {
        
        console.log(data);
        console.log(stuff[0]);
        console.log(stuff[1]);
        player.body.reset(stuff[0]+80, stuff[1]+82);
        


        
    });
  
    var text = document.getElementById("text");
    var saveButton = document.getElementById("save");
    var loadButton = document.getElementById("load");
  
    saveButton.onclick = function () {
       // var myPoint = new Phaser.Geom.Point(player.body.x, player.body.y);

      console.log("save");
      text.innerHTML = "Saved."
      stuff = [];
      stuff[0] = player.body.x;
      stuff[1] = player.body.y;
      var myTime = this.time;
      console.log(stuff[0]);
      console.log(stuff[1]);

      socket.emit("save", { studentname: "Tien Ortman", statename: "box position2", data:  stuff, data2: myTime});
    };
  
    loadButton.onclick = function () {
      console.log("load");
      text.innerHTML = "Loaded."
      socket.emit("load", { studentname: "Tien Ortman", statename: "box position2"});
      
    };
  
  };
