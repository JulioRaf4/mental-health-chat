# Mental Health Chatbot

A tool designed to assist psychologists and patients in the field of mental health. Built with Next.js and Vercel's AI SDK, this chatbot template leverages the `streamText` function on the server and the `useChat` hook on the client to enable a seamless and supportive interaction experience for therapy and mental well-being applications.

<picture align="center">
  <img align="center" alt="Briefer usage diagram" src="https://www.ucheck.co.uk/wp-content/uploads/mental-health-2313426_1280.png">
</picture>


## Running Locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run this project. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env.local` file is all that is necessary.

> **Note:** You should **not** commit your `.env.local` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

### Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key. Obtain it from [OpenAI API Keys](https://platform.openai.com/account/api-keys).
- `AUTH_SECRET`: A secret key for authentication. Generate one at [Generate Secret](https://generate-secret.vercel.app/32).
- `BLOB_READ_WRITE_TOKEN`: Token for Vercel Blob storage. Refer to [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob).
- `POSTGRES_URL`: Your Vercel Postgres database URL. Follow the [Vercel Postgres Quickstart](https://vercel.com/docs/storage/vercel-postgres/quickstart) to set it up.

### Steps to Run

1. **Install Dependencies:**

    ```bash
    pnpm install

2. **Build**
    ```bash
    pnpm run build

3. **Run the Development Server:**

    ```bash
    pnpm run dev

 **Your app should now be running on localhost:3000.**
