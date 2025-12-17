import { redirect } from "@sveltejs/kit";
import { readSessionFromCookies } from "$lib/server/auth";

const PROTECTED = ["/spots", "/ai"];

function isProtectedPath(pathname) {
    if (pathname === "/login" || pathname.startsWith("/login/")) return false;
    if (pathname === "/logout" || pathname.startsWith("/logout/")) return false;
    if (pathname === "/") return false;
    return PROTECTED.some((base) =>
        pathname === base || pathname.startsWith(`${base}/`),
    );
}

export const handle = async ({ event, resolve }) => {
    event.locals.user = readSessionFromCookies(event.cookies);

    if (!event.locals.user && isProtectedPath(event.url.pathname)) {
        const next = `${event.url.pathname}${event.url.search}`;
        throw redirect(303, `/login?next=${encodeURIComponent(next)}`);
    }

    return resolve(event);
};
