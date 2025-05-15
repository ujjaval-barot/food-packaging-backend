// Category labels
export const CATEGORY_LABELS = ["featured", "trending", "popular"] as const;
export type CategoryLabel = (typeof CATEGORY_LABELS)[number];

// Product tags
export const TAGS = ["featured", "trending", "popular"] as const;
export type TagActions = (typeof TAGS)[number];

// Product tag actions
export const TAG_ACTIONS = ["product", "category"] as const;
export type Tags = (typeof TAG_ACTIONS)[number];

// Asset modules
export const ASSET_MODULES = ["product", "category"] as const;
export type AssetModule = (typeof ASSET_MODULES)[number];
