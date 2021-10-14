import { Grid } from './components/grid.js'
import { Algorithms } from './components/algorithms.js'

import { initToggle } from './components/toggle.js'

;import { Cell } from './components/cell.js';
(function() {

    let canvas, ctx, cellSize, gridSize, grid, container, playbtn
    let hover, click, rightClick, startCellActive, endCellActive, startCell, endCell
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
        defaultStartAndEnd(startCell, grid, endCell)

        // ************************************************

        // Implement grid size button functionality
        gridSizeChange()

        // Listen to key strokes
        listenKeyboard(canvas)

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
            let chosenAlgorithm = getSelectedAlgorithm()

            switch(chosenAlgorithm) {

                case "DFS":
                    Algorithms.depthFirstSearch(grid, update, playbtn, true, startCell, endCell)
                    break

                case "BFS":
                    Algorithms.breadthFirstSearch(grid, update, playbtn, true, startCell, endCell)
                    break

                case "A Star":
                    Algorithms.aStar(grid, update, playbtn, true, startCell, endCell)
                    break

                case "Dijkstra":
                    Algorithms.dijkstra(grid, update, playbtn, true, startCell, endCell)
                    break

            }
            
            if (buttonState == "PAUSED") {
                grid.clearAllWalls()
                update(false)
                defaultStartAndEnd(startCell, grid, endCell);
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

    /**
     * Function that listens to mouse movements to detect when it is hovering over one of the cells
     * in order to fill them in the hover colour.
     * @param {CanvasRenderingContext2D} ctx        The HTML5 canvas rendering context 
     * @param {HTMLCanvasElement} canvas            The HTML5 canvas element
     */
    function listenMouseHover(ctx, canvas) {

        canvas.onmousemove = async function(e) {

            if (!Algorithms.FINISHED && !Algorithms.RUN) {

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

                                if (click) {
                                    cell.clickCell()
                                } else if (rightClick) {
                                    cell.rightClickCell()
                                }

                                cell.colorCell(ctx)
                                break;
                        }
                        
                    }
                    if (hover)  break
                }

            }
        }

    }

    /**
     * Function that listens to mouse clicks to detect when it is clicking on one of the cells
     * in order to fill them in the click colour and turn them into a wall.
     * @param {CanvasRenderingContext2D} ctx        The HTML5 canvas rendering context 
     * @param {HTMLCanvasElement} canvas            The HTML5 canvas element
     */
    function listenMouseClick(ctx, canvas) {

        canvas.onmousedown = async function(e) {

            let r = canvas.getBoundingClientRect()
            let x = e.clientX - r.left
            let y = e.clientY - r.top

            click = false
            rightClick = false

            for (let row = 0; row < grid.getLength()["y"]; row++) {
                for (let col = 0; col < grid.getLength()["x"]; col++) {

                    let cell = grid.getCell(row, col)

                    if (x >= cell.x && x <= cell.x + cell.size &&
                        y >= cell.y && y <= cell.y + cell.size) {

                            // If LMB, add wall
                            if (e.button == 0) {

                                if (startCellActive) {
                                    grid.changeStartCell(cell)
                                    startCell = cell
                                } else if (endCellActive) {
                                    grid.changeEndCell(cell)
                                    endCell = cell
                                } else {
                                    cell.clickCell()
                                }

                                click = true
                                cell.colorCell(ctx)
                                break
                            } 
                            // If RMB, delete wall
                            else if (e.button == 2) {
                                cell.rightClickCell()
                                rightClick = true
                                cell.colorCell(ctx)
                                break
                            }
                    }
                    
                }
                if (click || rightClick) break
            }

        }

        canvas.onmouseup = function() {
            click = false
            rightClick = false
        }

    }

    /**
     * Function that listens to key strokes and updates the light indicators accordingly
     * @param {HTMLCanvasElement} canvas            The HTML5 canvas element
     */
    function listenKeyboard(canvas) {

        let startCellIndicator = document.getElementById('startCellLight')
        let endCellIndicator = document.getElementById('endCellLight')

        window.addEventListener('keydown', (e) => {

            if (e.key == "s") {
                if (!startCellActive) {
                    startCellIndicator.style.backgroundColor = '#FEBA35'
                    startCellActive = true
                }
                else {
                    startCellIndicator.style.backgroundColor = 'transparent'
                    startCellActive = false
                }

                endCellIndicator.style.backgroundColor = 'transparent'
                endCellActive = false
            }

            if (e.key == "e") {
                if (!endCellActive) {
                    endCellIndicator.style.backgroundColor = '#FEBA35'
                    endCellActive = true
                }
                else {
                    endCellIndicator.style.backgroundColor = 'transparent'
                    endCellActive = false
                }

                startCellIndicator.style.backgroundColor = 'transparent'
                startCellActive = false
            }

        }, false)
    }

    /**
     * Function that runs the appropriate algoritm based on which one is selected
     * in the dropdown menu
     */
    function getSelectedAlgorithm() {
        let algorithmList = document.getElementById("algorithmBtnList");
        let chosenAlgorithm = algorithmList.options[0];  // Chosen algorithm is first algorithm by default

        algorithmList.onchange = function() {
            let option = algorithmList.options[algorithmList.selectedIndex].innerHTML.trim()

            let chosenAlgorithm = option
            return chosenAlgorithm
        }

        chosenAlgorithm = algorithmList.onchange()

        return chosenAlgorithm
    
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
            grid.clearAllWalls()
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            defaultStartAndEnd(startCell, grid, endCell)
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
                Algorithms.FINISHED = false
                break
        }
    }

    /**
     * Function that resets the starting and ending cell of the maze to the top left and
     * bottom right corner respectively and then returns them
     * @param {Cell} startCell          The start cell of the maze
     * @param {Grid} grid               The Grid object modelling the maze
     * @param {Cell} endCell            The ending cell of the maze
     * @returns Start and End cells for the maze
     */
    function defaultStartAndEnd(startCell, grid, endCell) {
        startCell = grid.getCell(0, 0);
        startCell.startCell = true;
        endCell = grid.getCell(grid.getLength()["x"] - 1, grid.getLength()["y"] - 1);
        endCell.endCell = true;
    }

    // wait for HTML to load
    document.addEventListener('DOMContentLoaded', init)

})()

