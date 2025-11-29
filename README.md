# Welcome to your Convex + React (Vite) app

This is a [Convex](https://convex.dev/) project created with [`npm create convex`](https://www.npmjs.com/package/create-convex).

After the initial setup (<2 minutes) you'll have a working full-stack app using:

- Convex as your backend (database, server logic)
- [React](https://react.dev/) as your frontend (web page interactivity)
- [Vite](https://vitest.dev/) for optimized web hosting
- [Tailwind](https://tailwindcss.com/) for building great looking accessible UI

## Cloudinary Setup

This project uses `@imaxis/cloudinary-convex` for image management. To get started:

1.  **Sign Up for Cloudinary**: Create a free account at [cloudinary.com](https://cloudinary.com).
2.  **Get Credentials**: From your Cloudinary Dashboard, copy your Cloud Name, API Key, and API Secret.
3.  **Set Environment Variables**: Run the following commands in your project root:

    ```bash
    npx convex env set CLOUDINARY_CLOUD_NAME <your_cloud_name>
    npx convex env set CLOUDINARY_API_KEY <your_api_key>
    npx convex env set CLOUDINARY_API_SECRET <your_api_secret>
    ```

4.  **Restart Development Server**: If your server is running, restart it to pick up the new configuration.

## Using StudioPro

**StudioPro** is a professional-grade image management and transformation interface built into this template. It features a 3-pane layout designed for desktop productivity:

### 1. Library (Left Sidebar)

- **Upload Images**: Click the large "Upload New" card to open the upload modal. You can drag & drop files or browse your computer. The app automatically handles large files (>5MB) via direct upload to bypass server limits.
- **Browse**: Scroll through your uploaded assets.
- **Manage**: Hover over any thumbnail to reveal the **Delete** button.

### 2. Canvas (Center)

- **Selection**: Click any image in the library to load it into the main canvas.
- **Preview**: See real-time previews of your transformations on a professional checkered background.
- **Toolbar**: Use the top toolbar to **Reset** all changes or **Download** the final transformed image.

### 3. Inspector (Right Sidebar)

- **Transformation Controls**: When an image is selected, use the Inspector to apply professional edits.
- **Categories**: Switch between tabs like **Resize**, **Shape**, **Color**, **Artistic**, and **Tune**.
- **Presets**: One-click apply complex effects (e.g., "Vintage", "Circle Crop", "Grayscale").
- **Fine-Tuning**: Use sliders in the **Tune** tab to adjust brightness, contrast, and saturation.

## Get started

If you just cloned this codebase and didn't use `npm create convex`, run:

```
npm install
npm run dev
```

If you're reading this README on GitHub and want to use this template, run:

```
npm create convex@latest -- -t react-vite
```

## Learn more

To learn more about developing your project with Convex, check out:

- The [Tour of Convex](https://docs.convex.dev/get-started) for a thorough introduction to Convex principles.
- The rest of [Convex docs](https://docs.convex.dev/) to learn about all Convex features.
- [Stack](https://stack.convex.dev/) for in-depth articles on advanced topics.

## Join the community

Join thousands of developers building full-stack apps with Convex:

- Join the [Convex Discord community](https://convex.dev/community) to get help in real-time.
- Follow [Convex on GitHub](https://github.com/get-convex/), star and contribute to the open-source implementation of Convex.
