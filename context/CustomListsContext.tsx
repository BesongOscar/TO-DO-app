import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "src/firebase/config";
import { CustomList } from "../types";
import {
  firestoreGetCustomLists,
  firestoreSaveCustomLists,
} from "@/src/firebase/customLists";

/**
 * CustomListsContext - Manages user-created task lists (e.g., "Work", "Personal")
 * 
 * Handles CRUD for custom lists, synced to Firestore. Unlike built-in lists
 * (My Day, Important, Planned), these are user-defined with custom names/icons.
 */

interface CustomListsContextValue {
  customLists: CustomList[];
  loading: boolean;
  addList: (name: string, icon: string) => CustomList;
  updateList: (id: string, updates: Partial<Omit<CustomList, "id">>) => void;
  deleteList: (id: string) => void;
}

const CustomListsContext = createContext<CustomListsContextValue | undefined>(
  undefined,
);

export const CustomListsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [customLists, setCustomLists] = useState<CustomList[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load custom lists from Firestore when user changes
  useEffect(() => {
    const loadLists = async () => {
      setLoading(true);
      if (!currentUser) {
        setCustomLists([]);
        setLoading(false);
        return;
      }
      try {
        const loadedLists = await firestoreGetCustomLists(currentUser.uid);
        setCustomLists(loadedLists);
      } catch (e) {
        console.warn("Failed to load custom lists from Firestore:", e);
        setCustomLists([]);
      }
      setLoading(false);
    };
    loadLists();
  }, [currentUser?.uid]);

  // Persist lists to Firestore after changes
  const saveLists = useCallback(
    async (lists: CustomList[]) => {
      if (!currentUser) return;
      try {
        await firestoreSaveCustomLists(currentUser.uid, lists);
      } catch (e) {
        console.warn("Failed to save custom lists to Firestore:", e);
      }
    },
    [currentUser?.uid],
  );

  // Add a new custom list
  const addList = useCallback(
    (name: string, icon: string): CustomList => {
      const newList: CustomList = {
        id: `list-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: name.trim(),
        icon,
        color: "#0078d4",
        taskCount: 0,
        createdAt: Date.now(),
      };
      setCustomLists((prev) => {
        const updated = [newList, ...prev];
        saveLists(updated);
        return updated;
      });
      return newList;
    },
    [saveLists],
  );

  // Update existing list properties
  const updateList = useCallback(
    (id: string, updates: Partial<Omit<CustomList, "id">>) => {
      setCustomLists((prev) => {
        const updated = prev.map((list) =>
          list.id === id ? { ...list, ...updates } : list
        );
        saveLists(updated);
        return updated;
      });
    },
    [saveLists],
  );

  // Remove a list
  const deleteList = useCallback(
    (id: string) => {
      setCustomLists((prev) => {
        const updated = prev.filter((list) => list.id !== id);
        saveLists(updated);
        return updated;
      });
    },
    [saveLists],
  );

  return (
    <CustomListsContext.Provider
      value={{ customLists, loading, addList, updateList, deleteList }}
    >
      {children}
    </CustomListsContext.Provider>
  );
};

export const useCustomLists = () => {
  const ctx = useContext(CustomListsContext);
  if (!ctx) throw new Error("useCustomLists must be inside CustomListsProvider");
  return ctx;
};

export default CustomListsContext;