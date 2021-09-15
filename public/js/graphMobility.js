let nodes = [];
let edges = [];
let network = null;




function draw() {
    // get data from restfull API (course)
    $.getJSON("/api/data_compatibility", function(data) {

        // define node to add
        let node1 = null;
        let node2 = null;

        // define edge
        let edge1 = null;
        $.each(data, function(key, val) {
            // give value to the node
            node1 = { id: val.program1, value: 20, label: val.program1, color: { background: "pink", border: "purple" } };
            node2 = { id: val.program2, value: 20, label: val.program2, color: { background: "pink", border: "purple" } };
            // check if node1 and node2 is in the list
            if (!nodes.some(node => node.id === val.program1)) {
                nodes.push(node1);
            }
            if (!nodes.some(node => node.id === val.program2)) {
                nodes.push(node2);
            }
            // give value to edge
            if (val.compatibility != null) {
                if (val.compatibility > 1) {
                    console.log(val.compatibility)
                    edge1 = { from: val.program1, to: val.program2, value: val.compatibility * 2, title: `${val.program1}---->${val.program2}` };
                    // add edge
                    edges.push(edge1)
                }
            }

        });
        // Instantiate our network object.
        var container = document.getElementById("mynetwork");
        var data = {
            nodes: nodes,
            edges: edges,
        };
        var options = {
            nodes: {
                shape: "dot",
                scaling: {
                    label: {
                        min: 8,
                        max: 20,
                    },
                },
            },
        };
        network = new vis.Network(container, data, options);
        console.log(nodes);
        console.log(edges);
    });
}


window.addEventListener("load", () => {
    draw();
});