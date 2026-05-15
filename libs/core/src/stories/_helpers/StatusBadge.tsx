import React from 'react';

import './StatusBadge.css';

export type ComponentStatus = 'stable' | 'beta' | 'deprecated';

export interface StatusBadgeProps {
  /** Lifecycle label as defined in the central component-status table. */
  status: ComponentStatus;
  /** Optional inline note (for example: 'Replaced by `pds-property`'). */
  note?: string;
}

const STATUS_LABELS: Record<ComponentStatus, string> = {
  stable: 'Stable',
  beta: 'Beta',
  deprecated: 'Deprecated',
};

/**
 * Renders the per-component lifecycle label that mirrors the central
 * Resources/Component status table. Apply once at the top of each
 * component's MDX page so consumers see stability state without
 * navigating elsewhere.
 *
 * Source of truth: `libs/core/src/stories/resources/component-status.docs.mdx`.
 * Keep this badge in sync with that table when a component is promoted
 * or deprecated.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, note }) => {
  const label = STATUS_LABELS[status];
  return (
    <div className="pine-status-badge" data-status={status} role="note" aria-label={`Component status: ${label}`}>
      <span className="pine-status-badge__dot" aria-hidden="true" />
      <span className="pine-status-badge__label">{label}</span>
      {note !== undefined && note !== '' ? <span className="pine-status-badge__note">— {note}</span> : null}
    </div>
  );
};

export default StatusBadge;
