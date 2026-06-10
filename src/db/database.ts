/**
 * Database - WatermelonDB database initialization
 * 
 * Configures SQLite adapter for local persistence.
 * Provides offline-first storage layer for task and list data.
 */

import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { mySchema } from "./schema";
import { TaskModel } from "./models/TaskModel";
import { ListModel } from "./models/ListModel";

const adapter = new SQLiteAdapter({
  schema: mySchema,
  jsi: false,
  onSetUpError: (error) => {
    console.error("WatermelonDB setup error:", error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [TaskModel, ListModel],
});
