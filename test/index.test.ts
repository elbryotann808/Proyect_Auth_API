import request from "supertest";
import app from "../src/app.js";
import { describe, it, expect, afterAll, } from "vitest";
import { PrismaClient  } from "@prisma/client"; 

const prisma = new PrismaClient()

const userTest = {
  "name": "test",
  "email": "test@test.com",
  "password": "123",
  "passwordIncorrect": "1234"
}

let tokenAccessTemp = ""
let cookieData = ""

afterAll(async ()=>{ 
  try {
    await prisma.user.deleteMany({ where: { "email": userTest.email} })
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect()
  }
})

describe("POST /register", ()=>{
  it("Create a new user", async ()=>{
    const res = await request(app)
    .post("/api/auth/register")
    .send({
      "name": userTest.name,
      "email": userTest.email,
      "password": userTest.password
    })

    expect(res.status).toBe(201)
    console.log(res.body.user.id);
    expect(res.body).toEqual({
      user: {
        id: expect.any(Number),
        name: userTest.name,
        email: userTest.email,
        role: "user",
        createdAt: expect.any(String)
      },
      accessToken: expect.any(String)
    })

    tokenAccessTemp = res.body.accessToken
    cookieData = String(res.headers["set-cookie"])
  })

  it("I should respond `All fields are required`", async ()=>{
    const res = await request(app)
    .post("/api/auth/register")
    .send({
      "name": userTest.name,
      "password": userTest.password
    })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({
      message: "All fields are required"
    })
  })

  it("I shold respond `Email already registered`", async()=>{
    const res = await request(app)
    .post("/api/auth/register")
    .send({
      name: userTest.name,
      email: userTest.email,
      password: userTest.password
    })

    expect(res.status).toBe(409)
    expect(res.body).toEqual({
      message: "Email already registered"
    })
  })
})

describe("POST /login", ()=>{
  it("loing user", async ()=>{
    const res = await request(app)
    .post("/api/auth/login")
    .send({
      "email": userTest.email,
      "password": userTest.password
    })

    expect(res.status).toBe(200)
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Logged in",
        user: {
          id: expect.any(Number),
          name: "test",
          email: "test@test.com",
          createdAt: expect.any(String)
        },
        accessToken: expect.any(String)
      })
    )    
  })

  it("I shold respond `All fields are required`", async()=>{
    const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: userTest.email
    })  

    expect(res.status).toBe(400)
    expect(res.body).toEqual({
      message: "All fields are required"
    })
  })

  it("I shold respond `Invalid credentials`", async()=>{
    const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: userTest.email,
      password: userTest.passwordIncorrect,
    })

    expect(res.status).toBe(401)
  })

  it("I should respod `Invalid request body`", async ()=>{
    const res = await request(app)
    .post("/api/auth/login")
    .send()

    expect(res.status).toBe(422)
    expect(res.body).toEqual({
      message: "Invalid request body"
    })
  })
})

// </>
describe("POST /refresh", ()=>{
  it("I should ruturn a new token", async()=>{
    const res = await request(app)
    .post("/api/auth/refresh")
    .set("Cookie", cookieData)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      accessToken: expect.any(String)
    })
  })

  it("I should `Missing refresh token`", async()=>{
    const res = await request(app)
    .post("/api/auth/refresh")
    .send()

    expect(res.status).toBe(400)
    expect(res.body).toEqual({
      message: "Missing refresh token"
    })
  })

  it("I should `Invalid or revoked refresh token`", async()=>{
    const res = await request(app)
    .post("/api/auth/refresh")
    .set("Authorization", `Hola mundo`)

    expect(res.status).toBe(401)
    expect(res.body).toEqual({
      message: "Invalid or revoked refresh token"
    })
  })

  // Agregar una validacion para el error 404
})

describe("POST /logout", ()=>{
  it("Log out the user using a token in the Autorization headers ", async ()=>{
    const res = await request(app)
    .post("/api/auth/logout")
    .set("Authorization", `Bearer ${tokenAccessTemp}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      message: "Logged out"
    })
  })

  it("Log out the user using a session cookie", async()=>{
    const res = await request(app)
    .post("/api/auth/logout")
    .set("Cookie", cookieData)

    expect(res.status).toBe(200)
  })

  it("I should respond `Missing refresh token`", async ()=>{
    const res = await request(app)
    .post("/api/auth/logout")
    .send()

    expect(res.status).toBe(400)
    expect(res.body).toEqual({
      message: "Missing refresh token"
    })
  })
})

// </>
describe("GET /me", ()=>{
  it("I should respond with data to the user", async()=>{
    const res = await request(app)
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${tokenAccessTemp}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      id: expect.any(Number),
      name: userTest.name,
      email: userTest.email,
      role: "user",
      createdAt: expect.any(String),
    })
  })

  it("I should respond `Autorization token missing`", async()=>{
    const res = await request(app)
    .get("/api/auth/me")
    .send()

    expect(res.status).toBe(401)
    expect(res.body).toEqual({
      message: "Autorization token missing"
    })
  })

  // Documentar el codigo de error 404
})

describe("GET /connection", () => {
  it("Auth API - verification the server, i should responde with the current date", async () => {
    const res = await request(app)
    .get("/api/auth/connection")
    .send()

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      [{
        now: expect.any(String)
      }]
    ) 
  });
})