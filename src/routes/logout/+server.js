import { clearSession } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";

export function GET({ cookies }) {
    clearSession(cookies);
    throw redirect(303, "/login");
}
