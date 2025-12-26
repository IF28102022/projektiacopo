import { clearSessionCookie } from "$lib/server/auth";
import { redirect } from "@sveltejs/kit";

export const GET = ({ cookies }) => {
    clearSessionCookie(cookies);
    throw redirect(303, "/");
};
