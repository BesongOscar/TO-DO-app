import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Alert } from "react-native";
import { CustomList } from "../types";
import { useAuth } from "@/context/AuthContext";
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
  const { user } = useAuth();
  const [customLists, setCustomLists] = useState<CustomList[]>([]);
  const [loading, setLoading] = useState(true);
  const customListsRef = useRef<CustomList[]>([]);

  useEffect(() => {
    customListsRef.current = customLists;
  }, [customLists]);

  // Load custom lists from Firestore when user changes
  useEffect(() => {
    const loadLists = async () => {
      setLoading(true);
      if (!user) {
        setCustomLists([]);
        setLoading(false);
        return;
      }
      try {
        const loadedLists = await firestoreGetCustomLists(user.uid);
        setCustomLists(loadedLists);
      } catch (e) {
        console.warn("Failed to load custom lists from Firestore:", e);
        setCustomLists([]);
      }
      setLoading(false);
    };
    loadLists();
  }, [user?.uid]);

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
      const previous = customListsRef.current;
      const updated = [newList, ...previous];
      setCustomLists(updated);
      if (user) {
        firestoreSaveCustomLists(user.uid, updated).catch((e) => {
          console.warn("Failed to save custom lists to Firestore:", e);
          setCustomLists(previous);
          Alert.alert(
            "Save Failed",
            "Your changes couldn't be saved. Please check your connection and try again.",
            [{ text: "OK" }],
          );
        });
      }
      return newList;
    },
    [user],
  );

  // Update existing list properties
  const updateList = useCallback(
    (id: string, updates: Partial<Omit<CustomList, "id">>) => {
      const previous = customListsRef.current;
      const updated = previous.map((list) =>
        list.id === id ? { ...list, ...updates } : list,
      );
      setCustomLists(updated);
      if (user) {
        firestoreSaveCustomLists(user.uid, updated).catch((e) => {
          console.warn("Failed to save custom lists to Firestore:", e);
          setCustomLists(previous);
          Alert.alert(
            "Save Failed",
            "Your changes couldn't be saved. Please check your connection and try again.",
            [{ text: "OK" }],
          );
        });
      }
    },
    [user],
  );

  // Remove a list
  const deleteList = useCallback(
    (id: string) => {
      const previous = customListsRef.current;
      const updated = previous.filter((list) => list.id !== id);
      setCustomLists(updated);
      if (user) {
        firestoreSaveCustomLists(user.uid, updated).catch((e) => {
          console.warn("Failed to save custom lists to Firestore:", e);
          setCustomLists(previous);
          Alert.alert(
            "Save Failed",
            "Your changes couldn't be saved. Please check your connection and try again.",
            [{ text: "OK" }],
          );
        });
      }
    },
    [user],
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