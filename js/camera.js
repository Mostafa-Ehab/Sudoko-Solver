document.addEventListener("DOMContentLoaded", () => {
    /*
    ** Camera Module Control
    */
    const player = document.querySelector('#camera-player');
    const capBtn = document.querySelector('#camera-capture');
    const canvas = document.createElement("canvas")
    const context = canvas.getContext('2d');
    const constraints = {
        video: {
            facingMode: 'environment'
        }
    }
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

        fetch("https://sudoku-api.mostafa-ehab.com/img", {
            method: "POST",
            headers: {
                // "Content-Type": "application/json"
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `img=${JSON.stringify(Object.values(imgData))}&width=${width}&height=${height}`
        }).then(
            res => res.json()
        ).then(
            result => {
                for (let i = 0; i < 81; i++) {
                    if (result[i] != 0) {
                        cells[i].value = result[i]
                    }
                }
                // Destroy Stream and close modal
                event.target.innerHTML = "Capture"
                document.querySelector("#camera-modal").classList.remove("active")

                const tracks = player.srcObject.getTracks();
                tracks.forEach(function (track) {
                    track.stop();
                });
            }
        ).catch(
            err => {
                console.log(err)
                // Destroy Stream and close modal
                event.target.innerHTML = "Capture"
                document.querySelector("#camera-modal").classList.remove("active")
                const tracks = player.srcObject.getTracks();
                tracks.forEach(function (track) {
                    track.stop();
                });

                showError("Couldn't analyze the image")
            }
        )

        // Change Button to Processing
        event.target.innerHTML = `<div class="spinner-border spinner-border-sm"></div> Processing`
    })

    // Set Modal Control
    let modal = document.querySelector("#camera-modal")
    document.querySelector("#camera-open").addEventListener("click", function () {
        modal.classList.add("active")
    })

    modal.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.classList.remove("active")
            // Destroy Stream and close modal
            event.target.innerHTML = "Capture"
            document.querySelector("#camera-modal").classList.remove("active")

            const tracks = player.srcObject.getTracks();
            tracks.forEach(function (track) {
                track.stop();
            });
        }
    })
})