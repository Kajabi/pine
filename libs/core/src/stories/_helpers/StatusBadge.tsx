import React from 'react';

import componentStatus from '../resources/component-status.json';
import './StatusBadge.css';

export type ComponentStatus = 'stable' | 'beta' | 'deprecated';

/** Display-only when manifest lookup fails or status is invalid. */
type ResolvedStatus = ComponentStatus | 'unknown';

export interface StatusBadgeProps {
  /**
   * Component tag (for example `pds-button`). When provided the badge
   * reads the lifecycle label from `component-status.json` so the badge
   * and the central status table cannot drift.
   */
  component?: string;

  /**
   * Lifecycle label override. Takes priority over the JSON manifest when
   * both are set — use to force a status that differs from the central
   * table (rare; prefer updating the JSON manifest).
   */
  status?: ComponentStatus;

  /** Optional inline note (for example: 'Replaced by `pds-property`'). */
  note?: string;
}

interface ComponentEntry {
  status: ComponentStatus;
  note?: string;
}

const VALID_STATUSES: readonly ComponentStatus[] = ['stable', 'beta', 'deprecated'];

const STATUS_LABELS: Record<ResolvedStatus, string> = {
  stable: 'Stable',
  beta: 'Beta',
  deprecated: 'Deprecated',
  unknown: 'Unknown',
};

const COMPONENTS = componentStatus.components as Record<string, ComponentEntry>;

function isComponentStatus(value: unknown): value is ComponentStatus {
  return typeof value === 'string' && (VALID_STATUSES as readonly string[]).includes(value);
}

function isComponentEntry(value: unknown): value is ComponentEntry {
  return value != null && typeof value === 'object';
}

function warnDev(message: string): void {
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(`[StatusBadge] ${message}`);
  }
}

function resolveStatus(
  component: string | undefined,
  status: ComponentStatus | undefined,
  entry: ComponentEntry | undefined,
): ResolvedStatus {
  if (status !== undefined) {
    if (!isComponentStatus(status)) {
      warnDev(`Invalid status prop "${status}".`);
      return 'unknown';
    }
    return status;
  }

  if (isComponentEntry(entry)) {
    if (!isComponentStatus(entry.status)) {
      warnDev(
        `Invalid status "${String(entry.status)}" for "${component ?? 'component'}" in component-status.json.`,
      );
      return 'unknown';
    }
    return entry.status;
  }

  if (component !== undefined) {
    warnDev(`"${component}" is not listed in component-status.json.`);
    return 'unknown';
  }

  return 'stable';
}

function buildAriaLabel(label: string, note: string | undefined): string {
  if (note !== undefined && note !== '') {
    return `Component status: ${label}. ${note}`;
  }
  return `Component status: ${label}`;
}

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
  const rawEntry = component !== undefined ? COMPONENTS[component] : undefined;
  let entry: ComponentEntry | undefined;

  if (rawEntry === undefined) {
    entry = undefined;
  } else if (isComponentEntry(rawEntry)) {
    entry = rawEntry;
  } else {
    warnDev(`Invalid entry for "${component}" in component-status.json.`);
    entry = undefined;
  }

  const resolvedStatus = resolveStatus(component, status, entry);
  const resolvedNote =
    note ?? (status === undefined && entry !== undefined ? entry.note : undefined);
  const label = STATUS_LABELS[resolvedStatus];
  const ariaLabel = buildAriaLabel(label, resolvedNote);

  return (
    <div
      className="pine-status-badge"
      data-status={resolvedStatus}
      role="note"
      aria-label={ariaLabel}
    >
      <span className="pine-status-badge__dot" aria-hidden="true" />
      <span className="pine-status-badge__label">{label}</span>
      {resolvedNote !== undefined && resolvedNote !== '' ? (
        <span className="pine-status-badge__note">— {resolvedNote}</span>
      ) : null}
    </div>
  );
};
