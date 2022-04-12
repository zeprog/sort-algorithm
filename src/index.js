import './select'

let canvas = document.getElementById('canvas')
let startButton = document.getElementById('start-button')
let resetButton = document.getElementById('reset-button')
let linesHeight = document.getElementById('lines-height')
let elementsNumber = document.getElementById('elements-number')
let speed = document.getElementById('speed')
let sortTypeSelect = document.getElementsByName('sort-type')
let ctx = canvas.getContext('2d')
let canvasSize = 900
let play = false
let array = []
let arrayLevel = 0
let arrayLevelLow = 0
let direction = true
let time = 0
let sortType = 'combSort'
let step = 0
let drawning = 0
let colors = ['#f2ff00', '#80ffbf', '#000000', '#ff8080', '#00cc00', '#006600']
let colorPick = 3
let radiusValue = +linesHeight.value
let diffRadiusValue = 0

const PI = 3.14

calcNewArray()

elementsNumber.oninput = calcNewArray
speed.oninput = changeSpeed
linesHeight.oninput = changeLinesHeight

startButton.onclick = start

resetButton.onclick = () => {
  play = false
  clearInterval(drawning)
  startButton.src = require('./static/start.png')
  calcNewArray()
  resetImg()
}

function start() {
  if (!play) {
    play = true
    startButton.src = require('./static/pause.png')
    initSort()
  } else {
    play = false
    startButton.src = require('./static/start.png')
    clearInterval(drawning)
    resetImg()
  }
}

function changeSpeed() {
  if (play) {
    clearInterval(drawning)
    initSort()
  }
}

function resetImg() {
  ctx.clearRect(10, 10, canvasSize - 20, canvasSize - 20)
  drawArray(array)
}

function changeLinesHeight() {
  diffRadiusValue = +linesHeight.value - radiusValue
  radiusValue = +linesHeight.value
  for (let i = 0; i < array.length; i++) {
    array[i] -= diffRadiusValue
  }
  resetImg()
}

function compareRandom(array) {
  let x, y
  for (let i = array.length; i; i--) {
    x = Math.floor(Math.random() * i)
    y = array[i - 1]
    array[i - 1] = array[x]
    array[x] = y
  }
}

function calcNewArray() {
  array = []
  for (let i = 0; i < +elementsNumber.value; i++) {
    array.push(Math.round(canvasSize / 2 - +linesHeight.value - 60))
  }
  for (i = 0; i < array.length; i++) {
    array[i] = array[i] * (i * (0.64 / array.length)) + 90
  }
  step = array.length - 2
  time = 0
  direction = true
  compareRandom(array)
  resetImg()
}

function lineFunction(pommel, radCord, color, radius) {
  ctx.strokeStyle = color
  ctx.lineWidth = (canvasSize * 0.75) / array.length
  if (pommel) {
    ctx.beginPath()
    ctx.moveTo(
      radCord * ((canvasSize * 0.9) / array.length) + 30,
      canvasSize / 2 - array[radCord]
    )
    ctx.lineTo(
      radCord * ((canvasSize * 0.9) / array.length) + 30,
      canvasSize / 2 - array[radCord] - (canvasSize * 0.8) / array.length
    )
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.moveTo(
      radCord * ((canvasSize * 0.9) / array.length) + 30,
      canvasSize / 2
    )
    ctx.lineTo(
      radCord * ((canvasSize * 0.9) / array.length) + 30,
      canvasSize / 2 - array[radCord]
    )
    ctx.stroke()
  }
}

function drawArray(array) {
  ctx.lineWidth = (2 * PI * linesHeight) / array.length
  if (sortType === 'combSort') {
    for (let i = 0; i < array.length; i++) {
      lineFunction(false, i, colors[0], +linesHeight.value)
      lineFunction(false, time - 1, colors[colorPick], +linesHeight.value)
      lineFunction(false, time + step - 1, colors[colorPick], +linesHeight.value
      )
      lineFunction(true, i, colors[2], +linesHeight.value)
    }
  }
  if (sortType === 'bubbleSort') {
    for (var i = 0; i < array.length; i++) {
      lineFunction(false, i, colors[0], +linesHeight.value)
      lineFunction(false, time - 1, colors[colorPick], +linesHeight.value)
      lineFunction(false, time, colors[colorPick], +linesHeight.value)
      lineFunction(true, i, colors[2], +linesHeight.value)
    }
  }
  if (sortType === 'cocktailSort') {
    if (direction) {
      for (var i = 0; i < array.length; i++) {
        lineFunction(false, i, colors[0], +linesHeight.value)
        lineFunction(false, time - 1, colors[colorPick], +linesHeight.value)
        lineFunction(false, time, colors[colorPick], +linesHeight.value)
        lineFunction(true, i, colors[2], +linesHeight.value)
      }
    } else {
      for (var i = 0; i < array.length; i++) {
        lineFunction(false, i, colors[0], +linesHeight.value)
        lineFunction(false, time + 2, colors[colorPick], +linesHeight.value)
        lineFunction(false, time + 1, colors[colorPick], +linesHeight.value)
        lineFunction(true, i, colors[2], +linesHeight.value)
      }
    }
  }
}

function initSort() {
  drawning = setInterval(sort, Math.abs(+speed.value - 200)) // code repeat interval
}

for(let i = 0; i < sortTypeSelect.length; i++) {
  sortTypeSelect[i].onchange = () => {
    clearInterval(drawning)
    resetImg()
    if (play) {
      start()
    }
    sortType = sortTypeSelect[i].value
    clearInterval(drawning)
  }
}

function sort() {
  ctx.clearRect(10, 10, canvasSize - 20, canvasSize - 20)

  if (sortType === 'combSort') {
    if (array[time] > array[time + step]) {
      colorPick = 3
    } else {
      colorPick = 1
    }
    drawArray(array)
    if (time + step >= array.length) {
      time = 0
      step = step == 1 ? step : Math.floor(step / 1.25)
    }
    if (arrayLevel > array.length) {
      terminateProgram()
    }
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] <= array[i + step]) {
        arrayLevel++
      } else {
        arrayLevel = 0
      }
    }
    if (time < array.length - 1 - arrayLevel) {

      if (array[time] > array[time + step]) {
        let temp = array[time]
        array[time] = array[time + step]
        array[time + step] = temp
      }
      time++
    } else {
      time = 0
    }
  }
  if (sortType === 'bubbleSort') {
    ctx.clearRect(10, 10, canvasSize - 20, canvasSize - 20)

    if (array[time] > array[time + 1]) {
      colorPick = 3
    } else colorPick = 1

    drawArray(array)

    if (arrayLevel > array.length) {
      terminateProgram()
    }

    for (var i = 0; i < array.length - 1; i++) {
      if (array[i] <= array[i + 1]) {
        arrayLevel++
      } else {
        arrayLevel = 0
      }
    }

    if (time < array.length - 1 - arrayLevel) {
      if (array[time] > array[time + 1]) {
        var temp = array[time + 1]
        array[time + 1] = array[time]
        array[time] = temp
      }
      time++
    } else {
      time = 0
    }
  }

  if (sortType === 'cocktailSort') {
    if (arrayLevel + arrayLevelLow > array.length) {
      terminateProgram()
    }

    ctx.clearRect(10, 10, canvasSize - 20, canvasSize - 20)
    drawArray(array)

    if (direction) {
      for (var i = 0; i < array.length - 1; i++) {
        if (array[i] < array[i + 1]) {
          arrayLevel++
        } else {
          arrayLevel = 0
        }
      }
    } else {
      for (i = array.length; i > 1; i--) {
        if (array[i] > array[i - 1]) {
          arrayLevelLow++
        } else {
          arrayLevelLow = 0
        }
      }
    }

    if (direction) {
      if (time < array.length - arrayLevel - 1) {
        if (array[time] > array[time + 1]) {
          var temp = array[time + 1]
          array[time + 1] = array[time]
          array[time] = temp
          colorPick = 3
        } else {
          colorPick = 1
        }
        time++
      } else {
        direction = false
      }
    }

    if (!direction) {
      if (time > arrayLevelLow) {
        if (array[time] > array[time + 1]) {
          var temp = array[time + 1]
          array[time + 1] = array[time]
          array[time] = temp
          colorPick = 3
        } else {
          colorPick = 1
        }
        time--
      } else {
        direction = true
      }
    }
  }
}

function terminateProgram() {
  clearInterval(drawning)
  ctx.clearRect(10, 10, canvasSize - 20, canvasSize - 20)
  time = 0
  colorPick = 3
  ctx.lineWidth = (2 * Math.PI * +linesHeight.value) / array.length
  for (let i = 0; i < array.length; i++) {
    lineFunction(false, i, colors[0], +linesHeight.value)
    lineFunction(true, i, colors[2], +linesHeight.value)
  }
  i = 0
  let finishDrawing = setInterval(function () {
    if (i < array.length) {
      lineFunction(false, i, colors[1], +linesHeight.value)
      // lineFunction(true, i, colors[5], +linesHeight.value)
    } else {
      clearInterval(finishDrawing)
      arrayLevel = 0
      arrayLevelLow = 0
      play = false
      startButton.src = require('./static/start.png')
    }
    i++
  }, Math.abs(+speed.value - 200) * 0.7)
}
