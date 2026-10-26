// Tier Capabilities Matrix (Config-driven, no hardcoded values)
const TIER_CONFIG = {
  free: {
    maxActiveClients: 5,
    customDomain: false,
    advancedAnalytics: false,
    exportPdfInvoices: true,
    noteTemplates: ["soap_basic"],
  },
  pro: {
    maxActiveClients: 50,
    customDomain: true,
    advancedAnalytics: true,
    exportPdfInvoices: true,
    noteTemplates: ["soap_basic", "dap_protocol", "cbt_ladder"],
  },
  practice: {
    maxActiveClients: 9999,
    customDomain: true,
    advancedAnalytics: true,
    exportPdfInvoices: true,
    noteTemplates: ["soap_basic", "dap_protocol", "cbt_ladder", "biopsychosocial"],
  },
};

/**
 * Single source of truth for feature access
 * @param {string} tier - Current tier of the therapist ("free" | "pro" | "practice")
 * @param {string} featureKey - Feature name ("advancedAnalytics", "customDomain", etc.)
 * @returns {boolean}
 */
exports.canAccess = (tier = "pro", featureKey) => {
  const currentConfig = TIER_CONFIG[tier.toLowerCase()] || TIER_CONFIG.free;
  return Boolean(currentConfig[featureKey]);
};

exports.getTierLimits = (tier = "pro") => {
  return TIER_CONFIG[tier.toLowerCase()] || TIER_CONFIG.free;
};
