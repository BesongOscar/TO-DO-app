const mockOnAuthStateChanged = jest.fn();
const mockSignInWithEmail = jest.fn();
const mockSignUp = jest.fn();
const mockSignOut = jest.fn();
const mockSendPasswordReset = jest.fn();
const mockSendVerificationEmail = jest.fn();
const mockReloadUser = jest.fn();
const mockGetCurrentUser = jest.fn();

const mockCreateProfile = jest.fn();
const mockGetProfile = jest.fn();
const mockUpdateProfile = jest.fn();

let mockCurrentFirebaseUser: { uid: string; email: string | null; displayName: string | null; photoURL: string | null; emailVerified: boolean } | null = null;

jest.mock("../../repositories/provider", () => ({
  getRepositories: jest.fn(() => ({
    authRepo: {
      onAuthStateChanged: mockOnAuthStateChanged,
      signInWithEmail: mockSignInWithEmail,
      signUp: mockSignUp,
      signOut: mockSignOut,
      sendPasswordReset: mockSendPasswordReset,
      sendVerificationEmail: mockSendVerificationEmail,
      reloadUser: mockReloadUser,
      getCurrentUser: mockGetCurrentUser,
    },
    profileRepo: {
      createProfile: mockCreateProfile,
      getProfile: mockGetProfile,
      updateProfile: mockUpdateProfile,
    },
  })),
}));

jest.mock("../../firebase/config", () => ({
  auth: {
    get currentUser() {
      return mockCurrentFirebaseUser;
    },
  },
  storage: { app: "mock-storage" },
}));

jest.mock("firebase/auth", () => ({
  GoogleAuthProvider: { credential: jest.fn(() => "mock-credential") },
  signInWithCredential: jest.fn(),
  sendEmailVerification: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
  ref: jest.fn(() => "mock-ref"),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(() => "https://example.com/photo.jpg"),
}));

import { Alert } from "react-native";
import { useAuthStore } from "../../store/authStore";

beforeEach(() => {
  useAuthStore.setState({ user: null, userProfile: null, loading: true });
  mockCurrentFirebaseUser = null;
  jest.clearAllMocks();
});

describe("authStore", () => {
  describe("initialize", () => {
    it("sets user and profile when authenticated", async () => {
      mockCurrentFirebaseUser = { uid: "u1", email: "test@test.com", displayName: "Test", photoURL: null, emailVerified: true };
      mockGetProfile.mockResolvedValue({ name: "Test", photoURL: null });
      mockOnAuthStateChanged.mockImplementation((cb: (user: unknown) => void) => {
        cb({ uid: "u1", email: "test@test.com", displayName: "Test", photoURL: null, emailVerified: true });
        return jest.fn();
      });

      useAuthStore.getState().initialize();
      await Promise.resolve();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockCurrentFirebaseUser as any);
      expect(state.userProfile).toEqual({ name: "Test", photoURL: null });
      expect(state.loading).toBe(false);
    });

    it("clears user and profile when not authenticated", async () => {
      mockOnAuthStateChanged.mockImplementation((cb: (user: unknown) => void) => {
        cb(null);
        return jest.fn();
      });

      useAuthStore.getState().initialize();
      await Promise.resolve();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.userProfile).toBeNull();
      expect(state.loading).toBe(false);
    });

    it("returns unsubscribe function", () => {
      const unsubscribe = jest.fn();
      mockOnAuthStateChanged.mockReturnValue(unsubscribe);
      const result = useAuthStore.getState().initialize();
      expect(result).toBe(unsubscribe);
    });
  });

  describe("login", () => {
    it("calls authRepo.signInWithEmail", async () => {
      mockSignInWithEmail.mockResolvedValue({ uid: "u1" });
      await useAuthStore.getState().login("a@b.com", "pass");
      expect(mockSignInWithEmail).toHaveBeenCalledWith("a@b.com", "pass");
    });
  });

  describe("signup", () => {
    it("creates account and profile", async () => {
      mockSignUp.mockResolvedValue({ uid: "u1", email: "a@b.com", displayName: null, photoURL: null, emailVerified: false });
      mockCreateProfile.mockResolvedValue(undefined);
      mockCurrentFirebaseUser = { uid: "u1", email: "a@b.com", displayName: null, photoURL: null, emailVerified: false };

      await useAuthStore.getState().signup("a@b.com", "pass", "Alice");
      expect(mockSignUp).toHaveBeenCalledWith("a@b.com", "pass");
      expect(mockCreateProfile).toHaveBeenCalledWith("u1", "Alice");
    });
  });

  describe("logout", () => {
    it("calls authRepo.signOut", async () => {
      mockSignOut.mockResolvedValue(undefined);
      await useAuthStore.getState().logout();
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe("resetPassword", () => {
    it("calls authRepo.sendPasswordReset", async () => {
      mockSendPasswordReset.mockResolvedValue(undefined);
      await useAuthStore.getState().resetPassword("a@b.com");
      expect(mockSendPasswordReset).toHaveBeenCalledWith("a@b.com");
    });
  });

  describe("sendVerificationEmail", () => {
    it("calls authRepo.sendVerificationEmail", async () => {
      mockSendVerificationEmail.mockResolvedValue(undefined);
      await useAuthStore.getState().sendVerificationEmail();
      expect(mockSendVerificationEmail).toHaveBeenCalled();
    });
  });

  describe("reloadUser", () => {
    it("reloads user and updates state", async () => {
      mockCurrentFirebaseUser = { uid: "u1", email: "test@test.com", displayName: "Test", photoURL: null, emailVerified: true };
      mockReloadUser.mockResolvedValue({ uid: "u1", email: "test@test.com", displayName: "Test", photoURL: null, emailVerified: true });
      useAuthStore.setState({ user: mockCurrentFirebaseUser as any });
      await useAuthStore.getState().reloadUser();
      expect(mockReloadUser).toHaveBeenCalled();
    });
  });

  describe("googleLogin", () => {
    let alertSpy: jest.SpyInstance;
    beforeEach(() => {
      alertSpy = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());
    });
    afterEach(() => {
      alertSpy.mockRestore();
    });

    it("creates profile if not existing", async () => {
      const mockUser = { uid: "g1", displayName: "Google User" };
      const firebaseAuth = require("firebase/auth");
      firebaseAuth.signInWithCredential.mockResolvedValue({ user: mockUser });
      mockGetProfile.mockResolvedValue(null);
      mockCreateProfile.mockResolvedValue(undefined);

      const result = await useAuthStore.getState().googleLogin("id-token");
      expect(result).toBe(true);
      expect(mockCreateProfile).toHaveBeenCalledWith("g1", "Google User");
    });

    it("does not create profile if already exists", async () => {
      const mockUser = { uid: "g1", displayName: "Google User" };
      const firebaseAuth = require("firebase/auth");
      firebaseAuth.signInWithCredential.mockResolvedValue({ user: mockUser });
      mockGetProfile.mockResolvedValue({ name: "Google User", photoURL: null });

      const result = await useAuthStore.getState().googleLogin("id-token");
      expect(result).toBe(true);
      expect(mockCreateProfile).not.toHaveBeenCalled();
    });

    it("returns false on error", async () => {
      const error = new Error("Sign-in failed");
      const firebaseAuth = require("firebase/auth");
      firebaseAuth.signInWithCredential.mockRejectedValue(error);

      const result = await useAuthStore.getState().googleLogin("bad-token");
      expect(result).toBe(false);
      expect(alertSpy).toHaveBeenCalled();
    });
  });

  describe("updateUserProfile", () => {
    it("updates profile and state", async () => {
      mockUpdateProfile.mockResolvedValue(undefined);
      useAuthStore.setState({ user: { uid: "u1" } as any, userProfile: { name: "Old", photoURL: null } });
      await useAuthStore.getState().updateUserProfile({ name: "New" });
      expect(mockUpdateProfile).toHaveBeenCalledWith("u1", { name: "New" });
      expect(useAuthStore.getState().userProfile).toEqual({ name: "New", photoURL: null });
    });

    it("does nothing when user is null", async () => {
      await useAuthStore.getState().updateUserProfile({ name: "New" });
      expect(mockUpdateProfile).not.toHaveBeenCalled();
    });
  });
});
