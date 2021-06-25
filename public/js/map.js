d3.queue()
  .defer(d3.json, "/api/coord_map")
  .defer(d3.json,"/api/data_map")
  .await(makeGraphs);

  function makeGraphs(error, apiData) {
    var unitaSunburst = apiData;
    var ndx = crossfilter(unitaSunburst);

    var map = new dc.GeoChoroplethChart("#map");

//Width and height
var w = 800;
var h = 600;

var colors = d3.scaleOrdinal().domain(['USMB','UBI','UPPA','UNITO','UNIZAR','UVT'])
                              .range(["#cf1342","#13cfcf","#13cf48","#7113cf","#9acf13","#cf6413"]);
//Define map projection


var projection = d3.geoMercator() //utiliser une projection standard pour aplatir les pÃ´les, voir D3 projection plugin
                       .center([ 8, 47 ]) //comment centrer la carte, longitude, latitude
                       .translate([ w/2, h/2 ]) // centrer l'image obtenue dans le svg
                       .scale([ w/0.8 ]); // zoom, plus la valeur est petit plus le zoom est gros 

//Define path generator
var path = d3.geoPath()
                 .projection(projection);


//Create SVG
var svg1 = d3.select("#map")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .append("g");

// Append Div for tooltip to SVG5
var div1 = d3.select("#map")
	.append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);


//Load in GeoJSON data
d3.json("api/coord_map", function(json) {
    map
    .width(w)
    .height(h)
    .projection(path)
    .colors(colors)
    //Bind data and create one path per GeoJSON feature
    var g = svg1.selectAll("path")
       .data(json.features)
       .enter()
       .append("path")
       .attr("d", path)
       .attr("stroke", "#9da1a1")
       .attr("fill", "#bec4c3");

       d3.json("api/data_map",function(data){
        console.log('gps', data);
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
                .attr("r",5)
                .style("fill", function(d){return colors(d.university)})
                .style("opacity", 0.75)
   
        // mouseover
				.on("mouseover", function (d) {
					div1.transition()
                        .style("display","block")
						.duration(500)
						.style("opacity", 1);
                        div1.html("Country : <b>"+d.country+ "</b><br/>" +" University : <b>"+d.university +"</b>")
						.style("left", (d3.event.pageX +10) + "px")
						.style("top", (d3.event.pageY ) + "px");

				})
                // dblclick to open url
                .on("dblclick",function(d){ window.open(d.site) })
				// mouseout               
				.on("mouseout", function (d) {
					div1.transition()
						.duration(500)
						.style("opacity", 0);
				})
				
			
	});
 

});
dc.renderAll();
  }

