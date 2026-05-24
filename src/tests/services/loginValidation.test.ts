import { loginValidationSchema } from "../../utils/validationSchemas";

describe("loginValidationSchema", () => {
  it("passes for valid email and password", async () => {
    await expect(
      loginValidationSchema.validate({ email: "user@example.com", password: "secret123" }),
    ).resolves.toBeDefined();
  });

  it("rejects invalid email", async () => {
    await expect(
      loginValidationSchema.validate({ email: "not-an-email", password: "secret123" }),
    ).rejects.toThrow("Invalid email");
  });

  it("rejects empty email", async () => {
    await expect(
      loginValidationSchema.validate({ email: "", password: "secret123" }),
    ).rejects.toThrow("Email is required");
  });

  it("rejects empty password", async () => {
    await expect(
      loginValidationSchema.validate({ email: "user@example.com", password: "" }),
    ).rejects.toThrow("Password is required");
  });

  it("rejects missing email field", async () => {
    await expect(
      loginValidationSchema.validate({ password: "secret123" }),
    ).rejects.toThrow("Email is required");
  });

  it("rejects missing password field", async () => {
    await expect(
      loginValidationSchema.validate({ email: "user@example.com" }),
    ).rejects.toThrow("Password is required");
  });

  it("strips unknown fields when stripUnknown is set", async () => {
    const result = await loginValidationSchema.validate(
      { email: "user@example.com", password: "secret123", extraField: "ignored" },
      { stripUnknown: true },
    );
    expect(result).not.toHaveProperty("extraField");
  });
});
