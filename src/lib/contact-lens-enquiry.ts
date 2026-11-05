/**
 * What the visitor is asking about. "coloured" is the fashion (cosmetic) lenses page, which has no prescription step.
 * Shared by the browser and the server.
 */
export type EnquiryTopic = "contact" | "coloured";

/** Limits for the "Ask about contact lenses" form, shared by the browser and the server. */
export const MAX_FILES = 3;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_FILES = "image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif,application/pdf";
