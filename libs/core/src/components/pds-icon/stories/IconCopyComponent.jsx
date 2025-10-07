import React, { useState, useEffect } from 'react';
import { IconItem } from '@storybook/blocks';

export const CopyIcon = ({ name }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => setShowToast(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  const handleCopy = async () => {
    const code = `<pds-icon name="${name}"></pds-icon>`;
    try {
      await navigator.clipboard.writeText(code);
      setToastMessage(`${name} has been copied to clipboard`);
      setShowToast(true);
    } catch (err) {
      setToastMessage('Failed to copy');
      setShowToast(true);
    }
  };

  return (
    <IconItem name={name}>
    <div onClick={handleCopy} style={{ cursor: 'pointer', position: 'relative' }}>
        <pds-icon name={name}>{name}</pds-icon>
    </div>
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: 'var(--pine-dimension-sm)',
          right: 'var(--pine-dimension-sm)',
          background: 'var(--pine-color-grey-950)',
          color: 'var(--pine-color-text-primary)',
          padding: 'var(--pine-dimension-sm)',
          borderRadius: 'var(--pine-dimension-xs)',
          zIndex: 'var(--pine-z-index-nuclear)',
          boxShadow: 'var(--pine-box-shadow-100)',
          border: '1px solid var(--pine-color-grey-200)',
        }}>
          {toastMessage}
        </div>
      )}
      </IconItem>
  );
};
