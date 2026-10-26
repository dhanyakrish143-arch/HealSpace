// src/services/entitlementService.js
// Single source of truth for tier-based feature gating (Module 7 Specification)

const TIER_CONFIG = {
  FREE: {
    maxActiveClients: 5,
    noteTemplates: ["freeform"],
    analyticsDepth: "basic",
    canExportPdf: false,
    customBranding: false
  },
  GROWTH: {
    maxActiveClients: 25,
    noteTemplates: ["freeform", "soap"],
    analyticsDepth: "advanced",
    canExportPdf: true,
    customBranding: true
  },
  PRO: {
    maxActiveClients: Infinity,
    noteTemplates: ["freeform", "soap", "dap"],
    analyticsDepth: "full_aggregations",
    canExportPdf: true,
    customBranding: true
  }
};

async function canAccess(therapistTier = "GROWTH", featureKey, context = {}) {
  const tierSettings = TIER_CONFIG[therapistTier.toUpperCase()] || TIER_CONFIG.FREE;

  switch (featureKey) {
    case "ACTIVE_CLIENT_CAP":
      return (context.currentClientCount || 0) < tierSettings.maxActiveClients;

    case "SOAP_NOTE_TEMPLATE":
      return tierSettings.noteTemplates.includes("soap");

    case "DAP_NOTE_TEMPLATE":
      return tierSettings.noteTemplates.includes("dap");

    case "ADVANCED_ANALYTICS":
      return tierSettings.analyticsDepth !== "basic";

    case "PDF_INVOICE_EXPORT":
      return Boolean(tierSettings.canExportPdf);

    default:
      return true;
  }
}

module.exports = {
  canAccess,
  TIER_CONFIG
};
