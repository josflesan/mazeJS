import { Grid } from './components/grid.js'
import { Algorithms } from './components/algorithms.js'

import { initToggle } from './components/toggle.js'
import { handleSaveBtn } from './components/save-btn.js'

;(function() {

    let canvas, ctx, cellSize, gridSize, grid, container, playbtn
    let buttonState = "PAUSED"

    /**
     * Function for intial setup of config variables
     */
    function init() {
        canvas = document.getElementById('monitor-canvas')
        container = document.querySelector('.fullscreen-canvas-container')
        ctx = canvas.getContext('2d')

        // ************ DEFAULT MAZE SETTINGS ************

        canvas.width = window.innerHeight * 0.8 * 0.9
        canvas.height = window.innerHeight * 0.8 * 0.9

        gridSize = 5  // 5x5 grid
        cellSize = canvas.height/gridSize
        grid = new Grid(gridSize, cellSize, canvas.height, canvas.width)
        grid.clearAllWalls()
        //let startCell = openMaze()  // Remove start and end walls of maze to open it

        // ************************************************

        gridSizeChange()

        // Implement toggle functionality
        initToggle("build")

        // Listen to mouse hover
        listenMouseHover(ctx, canvas)

        // Listen to mouse click
        listenMouseClick(ctx, canvas)
        
        // Implement play button functionality
        playbtn = document.getElementById("playbtn");

        playbtn.addEventListener("click", e => {
            // Choose appropriate algorithm and play animation
            changeButton()
            
            if (buttonState == "PAUSED") {
                grid.clear(ctx)  // If stopped, clear grid
                //openMaze()
            }

        })

    }

    /**
     * Function that updates the screen with the updated maze state
     * @param {Boolean} color Whether or not the cells will be coloured in according to their state 
     */
    function update(color) {
        // Clear grid before re-drawing
        ctx.clearRect(0, 0, grid.totalWidth, grid.totalHeight)
        grid.draw(ctx, color)
    }

    function listenMouseHover(ctx, canvas) {

        let hover

        canvas.onmousemove = async function(e) {

            let r = canvas.getBoundingClientRect()
            let x = e.clientX - r.left
            let y = e.clientY - r.top

            hover = false
            grid.resetGrid()

            update(true)

            for (let row = 0; row < grid.getLength()["y"]; row++) {
                for (let col = 0; col < grid.getLength()["x"]; col++) {

                    let cell = grid.getCell(row, col)

                    if (x >= cell.x && x <= cell.x + cell.size &&
                        y >= cell.y && y <= cell.y + cell.size) {
                            hover = true
                            cell.hoverCell()
                            cell.colorCell(ctx)
                            break;
                    }
                    
                }
                if (hover)  break
            }

        }

    }

    function listenMouseClick(ctx, canvas) {

        let click

        canvas.onmousedown = async function(e) {

            let r = canvas.getBoundingClientRect()
            let x = e.clientX - r.left
            let y = e.clientY - r.top

            click = false

            for (let row = 0; row < grid.getLength()["y"]; row++) {
                for (let col = 0; col < grid.getLength()["x"]; col++) {

                    let cell = grid.getCell(row, col)

                    if (x >= cell.x && x <= cell.x + cell.size &&
                        y >= cell.y && y <= cell.y + cell.size) {
                            cell.clickCell()
                            cell.colorCell(ctx)
                            click = true
                            //break;
                    }
                    
                }
                //if (click)  break
            }

        }

    }

    /**
     * Function that removes the starting cell's left wall and the ending
     * cell's right wall in the maze so that the maze is solvable from left
     * to right.
     * @returns {Cell} The starting cell object passed as a parameter to the DFS algorithm  
     */
    function openMaze() {
        // Declare starting cell, remove wall 
        let startCell = grid.getRandom()
        grid.getCell(0, 0).deleteWall("left", grid.getCell(0, 0).getNeighbours(grid))  // Delete wall from start cell
        // Declare ending cell, remove wall
        let endCell = grid.getCell(gridSize-1, gridSize-1)
        endCell.deleteWall("right", endCell.getNeighbours(grid))
        grid.draw(ctx, false)

        return startCell
    }

    /**
     * Function that handles the change in grid size as selected
     * by the drop-down menu
     */
    function gridSizeChange() {
        let sizeList = document.getElementById("gridSizeList")
        
        sizeList.onchange = function() {
            let tagContent = sizeList.options[sizeList.selectedIndex].innerHTML
            let size = parseInt(tagContent.substring(0, 2).trim())  // Remove spaces for single digit numbers
            gridSize = size
            cellSize = canvas.height / size

            grid = new Grid(gridSize, cellSize, canvas.height, canvas.width)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
    }

    /**
     * Function that handles the logic behind the play and stop buttons
     * in terms of switching sprites and handling the running behaviour of the
     * selected algorithm
     */
    function changeButton() {

        switch (buttonState) {

            case "PAUSED":
                buttonState = "PLAY"
                playbtn.style.backgroundImage = "url('../../public/img/Stop\ Icon.png')"
                Algorithms.playAlgorithm()
                break

            case "PLAY":
                buttonState = "PAUSED"
                playbtn.style.backgroundImage = "url('../../public/img/Play\ Icon.png')"
                Algorithms.stopAlgorithm()
                break

            case "FINISHED":
                buttonState = "PAUSED"
                playbtn.style.backgroundImage = "url('../../public/img/Play\ Icon.png')"
                Algorithms.stopAlgorithm()
                openMaze()
                break
        }
    }

    // wait for HTML to load
    document.addEventListener('DOMContentLoaded', init)

})()
