// Category labels
export const CATEGORY_LABELS = ["featured", "trending", "popular"] as const;
export type CategoryLabel = (typeof CATEGORY_LABELS)[number];

// Product tags
export const TAGS = ["featured", "trending", "popular"] as const;
export type TagActions = (typeof TAGS)[number];

// Product tag actions
export const TAG_ACTIONS = ["add", "remove"] as const;
export type Tags = (typeof TAG_ACTIONS)[number];

// Asset modules
export const ASSET_MODULES = ["product", "category"] as const;
export type AssetModule = (typeof ASSET_MODULES)[number];

// Asset modules
export const ASSET_TYPES = ["image", "video"] as const;
export type AssetTypes = (typeof ASSET_TYPES)[number];

// Asset size validations
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

// Asset type validations
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/mov"];
