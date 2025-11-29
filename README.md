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
