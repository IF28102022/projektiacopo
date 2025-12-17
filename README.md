# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Auth Setup

Create a `.env` with the credentials for the new Login:

- `AUTH_SECRET` – random long string for signing the session cookie.
- `OWNER_EMAIL` / `OWNER_PASSWORD` – deine persönlichen Owner-Zugangsdaten.
- `USER_PASSWORD` – gemeinsames Passwort für alle anderen Nutzer:innen (Leserechte).
- Optional: Registrierungs-Flow legt Nutzer:innen in MongoDB (`users` Collection) an
  und vergibt Rolle `user`. Owner-Rechte bleiben an die ENV-Credentials gebunden.

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
