import { Algorithms } from "./algorithms.js"
import { Grid } from "./grid.js"
import { Cell } from "./cell.js"
import { setGrid } from "../solve.js"

let modal = document.getElementById("loadModal")
let modalContent = document.getElementsByClassName("modal-content")[0]
let screenFilter = document.getElementById("screen-filter")
let btn = document.getElementById("loadbtn")
let span = document.getElementsByClassName("close")[0]

let finalGrid, drawingCanvas, drawingContext, updateFunction = null;
let savedMazes = [];

let req = new XMLHttpRequest();
let url = "/data"

function onLoad() {
    let response = this.responseText
    let parsedResponse = JSON.parse(response)

    let mazes = parsedResponse.mazes
    mazes.forEach((maze) => {
        savedMazes.push(maze)
    })

    loadOptions()
}

function onError() {
    console.log('error receiving async AJAX call')
}

function loadOptions() {
    savedMazes.forEach((maze) => {
        let newOption = document.createElement('div')
        newOption.innerHTML = maze.name
        newOption.classList.add("load-option")

        modalContent.appendChild(newOption)

        newOption.onclick = () => {
            loadMaze(maze)
        }

    })
}

function loadMaze(maze) {
    setGrid(maze.grid)

    let gridSize = maze.grid[0][0].GRID_SIZE
    let cellSize = maze.grid[0][0].size

    // Convert generic objects in parsed JSON to Cell objects
    for (let i = 0; i < maze.grid.length; i++) {
        for (let j = 0; j < maze.grid.length; j++) {

            let x = maze.grid[i][j].x
            let y = maze.grid[i][j].y
            let col = maze.grid[i][j].column
            let row = maze.grid[i][j].row

            let walls = maze.grid[i][j].walls
            
            maze.grid[i][j] = new Cell(x, y, col, row, cellSize, gridSize)
            maze.grid[i][j].walls = walls
        }
    }

    let loadedMaze = new Grid(gridSize, cellSize, drawingCanvas.height, drawingCanvas.width)

    loadedMaze.grid = maze.grid
    setGrid(loadedMaze)
    updateFunction(false)
    span.click()  // Close modal
}

export function getMaze() {
    return finalGrid
}

export function revealSaveBtn() {
    if (btn) {
        btn.classList.add("screen-footer-savebtn-active")
        btn.classList.remove("screen-footer-savebtn-inactive")
    }
}

export function hideSaveBtn() {
    if (btn) {
        btn.classList.remove("screen-footer-savebtn-active")
        btn.classList.add("screen-footer-savebtn-inactive")
    }
}

export function handleLoadBtn(ctx, canvas, update) {

    drawingContext = ctx
    drawingCanvas = canvas
    updateFunction = update

    req.open('GET', url, true)
    req.addEventListener('load', onLoad)
    req.addEventListener('error', onError)

    req.send()

    btn.onclick = () => {

        // If there is a maze to save...
        if (!Algorithms.isFinished() && btn.classList.contains('screen-footer-savebtn-active')) {
            modal.style.display = "block"
            screenFilter.style.display = "block"
        }

    }

    span.onclick = () => {
        modal.style.display = "none"
        screenFilter.style.display = "none"
    }

    window.onclick = (e) => {
        if (e.target == modal) {
            modal.style.display = "none"
        }
    }

}