import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { mySchema } from "./schema";
import { TaskModel } from "./models/TaskModel";
import { ListModel } from "./models/ListModel";

const adapter = new SQLiteAdapter({
  schema: mySchema,
  jsi: true,
  onSetUpError: (error) => {
    console.error("WatermelonDB setup error:", error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [TaskModel, ListModel],
});
