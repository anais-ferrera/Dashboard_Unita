d3.queue()
  .defer(d3.json, "/api/data_treeMap")
  .await(makeGraphs);

function makeGraphs(error, apiData) {
  
    var width = 975;
    var height = 400;
    format = d3.format(",d")
    
    var div3 = d3.select("#treeMap")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    const svg_treeMap = d3.select('#treeMap').append('svg')
      .attr("viewBox", [0, 0, width, height])
      .style("font", "10px sans-serif");

  const partition = data => {
    const root = d3.hierarchy(data)
        .sum(d => d.ECTS)
        .sort((a, b) => b.height - a.height || b.ECTS - a.ECTS);  
    return d3.partition()
        .size([height, (root.height + 1) * width / 7])
      (root);
  }

      d3.json("/api/data_treeMap", (error, data) => {
        if (error) throw error;
        const root = partition(data);
        let focus = root;
        //const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
      const color = d3.scaleOrdinal().range(["#F1E268","#6FCF8C" ,"#B7AFE7","#FB9981","#5FBFD8"]);

    const cell = svg_treeMap
        .selectAll("g")
        .data(root.descendants())
        .enter().append('g')
         .attr("transform", d =>   `translate(${d.y0},${d.x0})`);

    const rect = cell.append("rect")
      .attr("width", d => d.y1 - d.y0 -1)
      .attr("height", d =>  rectHeight(d))
      .attr("fill-opacity", 1)
      .attr("fill", d => {
        if (!d.depth) return 'none';
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .style("cursor", "pointer")
      .on("click", clicked)
      .on("mouseover", function (d) {
        div3.transition()
            .style("display", (d.depth === 0) ? 'none' : 'block' )
            .duration(500)
            .style("opacity", 1);
            div3.html("<p>"+d.data.name+"</p>")
    })    

      .on('mouseout', function(d) { // when mouse leaves div                        
        div3.style('display', 'none') // hide tooltip for that element
        div3.transition()
            .duration(500);
      })

      .on('mousemove', function(d) { // when mouse moves                  
        div3.style('top', (d3.event.pageY + 10) + 'px') // always 10px below the cursor
        div3.style('left', (d3.event.pageX + 10) + 'px'); // always 10px to the right of the mouse
      })
      const text = cell.append("text")
      .style("user-select", "none")
      .attr("pointer-events", "none")
      .attr("y", 10)
      .attr("x", 2)
      .attr("fill-opacity", d => +labelVisible(d) ? null : 0);
     

  text.append("tspan")
      //.text(d => { if (d.data.name.length >30) return ((d.data.name.split(' ',10)));return (d.data.name)});
      .text(d => d.data.name) 
      .attr("dy", 0.01)
      .call(wrap,115);
      

     const tspan = text.append("tspan")
     .attr("fill-opacity", d => labelVisible(d) * 0.5)
      .text(d =>{ if (d.depth==4) return ( ` ${format(d.value)}`);return ''});

  //cell.append("title")
      //.text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
      

      function clicked(p) {
        
        focus = focus === p ? p = p.parent : p;
    
        root.each(d => d.target = {
          x0: (d.x0 - p.x0) / (p.x1 - p.x0) * height,
          x1: (d.x1 - p.x0) / (p.x1 - p.x0) * height,
          y0: d.y0 - p.y0,
          y1: d.y1 - p.y0
        });
        
        const t = cell.transition().duration(750)
            .attr("transform", d => `translate(${d.target.y0},${d.target.x0})`);
    
        rect.transition(t).attr("height", d => rectHeight(d.target));
        text.transition(t).attr("fill-opacity", d => +labelVisible(d.target));
        tspan.transition(t).attr("fill-opacity", d => labelVisible(d.target) * 0.7);
      }
      
      function rectHeight(d) {
        return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
      }
    
      function labelVisible(d) {
        return d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 20;
      }
      
      function wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1, // ems
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")),
              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy",`${lineHeight + dy}em`).text(word);
            }
          }})}
  
  })}