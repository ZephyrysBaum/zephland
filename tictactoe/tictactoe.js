window.onload = function () {

    let game = [];

    for (let i = 0; i < 3; i++) {
        var div = document.createElement('div')
        div.id = "" + i;
        div.className = "row";
        document.getElementById("game").appendChild(div)
        for (let j = 0; j < 3; j++) {
            var div = document.createElement('div')
            div.id = "" + i + j;
            div.className = "column";
            document.getElementById("" + i).appendChild(div)
            for (let k = 0; k < 3; k++) {
                var div = document.createElement('div')
                div.id = "" + i + j + k;
                div.className = "square";
                document.getElementById("" + i + j).appendChild(div)
                for (let l = 0; l < 3; l++) {
                    var div = document.createElement('div')
                    div.id = "" + i + j + k + l;
                    div.className = "square";
                    div.textContent = "."
                    document.getElementById("" + i + j + k).appendChild(div)
                }
            }
        }
    }
};