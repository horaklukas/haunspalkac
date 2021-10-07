export const getOnlyItem = <T>(item: T | T[]): T =>
  Array.isArray(item) ? item[0] : item;

export const fetcher = (url: string) => fetch(url).then((r) => r.json());
