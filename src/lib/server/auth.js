import crypto from "node:crypto";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";
import { getDb } from "$lib/server/db";

const COOKIE_NAME = "sps_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 Tage
const HASH_ITERATIONS = 120_000;
const HASH_KEYLEN = 64;
const HASH_DIGEST = "sha512";

const ownerEmail = (env.OWNER_EMAIL || "").trim().toLowerCase();
const ownerPassword = env.OWNER_PASSWORD || "";
const userPassword = env.USER_PASSWORD || "";

const sessionSecret = env.AUTH_SECRET || crypto.randomBytes(32).toString("hex");
if (!env.AUTH_SECRET) {
    console.warn("AUTH_SECRET fehlt. Verwende temporäres Secret für Dev.");
}

function sign(payload) {
    const base = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = crypto
        .createHmac("sha256", sessionSecret)
        .update(base)
        .digest("base64url");
    return `${base}.${signature}`;
}

function verify(token) {
    if (!token || typeof token !== "string") return null;

    const [base, signature] = token.split(".");
    if (!base || !signature) return null;

    try {
        const expected = crypto
            .createHmac("sha256", sessionSecret)
            .update(base)
            .digest("base64url");

        const sigBuf = Buffer.from(signature, "base64url");
        const expBuf = Buffer.from(expected, "base64url");
        if (sigBuf.length !== expBuf.length) return null;
        if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

        const payload = JSON.parse(Buffer.from(base, "base64url").toString("utf8"));
        if (!payload?.role || !payload?.email) return null;
        return {
            email: payload.email,
            role: payload.role,
            name: payload.name || "",
            issuedAt: payload.issuedAt || Date.now(),
        };
    } catch (err) {
        console.error("Konnte Session nicht lesen", err);
        return null;
    }
}

async function findUserByEmail(email) {
    if (!email) return null;
    const db = await getDb();
    return db.collection("users").findOne({ email });
}

async function hashPassword(password, salt) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(
            password,
            salt,
            HASH_ITERATIONS,
            HASH_KEYLEN,
            HASH_DIGEST,
            (err, derivedKey) => {
                if (err) return reject(err);
                resolve(derivedKey.toString("hex"));
            },
        );
    });
}

async function verifyPassword(password, user) {
    if (!user?.salt || !user?.passwordHash) return false;
    const hash = await hashPassword(password, user.salt);
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(user.passwordHash));
}

export async function authenticate(emailRaw, passwordRaw) {
    const email = (emailRaw || "").trim().toLowerCase();
    const password = passwordRaw ? String(passwordRaw) : "";

    if (ownerEmail && ownerPassword && email === ownerEmail && password === ownerPassword) {
        return { email, role: "owner", name: "Owner" };
    }

    const userDoc = await findUserByEmail(email);
    if (userDoc && (await verifyPassword(password, userDoc))) {
        return {
            email: userDoc.email,
            role: userDoc.role || "user",
            name: userDoc.name || userDoc.email,
        };
    }

    if (userPassword && password === userPassword) {
        return {
            email: email || "gast",
            role: "user",
            name: email || "Gast",
        };
    }

    return null;
}

export function createSessionCookie(cookies, user, secure = false) {
    const token = sign({
        email: user.email,
        role: user.role,
        name: user.name || "",
        issuedAt: Date.now(),
    });

    cookies.set(COOKIE_NAME, token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure,
        maxAge: SESSION_MAX_AGE,
    });
}

export function readSessionFromCookies(cookies) {
    const token = cookies.get(COOKIE_NAME);
    return verify(token);
}

export function clearSession(cookies) {
    cookies.delete(COOKIE_NAME, { path: "/" });
}

export function requireOwner(locals) {
    if (locals?.user?.role !== "owner") {
        throw error(403, "Nur der Owner darf diese Aktion ausführen.");
    }
}

export async function registerUser({ emailRaw, passwordRaw, nameRaw }) {
    const email = (emailRaw || "").trim().toLowerCase();
    const password = passwordRaw ? String(passwordRaw) : "";
    const name = (nameRaw || "").trim();

    if (!email || !password) {
        throw error(400, "E-Mail und Passwort sind Pflicht.");
    }

    const db = await getDb();
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
        throw error(400, "E-Mail ist bereits registriert.");
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = await hashPassword(password, salt);

    const doc = {
        email,
        name: name || email,
        role: "user",
        salt,
        passwordHash,
        createdAt: new Date(),
    };

    await db.collection("users").insertOne(doc);

    return { email: doc.email, role: doc.role, name: doc.name };
}
