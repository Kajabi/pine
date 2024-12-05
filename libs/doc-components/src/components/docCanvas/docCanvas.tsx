/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';


import './docCanvas.css';


const camelToFlat = (c: string) => (c = c.replace(/[A-Z]/g, " $&"), c[0].toUpperCase() + c.slice(1))

interface SourceType {
  [key: string]: any
}

interface DocCanvasProps {
  activeTab: string
  children: React.ReactNode
  display: string
  isMenuVisible: boolean
  mdxSource: SourceType
}

const docCanvas: React.FC<DocCanvasProps> = ({
  // activeTab = 'react',
  children,
  display,
  // isMenuVisible = false,
  mdxSource
}) => {
  const [activeTab, setActiveTab] = useState('webComponent');
  const [isMenuVisible, setMenuVisible] = useState(false);

  const handleCopyCodeClick = () => {
    const codeToCopy = activeTab === 'react' ? mdxSource?.react : mdxSource?.webComponent;

    if (codeToCopy) {
      // Create a temporary textarea element to copy the code
      const textarea = document.createElement('textarea');
      textarea.value = codeToCopy;
      document.body.appendChild(textarea);

      // Select and copy the text
      textarea.select();
      document.execCommand('copy');

      // Remove the temporary textarea
      document.body.removeChild(textarea);
    }
  }


  const handleTabClick = (tab: string) => {
    if (isMenuVisible == false) {
      setMenuVisible(true);
    }

    setActiveTab(tab);
  }

  const handleToggleMenuClick = () => {
    setMenuVisible(!isMenuVisible);
  }

  const renderSource = () => {
    return (
      <SyntaxHighlighter language="jsx" style={prism}>
        {mdxSource?.[activeTab]}
      </SyntaxHighlighter>
    )
  }

  const createViewCodeButtons = () => {
    const buttons = Object.keys(mdxSource).map((key) => (
      <button
        className={`
        doc-canvas-action
          ${isMenuVisible && activeTab === key ? 'doc-canvas-action--active' : ''}
        `}
        disabled={!mdxSource[key]}
        onClick={() => handleTabClick(key)}
      >
        {camelToFlat(key)}
      </button>
      )
    )

    return (
      <> {buttons} </>
    )
  }

  return (
    <div className={`doc-canvas ${isMenuVisible ? 'doc-canvas--menu-visible' : ''}`}
      >
        <div className={`doc-canvas-preview ${display ? `doc-canvas-preview--${display}` : ''}`}>
        {children}
        </div>
        <div className="doc-canvas-actions">
          <div className="doc-cavas-actions-toggle">
            { createViewCodeButtons() }
          </div>

          {isMenuVisible &&
            <button
              className={`
                doc-canvas-action
                doc-canvas-action--toggle-menu
                ${isMenuVisible ? 'doc-canvas-action--active' : ''}
              `}
              onClick={() => handleToggleMenuClick()}
            >
              {isMenuVisible ? 'Hide code' : 'Show code'}
            </button>
          }
        </div>
        <div className="doc-canvas-code-wrapper">
          <div className="doc-canvas-code">
            { renderSource() }
          </div>

          <button
            className="doc-canvas-action doc-canvas-action--copy-code"
            onClick={() => handleCopyCodeClick()}
          >
            Copy
          </button>
        </div>
      </div>
  )
}

export default docCanvas;
