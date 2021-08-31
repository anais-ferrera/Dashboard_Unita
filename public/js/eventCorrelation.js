
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
    // get value selected
    let submitvalue = $('#prog1').val();
    // get data from restfull API (compatibility)
    $.getJSON( "/api/data_compatibility", function( data ) {
        let items = [];
        // sort by compatibility the most relevant
        data = data.sort((a, b) => (a.compatibility > b.compatibility ? -1 : +1));
        // browse the table
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
                    <div class="${color} chart-wrapper" style='width:500px;height:200px'>
                        <div class="chart-stage">
                            <h3>${title}</h3>
                            <div id="Correlation"> Correlation : <b>${compatibility}</b></div>
                            <div id="Program1">Program1 : <b>${val.program1}</b></div>
                            <div id="Program2">Program2 : <b>${val.program2}</b></div>
                            <div id="Comment">Comment: <b>${val.comment}</b></div>
                        </div>
                    </div>
                </tr></td>
                ` );
            }
        });
        $("#compatibility").html(items);
    });
});