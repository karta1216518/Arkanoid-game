// Vue
let vm = new Vue({
  el: '#app',
  data: {
  },
  computed: {
  },
  methods: {
  },
  watch: {
  },
})
var GameObj = function (position, size, selector) {
  this.el = document.querySelector(selector)
  this.size = size
  this.position = position
  this.el.style.position = 'absolute'
  this.updateCss()
}
GameObj.prototype.updateCss = function () {
  this.el.style.left = this.position.x + 'px'
  this.el.style.top = this.position.y + 'px'
  this.el.style.width = this.size.width + 'px'
  this.el.style.height = this.size.height + 'px'
}
GameObj.prototype.collide = function (otherObj) {
  let inRangeX = otherObj.position.x > this.position.x &&
    otherObj.position.x < this.position.x + this.size.width
  let inRangeY = otherObj.position.y > this.position.y &&
    otherObj.position.y < this.position.y + this.size.height/2
  return inRangeX & inRangeY
}


let infoText = document.querySelector('.infoText')
let infoWell = document.querySelector('.infoWell')
let gradeEL = document.querySelector('.grade')
let startBtn = document.querySelector('.startBtn')

var Ball = function () {
  this.position = { x: 300, y: 300 }
  this.size = { width: 20, height: 20 }
  this.velocity = { x: -5, y: 5 }
  GameObj.call(this, this.position, this.size, '.ball')
}
// Ball的原型指向GameObj  Ball的建構函數指向自己的建構函數
Ball.prototype = Object.create(GameObj.prototype)
Ball.prototype.constructor = Ball.constructor
// 球的移動模式
Ball.prototype.update = function () {
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y
  this.updateCss()
  if (this.position.x > 600 || this.position.x < 0) {
    this.velocity.x = -this.velocity.x
  }
  if (this.position.y > 500 || this.position.y < 0) {
    this.velocity.y = -this.velocity.y
  }
}

var Board = function (position, seletor) {
  this.size = {
    width: 100,
    height: 20
  }
  GameObj.call(this, position, this.size, seletor)
}
Board.prototype = Object.create(GameObj.prototype)
Board.prototype.constructor = Ball.constructor
Board.prototype.update = function () {
  if (this.position.x < 0) {
    this.position.x = 0
  }
  if (this.position.x + this.size.width > 600) {
    this.position.x = 600 - this.size.width
  }
  this.updateCss()
}

var Game = function () {
  this.timer = null
  this.grade = 0
  this.initControl()
  this.control = {}
}
Game.prototype.initControl = function () {
  let vm = this
  document.onkeydown = function (e) {	
    var keyNum = window.event ? e.keyCode : e.which;
    vm.control[keyNum] = true
  }
  document.onkeyup = function (e) {	
    var keyNum = window.event ? e.keyCode : e.which;
    vm.control[keyNum] = false
  }
}
Game.prototype.startGame = function () {
  let time = 3
  let vm = this
  ball.position.x = 300
  ball.position.y = 250
  ball.updateCss()
  this.grade = 0
  infoText.innerHTML = ''
  startBtn.style.display = 'none'
  let mytimer = setInterval(function () {
    infoText.innerHTML = time
    time--
    if (time < 0) {
      clearInterval(mytimer)
      infoWell.style.display = 'none'
      infoText.style.display = 'none'
      vm.startGameMain()
    }
  }, 1000)

}
Game.prototype.startGameMain = function () {
  let vm = this
  this.timer = setInterval(function () {
    if (computer.collide(ball)) {
      ball.velocity.y = -ball.velocity.y
      ball.velocity.x+=.1
      ball.velocity.y+=.1
    }
    if (player.collide(ball)) {
      ball.velocity.y = -ball.velocity.y
      vm.grade += 10
      gradeEL.innerHTML = '分數:' + vm.grade
    }
    if (ball.position.y < 0) {
      vm.endGame('Win')
    }
    if (ball.position.y > 500) {
      vm.endGame('Lose')
    }
    if (vm.control['37']) {
      player.position.x -= 8
    }
    if (vm.control['39']) {
      player.position.x += 8
    }
    computer.position.x += ball.position.x > computer.position.x + computer.size.width / 2 ? 12 : 0
    computer.position.x += ball.position.x < computer.position.x + computer.size.width / 2 ? -12 : 0
    computer.update()
    player.update()
    ball.update()
  }, 15)
}
Game.prototype.endGame = function (game) {
  clearInterval(this.timer)
  infoWell.style.display = 'flex'
  infoText.style.display = 'block'
  startBtn.style.display = 'block'
  infoText.innerHTML = 'You ' + game +'!!!'
  startBtn.innerHTML = 'Again'
  
}
let ball = new Ball



let computer = new Board({ x: 0, y: 30 }, '.computer')
let player = new Board({ x: 0, y: 470 }, '.player')

let game = new Game
// game.startGame()