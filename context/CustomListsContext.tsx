import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "src/firebase/config";
import { CustomList } from "../types";

const STORAGE_KEY = (uid: string) => `@customLists_${uid}`;

interface CustomListsContextValue {
  customLists: CustomList[];
  loading: boolean;
  addList: (name: string, icon: string) => void;
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

  // Track signed-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load custom lists when user changes
  useEffect(() => {
    const loadLists = async () => {
      setLoading(true);
      if (!currentUser) {
        setCustomLists([]);
        setLoading(false);
        return;
      }
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY(currentUser.uid));
        if (stored) {
          setCustomLists(JSON.parse(stored));
        } else {
          setCustomLists([]); // Start empty
        }
      } catch (e) {
        console.warn("Failed to load custom lists:", e);
        setCustomLists([]);
      }
      setLoading(false);
    };
    loadLists();
  }, [currentUser]);

  // Persist when lists change
  useEffect(() => {
    if (loading || !currentUser) return;
    AsyncStorage.setItem(
      STORAGE_KEY(currentUser.uid),
      JSON.stringify(customLists),
    ).catch((e) => console.warn("Failed to save custom lists:", e));
  }, [customLists, loading, currentUser]);

  const addList = useCallback((name: string, icon: string) => {
    const newList: CustomList = {
      id: `list-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      icon,
      createdAt: Date.now(),
    };
    setCustomLists((prev) => [newList, ...prev]);
  }, []);

  const updateList = useCallback(
    (id: string, updates: Partial<Omit<CustomList, "id">>) => {
      setCustomLists((prev) =>
        prev.map((list) => (list.id === id ? { ...list, ...updates } : list)),
      );
    },
    [],
  );

  const deleteList = useCallback((id: string) => {
    setCustomLists((prev) => prev.filter((list) => list.id !== id));
  }, []);

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
  if (!ctx) throw new Error("useCustomLists must be used inside CustomListsProvider");
  return ctx;
};

export default CustomListsContext;