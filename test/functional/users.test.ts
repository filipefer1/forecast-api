import { User } from "@src/models/user";
import AuthServices from "@src/services/auth";

describe("Users functional test", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  describe("When creating a new user", () => {
    it("should successfully create a new user with encrypted password", async () => {
      const newUser = {
        name: "John Doe",
        email: "john@mail.com",
        password: "123456",
      };
      const response = await global.testRequest.post("/users").send(newUser);

      await expect(
        AuthServices.comparePasswords(newUser.password, response.body.password)
      ).resolves.toBeTruthy();
      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
        })
      );
    });

    it("should return when there is a validation error", async () => {
      const newUser = {
        email: "john@mail.com",
        password: "123456",
      };
      const response = await global.testRequest.post("/users").send(newUser);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        error: "Bad Request",
        message: "User validation failed: name: Path `name` is required.",
      });
    });

    it("should return 409 when the email already exists", async () => {
      const newUser = {
        name: "John Doe",
        email: "john@mail.com",
        password: "123456",
      };
      await global.testRequest.post("/users").send(newUser);
      const response = await global.testRequest.post("/users").send(newUser);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: "Conflict",
        message:
          "User validation failed: email: already exists in the database.",
      });
    });
  });

  describe("When authenticating a user", () => {
    it("should generate a token for a valid user", async () => {
      const newUser = {
        name: "John Doe",
        email: "john@mail.com",
        password: "123456",
      };
      await new User(newUser).save();
      const response = await global.testRequest
        .post("/users/authenticate")
        .send({ email: newUser.email, password: newUser.password });
      expect(response.body).toEqual(
        expect.objectContaining({ token: expect.any(String) })
      );
    });

    it("should return UNAUTHORIZED if the user with the given email  is not found", async () => {
      const response = await global.testRequest
        .post("/users/authenticate")
        .send({ email: "some_email@email.com", password: "1234" });

      expect(response.status).toBe(401);
    });

    it("shoudl return UNAUTHORIZED if the user is found but the password does not match", async () => {
      const newUser = {
        name: "John Doe",
        email: "john@mail.com",
        password: "123456",
      };
      await new User(newUser).save();
      const response = await global.testRequest
        .post("/users/authenticate")
        .send({ email: newUser.email, password: "different password" });
      expect(response.status).toBe(401);
    });
  });

  describe("When getting user profille info", () => {
    it("should return the token's owner profile information", async () => {
      const newUser = {
        name: "John Doe",
        email: "john@mail.com",
        password: "123456",
      };
      const user = await new User(newUser).save();
      const token = AuthServices.generateToken(user.toJSON());
      const { body, status } = await global.testRequest
        .get("/users/me")
        .set({ "x-access-token": token });

      expect(status).toBe(200);
      expect(body).toMatchObject(JSON.parse(JSON.stringify({ user })));
    });

    it("should return not found when the user is not found", async () => {
      const newUser = {
        name: "John Doe",
        email: "john@mail.com",
        password: "123456",
      };
      const user = await new User(newUser);
      const token = AuthServices.generateToken(user.toJSON());
      const { body, status } = await global.testRequest
        .get("/users/me")
        .set({ "x-access-token": token });

      expect(status).toBe(404);
      expect(body.message).toBe("User not found!");
    });
  });
});
