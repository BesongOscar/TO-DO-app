import { TaskRepository } from "./interfaces/TaskRepository";
import { ListRepository } from "./interfaces/ListRepository";
import { AuthRepository } from "./interfaces/AuthRepository";
import { ProfileRepository } from "./interfaces/ProfileRepository";
import { FirebaseTaskRepository } from "./firebase/FirebaseTaskRepository";
import { FirebaseListRepository } from "./firebase/FirebaseListRepository";
import { FirebaseAuthRepository } from "./firebase/FirebaseAuthRepository";
import { FirebaseProfileRepository } from "./firebase/FirebaseProfileRepository";

interface RepositoryProvider {
  taskRepo: TaskRepository;
  listRepo: ListRepository;
  authRepo: AuthRepository;
  profileRepo: ProfileRepository;
}

const createProvider = (): RepositoryProvider => ({
  taskRepo: new FirebaseTaskRepository(),
  listRepo: new FirebaseListRepository(),
  authRepo: new FirebaseAuthRepository(),
  profileRepo: new FirebaseProfileRepository(),
});

let provider: RepositoryProvider | null = null;

export const getRepositories = (): RepositoryProvider => {
  if (!provider) {
    provider = createProvider();
  }
  return provider;
};

export const setRepositories = (custom: Partial<RepositoryProvider>): void => {
  if (!provider) {
    provider = createProvider();
  }
  if (custom.taskRepo) provider.taskRepo = custom.taskRepo;
  if (custom.listRepo) provider.listRepo = custom.listRepo;
  if (custom.authRepo) provider.authRepo = custom.authRepo;
  if (custom.profileRepo) provider.profileRepo = custom.profileRepo;
};

export const resetRepositories = (): void => {
  provider = null;
};
