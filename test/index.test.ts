import request from "supertest";
import app from "../src/app.js";
import { describe, it, expect, } from "vitest";

describe("Auth API - verificacion del servidor", () => {
  it("GET /api/auth/ -> 200 (DB real)", async () => {
    const res = await request(app).get("/api/auth/");
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });
})