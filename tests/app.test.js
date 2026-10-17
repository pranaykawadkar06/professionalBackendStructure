// import { jest } from "@jest/globals";
import request from "supertest";
import app from "../app.js";

describe("Express app", () => {
    test("unknown route should return 404", async () => {
        const response = await request(app).get("/this-route-does-not-exist");

        expect(response.statusCode).toBe(404);
    });
});

test("signup should reject an empty request", async () => {
    const response = await request(app)
        .post("/signup")
        .send({});

    expect(response.statusCode).toBe(400);
});


test("login should reject an empty request", async () => {
    const response = await request(app)
        .post("/login")
        .send({});

    expect(response.statusCode).toBe(400);
});

test("protected route should reject unauthenticated requests", async () => {
    const response = await request(app)
        .get("/api/users/profile");

    expect(response.statusCode).toBe(401);
});


test("protected route should reject an invalid token", async () => {
    const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", "Bearer invalid-token");

    expect(response.statusCode).toBe(401);
});

// test("should handle application error correctly", async () => {
//     const response = await request(app).get("/test-error")

//     expect(response.statusCode).toBe(400);
//     expect(response.body.message).toBe("Test error");
// });

test("signup route should reject invalid fields", async () => {
    const response = await request(app)
        .post("/signup")
        .send(
            {
                email: "pranay",
                password: "pranay123"
            }
        )

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid email format");
})

test("signup should reject a short password", async () => {
    const response = await request(app)
        .post("/signup")
        .send({
            email: "pranay@example.com",
            password: "123"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
        "password must be of minimum 6 length"
    );
});

test("login should reject invalid fields", async () => {
    const response = await request(app)
        .post("/login")
        .send({
            email: "pranaykawadkar2006@gmail.com",
            password : "pranay@2006",
            role: "user"
        })

        expect(response.statusCode).toBe(400);
});

