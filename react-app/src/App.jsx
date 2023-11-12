// src/App.js
import { useState } from 'react';
import Tree from './components/Tree';

const App = () => {
  const [treeData, setTreeData] = useState([]);

  return (
    <div >
      <h1>Tree App</h1>
      <Tree data={treeData} />
    </div>
  );
};

export default App;