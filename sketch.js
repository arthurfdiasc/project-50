
var player, HPBar, MaxHPBar, playerDisplay, swordSlash, swordSlash2
var playerImg, woodenSwordImg, swordSlashAnimation, swordSlash2Img, levelDisplayImg, slimeImg
var slimeGroup
var woodSwordEquiped = true
var left = false
var MaxHP = 100
var HP = MaxHP
var damage = 0
var defense = 0
var slimeHP = 10
var swordSlashDuration = 0
var keyPressed = false
var attackSpeed = 3
var attackCooldown = 0
var imunityFrame = 0
slimeImunityFrame = 0

function preload() {
playerImg = loadImage("player.png")
woodenSwordImg = loadImage("WoodenSword.png")
swordSlashAnimation = loadAnimation("SwordSlash1.png", "SwordSlash2.png", "SwordSlash3.png", "SwordSlash4.png")
swordSlash2Img = loadAnimation("SwordSlash5.png", "SwordSlash6.png", "SwordSlash7.png", "SwordSlash8.png")
levelDisplayImg = loadImage("level1.png")
slimeImg = loadAnimation("Slime1.png", "Slime2.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = createSprite(windowWidth/2, windowHeight/2);
  player.addImage(playerImg)
  player.scale = 3
  player.debug = true
  
  MaxHPBar = createSprite(windowWidth - 1300, windowHeight - 75, 300, 30)
  MaxHPBar.shapeColor = "black"
  
  HPBar = createSprite(windowWidth - 1450, windowHeight - 75, HP/MaxHP * 600, 20)
  HPBar.shapeColor = "Lime"
  
  playerDisplay = createSprite(windowWidth - 1547, windowHeight - 75)
  playerDisplay.addImage(levelDisplayImg)
  playerDisplay.scale = 3
  
  swordSlash = createSprite(windowWidth/2, windowHeight/2)
  swordSlash.addAnimation("swordSlash", swordSlashAnimation)
  swordSlash.scale = 4
  swordSlash.visible = false
  swordSlash.debug = true
  swordSlash.setCollider("rectangle", 0, 0, 10, 20)
  
  swordSlash2 = createSprite(windowWidth/2, windowHeight/2)
  swordSlash2.addAnimation("swordSlash2", swordSlash2Img)
  swordSlash2.scale = 4
  swordSlash2.visible = false
  swordSlash2.debug = true
  swordSlash2.setCollider("rectangle", 0, 0, 10, 20)

  slimeGroup = new Group()
  
}

function draw() {
  background(0, 150, 0); 
  if(keyDown("RIGHT")) {
    player.x = player.x + 10
    left = false
  } 
  if(keyDown("LEFT")) {
    player.x = player.x - 10
    left = true
  }
  if(keyDown("UP")) {
    player.y = player.y - 10
  }
  if(keyDown("DOWN")) {
    player.y = player.y + 10
  }
  if(woodSwordEquiped === true) {
    damage = 5
    if(keyDown("X") && left === false) {
      if(keyPressed === false && attackCooldown === 0) {
      swordSlash.visible = true
      swordSlash.changeAnimation("swordSlash", swordSlashAnimation)
      keyPressed = true
      attackCooldown = 60/attackSpeed
      swordSlashDuration = 16
      }
  }
  if(keyDown("X") && left === true) {
    if(keyPressed === false && attackCooldown === 0) {
      swordSlash2.visible = true
      swordSlash2.changeAnimation("swordSlash2", swordSlash2Img)
      keyPressed = true
      attackCooldown = 60/attackSpeed
      swordSlashDuration = 16
    }
  }
 }
 if(woodSwordEquiped === false) {
    damage = 0
  }
  if(swordSlashDuration > 0) {
    swordSlashDuration = swordSlashDuration - 1
  }
  if(attackCooldown > 0) {
    attackCooldown = attackCooldown - 1
  }
  if(attackCooldown <= 0) {
    keyPressed = false
  }
  if(swordSlashDuration <= 0) {
    swordSlash.visible = false
    swordSlash2.visible = false
  }
  swordSlash.x = player.x + 50
  swordSlash.y = player.y
  swordSlash2.x = player.x - 50
  swordSlash2.y = player.y
  if(player.isTouching(slimeGroup) && imunityFrame <= 0) {
    HP = HP - 7
    imunityFrame = 40
  }
  if(swordSlash.isTouching(slimeGroup) || swordSlash2.isTouching(slimeGroup) && slimeImunityFrame > 0) {
    if(swordSlash.visible === true || swordSlash2.visible === true)
    slimeHP = slimeHP - damage
    slimeImunityFrame = 40
  }
  if(slimeHP <= 0) {
    slimeGroup.destroyEach()
    slimeHP = 10
  }
  if(imunityFrame > 0) {
    imunityFrame = imunityFrame - 1
  }
  if(slimeImunityFrame > 0) {
    slimeImunityFrame = slimeImunityFrame - 1
  }
  if(HP > 0 && MaxHP > 1) {
    HPBar.width = HP/MaxHP * 600
    MaxHPBar.width = 310
    HPBar.visible = true
    MaxHPBar.visible = true
    playerDisplay.visible = true
    fill("black")
    stroke("black")
    textSize(20)
    text("HP: " + HP + "/" + MaxHP, windowWidth - 1400, windowHeight - 100)
  }
  if(HP > 0 && MaxHP === 1) {
    HPBar.visible = false
    MaxHPBar.visible = false
    playerDisplay.visible = false
  }
  
   if(HP/MaxHP > 0.6) {
    HPBar.shapeColor = rgb(0, 200, 0)
   }
   if(HP/MaxHP <= 0.6 && HP/MaxHP > 0.4) {
    HPBar.shapeColor = rgb(200, 200, 0)
   }
   if(HP/MaxHP <= 0.4 && HP/MaxHP > 0.2) {
    HPBar.shapeColor = rgb(200, 100, 0)
   }
   if(HP/MaxHP <= 0.2 && HP/MaxHP > 0) {
    HPBar.shapeColor = rgb(200, 0, 0)
   }
   if(HP <= 0) {
    woodSwordEquiped = false
    player.visible = false
    fill("black")
    stroke("black")
    textSize(20)
    text("Dead", windowWidth - 1400, windowHeight - 100)
   }
   if(HP < 0) {
     HP = 0
   }
   createSlime()
   drawSprites();
   
  }
  function createSlime() {
    if(frameCount % 300 === 0) {
      var slime = createSprite(random(windowWidth - 50, windowWidth - 1450), random(windowHeight - 50, windowHeight - 750))
      slime.addAnimation("slime", slimeImg)
      slime.scale = 3
      slime.velocityX = random(-5, 5)
      slime.velocityY = random(-5, 5)
      slimeGroup.add(slime)
    }
    
  }