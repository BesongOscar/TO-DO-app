/**
 * parseDateString - Parse "YYYY-MM-DD" string into a Date object
 * 
 * Uses local timezone components to avoid timezone offset issues
 * that occur with `new Date(dateStr)`.
 */
export const parseDateString = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};
