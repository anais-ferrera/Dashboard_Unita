var s = new sigma('sigma');

// Then, let's add some data to display:
s.graph.addNode({
  // Main attributes:
  id: 'n0',
  label: 'Hello',
  // Display attributes:
 
  color: '#f00'
}).addNode({
  // Main attributes:
  id: 'n1',
  label: 'World !',
  // Display attributes:

  color: '#00f'
}).addNode({
  // Main attributes:
  id: 'a1',
  label: 'a1',
  // Display attributes:

  color: '#00f',
  target:''
}).addNode({
  // Main attributes:
  id: 'a2',
  label: 'a2',
  // Display attributes:
  color: '#00f',
}).addNode({
  // Main attributes:
  id: 'a3',
  label: 'a3',
  // Display attributes:

  color: '#00f',
}).addNode({
  // Main attributes:
  id: 'a4',
  label: 'a4',
  // Display attributes:

  color: '#00f',
}).addNode({
  // Main attributes:
  id: 'a5',
  label: 'a5',
  // Display attributes:
  color: '#00f',
}).addNode({
  // Main attributes:
  id: 'b1',
  label: 'b1',
  // Display attributes:
  color: '#f00',
}).addEdge({
  id: 'e0',
  // Reference extremities:
  source: 'n0',
  target: 'n1'
}).addEdge({
  id: 'e1',
  // Reference extremities:
  source: 'n1',
  target: 'a1'
}).addEdge({
  id: 'e2',
  // Reference extremities:
  source: 'a1',
  target: 'a2'
}).addEdge({
  id: 'e3',
  // Reference extremities:
  source: 'a1',
  target: 'a3'
}).addEdge({
  id: 'e4',
  // Reference extremities:
  source: 'a1',
  target: 'a4'
}).addEdge({
  id: 'e5',
  // Reference extremities:
  source: 'n1',
  target: 'a5'
}).addEdge({
  id: 'eb1',
  // Reference extremities:
  source: 'n0',
  target: 'b1'
}).addEdge({
  id: 'eb1bis',
  // Reference extremities:
  source: 'n0',
  target: 'b1'
});


// Finally, let's ask our sigma instance to refresh:
s.refresh();
