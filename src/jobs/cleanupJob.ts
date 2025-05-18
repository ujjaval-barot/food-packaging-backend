import cloudinary from "../config/cloudinary";
import Category from "../models/Category";
import Product from "../models/Product";

export const cleanUpUnusedAssets = async () => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "", // or "categories/"
      max_results: 500,
    });

    const allAssets = result.resources;
    console.log(`Total assets in Cloudinary: ${allAssets.length}`);

    type ProductAssetDoc = { assets?: { publicId: string }[] };

    const extractPublicIds = (docs: { assets?: { publicId: string }[] }[]) =>
      docs.flatMap((doc) => doc.assets?.map((a) => a.publicId) || []);

    const productAssets = await Product.find({}, "assets").lean<
      ProductAssetDoc[]
    >();
    const productPublicIds = extractPublicIds(productAssets);

    const categoryAssets = await Category.find({}, "assets").lean<
      ProductAssetDoc[]
    >();
    const categoryPublicIds = extractPublicIds(categoryAssets);

    const dbPublicIds = [...productPublicIds, ...categoryPublicIds];
    console.log(`Total DB public IDs: ${dbPublicIds.length}`);

    const unusedAssets = allAssets.filter(
      (asset: any) => !dbPublicIds.includes(asset.public_id)
    );
    console.log(`Unused assets to delete: ${unusedAssets.length}`);

    for (const asset of unusedAssets) {
      await cloudinary.uploader.destroy(asset.public_id, {
        resource_type: asset.resource_type,
      });
      console.log(`Deleted unused asset: ${asset.public_id}`);
    }
  } catch (error) {
    console.log(error);
  }
};

// Schedule: every day at 2 AM
// cron.schedule("0 2 * * *", cleanUpUnusedAssets);
