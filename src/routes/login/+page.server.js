import { fail, redirect } from "@sveltejs/kit";
import { findUserByEmail, verifyPassword, setSessionCookie } from "$lib/server/auth";

export const load = async ({ locals }) => {
    if (locals.user) throw redirect(303, "/spots");
    return {};
};

export const actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData();
        const email = String(form.get("email") || "").trim().toLowerCase();
        const password = String(form.get("password") || "").trim();

        if (!email || !password) {
            return fail(400, { error: "Please provide email and password." });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return fail(400, { error: "No account found. Please register." });
        }

        if (!verifyPassword(password, user.passwordHash)) {
            return fail(400, { error: "Sign in failed." });
        }

        setSessionCookie(cookies, {
            id: user._id.toString(),
            email: user.email,
            role: user.role || "user"
        });

        throw redirect(303, "/spots");
    }
};
