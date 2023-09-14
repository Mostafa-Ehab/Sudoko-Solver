document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#file-upload").addEventListener("change", (e) => {
        var data = new FormData()
        data.append("img", document.querySelector("#file-upload").files[0])

        fetch("https://sudoku-api.mostafa-ehab.com/img", {
            // fetch("http://127.0.0.1:5000/file", {
            method: "POST",
            body: data
        }).then(
            res => res.json()
        ).then(
            result => {
                for (let i = 0; i < 81; i++) {
                    if (result[i] != 0) {
                        cells[i].value = result[i]
                    }
                }
                document.querySelector("#upload-label").innerHTML = '<i class="fa-solid fa-upload"></i>'
            }
        ).catch(
            err => {
                console.log(err)
                showError("Couldn't analyze the image")
                document.querySelector("#upload-label").innerHTML = '<i class="fa-solid fa-upload"></i>'
            }
        )

        document.querySelector("#upload-label").innerHTML = `<span class="loader"></span>`
    })
})