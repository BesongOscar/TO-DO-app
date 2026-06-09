import React, { createContext, useContext, useEffect } from "react";
import { CustomList } from "../types";
import { useAuth } from "@/context/AuthContext";
import { useListStore } from "../src/store/listStore";

interface CustomListsContextValue {
  customLists: CustomList[];
  loading: boolean;
  addList: (name: string, icon: string, color: string) => CustomList;
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
  const customLists = useListStore((s) => s.customLists);
  const loading = useListStore((s) => s.loading);
  const addList = useListStore((s) => s.addList);
  const updateList = useListStore((s) => s.updateList);
  const deleteList = useListStore((s) => s.deleteList);

  useEffect(() => {
    useListStore.getState().fetchLists();
  }, [user?.uid]);

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
  if (!ctx)
    throw new Error("useCustomLists must be inside CustomListsProvider");
  return ctx;
};

export default CustomListsContext;
