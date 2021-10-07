export const getOnlyItem = <T>(item: T | T[]): T =>
  Array.isArray(item) ? item[0] : item;
