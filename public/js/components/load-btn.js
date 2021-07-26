import { Algorithms } from "./algorithms.js"
import { Grid } from "./grid.js"
import { Cell } from "./cell.js"
import { setGrid } from "../solve.js"

let modal = document.getElementById("loadModal")
let modalContent = document.getElementsByClassName("modal-content")[0]
let screenFilter = document.getElementById("screen-filter")
let btn = document.getElementById("loadbtn")
let span = document.getElementsByClassName("close")[0]

let drawingCanvas, updateFunction = null;
let savedMazes = [];

let req = new XMLHttpRequest();
let url = "/data"

/**
 * Function that is executed once the http async GET request call is fulfilled.
 * Parses the JSON returned by the request and uses it to populate an array
 * of saved mazes
 */
function onLoad() {
    let response = this.responseText
    let parsedResponse = JSON.parse(response)

    let mazes = parsedResponse.mazes
    mazes.forEach((maze) => {
        savedMazes.push(maze)
    })

    loadOptions()
}

/**
 * Function that is run if the GET request to the server fails
 */
function onError() {
    console.log('error receiving async AJAX call')
}

/**
 * Function that creates a div HTML element for each existing maze in the server
 * and appends it to the modal list
 */
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

/**
 * Function that loads the maze by first updating it from the generic object
 * returned by the parsing of the JSON server response and then setting it as the 
 * grid in the solve.js file using the setGrid function exported from it
 * 
 * @param {JSON Object} maze        The maze object as returned by the parsing of the JSON get request response
 */
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


/**
 * Load Button Event Listener.
 * Function performs the GET request to the server to retrieve JSON data and adds
 * click listeners to each of the buttons divs to the load button and its modal
 * 
 * @param {HTML5 Canvas} canvas                 The HTML5 canvas needed to update the maze with the loaded one
 * @param {Function} update                     The update function needed to correctly display the loaded maze 
 */
export function handleLoadBtn(canvas, update) {

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