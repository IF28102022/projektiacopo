import { ensureAdminSeed, parseSessionToken, clearSessionCookie } from "$lib/server/auth";

export const handle = async ({ event, resolve }) => {
    await ensureAdminSeed().catch((err) => {
        console.error("Admin-Seed fehlgeschlagen", err);
    });

    const token = event.cookies.get("session");
    const session = parseSessionToken(token);

    if (session?.id && session?.role) {
        event.locals.user = {
            id: session.id,
            email: session.email,
            role: session.role
        };
    } else {
        if (token) {
            clearSessionCookie(event.cookies);
        }
        event.locals.user = null;
    }

    return resolve(event);
};
