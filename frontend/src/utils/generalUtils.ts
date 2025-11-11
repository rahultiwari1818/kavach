type strnum = string | number;

export function debounce<T extends (...args: strnum[]) => void | Promise<void>>(
  fn: T,
  delay = 500
) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>): void => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      void fn(...args); // 'void' ignores Promise result safely
    }, delay);
  };
}
