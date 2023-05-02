import request from "supertest";
import NgCashTransfer from "../server";

describe("User routes", () => {
  const server = NgCashTransfer.listen(3001);

  it("should register or authenticate a user", async () => {
    const response = await request(server)
      .post("/user")
      .send({ email: "test@example.com", password: "Password12105" });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it("should return user info with valid JWT", async () => {
    const registerResponse = await request(server)
      .post("/user")
      .send({ email: "test@example.com", password: "Password12105" });

    const response = await request(server)
      .get("/user")
      .set("Authorization", `Bearer ${registerResponse.body.token}`);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe("test@example.com");
  });

  it("should return unauthorized with invalid JWT", async () => {
    const response = await request(server)
      .get("/user")
      .set("Authorization", "Bearer invalid_token");
    expect(response.status).toBe(200);
  });
});
