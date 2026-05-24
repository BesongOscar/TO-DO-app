import { getGoogleSignInErrorMessage } from "../../auth/googleAuth";

const mockIsErrorWithCode = jest.fn();

jest.mock("@react-native-google-signin/google-signin", () => ({
  isErrorWithCode: (...args: unknown[]) => mockIsErrorWithCode(...args),
  statusCodes: {
    SIGN_IN_CANCELLED: "SIGN_IN_CANCELLED",
    IN_PROGRESS: "IN_PROGRESS",
    PLAY_SERVICES_NOT_AVAILABLE: "PLAY_SERVICES_NOT_AVAILABLE",
  },
}));

beforeEach(() => {
  mockIsErrorWithCode.mockReset();
});

describe("getGoogleSignInErrorMessage", () => {
  it('returns "Sign-in was cancelled" for SIGN_IN_CANCELLED', () => {
    mockIsErrorWithCode.mockReturnValue(true);
    const error = { code: "SIGN_IN_CANCELLED" };
    expect(getGoogleSignInErrorMessage(error)).toBe("Sign-in was cancelled");
  });

  it('returns "Sign-in is already in progress" for IN_PROGRESS', () => {
    mockIsErrorWithCode.mockReturnValue(true);
    const error = { code: "IN_PROGRESS" };
    expect(getGoogleSignInErrorMessage(error)).toBe(
      "Sign-in is already in progress",
    );
  });

  it('returns "Google Play Services not available or outdated" for PLAY_SERVICES_NOT_AVAILABLE', () => {
    mockIsErrorWithCode.mockReturnValue(true);
    const error = { code: "PLAY_SERVICES_NOT_AVAILABLE" };
    expect(getGoogleSignInErrorMessage(error)).toBe(
      "Google Play Services not available or outdated",
    );
  });

  it("returns the error message for unknown error codes", () => {
    mockIsErrorWithCode.mockReturnValue(true);
    const error = { code: "UNKNOWN_CODE", message: "Something went wrong" };
    expect(getGoogleSignInErrorMessage(error)).toBe("Something went wrong");
  });

  it("returns fallback when unknown code has no message", () => {
    mockIsErrorWithCode.mockReturnValue(true);
    const error = { code: "UNKNOWN_CODE" };
    expect(getGoogleSignInErrorMessage(error)).toBe("Google Sign-In failed");
  });

  it("returns error message for a standard Error", () => {
    mockIsErrorWithCode.mockReturnValue(false);
    const error = new Error("Network error");
    expect(getGoogleSignInErrorMessage(error)).toBe("Network error");
  });

  it('returns "An unexpected error occurred" for non-Error unknown input', () => {
    mockIsErrorWithCode.mockReturnValue(false);
    expect(getGoogleSignInErrorMessage("some string")).toBe(
      "An unexpected error occurred",
    );
  });

  it("handles null error", () => {
    mockIsErrorWithCode.mockReturnValue(false);
    expect(getGoogleSignInErrorMessage(null)).toBe(
      "An unexpected error occurred",
    );
  });
});
