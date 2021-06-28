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
		.attr("class", "tooltip_map")
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
            
    var colors = d3.scaleOrdinal().domain(data)
    .range(["#F8A3D7","#A2C5FA",'#F07F78',"#FCC987","#82CBD8",'#BDA086']);
        //marron BDA086
        //orange FCC987
        //cyan 82CBD8
        //rouge F07F78
        //bleu A2C5FA

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

    //HISTOGRAM
    
    width = 500;
    height = 250;

    const x = d3.scaleBand()
                .range([0, width])
                .padding(0.1);

    const y = d3.scaleLinear()
                .range([height, 0]);

    const svg = d3.select("#histogram").append("svg")
                  .attr("id", "svg")
                  //responsive
                  .attr('viewBox','-50 0 600 300' )
                  .attr('preserveAspectRatio','xMinYMin');     

    const divBar = d3.select("body").append("div")
                  .attr("class", "tooltip_map")         
                  .style("opacity", 0);   

    //convert caract to number
    data.forEach(d => d.students = +d.students);

    x.domain(data.map(d => d.university));
    y.domain([0, d3.max(data, d => d.students)]);
    
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
    
    svg.append("g")
        .call(d3.axisLeft(y).ticks(6));

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("fill", function(d,i) {return colors(i);})
            .attr("x", d => x(d.university))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.students))
            .attr("height", d => height - y(d.students))	
            .attr("class", function(d,i) { return "pt" + i; })
            // no bar at the beginning (for the animation)
            .attr("height", function(d) { return height - y(0); }) 
            .attr("y", function(d) { return y(0); })
            .on("mouseover",over)
            .on("mouseout",out);
            
    // Animation
    svg.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", function(d) { return y(d.students); })
        .attr("height", function(d) { return height - y(d.students); })
        .delay(function(d,i){console.log(i) ; return(i*100)})

    function over (d,i) { 
      
      console.log("circle.pt"+i)
      console.log("rect.pt"+i)
      function select(i){
     d3.selectAll("circle.pt"+i)
     .attr("stroke","black")
     .attr("stroke-width","3px");
     d3.selectAll("rect.pt"+i)
     .attr("stroke","black")
     .attr("stroke-width","3px"); }     
        if(arraysEqual(d3.select(this)._groups[0],Array.from(d3.selectAll("circle.pt"+i)._groups[0]))){
         select(i);
                   div1.transition()
                        .style("display","block")
                        .duration(500)
                        .style("opacity", 1);
                
         div1.html(
            "<img class='img' src='data:image/png;base64,"+ d.img +"'/>"
            + "<p class='univ'><b>" + d.university + "</b></p>" 
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
        };      

      });
      })}