import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import { PdsCheckbox, PdsIcon } from '@pine-ds/react';
import { add } from 'pineicons/icons';
import { PdsCheckboxCustomEvent } from '@pine-ds/core/loader';

function App() {
  const [count, setCount] = useState(0)

  const handleClick = (evt: PdsCheckboxCustomEvent<boolean>) => {
    console.log('Event: ', evt);
    if ( evt.target?.checked) {
      console.log('Do Something')
    }
    else {
      console.log("Not Checked")
    }
  }

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <PdsCheckbox componentId='foo' label="Test" onPdsCheckboxChange={handleClick}/>
      <PdsIcon icon={add} size="large" />
    </div>
  )
}

export default App
