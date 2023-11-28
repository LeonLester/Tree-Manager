// src/components/Tree.js
import { useState, useEffect } from 'react';
import axios from 'axios';



const Tree = () => {
  // every time the set function of a state gets called, the component
  // that contains this state gets updated.
  const [nodes, setNodes] = useState([]);
  const [parentId, setParentId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const backend_location = 'http://localhost:3001';
  console.log(`${backend_location}`);
  // this runs only once at every refresh
  useEffect(() => {
    fetchNodes();
   }, []);

  const fetchNodes = async () => {
    try {
      const response = await axios.get(`${backend_location}/api/nodes`, {"Access-Control-Allow-Origin": "*"});
      setNodes(response.data);
    } catch (error) {
      console.error('Error fetching tree data:', error);
    }
  };

  const handleEmptyTree = async () => {
    try {
      await axios.post(`${backend_location}/api/nodes/truncate`)
      await fetchNodes();
    } catch (error) {
      console.error('Error adding node:', error)
    }
    return;
  }

  const addNode = async (e) => {
    e.preventDefault();
    const data = nodes.length === 0
    ? { ID: parentId }
    : { parent_ID: parentId };
    try {
      await axios.post(`${backend_location}/api/nodes`, data)
      await fetchNodes();
    } catch (error) {
      console.error('Error adding node:', error);
      if (error.response && error.response.status === 400) {
        setErrorMessage(`Error: Parent node with ID ${parentId} does not exist.`);
      } else {
        // Default error message for other errors
        setErrorMessage('Error: Failed to add node.');
      }
  
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }
    return;
  }
  

  const renderTree = (parentNode, depth = 1) => {
    // Calculate font size based on the depth
    const fontSize = 12; //- depth * 2;
  
    return (
      <div key={parentNode._node.id} style={{ maxWidth: '50%', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: `${fontSize}px`, color: "#7C90A0"}}>{parentNode._node.name}</h2>
        {parentNode.children && parentNode.children.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            {parentNode.children.map((childNode) => (
              <div key={childNode._node.id} style={{ margin: '0 10px' }}>
                {renderTree(childNode, depth + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
    <div name="Tree">
      {nodes.map(node => renderTree(node))}
    </div>
      <form className="button_form" onSubmit={(e) => addNode(e, parentId)}>
          <input
            type="text"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          />
          <button onClick={(e) => addNode(e, parentId)}>Add Node</button>
          <button type="button" onClick={handleEmptyTree} >Clear Tree</button>

      </form>
    {errorMessage && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: 'rgb(204, 45, 45)', color: 'white', borderRadius: '5px' }}>
          {errorMessage}
        </div>
      )}
    </>
  );
};

export default Tree;
