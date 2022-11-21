
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine;
var world;
var PLAY = 1;
var END = 0;
var SERVE;
var gamestate;
var serve;
var backgroundImg1;
var backgroundImg2;
var score;
var canvas;
var power;

var invisibleGround
var key = 0
var delayInMilliseconds = 1000;

var fighter1;
var fighter1_gif;
var fighter1_punch;
var fighter1_life = 100;
var fighter1d

var fighter2;
var fighter2_gif;
var fighter2_punch;
var fighter2_life = 100;
var fighter2d;

var power_animation;
var power_spriteData;
var power_spriteSheet;

var vid1;
var vid2;

var database;
var players = 0;
var gameState;

var wait;

function preload(){
    backgroundImg1 = loadImage("assets/MicrosoftTeams-image (2) (2).png");
    backgroundImg2 = loadImage("assets/aaa.png");
    fighter1_gif = loadImage("assets/animeBB.gif");
    fighter2_gif = loadImage("assets/red1.gif");
    fighter1_punch = loadImage("assets/poopy.gif");
    fighter2_punch = loadImage("assets/bloob.gif");
    fighter1d = loadImage("assets/DamageBlue.png");
    fighter2d = loadImage("assets/RedDamage.png");
    redwin = loadImage("assets/wwr.png");
    bluewin = loadImage("assets/wwb.png");
    wait = loadImage("assets/waiting.png");

    f1ma = loadImage("assets/f1ma.gif");
    f2ma = loadImage("assets/f2am.gif");

    pm1 = loadImage("assets/oror.gif");
    pm2 = loadImage("assets/orm2.gif");
}

function setup() {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  if(isMobile){
    W = displayWidth;
    H = displayHeight;
    createCanvas(W+80,H)
  }
  else{
    W = windowWidth;
    H = windowHeight;
    createCanvas(W, H);
  }
  database = firebase.database();
    fundo = createSprite(W/2, H/2);
    fundo.addImage(backgroundImg1);
    
    fighter1 = createSprite(W*0.25,H-200,20,300);
    fighter1.addImage(fighter1_gif);    
    fighter1.setCollider("rectangle",0,0,200,150);
    
    fighter2 = createSprite(W*0.75,H-200,20,300);
    fighter2.addImage(fighter2_gif);
    fighter2.setCollider("rectangle",0,0,200,150);
    
   

    
    fighter1.visible = false;
    fighter2.visible = false;
    
    edges = createEdgeSprites();
    
    backgroundImg2.visible = false;
    backgroundImg1.visible = true;
    
    gamestate = SERVE;
    
    invisibleGround = createSprite(W/2,H-10, 2000, 100);
    invisibleGround.visible = false;
    
}


function draw() {
    background(180);
    


    if(gamestate === "serve"){
        fundo.addImage(backgroundImg1);
    }
    else{
        gameplay();
    }
    

    fighter1.collide(invisibleGround);
    fighter2.collide(invisibleGround);

    var playerCountRef = database.ref("playerCount");
    playerCountRef.on("value",function(data){
        players = data.val();
    })

    var datGameState = database.ref("gameState");
    datGameState.on("value",function(data){
        gameState = data.val();
    })
    if(players == 1){
        fundo.addImage(wait);
    }
    if(players == 2){
        fundo.addImage(backgroundImg2);
        fighter1.visible = true;
        fighter2.visible = true;
    }
    drawSprites();
    if(fighter1.visible == true){
        textSize(40);
        noStroke();
        //fill("blue");
        //text("LIFE: " + fighter1_life , W-1300, H*0.1);
        //fill("red")
        //tex(fighter2_life , W-300, H*0.1);
        fill("red");
        rect(W-1300, H*0.1, 100*2,20);
        fill("green");
        rect(W-1300, H*0.1,fighter1_life*2,20);
        noStroke();
        fill("red");
        rect(W-300, H*0.1, 100*2,20);
        fill("green");
        rect(W-300, H*0.1,fighter2_life*2,20);
        noStroke();
    }
    
}


function keyPressed(){
    if(keyCode===69){
        //backgroundImg1.visible = false;
        //backgroundImg2.visible = true;
        players +=1;
        database.ref("/").update({
            playerCount: players,
        })
        if(gamestate == "serve"){
            gamestate = "play";
        }
    }

    if(fighter1.x > fighter2.x){
        fighter1.addImage(f1ma)
        fighter2.addImage(f2ma)
        
        if(keyCode===83){
            fighter1.addImage(pm1);
            if(fighter1.isTouching(fighter2)){
                fighter2_life -= Math.round(random(1,3));
            }
            if(fighter1.isTouching(fighter2) && fighter2.x < windowWidth+100 && fighter2.x < windowWidth-100){
                fighter2.x -= 100;
            }
            
    
    
        } else{
            fighter1.addImage(f1ma);
        }
        
        if(keyCode===75){
            fighter2.addImage(pm2);
            if(fighter2.isTouching(fighter1)){
                fighter1_life -= Math.round(random(1,3));
    
            }
            if(fighter2.isTouching(fighter1) && fighter1.x < windowWidth-100 && fighter2.x < windowWidth+100){
                fighter1.x += 100;
            }
            
    
        } else{
            fighter2.addImage(f2ma);
        }

    }
    else{
        if(keyCode===83){
            fighter1.addImage(fighter1_punch);
            if(fighter1.isTouching(fighter2)){
                fighter2_life -= Math.round(random(1,3));
            }
            if(fighter1.isTouching(fighter2) && fighter2.x < windowWidth-100 && fighter2.x < windowWidth+100){
                fighter2.x += 100;
            }
            
    
    
        } else{
            fighter1.addImage(fighter1_gif);
        }
    
    
        if(keyCode===75){
            fighter2.addImage(fighter2_punch);
            if(fighter2.isTouching(fighter1)){
                fighter1_life -= Math.round(random(1,3));
    
            }
            if(fighter2.isTouching(fighter1) && fighter1.x < windowWidth+100 && fighter2.x < windowWidth-100){
                fighter1.x -= 100;
            }
            
    
        } else{
            fighter2.addImage(fighter2_gif);
        }
    }
    
    
    
    if(fighter1_life <= 0 || fighter2_life <= 0){
        if(keyCode===16){
            location.reload();
        }
    }
        
}

function gameplay(){
    fighter1.bounceOff(edges[0]);
    fighter1.bounceOff(edges[1]);
    
    fighter2.bounceOff(edges[0]);
    fighter2.bounceOff(edges[1]);

    if(keyIsDown("68")){
        fighter1.x += 10; 
    } 
    if(keyIsDown("65")){
        fighter1.x -= 10;
    }
    
    if(keyIsDown("87") && fighter1.y >= 522){
       fighter1.velocityY = -16;
    }
    
    
    
    
    
    if(keyIsDown("74")){
        fighter2.x -= 10;
    }
    if(keyIsDown("76")){
        fighter2.x += 10;
    }
    
    
    if(keyIsDown("73") && fighter2.y >= 522){
        fighter2.velocityY = -16;
     }
    
   
    //adicionar gravidade
    fighter1.velocityY = fighter1.velocityY + 0.5
    fighter2.velocityY = fighter2.velocityY + 0.5 
      
    if(fighter1_life <=0){
        fundo.visible = false;
        fundo.addImage(redwin);
        image(redwin,0,0,windowWidth+50,windowHeight+50);
        fighter1.visible = false;
        fighter2.visible = false;
    }

    if(fighter2_life <=0){
        fundo.visible = false;
        fundo.addImage(bluewin);
        image(bluewin,0,0,windowWidth+50,windowHeight+50);
        fighter1.visible = false;
        fighter2.visible = false;
    }
}