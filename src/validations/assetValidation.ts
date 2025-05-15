import { z } from "zod";

export const assetUploadReqSchema = z.object({
  module: z.enum(["product", "category"]),
});
