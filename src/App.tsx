import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Diagram from './components/diagram';

function App() {
  const [show, setShow] = useState(false);
  return (
    <div className="App">
      <div style={{height: '20px', marginBottom: '50px'}}>
      <input 
      type="checkbox"
      checked={show}
      onChange={() => setShow(!show)}
      /> 
      </div>
      <div style={{position: 'relative', display: 'block', height: '100vh'}}>

      {<Diagram/>}
      </div>
    </div>
  );
}

export default App;
