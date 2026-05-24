import { signupValidationSchema } from "../../utils/validationSchemas";

describe("signupValidationSchema", () => {
  it("passes for valid signup data", async () => {
    await expect(
      signupValidationSchema.validate({
        name: "John Doe",
        email: "john@example.com",
        password: "secret123",
        confirmPassword: "secret123",
      }),
    ).resolves.toBeDefined();
  });

  it("rejects empty name", async () => {
    await expect(
      signupValidationSchema.validate({
        name: "",
        email: "john@example.com",
        password: "secret123",
        confirmPassword: "secret123",
      }),
    ).rejects.toThrow("Name is required");
  });

  it("rejects invalid email", async () => {
    await expect(
      signupValidationSchema.validate({
        name: "John",
        email: "bad-email",
        password: "secret123",
        confirmPassword: "secret123",
      }),
    ).rejects.toThrow("Invalid email");
  });

  it("rejects password shorter than 6 characters", async () => {
    await expect(
      signupValidationSchema.validate({
        name: "John",
        email: "john@example.com",
        password: "12345",
        confirmPassword: "12345",
      }),
    ).rejects.toThrow("Password must be at least 6 characters");
  });

  it("rejects mismatched passwords", async () => {
    await expect(
      signupValidationSchema.validate({
        name: "John",
        email: "john@example.com",
        password: "secret123",
        confirmPassword: "different",
      }),
    ).rejects.toThrow("Passwords must match");
  });

  it("rejects empty confirm password", async () => {
    await expect(
      signupValidationSchema.validate({
        name: "John",
        email: "john@example.com",
        password: "secret123",
        confirmPassword: "",
      }),
    ).rejects.toThrow();
  });

  it("rejects missing name field", async () => {
    await expect(
      signupValidationSchema.validate({
        email: "john@example.com",
        password: "secret123",
        confirmPassword: "secret123",
      }),
    ).rejects.toThrow("Name is required");
  });

  it("strips unknown fields when stripUnknown is set", async () => {
    const result = await signupValidationSchema.validate(
      {
        name: "John",
        email: "john@example.com",
        password: "secret123",
        confirmPassword: "secret123",
        extraField: "ignored",
      },
      { stripUnknown: true },
    );
    expect(result).not.toHaveProperty("extraField");
  });
});
