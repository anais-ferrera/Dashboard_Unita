var q = d3.queue()
  .defer(d3.json, "/api/coord_map")
  .defer(d3.json,"/api/data_map")
  .defer(makeMap);

q.awaitAll(function(error){
    if (error) throw error;
    makeMap;
})

function makeMap(error, apiData) {
    var unitaSunburst = apiData;



//Width and height
var w = 800;
var h = 600;

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
            .attr("viewBox", "0 0 " + w + " " + h )
            .append("g");


// Append Div for tooltip to SVG
var div1 = d3.select("body")
	    .append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

    
//Load in GeoJSON data
d3.json("api/coord_map", function(json) {
   
    //Bind data and create one path per GeoJSON feature
    var g = svg1.selectAll("path")
       .data(json.features)
       .enter()
       .append("path")
       .attr("d", path)
       .attr("stroke", "#ABB0B0")
       .attr("fill", "#D0D0D0");

       d3.json("api/data_map",function(data){
            
    //  var colors = d3.scaleOrdinal().domain(data)
    //                           .range(["#FCBDE3","#B9D3FA","#EEEB9E","#94D4AB","#494B44","#D4B79D"]);
    var colors = d3.scaleOrdinal().domain(data)
                              .range(["#F8A3D7","#A2C5FA","#E9E587","#85D8A3","#FCC987","#BDA086"]);
        
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
				
        .on("click",click);
            
            function click(d,i){
             
            };

                  

                //PIE CHART
				widthT=300
                heightT=200
                var svgT = d3.select("#pie")
                            .append("svg")
                             .attr("width",widthT)
                             .attr("height",heightT)
                            radius = Math.min(widthT, heightT) / 2,
                            gT = svgT.append("g").attr("transform", "translate(" + widthT/2 + "," + heightT/2 + ")");
                var divPie = d3.select("body")
                            .append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 0);
                
                var pie = d3.pie().value(function(d) { 
                    return d.students; 
                });
              
                // Generate the arcs
    var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

//Generate groups
var arcs = gT.selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g")
    //.attr("class","arc")
    .append("path")
    .attr("fill", function(d,i) {return colors(i);})
    .attr("stroke","none")
    .attr("d", arc)
    .attr("class", function(d,i) { return "pt" + i; })
    .on("mouseover",over)
    .on("mouseout",out)
    
    function over (d,i) { 
      
      console.log("circle.pt"+i)
      function select(i){
     d3.selectAll("circle.pt"+i)
     .attr("stroke","black")
     .attr("stroke-width","3px");
     d3.selectAll("path.pt"+i)
     .attr("stroke","black")
     .attr("stroke-width","3px"); }     
        if(arraysEqual(d3.select(this)._groups[0],Array.from(d3.selectAll("circle.pt"+i)._groups[0]))){
         select(i);
                   div1.transition()
             .style("display","block")
                         .duration(500)
                         .style("opacity", 1);
         div1.html("Country : <b>"+d.country+ "</b><br/>" +" University : <b>"+d.university +"</b>"
         + "<img class='toto' src='data:image/png;base64,"+ d.img +"'/>")
                         .style("left", (d3.event.pageX -105) + "px")
                         .style("top", (d3.event.pageY +10 ) + "px");
           
        
         }
         
         if(arraysEqual(d3.select(this)._groups[0],Array.from(d3.selectAll("path.pt"+i)._groups[0]))){
           select(i);
       
           divPie.transition()
             .style("display","block")
                         .duration(500)
                         .style("opacity", 1);
           divPie.html("Nb students : <b>"+ d.data.students + "</b><br/>" +" University : <b>"+d.data.university +"</b>")
                           .style("left", (d3.event.pageX +10) + "px")
                           .style("top", (d3.event.pageY ) + "px");}
           
           }
            


           /*  function arraysEqual(a1,a2) {
              //WARNING: arrays must not contain {objects} or behavior may be undefined 
              return JSON.stringify(a1)==JSON.stringify(a2);
          } */
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
      divPie.transition()
						.duration(500)
						.style("opacity", 0);
        d3.selectAll("path.pt"+i)
        .attr("stroke","none")
        div1.transition()
           .duration(500)
           .style("opacity", 0);
        d3.selectAll("circle.pt"+i)
           .attr("stroke","none")
    };
    
       

             
	var arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)

    gT
    .selectAll('arc')
    .data(pie(data))
    .enter()
    .append('text')
    .attr("classe","txt")
    .text(function(d){ return d.data.university})
    .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
    .style("text-anchor", "middle")
    .style("font-size", 10)
    .style("font-family","sans-serif")
  



      });
      })}