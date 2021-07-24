let modal = document.getElementById("saveModal")
let screenFilter = document.getElementById("screen-filter")
let btn = document.getElementById("savebtn")
let span = document.getElementsByClassName("close")[0]

export function handleSaveBtn() {

    btn.onclick = function() {
        modal.style.display = "block"
        screenFilter.style.display = "block"
    }

    span.onclick = function() {
        modal.style.display = "none"
        screenFilter.style.display = "none"
    }

    window.onclick = function(e) {
        if (e.target == modal) {
            modal.style.display = "none"
        }
    }

}