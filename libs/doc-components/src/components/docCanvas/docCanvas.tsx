import React, { useState } from 'react';

import './docCanvas.css';

interface SourceType {
  [key: string]: any
}

interface DocCanvasProps {
  activeTab: string
  children: React.ReactNode
  isMenuVisible: boolean
  mdxSource: SourceType
}

const docCanvas: React.FC<DocCanvasProps> = ({
  // activeTab = 'react',
  children,
  // isMenuVisible = false,
  mdxSource
}) => {
  const [activeTab, setActiveTab] = useState('react');
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
    console.log('Tab Clicked: ', tab);
    if (isMenuVisible == false) {
      setMenuVisible(true);
    }

    setActiveTab(tab);
  }

  const handleToggleMenuClick = () => {
    console.log('handleToggleMenuClick');
    setMenuVisible(!isMenuVisible);
  }

  const renderSource = () => {
    return (
      <pre>
        <code>
          {mdxSource?.[activeTab]}
        </code>
      </pre>
    )
  }

  return (
    <div className={`doc-canvas ${isMenuVisible ? 'doc-canvas--menu-visible' : ''}`}
      >
        <div className="doc-canvas-preview">
        {children}
        </div>
        <div className="doc-canvas-actions">
          {mdxSource?.react &&
            <button
              className={`
                doc-canvas-action
                ${activeTab === 'react' ? 'doc-canvas-action--active' : ''}
              `}
              disabled={!mdxSource?.react}
              onClick={() => handleTabClick('react')}
            >
              React
            </button>
          }

          {mdxSource?.webComponent &&
            <button
              className={`
              doc-canvas-action
                ${activeTab === 'webComponent' ? 'doc-canvas-action--active' : ''}
              `}
              disabled={!mdxSource?.webComponent}
              onClick={() => handleTabClick('webComponent')}
            >
              Web Component
            </button>
          }
          <button
            className={`
              doc-canvas-action
              ${isMenuVisible ? 'doc-canvas-action--active' : ''}
            `}
            onClick={() => handleToggleMenuClick()}
          >
            Toggle menu
          </button>
        </div>
        <div className="doc-canvas-code">
          <button
            className="doc-canvas-action doc-canvas-action--copy-code"
            onClick={() => handleCopyCodeClick()}
          >
            Copy Code
          </button>

          { renderSource() }

        </div>
      </div>
  )
}

export default docCanvas;
