// Implementation of ripple effect

function createRipple(event) {

    const tile = event.currentTarget

    const viewportHeight = document.documentElement.clientHeight;

    const circle = document.createElement("span")
    const diameter = Math.max(tile.clientWidth, tile.clientHeight)
    const radius = diameter / 2

    const ripple = tile.getElementsByClassName("ripple")[0]

    if (ripple) {
        ripple.remove()
    }

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (tile.offsetLeft + radius)}px`
    circle.style.top = `${event.clientY - (tile.offsetTop + radius) + viewportHeight}px`
    circle.classList.add("ripple");

    console.log({
        "Offset Top": tile.offsetTop,
        "X": event.clientX,
        "Y": event.clientY
    })

    tile.appendChild(circle)

}

const tiles = document.getElementsByClassName("menu-item")
for (const tile of tiles) {
    tile.addEventListener("click", createRipple)
}