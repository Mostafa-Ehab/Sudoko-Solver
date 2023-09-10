document.addEventListener("DOMContentLoaded", () => {
    /*
** Change Theme
*/
    let themes = {
        "light": ["#fff", "#000", "#00f"],
        "dark": ["#333533", "#fff", "#f00"]
    }
    let theme = "light"


    document.querySelector(".theme").addEventListener("click", function () {
        theme = (theme == "dark") ? "light" : "dark"
        console.log(theme)
        document.documentElement.style.setProperty("--bg-color", themes[theme][0])
        document.documentElement.style.setProperty("--main-color", themes[theme][1])
        document.documentElement.style.setProperty("--alt-color", themes[theme][2])
    })
})