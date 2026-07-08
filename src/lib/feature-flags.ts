/** Feature flags for optional capabilities. AI is off by default in v0.1. */
export const FeatureFlags = {
  aiAssistant: false,
  calendarSync: false,
  plantIdentification: false,
  localOnlyMode: false,
  webDashboard: false,
} as const;
