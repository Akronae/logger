export function filterFalsy<T>(array: (T | null | undefined | boolean)[]) {
  return array.filter(Boolean) as T[];
}
