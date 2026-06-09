export interface CustomList {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt?: number;
}

export const createCustomList = (
  name: string,
  icon: string,
  color: string,
): CustomList => ({
  id: `list-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: name.trim(),
  icon,
  color,
  createdAt: Date.now(),
});
