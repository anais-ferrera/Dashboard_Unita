document.querySelector("#Import-read-button").addEventListener('click', function() {
    let file = document.querySelector("#Import-input").files[0];
    let reader = new FileReader();
    reader.addEventListener('load', function(e) {
        let text = e.target.result;
        let json = JSON.parse(text);
        console.log({ "table": json });
        $.ajax({
            type: "POST",
            url: "/api/data_compatibility/import",
            data: { "table": json },
            success: document.location.reload()
        });
    });
    reader.readAsText(file);
});

function export_json() {
    $.get("/api/data_compatibility", (data) => {
        download(data, `data_compatibility_${Date.now()}`, 'application/json');
    });
}

function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}


function reset() {
    if ($('#resetCheck').is(":checked")) {
        $.ajax({
            url: '/api/data_compatibility',
            type: 'DELETE',
            success: function(response) {
                console.log(response);
                document.location.reload();
            }
        });
    } else {
        alert('Check the box before confirming the button')
    }

}