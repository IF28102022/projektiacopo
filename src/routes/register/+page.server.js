import { createSessionCookie, registerUser } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";

export function load({ locals }) {
    if (locals.user) {
        throw redirect(303, "/spots");
    }
    return {};
}

export const actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData();
        const email = form.get("email");
        const password = form.get("password");
        const name = form.get("name");

        if (!password || String(password).length < 6) {
            return fail(400, {
                message: "Passwort muss mindestens 6 Zeichen haben.",
                email,
                name,
            });
        }

        try {
            const user = await registerUser({ emailRaw: email, passwordRaw: password, nameRaw: name });
            createSessionCookie(cookies, user, false);
            throw redirect(303, "/spots");
        } catch (err) {
            const message = err?.message || "Registrierung fehlgeschlagen.";
            return fail(400, { message, email, name });
        }
    },
};
