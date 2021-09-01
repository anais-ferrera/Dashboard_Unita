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
            node1 = { id: val.program1, value: 20, label: val.program1 };
            node2 = { id: val.program2, value: 20, label: val.program2 };
            // check if node1 and node2 is in the list
            if (!nodes.some(node => node.id === val.program1)) {
                nodes.push(node1);
            }
            if (!nodes.some(node => node.id === val.program2)) {
                nodes.push(node2);
            }
            // give value to edge
            if (val.compatibility != null) {
                edge1 = { from: val.program1, to: val.program2, value: val.compatibility * 2, title: `${val.program1}---->${val.program2}` };
                // add edge
                edges.push(edge1)
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
    // create people.
    // value corresponds with the age of the person
    // nodes = [
    //     { id: 'a a', value: 2, label: "Algie" },
    //     { id: 2, value: 31, label: "Alston" },
    //     { id: 3, value: 12, label: "Barney" },
    //     { id: 4, value: 16, label: "Coley" },
    //     { id: 5, value: 17, label: "Grant" },
    //     { id: 6, value: 15, label: "Langdon" },
    //     { id: 7, value: 6, label: "Lee" },
    //     { id: 8, value: 5, label: "Merlin" },
    //     { id: 9, value: 30, label: "Mick" },
    //     { id: 10, value: 18, label: "Tod" },
    // ];

    // // create connections between people
    // // value corresponds with the amount of contact between two people
    // edges = [
    //     { from: 'a a', to: 8, value: 30, title: "3 emails per week" },
    // ];



}


window.addEventListener("load", () => {
    draw();
});