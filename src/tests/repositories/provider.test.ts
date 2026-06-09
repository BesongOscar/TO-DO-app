import { getRepositories, setRepositories, resetRepositories } from "../../repositories/provider";

const mockGetTasks = jest.fn();
const mockSaveTasks = jest.fn();
const mockUpdateTask = jest.fn();
const mockDeleteTask = jest.fn();
const mockMigrateFromLocal = jest.fn();

jest.mock("../../repositories/firebase/FirebaseTaskRepository", () => ({
  FirebaseTaskRepository: jest.fn().mockImplementation(() => ({
    getTasks: mockGetTasks,
    saveTasks: mockSaveTasks,
    updateTask: mockUpdateTask,
    deleteTask: mockDeleteTask,
    migrateFromLocal: mockMigrateFromLocal,
  })),
}));

jest.mock("../../repositories/firebase/FirebaseListRepository", () => ({
  FirebaseListRepository: jest.fn().mockImplementation(() => ({
    getLists: jest.fn(),
    saveLists: jest.fn(),
    updateList: jest.fn(),
    migrateFromLocal: jest.fn(),
  })),
}));

jest.mock("../../repositories/firebase/FirebaseAuthRepository", () => ({
  FirebaseAuthRepository: jest.fn().mockImplementation(() => ({
    signInWithEmail: jest.fn(),
    signUpWithEmail: jest.fn(),
    signInWithGoogle: jest.fn(),
    signOut: jest.fn(),
    getCurrentUser: jest.fn(),
    onAuthStateChanged: jest.fn(),
    sendPasswordReset: jest.fn(),
  })),
}));

jest.mock("../../repositories/firebase/FirebaseProfileRepository", () => ({
  FirebaseProfileRepository: jest.fn().mockImplementation(() => ({
    getProfile: jest.fn(),
    createProfile: jest.fn(),
    updateProfile: jest.fn(),
  })),
}));

beforeEach(() => {
  resetRepositories();
});

describe("getRepositories", () => {
  it("returns the same provider on repeated calls (singleton)", () => {
    const a = getRepositories();
    const b = getRepositories();
    expect(a).toBe(b);
  });

  it("returns a provider with all repos", () => {
    const p = getRepositories();
    expect(p.taskRepo).toBeDefined();
    expect(p.listRepo).toBeDefined();
    expect(p.authRepo).toBeDefined();
    expect(p.profileRepo).toBeDefined();
  });

  it("returns a new singleton after reset", () => {
    const a = getRepositories();
    resetRepositories();
    const b = getRepositories();
    expect(a).not.toBe(b);
  });
});

describe("setRepositories", () => {
  it("overrides a single repository", () => {
    const mockRepo = { getTasks: jest.fn(), saveTasks: jest.fn(), updateTask: jest.fn(), deleteTask: jest.fn(), migrateFromLocal: jest.fn() };
    setRepositories({ taskRepo: mockRepo });
    const p = getRepositories();
    expect(p.taskRepo).toBe(mockRepo);
  });

  it("preserves non-overridden repositories", () => {
    const mockRepo = { getTasks: jest.fn(), saveTasks: jest.fn(), updateTask: jest.fn(), deleteTask: jest.fn(), migrateFromLocal: jest.fn() };
    setRepositories({ taskRepo: mockRepo });
    const p = getRepositories();
    expect(p.taskRepo).toBe(mockRepo);
    expect(p.listRepo).toBeDefined();
    expect(p.authRepo).toBeDefined();
    expect(p.profileRepo).toBeDefined();
  });

  it("works before getRepositories is called", () => {
    const mockRepo = { getTasks: jest.fn(), saveTasks: jest.fn(), updateTask: jest.fn(), deleteTask: jest.fn(), migrateFromLocal: jest.fn() };
    setRepositories({ taskRepo: mockRepo });
    resetRepositories();
    setRepositories({ taskRepo: mockRepo });
    const p = getRepositories();
    expect(p.taskRepo).toBe(mockRepo);
  });
});
