let cells = document.querySelectorAll("#board input")
let Solutions = []
let current = 0

/*
** Board Class
*/
class Board {
    constructor(board) {
        this.board = board
    }

    show() {
        for (let i = 0; i < 81; i++) {
            cells[i].value = this.board[i]
        }
    }
}

/*
** Solve | Unsolve Button
*/
function solve() {
    /*
    ** If All Values Exist [make Unsolve]
    */
    if (makeBoard()[0] == true) {
        for (let i = 0; i < 81; i++) {
            if (cells[i].classList.contains("blue")) {
                cells[i].value = ""
                cells[i].classList.remove("blue")
            }
        }
        Solutions = []
        currentSolution(0, 0)
        document.querySelector("#solve").value = "Solve"
    }
    /*
    ** If Some Value not Exist [make Solve]
    */
    else {
        for (let i = 0; i < 81; i++) {
            if (cells[i].value == "") {
                cells[i].classList.add("blue")
            }
        }
        Solutions = []
        let xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let results = JSON.parse(this.response)
                if (results.length != 0) {
                    for (let i = 0, len = results.length; i < len; i++) {
                        Solutions.push(new Board(results[i]))
                    }
                    Solutions[0].show()
                    currentSolution(0, Solutions.length)
                    document.querySelector("#solve").value = "Unsolve"
                } else {
                    console.log("Check your Input")
                    alert("Check your Input")
                    document.querySelector("#solve").value = "Solve"
                }
            }
        }
        xhttp.open("POST", "/", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("board=" + makeBoard()[1])
        document.querySelector("#solve").value = "Solving..."
    }
}

/*
** Reset Button
*/
function reset() {
    for (let i = 0; i < 81; i++) {
        cells[i].value = ""
        cells[i].classList.remove("blue")
    }
    currentSolution(0, 0)
    document.querySelector("#solve").value = "Solve"
}

/*
** Show Previous Solution
*/
document.querySelector("#prev").addEventListener("click", function (event) {
    if (current == 0) {
        current = (Solutions.length - 1)
    } else {
        current--
    }
    Solutions[current].show()
    currentSolution(current, Solutions.length)
})

/*
** Show Next Solution
*/
document.querySelector("#next").addEventListener("click", function (event) {
    if (current == (Solutions.length - 1)) {
        current = 0
    } else {
        current++
    }
    Solutions[current].show()
    currentSolution(current, Solutions.length)
})

/*
** Camera Module Control
*/
const player = document.querySelector('#camera-player');
const capBtn = document.querySelector('#camera-capture');
const canvas = document.createElement("canvas")
const context = canvas.getContext('2d');
const constraints = {
    video: true,
};
let height, width
document.querySelector("#camera-open").addEventListener("click", function (event) {
    // Attach the video stream to the video element and autoplay.
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            player.srcObject = stream;
            width = stream.getVideoTracks()[0].getSettings().width
            height = stream.getVideoTracks()[0].getSettings().height
            // Set Canvas Width and Height
            canvas.width = width
            canvas.height = height
        });
})

capBtn.addEventListener('click', function (event) {
    // Draw the video frame to the canvas.
    context.drawImage(player, 0, 0, canvas.width, canvas.height);
    const imgData = context.getImageData(0, 0, width, height).data

    // Hold Recorder
    player.pause()

    // Send THe photo to the server
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let results = JSON.parse(this.response)
            console.log(this.response)
            let result = JSON.parse(this.response)
            for (let i = 0; i < 81; i++) {
                if (result[i] != 0) {
                    cells[i].value = result[i]
                }
            }
            // Destroy Stream and close modal
            event.target.innerHTML = "Capture"
            $("#camera-modal").modal("hide")

            const tracks = player.srcObject.getTracks();
            tracks.forEach(function (track) {
                track.stop();
            });
            // player.srcObject = null
        }
    }
    xhttp.open("POST", "/img", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("img=" + JSON.stringify(Object.values(imgData)) + "&width=" + width + "&height=" + height)

    // Change Button to Processing
    event.target.innerHTML = `<div class="spinner-border spinner-border-sm"></div> Processing`
});

/*
** Make Board and userInput
*/
function makeBoard() {
    let board = []
    let solved = true
    for (let i = 0, len = cells.length; i < len; i++) {
        if (cells[i].value == "") {
            board[i] = ""
            solved = false
        } else {
            board[i] = parseInt(cells[i].value)
        }
    }
    return [solved, JSON.stringify(board)]
}

/*
** Show Current Solution
*/
function currentSolution(i, len) {
    if (len != 0) {
        i++;
    }
    if (len > 1) {
        document.querySelector("#prev").style.display = "inline-block"
        document.querySelector("#next").style.display = "inline-block"
    }
    else {
        document.querySelector("#prev").style.display = "none"
        document.querySelector("#next").style.display = "none"
    }
    document.querySelector("#num").innerHTML = i + " of " + len
}
