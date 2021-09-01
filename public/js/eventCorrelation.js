
var count = 1;
// get data from restfull API (course)
$.getJSON( "/api/data_table_courses", function( data ) {
    let items = [];
    $.each( data, function( key, val ) {
        items.push( `<option value='${val.Program}-${val.University}'/>` );
    });
    // 1: we create a dataset, it allows to filter and remove duplicates
    const uniqueSet = new Set(items);
    // 2: we convert to an array using the spread operator
    const backToArray = [...uniqueSet];
    // 3: add this array to the html forms
    $( "#program1" ).html(backToArray);
});

// event --> click 
$("#submitCorrelation").click(function() {
    submitCorrelation();
    // add html the to bottom part
    const mobility = `
    <div class="box arrow-right bg-success">
        <b>Semester 1</b>
            <br></br>
        <div> Program : <b>${$('#prog1').val()}</b></div>
    </div>
    `;
    $("#mobility1").html(mobility);
    count = 1;
});

function submitCorrelation(){
    // get value selected
    let submitvalue = $('#prog1').val();
    // get data from restfull API (compatibility)
    $.getJSON( "/api/data_compatibility", function( data ) {
        let items = [];
        // sort by compatibility the most relevant
        data = data.sort((a, b) => (a.compatibility > b.compatibility ? -1 : +1));
        // browse the table
        items.push( `
            <tr><td>
                <div class="bg-success chart-wrapper">
                    <div class="chart-stage">
                        <h3>${submitvalue}</h3>
                        <div id="Correlation"> Correlation : <b>&#11088;&#11088;&#11088;&#11088;&#11088;</b></div>
                        <div id="Program1">Program1 : <b>${submitvalue}</b></div>
                        <div id="Program2">Program2 : <b>${submitvalue}</b></div>
                        <div>Comment: <b>null</b></div>
                        <br>
                        <button name="${submitvalue}" onclick="addProgram('${submitvalue}','bg-success')" class="btn btn-warning">Add this program</button>
                    </div>
                </div>
            </td></tr>
            ` );
        $.each( data, function( key, val ) {
            if ( submitvalue == val.program2 ||   submitvalue == val.program1) {
                // using for the number of star
                let compatibility = ''
                // title of the new section
                let title = '';
                // change color according to compatibility
                let color = '';
                if (val.compatibility){
                    
                    //compatibility += '&#11088;';
                    for (let step = 1; step <= val.compatibility; step++) {
                        compatibility += '&#11088;';
                    }
                    if (val.compatibility<3){
                        color = 'bg-warning';
                    }else{
                        color = 'bg-success';
                    }
                }else{
                    compatibility = '0';
                    color = 'bg-danger';
                }
                if (submitvalue == val.program2) {
                    title = val.program1;
                }else{
                    title = val.program2;
                }
                // add html section
                items.push( `
                <tr><td>
                    <div class="${color} chart-wrapper">
                        <div class="chart-stage">
                            <h3>${title}</h3>
                            <div id="Correlation"> Correlation : <b>${compatibility}</b></div>
                            <div id="Program1">Program1 : <b>${val.program1}</b></div>
                            <div id="Program2">Program2 : <b>${val.program2}</b></div>
                            <div id="Comment">Comment: <b>${val.comment}</b></div>
                            <br>
                            <button name="${title}" onclick="addProgram('${title}','${color}')" class="btn btn-warning">Add this program</button>
                        </div>
                    </div>
                </td></tr>
                ` );
            }
        });
        $("#compatibility").html(items);
    });
}

function addProgram(id,color) {
    count = count + 1;
    if (count < 7) {
        const semesterFollowing = `
            <div class="box arrow-right ${color}">
                <b>Semester ${count}</b>
                <br></br>
                <div> Program : <b>${id}</b></div>
            </div>
        `;
        $(`#mobility1`).append(semesterFollowing);
        $('#prog1').val(id);
        submitCorrelation();
    }else{
        window.alert("Too many semester");
    }
    
}

function reset(){
    const reset = `
    <div class="box arrow-right bg-success">
        <b>Semester 1</b>
           <br></br>
        <div> Program : <b>null</b></div>
    </div>
    `;
    $("#mobility1").html(reset);
    count = 1;
}

function save(){
    var doc = new jsPDF();

    doc.text(20, 20, 'Hello !');
    doc.text(20, 30, 'Here you will find your mobility :');
    doc.fromHTML($("#mobility1").html(),20,40);
    // Save the PDF
    doc.save('mobilitySemester.pdf');

    console.log('Doc is saving...')
}