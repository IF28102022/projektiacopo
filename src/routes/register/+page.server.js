import { fail, redirect } from "@sveltejs/kit";
import { createUser, findUserByEmail, setSessionCookie } from "$lib/server/auth";

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

        if (password.length < 6) {
            return fail(400, { error: "Password must be at least 6 characters." });
        }

        const existing = await findUserByEmail(email);
        if (existing) {
            return fail(400, { error: "Email is already registered. Please sign in." });
        }

        const user = await createUser({ email, password, role: "user" });
        setSessionCookie(cookies, {
            id: user._id.toString(),
            email: user.email,
            role: user.role || "user"
        });

        throw redirect(303, "/spots");
    }
};
