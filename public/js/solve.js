import { Grid } from './components/grid.js'
import { Algorithms } from './components/algorithms.js'

import { initToggle } from './components/toggle.js'
import { handleLoadBtn } from './components/load-btn.js'

let canvas, ctx, cellSize, gridSize, grid, container, playbtn
let buttonState = "PAUSED"

export function setGrid(maze) {
    grid = maze
    initToggle("solve")
}

export function getGrid() {
    return grid
}

;(function() {

    /**
     * Function for intial setup of config variables
     */
    function init() {
        canvas = document.getElementById('monitor-canvas')
        container = document.querySelector('#canvas-container')
        ctx = canvas.getContext('2d')

        container.width = innerWidth * 0.9 * 0.5
        container.height = innerHeight * 0.7 * 0.6

        ctx.canvas.height = container.height;
        ctx.canvas.width = canvas.height;

        // Add randomize grid button functionality
        randomizeGrid()

        // Implement toggle functionality
        initToggle("solve")

        // Implement save button functionality
        handleLoadBtn(canvas, update)
        
        // Implement play button functionality
        playbtn = document.getElementById("playbtn");

        playbtn.addEventListener("click", e => {

            // If there is a grid loaded
            if (grid) {
                // Choose appropriate algorithm and play animation
                changeButton()
                let chosenAlgorithm = getSelectedAlgorithm()

                switch (chosenAlgorithm) {

                    case "01":
                        Algorithms.depthFirstSearch(grid, update, playbtn, buttonState)
                        buttonState = "FINISHED"
                        break

                    case "02":
                        console.log("Placeholder 2")
                        break

                }
                
                if (buttonState == "FINISHED") {
                    //setGrid(null)
                }
            }
            else {
                alert("No grid loaded!")
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
     * Function that generates a random grid using the algorithms
     * present in the generate screen
     */
    function randomizeGrid() {
        let randBtn = document.getElementById("randomize-btn")
        let possibleGridSizes = [5, 10, 15, 20, 25, 30]
        
        randBtn.addEventListener("click", () => {
            
            let randGridSize = possibleGridSizes[Math.floor(Math.random() * possibleGridSizes.length)]
            let randCellSize = canvas.height / randGridSize

            let maze = new Grid(randGridSize, randCellSize, canvas.height, canvas.width)
            setGrid(maze)

            update(false)
            Algorithms.playAlgorithm()
            Algorithms.randomizedPrim(grid, update, true)
            Algorithms.restart(playbtn)
            buttonState = "PAUSED"
        })
    }

    /**
     * Function that runs the appropriate algoritm based on which one is selected
     * in the dropdown menu
     */
    function getSelectedAlgorithm() {
        let algorithmList = document.getElementById("algorithmList");
        let chosenAlgorithm;

        algorithmList.onchange = function() {
            let tagContent = algorithmList.options[algorithmList.selectedIndex].innerHTML
            let option = tagContent.substring(0, 2).trim()

            let chosenAlgorithm = option
            return chosenAlgorithm
        }

        chosenAlgorithm = algorithmList.onchange()

        return chosenAlgorithm
    
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
                setGrid(null)
                break

            case "FINISHED":
                buttonState = "PAUSED"
                playbtn.style.backgroundImage = "url('../../public/img/Play\ Icon.png')"
                Algorithms.stopAlgorithm()
                ctx.clearRect(0, 0, grid.totalWidth, grid.totalHeight)  // If stopped, clear grid
                setGrid(null)
                break
        }
    }

    // wait for HTML to load
    document.addEventListener('DOMContentLoaded', init)

})()
