import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "tasks",
      columns: [
        { name: "firestore_id", type: "string", isOptional: true },
        { name: "text", type: "string" },
        { name: "completed", type: "boolean" },
        { name: "important", type: "boolean" },
        { name: "my_day", type: "boolean" },
        { name: "order", type: "number", isOptional: true },
        { name: "due_date", type: "string", isOptional: true },
        { name: "due_time", type: "string", isOptional: true },
        { name: "reminder", type: "string", isOptional: true },
        { name: "note", type: "string", isOptional: true },
        { name: "repeat", type: "string", isOptional: true },
        { name: "repeat_days", type: "string", isOptional: true },
        { name: "repeat_on_day", type: "number", isOptional: true },
        { name: "repeat_on_last_day", type: "boolean", isOptional: true },
        { name: "repeat_end_date", type: "string", isOptional: true },
        { name: "list_id", type: "string", isOptional: true },
        { name: "user_id", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "custom_lists",
      columns: [
        { name: "firestore_id", type: "string", isOptional: true },
        { name: "name", type: "string" },
        { name: "icon", type: "string" },
        { name: "color", type: "string" },
        { name: "user_id", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
