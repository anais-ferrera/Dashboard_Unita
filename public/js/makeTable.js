var q = d3.queue()
.defer(d3.json, "/api/data")
.defer(d3.json, "/api/data_sunUniv")
.defer(d3.json, "/api/data_table_courses")
.defer(makeTable)
.defer(makeSunThematic)
.defer(makeSunUniv);

q.awaitAll(function(error){
  if (error) throw error;
  makeTable;
  makeSunThematic;
 makeSunUniv;
  
})
  
function makeTable() {

        
  var data, sort_by, filter_cols; // Customizable variables
  
  var table; // A reference to the main DataTable object
  
  // This is a custom event dispatcher.
  var dispatcher = d3.dispatch('highlight', 'select');
  
  // Main function, where the actual plotting takes place.
  function _table(targetDiv) {
  // Create and select table skeleton
  var tableSelect = targetDiv.append("table")
      .attr("class", "display compact")
          // Generally, hard-coding Ids is wrong, because then 
          // you can't have 2 table plots in one page (both will have the same id).
          // I will leave it for now for simplicity. TODO: remove hard-coded id.
      .attr("id", "courses_table") 
      .style("visibility", "hidden"); // Hide table until style loads;
          
  // Set column names
  var colnames = Object.keys(data[0]);
      if(typeof filter_cols !== 'undefined'){
          // If we have filtered cols, remove them.
          colnames = colnames.filter(function (e) {
              // An index of -1 indicate an element is not in the array.
              // If the col_name can't be found in the filter_col array, retain it.
              return filter_cols.indexOf(e) < 0;
          });
      }
      
      // Here I initialize the table and head only. 
      // I will let DataTables handle the table body.
  var headSelect = tableSelect.append("thead");
  headSelect.append("tr")
      .selectAll('th')
      .data(colnames).enter()
          .append('th')
          .html(function(d) { return d; });
          
  //Append column Action to add a button
/* headSelect.selectAll("tr")
  .append('th')
  .attr("class", "button")
  .text('');  */ 
  headSelect.selectAll("tr")
  .append('th')
  .attr("class", "plus")
  .text(''); 

      if(typeof sort_by !== 'undefined'){
          // if we have a sort_by column, format it according to datatables.
          sort_by[0] = colnames.indexOf(sort_by[0]); //colname to col idx
          sort_by = [sort_by]; //wrap it in an array
      }
     
     
  // Apply DataTable formatting: https://www.datatables.net/
  $(document).ready(function() {
      var dragSrcRow = null;  // Keep track of the source row
      var srcTable = '';  // Global tracking of table being dragged for 'over' class setting
      var rows = [];   // Global rows for #example
      var rows2 = [];  // Global rows for #example2
      $.extend( $.fn.dataTable.defaults, {
        responsive: true,
        
    } );
      table = $('#courses_table').DataTable({
          
              // Here, I am supplying DataTable with the data to fill the table.
              // This is more efficient than supplying an already contructed table.
              // Refer to http://datatables.net/manual/data#Objects for details.
       // responsive:true,
      data: data,
      
      columns: colnames.map(function(e) { return {data: e}; }),
       
      //"bLengthChange": false, // Disable page size change
      "bDeferRender": true,
      "order": [[ 1, "asc" ]],
  //});
    //  $('#courses_table').DataTable({
     
      /* 'select': {
         'style': 'multi' 
      }, */
      // Add HTML5 draggable class to each row
  createdRow: function ( row, data, dataIndex, cells ) {
  
    $(row).attr('draggable', 'true');
   // 
  //$(row).add('tr td.details-control');
},

drawCallback: function () {
  // Add HTML5 draggable event listeners to each row
  rows = document.querySelectorAll('#courses_table tbody tr');
    [].forEach.call(rows, function(row) {
      row.addEventListener('dragstart', handleDragStart, false);
      row.addEventListener('dragenter', handleDragEnter, false)
      row.addEventListener('dragover', handleDragOver, false);
      row.addEventListener('dragleave', handleDragLeave, false);
      row.addEventListener('drop', handleDrop, false);
      row.addEventListener('dragend', handleDragEnd, false);
    });
}
      });
          
      tableSelect.style("visibility", "visible");
        

    dataTable = $("#table_target").DataTable({
        //data : null,
        //responsive:true,
        columns: colnames.map(function(e) { return {data: e}; }),
        
        "bFilter": false,
        "language":{
            "zeroRecords":"Drag the courses from the table with all the courses"
        },
       dom: 'Bfrtip',
        buttons: [{
          
          exportOptions: {
            stripHtml: false
          },
            extend: 'pdfHtml5',
            text: 'Save courses (PDF)',
            title:"Courses' choice",
            
            customize: function (doc) {
              for (var row = 1; row < doc.content[1].table.body.length; row++) {
                if(doc.content[1].table.body[row][7].text.match(/\bhttps?:\/\/\S+/gi)){
                  doc.content[1].table.body[row][7] = {text: 'Link',link:doc.content[1].table.body[row][7].text.match(/\bhttps?:\/\/\S+/gi), style: {decoration: 'underline'},fillColor:"#f3f3f3"};
                }
               }
          }
        }],
        
       // "order": [[ 1, "asc" ]],
       // Add HTML5 draggable class to each row
    createdRow: function ( row, data, dataIndex, cells ) {
        $(row).attr('draggable', 'true');
      },
  
      drawCallback: function () {
       
        // Add HTML5 draggable event listeners to each row
        rows2 = document.querySelectorAll('#table_target tbody tr');
          [].forEach.call(rows2, function(row) {
            row.addEventListener('dragstart', handleDragStart, false);
            row.addEventListener('dragenter', handleDragEnter, false)
            row.addEventListener('dragover', handleDragOver, false);
            row.addEventListener('dragleave', handleDragLeave, false);
            row.addEventListener('drop', handleDrop, false);
            row.addEventListener('dragend', handleDragEnd, false);
          });
      }, 
      "footerCallback": function ( row, data, start, end, display ) {
        var api = this.api(), data;

        // Remove the formatting to get integer data for summation
        var intVal = function ( i ) {
            return typeof i === 'string' ?
                i.replace(/[\$,]/g, '')*1 :
                typeof i === 'number' ?
                    i : 0;
        };

        // Total over all pages
        total = api
            .column( 4 )
            .data()
            .reduce( function (a, b) {
                return intVal(a) + intVal(b);
            }, 0 );

        // Update footer
        $( api.column( 4 ).footer() ).html(
            'Total of ECTS : ' +total 
        );
    }
    });
    
   
    function handleDragStart(e) {
               
        // Keep track globally of the source row and source table id
        dragSrcRow = this;
        srcTable = this.parentNode.parentNode.id
      
        // Allow moves
        e.dataTransfer.effectAllowed = 'move';
        // Save the source row html as text
        e.dataTransfer.setData('text/plain', e.target.outerHTML);
        
      }
        
      function handleDragOver(e) {
        if (e.preventDefault) {
          e.preventDefault(); // Necessary. Allows us to drop.
        }
      
        // Allow moves
        e.dataTransfer.dropEffect = 'move'; 
      
        return false;
      }
      
      function handleDragEnter(e) {
        // this / e.target is the current hover target.  
        
        // Get current table id
        var currentTable = this.parentNode.parentNode.id
        
        // Don't show drop zone if in source table
        if (currentTable !== srcTable) {
          this.classList.add('over');
        }
      }
      
      function handleDragLeave(e) {
        // this / e.target is previous target element.
        
        // Remove the drop zone when leaving element
        this.classList.remove('over');  
      }
        
      function handleDrop(e) {
        // this / e.target is current target element.
      
        if (e.stopPropagation) {
          e.stopPropagation(); // stops the browser from redirecting.
        }
      
        // Get destination table id, row
        var dstTable = $(this.closest('table')).attr('id');
        var dstRow = $(this).closest('tr');
      
        // No need to process if src and dst table are the same
        if (srcTable !== dstTable) {
        
          // Get source transfer data
          var srcData = e.dataTransfer.getData('text/plain');
      
          // Add row to destination Datatable
          $('#' + dstTable).DataTable().row.add($(srcData)).draw();
      
          // Remove ro from source Datatable
          $('#' + srcTable).DataTable().row(dragSrcRow).remove().draw();
      
        }
        return false;
      }
      
      function handleDragEnd(e) {
        // this/e.target is the source node.
        
        // Reset the opacity of the source row
        this.style.opacity = '1.0';
      
        // Clear 'over' class from both tables
        // and reset opacity
        [].forEach.call(rows, function (row) {
          row.classList.remove('over');
          row.style.opacity = '1.0';
        });
      
        [].forEach.call(rows2, function (row) {
          row.classList.remove('over');
          row.style.opacity = '1.0';
        });
      }
   
    }); 
                  
    
                    }

                    
        /**** Setter / getters functions to customize the table plot *****/
        _table.datum = function(_){
        if (!arguments.length) {return data;}
        data = _;
        
        return _table;
        };
        _table.filterCols = function(_){
        if (!arguments.length) {return filter_cols;}
        filter_cols = _;
        
        return _table;
        };
        _table.sortBy = function(colname, ascending){
        if (!arguments.length) {return sort_by;}
        
            sort_by = [];
            sort_by[0] = colname;
            //sort_by[1] = ascending ? 'asc': 'desc';
        
        return _table;
        };
        
                // Copies a variable number of methods from source to target.
        d3.rebind = function(target, source) {
            var i = 1, n = arguments.length, method;
            while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
            return target;
        };
        
        // Method is assumed to be a standard D3 getter-setter:
        // If passed with no arguments, gets the value.
        // If passed with arguments, sets the value and returns the target.
        function d3_rebind(target, source, method) {
            return function() {
            var value = method.apply(source, arguments);
            return value === source ? target : value;
            };
        }
        
        // This allows other objects to 'listen' to events dispatched by the _table object.
        d3.rebind(_table, dispatcher, 'on');
        
        // This is the return of the main function 'makeTable'
        return _table;
    
  }

  


 $(document).ready(function(){
 
 $(".div_content").hide();
  //unhides first option content
  //$("#DivContent:first").show(); 
  $("#thematic").show(); 
  
  //listen to dropdown for change
  $("#sunburst").change(function(){
    //rehide content on change
    $('.div_content').hide();
    //unhides current item
    $('#'+$(this).val()).show();
  });
  
}); 

function makeSunThematic() {
  
const width = window.innerWidth,
height = window.innerHeight,
maxRadius = (Math.min(width, height) / 2) - 5; //modif 2 et 5 = taille


const formatNumber = d3.format(',d');

const x = d3.scaleLinear()
.range([0, 2 * Math.PI])
.clamp(true);

const y = d3.scaleSqrt()
.range([maxRadius*0.1, maxRadius]); //modif 0.1 = taille du centre pour faire retour

const color = d3.scaleOrdinal().range(["white","#F1E268" ,"#B7AFE7","#6FCF8C","#FB9981","#5FBFD8"]);
const partition = d3.partition();

const arc = d3.arc()
.startAngle(d => x(d.x0))
.endAngle(d => x(d.x1))
.innerRadius(d => Math.max(0, y(d.y0))) //les 0 c'est pour que le retour soit un cran avant
.outerRadius(d => Math.max(0, y(d.y1)));// et pas au tout au début

const middleArcLine = d => {
const halfPi = Math.PI/2;
const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

const middleAngle = (angles[1] + angles[0]) / 2;
const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
if (invertDirection) { angles.reverse(); }

const path = d3.path();
path.arc(0, 0, r, angles[0], angles[1], invertDirection);
return path.toString();
};

const textFits = d => {
const CHAR_SPACE = 6;

const deltaAngle = x(d.x1) - x(d.x0);
const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
const perimeter = r * deltaAngle ;

return d.data.name.length * CHAR_SPACE < perimeter;
};

// Append Div for tooltip to SVG5
var div2 = d3.select("#thematic")
.append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const svg = d3.select('#thematic').append('svg')
.style('width'/2, '75vw')
.style('height'/2, '75vh')
.attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
.on('click', () => focusOn()) // Reset zoom on canvas click  

d3.json("/api/data", (error, root) => {
if (error) throw error;

root = d3.hierarchy(root);
root.sum(d => d.ECTS);

const slice = svg.selectAll('g.slice')
  .data(partition(root).descendants());

slice.exit().remove();

const newSlice = slice.enter()
  .append('g').attr('class', 'slice')
  .on('click', d => {
      
      d3.event.stopPropagation();
      focusOn(d);
      var program_filter = (d.depth === 4) ? d.data.name : null;
      return console.log(program_filter);
  })


/// mouseover
.on("mouseover", function (d) {
  div2.transition()
      .style("display", (d.depth === 0) ? 'none' : 'block' )
      .duration(500)
      .style("opacity", 1);
      div2.html(" <p> "+d.data.name+"</p>")
})

.on('mouseout', function() { // when mouse leaves div                        
  div2.style('display', 'none'); // hide tooltip for that element
})
.on('mousemove', function(d) { // when mouse moves                  
  div2.style('top', (d3.event.pageY -80) + 'px') // always 10px below the cursor
 .style('left', (d3.event.pageX ) + 'px'); // always 10px to the right of the mouse
})  


newSlice.append('path')
  .attr('class', 'main-arc')
  //.style('fill', d => color((d.children ? d : d.parent).data.name))
  .style("fill", d => { while (d.depth > 2) d = d.parent; return color(d.data.name); })
  .style("fill-opacity", function(d) { return (d.depth === 3) ? 0.6 : 1; })
  .attr("opacity",d =>  (d.children ? d : 0.3))
  .attr('d', arc);

newSlice.append('path')
  .attr('class', 'hidden-arc')
  .attr('id', (_, i) => `hiddenArc${i}`)
  .attr('d', middleArcLine);

const text = newSlice.append('text')
  .attr('display', d => textFits(d) ? null : 'none');

text.append('textPath')
  .attr('startOffset','50%')
  .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
  .text(d => d.data.name);
});

function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
// Reset to top-level if no data point specified

const transition = svg.transition()
  .duration(750)
  .tween('scale', () => {
      const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
          yd = d3.interpolate(y.domain(), [d.y0, 1]);
      return t => { x.domain(xd(t)); y.domain(yd(t)); };
  });

transition.selectAll('path.main-arc')
  .attrTween('d', d => () => arc(d));

transition.selectAll('path.hidden-arc')
  .attrTween('d', d => () => middleArcLine(d));

transition.selectAll('text')
  .attrTween('display', d => () => textFits(d) ? null : 'none');

moveStackToFront(d);

//

function moveStackToFront(elD) {
  svg.selectAll('.slice').filter(d => d === elD)
      .each(function(d) {
          this.parentNode.appendChild(this);
          if (d.parent) { moveStackToFront(d.parent); }
      })
}
}                    
} 
function makeSunUniv() {

  const widthUniv = window.innerWidth,
  heightUniv = window.innerHeight,
  maxRadiusUniv = (Math.min(widthUniv, heightUniv) / 2) - 5; //modif 2 et 5 = taille
  
  
  const formatNumber = d3.format(',d');
  
  const xUniv = d3.scaleLinear()
  .range([0, 2 * Math.PI])
  .clamp(true);
  
  const yUniv = d3.scaleSqrt()
  .range([maxRadiusUniv*0.1, maxRadiusUniv]); //modif 0.1 = taille du centre pour faire retour
  
  const colorUniv = d3.scaleOrdinal().range(["white","#94D4AB","#B9D3FA ",'#EEEB9E','#D4B79D ',"#FCBDE3","#6FCF8C ","#B7AFE7", "#F1E268" ]);
  const partitionUniv = d3.partition();
  
  const arcUniv = d3.arc()
  .startAngle(d => xUniv(d.x0))
  .endAngle(d => xUniv(d.x1))
  .innerRadius(d => Math.max(0, yUniv(d.y0))) //les 0 c'est pour que le retour soit un cran avant
  .outerRadius(d => Math.max(0, yUniv(d.y1)));// et pas au tout au début
  
  const middleArcLineUniv = d => {
  const halfPi = Math.PI/2;
  const anglesUniv = [xUniv(d.x0) - halfPi, xUniv(d.x1) - halfPi];
  const rUniv = Math.max(0, (yUniv(d.y0) + yUniv(d.y1)) / 2);
  
  const middleAngleUniv = (anglesUniv[1] + anglesUniv[0]) / 2;
  const invertDirectionUniv = middleAngleUniv > 0 && middleAngleUniv < Math.PI; // On lower quadrants write text ccw
  if (invertDirectionUniv) { anglesUniv.reverse(); }
  
  const pathUniv = d3.path();
  pathUniv.arc(0, 0, rUniv, anglesUniv[0], anglesUniv[1], invertDirectionUniv);
  return pathUniv.toString();
  };
  
  const textFitsUniv = d => {
  const CHAR_SPACE_Univ = 6;
  
  const deltaAngleUniv = xUniv(d.x1) - xUniv(d.x0);
  const rUniv = Math.max(0, (yUniv(d.y0) + yUniv(d.y1)) / 2);
  const perimeterUniv = rUniv * deltaAngleUniv ;
  
  return d.data.name.length * CHAR_SPACE_Univ < perimeterUniv;
  };
  
  // Append Div for tooltip to SVG5
  var divUniv = d3.select("#university")
    .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  
  const svgUniv = d3.select('#university').append('svg')
  .style('width'/2, '75vw')
  .style('height'/2, '75vh')
  .attr('viewBox', `${-widthUniv / 2} ${-heightUniv / 2} ${widthUniv} ${heightUniv}`)
  .on('click', () => focusOnUniv()) // Reset zoom on canvas click  
  
  d3.json("/api/data_sunUniv", (error, rootUniv) => {
  if (error) throw error;
  
  rootUniv = d3.hierarchy(rootUniv);
  rootUniv.sum(d => d.ECTS);
  
  const sliceUniv = svgUniv.selectAll('g.slice')
      .data(partitionUniv(rootUniv).descendants());
  
      sliceUniv.exit().remove();
  
  const newSliceUniv = sliceUniv.enter()
      .append('g').attr('class', 'slice')
      .on('click', d => {
          d3.event.stopPropagation();
          focusOnUniv(d);
      })
  
  
  /// mouseover
  .on("mouseover", function (d) {
      divUniv.transition()
          .style("display", (d.depth === 0) ? 'none' : 'block' )
          .duration(500)
          .style("opacity", 1);
          divUniv.html(" <p> "+d.data.name+"</p>")
  })
  
  .on('mouseout', function() { // when mouse leaves div                        
      divUniv.style('display', 'none'); // hide tooltip for that element
   })
  .on('mousemove', function(d) { // when mouse moves                  
      divUniv.style('top', (d3.event.pageY + 10) + 'px') // always 10px below the cursor
     .style('left', (d3.event.pageX ) + 'px'); // always 10px to the right of the mouse
  })  
  
  newSliceUniv.append('path')
      .attr('class', 'main-arc')
      //.style('fill', d => color((d.children ? d : d.parent).data.name))
      .style("fill", d => { while (d.depth > 2) d = d.parent; return colorUniv(d.data.name); })
      .style("fill-opacity", function(d) { return (d.depth === 3) ? 0.6 : 1; })
      .attr("opacity",d =>  (d.children ? d : 0.3))
      .attr('d', arcUniv);
  
      newSliceUniv.append('path')
      .attr('class', 'hidden-arc')
      .attr('id', (_, j) => `hiddenarc${j}`)
      .attr('d', middleArcLineUniv);
  
  const textUniv = newSliceUniv.append('text')
      .attr('display',d => textFitsUniv(d) ? null : 'none');
  textUniv.append('textPath')
      .attr('startOffset','50%')
      .attr('xlink:href', (_, j) => `#hiddenarc${j}` )
      .text(d => d.data.name);
  });
  
  function focusOnUniv(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
  // Reset to top-level if no data point specified
  
  const transitionUniv = svgUniv.transition()
      .duration(750)
      .tween('scale', () => {
          const x_univ = d3.interpolate(xUniv.domain(), [d.x0, d.x1]),
              y_univ = d3.interpolate(yUniv.domain(), [d.y0, 1]);
          return t => { xUniv.domain(x_univ(t)); yUniv.domain(y_univ(t)); };
      });
  
  transitionUniv.selectAll('path.main-arc')
      .attrTween('d', d => () => arcUniv(d));
  
  transitionUniv.selectAll('path.hidden-arc')
      .attrTween('d', d => () => middleArcLineUniv(d));
  
  transitionUniv.selectAll('text')
      .attrTween('display', d => () => textFitsUniv(d) ? null : 'none');
  
  moveStackToFrontUniv(d);
  
  //
  
  function moveStackToFrontUniv(elD) {
      svgUniv.selectAll('.slice').filter(d => d === elD)
          .each(function(d) {
              this.parentNode.appendChild(this);
              if (d.parent) { moveStackToFrontUniv(d.parent); }
          })
  }
  }                    
  }