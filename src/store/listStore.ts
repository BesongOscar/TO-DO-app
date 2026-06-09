/**
 * listStore - Zustand store for custom list state
 * 
 * Manages CRUD for user-created lists with debounced Firestore persistence.
 */

import { create } from "zustand";
import { Alert } from "react-native";
import { CustomList } from "../../types";
import { auth } from "../firebase/config";
import { getRepositories } from "../repositories/provider";

type RepoList = import("../domain/List").CustomList;

const asReproLists = (lists: CustomList[]): RepoList[] => lists as unknown as RepoList[];
const asLists = (domainLists: RepoList[]): CustomList[] => domainLists as unknown as CustomList[];

interface ListState {
  customLists: CustomList[];
  loading: boolean;
  fetchLists: () => Promise<void>;
  addList: (name: string, icon: string, color: string) => CustomList;
  updateList: (id: string, updates: Partial<Omit<CustomList, "id">>) => void;
  deleteList: (id: string) => void;
}

const getUserId = (): string | null => auth.currentUser?.uid ?? null;

export const useListStore = create<ListState>()((set, get) => ({
  customLists: [],
  loading: true,

  fetchLists: async () => {
    const userId = getUserId();
    set({ loading: true });
    if (!userId) {
      set({ customLists: [], loading: false });
      return;
    }
    try {
      const { listRepo } = getRepositories();
      const loadedLists = await listRepo.getLists(userId);
      set({ customLists: asLists(loadedLists) });
    } catch (e) {
      console.warn("Failed to load custom lists:", e);
      set({ customLists: [] });
    }
    set({ loading: false });
  },

  addList: (name: string, icon: string, color: string): CustomList => {
    const userId = getUserId();
    const newList: CustomList = {
      id: `list-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      icon,
      color: "#0078d4",
      createdAt: Date.now(),
    };
    const previous = get().customLists;
    const updated = [newList, ...previous];
    set({ customLists: updated });
    if (userId) {
      const { listRepo } = getRepositories();
      listRepo.saveLists(userId, asReproLists(updated)).catch((e: unknown) => {
        console.warn("Failed to save custom lists:", e);
        set({ customLists: previous });
        Alert.alert(
          "Save Failed",
          "Your changes couldn't be saved. Please check your connection and try again.",
          [{ text: "OK" }],
        );
      });
    }
    return newList;
  },

  updateList: (id: string, updates: Partial<Omit<CustomList, "id">>) => {
    const userId = getUserId();
    const previous = get().customLists;
    const updated = previous.map((list) =>
      list.id === id ? { ...list, ...updates } : list,
    );
    set({ customLists: updated });
    if (userId) {
      const { listRepo } = getRepositories();
      listRepo.updateList(userId, id, updates).catch((e: unknown) => {
        console.warn("Failed to update custom list:", e);
        set({ customLists: previous });
        Alert.alert(
          "Save Failed",
          "Your changes couldn't be saved. Please check your connection and try again.",
          [{ text: "OK" }],
        );
      });
    }
  },

  deleteList: (id: string) => {
    const userId = getUserId();
    const previous = get().customLists;
    const updated = previous.filter((list) => list.id !== id);
    set({ customLists: updated });
    if (userId) {
      const { listRepo } = getRepositories();
      listRepo.saveLists(userId, asReproLists(updated)).catch((e: unknown) => {
        console.warn("Failed to save custom lists:", e);
        set({ customLists: previous });
        Alert.alert(
          "Save Failed",
          "Your changes couldn't be saved. Please check your connection and try again.",
          [{ text: "OK" }],
        );
      });
    }
  },
}));
