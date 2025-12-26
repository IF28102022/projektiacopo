import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "crypto";
import { AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD } from "$env/static/private";
import { ObjectId } from "mongodb";
import { getDb } from "$lib/server/db";

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 Tage

function getSecret() {
    if (!AUTH_SECRET) {
        throw new Error("AUTH_SECRET ist nicht gesetzt");
    }
    return AUTH_SECRET;
}

export function hashPassword(password) {
    const salt = randomBytes(16);
    const hash = scryptSync(password, salt, 64);
    return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(password, stored) {
    if (!stored) return false;
    const [saltHex, hashHex] = stored.split(":");
    if (!saltHex || !hashHex) return false;
    const salt = Buffer.from(saltHex, "hex");
    const hash = Buffer.from(hashHex, "hex");
    const candidate = scryptSync(password, salt, hash.length);
    return timingSafeEqual(hash, candidate);
}

function sign(data) {
    const secret = getSecret();
    return createHmac("sha256", secret).update(data).digest("hex");
}

export function createSessionToken(payload) {
    const json = JSON.stringify(payload);
    const b64 = Buffer.from(json).toString("base64url");
    const sig = sign(b64);
    return `${b64}.${sig}`;
}

export function parseSessionToken(token) {
    if (!token) return null;
    const [b64, sig] = token.split(".");
    if (!b64 || !sig) return null;
    const expected = sign(b64);
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    try {
        return JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
    } catch (err) {
        console.error("Konnte Session nicht parsen", err);
        return null;
    }
}

export function setSessionCookie(cookies, payload) {
    const token = createSessionToken(payload);
    cookies.set(SESSION_COOKIE, token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: SESSION_MAX_AGE
    });
}

export function clearSessionCookie(cookies) {
    cookies.delete(SESSION_COOKIE, { path: "/" });
}

export async function findUserByEmail(email) {
    const db = await getDb();
    return db.collection("users").findOne({ email: email.toLowerCase() });
}

export async function createUser({ email, password, role = "user" }) {
    const db = await getDb();
    const existing = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (existing) return existing;
    const passwordHash = hashPassword(password);
    const now = new Date();
    const { insertedId } = await db.collection("users").insertOne({
        email: email.toLowerCase(),
        passwordHash,
        role,
        createdAt: now
    });
    return { _id: insertedId, email: email.toLowerCase(), role, createdAt: now };
}

let adminSeeded = false;
export async function ensureAdminSeed() {
    if (adminSeeded) return;
    adminSeeded = true;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.warn("ADMIN_EMAIL/ADMIN_PASSWORD nicht gesetzt – kein Admin-Seed erstellt.");
        return;
    }
    const db = await getDb();
    const existing = await db.collection("users").findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (existing) return;
    const passwordHash = hashPassword(ADMIN_PASSWORD);
    await db.collection("users").insertOne({
        email: ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role: "admin",
        createdAt: new Date()
    });
    console.log("Admin-User angelegt:", ADMIN_EMAIL);
}

export function toObjectId(value) {
    try {
        return new ObjectId(value);
    } catch (e) {
        return null;
    }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
