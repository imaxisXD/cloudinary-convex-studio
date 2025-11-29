import { defineApp } from "convex/server";
import cloudinary from "@imaxis/cloudinary-convex/convex.config";

const app = defineApp();
app.use(cloudinary);

export default app;
