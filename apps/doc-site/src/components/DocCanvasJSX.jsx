import React, { useState } from 'react';

const DocCanvasJSX = ({ react, webComponent }) => {
  const [activeTab, setActiveTab] = useState('react');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleTabClick('react')} disabled={!react}>
          React
        </button>
        <button onClick={() => handleTabClick('webComponent')} disabled={!webComponent}>
          Web Component
        </button>
      </div>
      <pre className='doc-canvas'>
        {activeTab === 'react' && react && <code>{react}</code>}
        {activeTab === 'webComponent' && webComponent && <code>{webComponent}</code>}
        <code><slot /></code>
      </pre>

      <style>
        {`
          .doc-canvas {
            background: slateblue;
            color: white;
            display: flex;
            flex-direction: column;
          }

          button {
            margin-right: 10px;
          }
        `}
      </style>
    </div>
  );
};

export default DocCanvasJSX;
