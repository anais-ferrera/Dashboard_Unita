var q = d3.queue()
  .defer(d3.json, "/api/coord_map")
  .defer(d3.json,"/api/data_map")
  .defer(makeMap);

q.awaitAll(function(error){
    if (error) throw error;
    makeMap;
})

function makeMap(error, apiData) {
    
//Width and height
var w = 800;
var h = 700;

//Define map projection
var projection = d3.geoMercator() //standard projection
                       .center([ 8, 47 ]) //how to center the map, longitude, latitude
                       .translate([ w/2, h/2 ]) // center the resulting image in the svg
                       .scale([ w/0.8 ]); // zoom, the smaller the value, the bigger the zoom

//Define path generator
var path = d3.geoPath()
            .projection(projection);


//Create SVG
var svg1 = d3.select("#map")
            .append("svg")
            .attr("viewBox", "0 0 " + w + " " + h )
            .append("g");


// Append Div for tooltip to SVG
var div1 = d3.select("body")
	    .append("div")
		.attr("class", "tooltip_map")
		.style("opacity", 0);

        
//Load in GeoJSON data
d3.json("/api/coord_map", function(json) {
   
    //Bind data and create one path per GeoJSON feature
    var g = svg1.selectAll("path")
       .data(json.features)
       .enter()
       .append("path")
       .attr("d", path)
       .attr("stroke", "#ABB0B0")
       .attr("fill", "#D0D0D0");

       d3.json("api/data_map",function(data){
            
    var colors = d3.scaleOrdinal().domain(data)
    .range(["#E0966E","#88E073",'#9B82E0',"#E073B2","#8BE0DC",'#E0D984']);
        //brown BDA086
        //orange FCC987
        //cyan 82CBD8
        //red F07F78
        //blue A2C5FA

        svg1.selectAll("circle")
                .data(data)                
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                return projection([d.long, d.lat])[0];
            })
                .attr("cy", function (d) {
                return projection([d.long, d.lat])[1];
            })
               .attr("class", function(d,i) { return "pt" + i; })
                .attr("r",6)
                .style("fill", function(d){return colors(d.university)})
                .style("opacity", 1)
   
        // mouseover
			.on("mouseover",over) 
        // dblclick to open url
          .on("dblclick",function(d){ window.open(d.site) })
		// mouseout               
			.on("mouseout",out) 
	

    //HISTOGRAM
    
    width_histo = 500;
    height_histo = 200;

    const x_histo = d3.scaleBand()
                .range([0, width_histo])
                .padding(0.1);

    const y_histo = d3.scaleLinear()
                .range([height_histo, 0]);

    const svg_histo = d3.select("#histogram").append("svg")
                  .attr("id", "svg")
                  //responsive
                  .attr('viewBox','-50 0 600 250' )
                  .attr('preserveAspectRatio','xMinYMin');     

    const divBar = d3.select("body").append("div")
                  .attr("class", "tooltip_map")         
                  .style("opacity", 0);   

    //convert caract to number
    data.forEach(d => d.students = +d.students);

    x_histo.domain(data.map(d => d.university));
    y_histo.domain([0, d3.max(data, d => d.students)]);
    
    svg_histo.append("g")
        .attr("transform", "translate(0," + height_histo + ")")
        .call(d3.axisBottom(x_histo).tickSize(0))
        .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
    
    svg_histo.append("g")
        .call(d3.axisLeft(y_histo).ticks(6));

     svg_histo.selectAll(".bar")
        .data(data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("fill", function(d,i) {return colors(i);})
            .attr("x", d => x_histo(d.university))
            .attr("width", x_histo.bandwidth())
            .attr("y", d => y_histo(d.students))
            .attr("height", d => height_histo - y_histo(d.students))	
            .attr("class", function(d,i) { return "pt" + i; })
            // no bar at the beginning (for the animation)
            .attr("height", function(d) { return height_histo - y_histo(0); }) 
            .attr("y", function(d) { return y_histo(0); })
            .on("mouseover",over)
            .on("mouseout",out);
            
    // Animation
    svg_histo.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", function(d) { return y_histo(d.students); })
        .attr("height", function(d) { return height_histo - y_histo(d.students); })
        .delay(function(d,i){console.log(i) ; return(i*100)})

      //====================== HISTOGRAM thematic==================================

        // set the dimensions and margins of the graph
        var margin_thematic = {top: 10, right: 30, bottom: 20, left: 50},
        width_thematic = 560 - margin_thematic.left - margin_thematic.right,
        height_thematic = 250 - margin_thematic.top - margin_thematic.bottom;
        
        // append the svg object to the body of the page
        var svg_thematic = d3.select("#my_dataviz")
        .append("svg")
        .attr("id", "svg")
        .attr("viewBox", "0 0 560 250 ")
        .attr('preserveAspectRatio','xMinYMin')
        .append("g")
        .attr("transform",
              "translate(" + margin_thematic.left + "," + margin_thematic.top + ")");
        
            var divThematic = d3.select("body").append("div")
              .attr("class", "tooltip_map")         
              .style("opacity", 0);   
        
        // List of subgroups 
        var subgroups = ['Cultural heritage','Circular economy','Renewable energy']
        
        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(data, function(d){return(d.university)}).keys()
        
        // Add X axis
        var x_thematic = d3.scaleBand()
          .domain(groups)
          .range([0, width_thematic])
          .padding([0.2])
        svg_thematic.append("g")
        .attr("transform", "translate(0," + height_thematic + ")")
        .call(d3.axisBottom(x_thematic).tickSizeOuter(0));
        
        // Add Y axis
        var y_thematic = d3.scaleLinear()
        .domain([0, 85])
        .range([ height_thematic, 0 ]);
        svg_thematic.append("g")
        .call(d3.axisLeft(y_thematic));
        
        // color palette = one color per subgroup
        var color_thematic =  d3.scaleOrdinal().domain(data)
        .range(["#6FCF8C","#F1E268" ,"#B7AFE7"]);
        
        //stack the data? --> stack per subgroup
        var stackedData = d3.stack()
        .keys(subgroups)
        (data)
        
        // Show the bars
        svg_thematic.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
          .attr("fill", function(d) { return color_thematic(d.key); })
          .attr("class", function(d){ return "myRect " + d.key }) // Add a class to each subgroup: their name
          .selectAll("rect")
          // enter a second time = loop subgroup per subgroup to add all rectangles
          .data(function(d) { return d; })
          .enter().append("rect")
            .attr("x", function(d) {return x_thematic(d.data.university); })
            .attr("y", function(d) { return y_thematic(d[1]); })
            .attr("height", function(d) { return y_thematic(d[0]) - y_thematic(d[1]); })
            .attr("width",x_thematic.bandwidth())
            .attr("stroke", "grey")
            .attr("class", function(d,i) { return "pt_thematic" + i; })
          .on("mouseover", over)
          .on("mouseleave", out)
          .on("mousemove", function(d) {
            nb=d[1] - d[0];
            divThematic.html("<b>"+ nb + "</b>")
                       .style("left", (d3.event.pageX + 5) + "px")     
                       .style("top", (d3.event.pageY - 40) + "px");
          });


          addLegend(["#F1E268","#B7AFE7","#6FCF8C"]);
        
          function addLegend(color_thematic) {
            
            legendCellSize = 15;
            let legend = svg_thematic.append('g')
                .attr('transform', 'translate(10, 20)'); // Represents the precise point at the top left of the first colored square
                
            // For each color, we add a square always positioned at the same place on the X axis and shifted according to the
            // size of the square and the index of the color processed on the Y axis
            
            legend.selectAll()
                .data(color_thematic)
                .enter().append('rect')
                    .attr('height', legendCellSize + 'px')
                    .attr('width', legendCellSize + 'px')
                    .attr('x', 10)
                    .attr('y', (d,i) => (i-2) * legendCellSize)
                    .style("fill", d => d);
            
            // We proceed in the same way for the labels with a positioning on the X axis of the size of the squares
            // to which we add 10 px of margin
            legend.selectAll()
                .data(subgroups)
                .enter().append('text')
                    .attr("transform", (d,i) => "translate(" + (legendCellSize + 10) + ", " + ((i-1.7) * legendCellSize) + ")")
                    .attr("dy", legendCellSize / 1.6) // To center text around squares
                    .style("font-size", "13px")
                    .style("fill", "grey")
                    .text(d => d);
              }

    function over (d,i) { 
      
      function select(i){
     d3.selectAll("circle.pt"+i)
     .attr("stroke","black")
     .attr("stroke-width","3px");
     d3.selectAll("rect.pt"+i)
     .attr("stroke","black")
     .attr("stroke-width","3px"); 
    d3.selectAll("rect.pt_thematic"+i)
    .attr("stroke","black")
    .attr("stroke-width","3px");}     
        if(arraysEqual(d3.select(this)._groups[0],Array.from(d3.selectAll("circle.pt"+i)._groups[0]))){
         select(i);
                   div1.transition()
                        .style("display","block")
                        .duration(500)
                        .style("opacity", 1);
                
         div1.html(
            "<img class='img' src='data:image/png;base64,"+ d.img +"'/>"
            + "<p class='univ'><b>" + d.university + "</p>" 
            + "<p class='univ_name'><b>" + d.full_name + "</b></p>" 
            + "<p class='country'>" + d.country + "</p>"   
            + "<p class='summary'>" + d.summary + "</p><br/>" )
            .style("left", (d3.event.pageX -10) + "px")
            .style("top", (d3.event.pageY -400) + "px");
         }
         
         if(arraysEqual(d3.select(this)._groups[0],Array.from(d3.selectAll("rect.pt"+i)._groups[0]))){
           select(i);

            divBar.transition()     
                   .duration(200)       
                   .style("opacity", 1)
                   .style("background-color", "white");
            divBar.html("Nb students : <b>"+ d.students + "</b>")
                  .style("left", (d3.event.pageX + 5) + "px")     
                  .style("top", (d3.event.pageY - 40) + "px");             
             }
            
             ary=Array.from(d3.selectAll("rect.pt_thematic"+i)._groups[0])
             if(ary.includes((d3.select(this)._groups[0])[0])){
                select(i);
                 divThematic.transition()     
                        .duration(200)       
                        .style("opacity", 1)
                        .style("background-color", "white");         
                  }
           
           }
            
          function arraysEqual(a,b) {
            /*
                Array-aware equality checker:
                Returns whether arguments a and b are == to each other;
                however if they are equal-lengthed arrays, returns whether their 
                elements are pairwise == to each other recursively under this
                definition.
            */
            if (a instanceof Array && b instanceof Array) {
                if (a.length!=b.length)  // assert same length
                    return false;
                for(var i=0; i<a.length; i++)  // assert each element equal
                    if (!arraysEqual(a[i],b[i]))
                        return false;
                return true;
            } else {
                return a==b;  // if not both arrays, should be the same
            }
        }

        function out (d,i){
            divBar.transition()
                  .duration(500)
                  .style("opacity", 0);
            d3.selectAll("rect.pt"+i)
              .attr("stroke","none")
            div1.transition()
                .duration(500)
                .style("opacity", 0);
            d3.selectAll("circle.pt"+i)
              .attr("stroke","none")
            divThematic.transition()
                .duration(500)
                .style("opacity", 0);
            d3.selectAll("rect.pt_thematic"+i)
            .attr("stroke-width","1 px")
              .attr("stroke","grey")
        };      


      });

      
     })}