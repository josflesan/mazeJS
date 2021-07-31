import { initToggle } from './components/toggle.js'

;(function() {

    /**
     * Function for intial setup of config variables
     */
    function init() {
        let container = document.querySelector('.fullscreen-canvas-container')

        // Implement toggle functionality
        initToggle("build")
        
        // Implement play button functionality
        playbtn = document.getElementById("playbtn");

    }

    // wait for HTML to load
    document.addEventListener('DOMContentLoaded', init)

})()
    