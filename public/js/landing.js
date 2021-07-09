import { createRipple } from './animations/ripple.js';
import { Grid } from './components/grid.js'
import { Algorithms } from './components/algorithms.js'

let canvas, ctx, gridSize, grid, cellSize, startCell

function init() {

    // Canvas Background Animation
    canvas = document.getElementById("animation")

    // Resize canvas so it occupies the full page
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx = canvas.getContext('2d')

    gridSize = 50  // 20x20 grid
    cellSize = canvas.height/gridSize

    grid = new Grid(gridSize, cellSize, canvas.height, canvas.width)
    startCell = grid.getRandom()

    grid.draw(ctx, false)

    Algorithms.randomizedDFS(startCell, ctx, grid, update)

}

function update(color) {
    // Clear grid before re-drawing
    ctx.clearRect(0, 0, grid.totalWidth, grid.totalHeight)
    grid.draw(ctx, color)
}

// wait for HTML to load
document.addEventListener('DOMContentLoaded', init)


// Ripple Animation Implementation
const tiles = document.getElementsByClassName("menu-item")
for (const tile of tiles) {
    tile.addEventListener("click", createRipple)
}