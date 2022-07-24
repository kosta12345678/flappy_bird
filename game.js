// postavljanje platna
kaboom({
  width: 900,
  height: 600,
  font: "sinko", // ugrađeni font sinko
  canvas: document.querySelector("#mycanvas")
})

// učitavanje sličica
loadSprite("flappy", "sprites/flappy.png")
loadSprite("background", "sprites/background.png")
loadSprite("pipe", "sprites/pipe.png")

// učitavanje zvukova
loadSound("wooosh", "sounds/wooosh.mp3")
loadSound("score", "sounds/score.mp3")
loadSound("hit", "sounds/hit.mp3")

// globalne promenljive

// scena sa igrom
scene("game", () => {
  volume(0.2)
  focus()

  add([
    sprite("background", {
      width: width(),
      height: height()
    })
  ])

  score = 0
  scoreText = add([
    pos(10, 10),
    text(score, { size: 70 })
  ])

  bird = add([
    sprite("flappy"),
    pos(80, 40),
    scale(2),
    body(),
    area()
  ])

  bird.onUpdate(() => {
    if (bird.pos.y > height() + 30 || bird.pos.y < -30) {
      play("hit")
      go("gameover", score)
    }
  })

  onKeyPress("space", () => {
    play("wooosh")
    bird.jump(400)
  })

  function producePipes(){
    PIPE_GAP=150
    offset=rand(-50, 50)

    add([
      sprite("pipe"),
      pos(width(), height()/2+(PIPE_GAP/2)+offset),
      area(),
      "pipe"
      {passed:false}
    ])

    add([
      sprite("pipe", {flipY: true}),
      pos(width(), height()/2-(PIPE_GAP/2)+offset),
      origin("botleft"),
      area()
      "pipe"
    ])

  }

  loop(1.5,() => producePipes())

  onUpdate("pipe", (pipe) =>{
    pipe.move(-160, 0)

    if(pipe.passed==false&&pipe.pos.x<bird.pos.x) {
      play("score")
      score++
      scoreText=score

      pipe.passed=true
    }
  })

  bird.collides("pipe", () =>{
    play("hit"),
    go("gameover")
  })

})

storage = localStorage.getItem("high_score")
highScore = storage == undefined ? 0 : parseInt(storage)

// scena za kraj igre
scene("gameover", (score) => {
  if (score > highScore) {
    highScore = score
    localStorage.setItem("high_score", highScore)
  }

  add([
    pos(10, 10),
    text(`kraj igre!\nrezultat: ${score}\nnajbolji rezultat: ${highScore}`, {
      size: 45
    })
  ])

  onKeyPress("space", () => go("game"))
})

// započinjemo sa igrom
go("game")