import React from 'react';

import componentStatus from '../resources/component-status.json';
import './StatusBadge.css';

export type ComponentStatus = 'stable' | 'beta' | 'deprecated';

export interface StatusBadgeProps {
  /**
   * Component tag (for example `pds-button`). When provided the badge
   * reads the lifecycle label from `component-status.json` so the badge
   * and the central status table cannot drift.
   */
  component?: string;

  /**
   * Lifecycle label override. Only used when `component` is omitted, or
   * to force a status that differs from the central table (rare —
   * prefer updating the JSON manifest).
   */
  status?: ComponentStatus;

  /** Optional inline note (for example: 'Replaced by `pds-property`'). */
  note?: string;
}

interface ComponentEntry {
  status: ComponentStatus;
  note?: string;
}

const STATUS_LABELS: Record<ComponentStatus, string> = {
  stable: 'Stable',
  beta: 'Beta',
  deprecated: 'Deprecated',
};

const COMPONENTS = componentStatus.components as Record<string, ComponentEntry>;

/**
 * Renders the per-component lifecycle label that mirrors the central
 * Resources/Component status table. Apply once at the top of each
 * component's MDX page so consumers see stability state without
 * navigating elsewhere.
 *
 * Source of truth: `libs/core/src/stories/resources/component-status.json`.
 * Pass the component tag (`component="pds-button"`) so the badge stays
 * in sync automatically.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ component, status, note }) => {
  const entry = component !== undefined ? COMPONENTS[component] : undefined;
  const resolvedStatus: ComponentStatus = entry?.status ?? status ?? 'stable';
  const resolvedNote = note ?? entry?.note;
  const label = STATUS_LABELS[resolvedStatus];

  return (
    <div
      className="pine-status-badge"
      data-status={resolvedStatus}
      role="note"
      aria-label={`Component status: ${label}`}
    >
      <span className="pine-status-badge__dot" aria-hidden="true" />
      <span className="pine-status-badge__label">{label}</span>
      {resolvedNote !== undefined && resolvedNote !== '' ? (
        <span className="pine-status-badge__note">— {resolvedNote}</span>
      ) : null}
    </div>
  );
};

export default StatusBadge;
