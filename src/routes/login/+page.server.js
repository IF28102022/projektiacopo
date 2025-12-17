import { authenticate, createSessionCookie } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";

export function load({ locals, url }) {
    if (locals.user) {
        const next = url.searchParams.get("next");
        throw redirect(303, next || "/spots");
    }
    return {};
}

export const actions = {
    default: async ({ request, cookies, url }) => {
        const form = await request.formData();
        const email = form.get("email");
        const password = form.get("password");

        const user = await authenticate(email, password);
        if (!user) {
            return fail(400, {
                message: "Login fehlgeschlagen. Bitte Zugangsdaten prüfen.",
                email,
            });
        }

        const secure = url.protocol === "https:";
        createSessionCookie(cookies, user, secure);

        const next = url.searchParams.get("next");
        throw redirect(303, next || "/spots");
    },
};
