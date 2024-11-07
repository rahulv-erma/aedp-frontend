export const stringFormat = (s: string, ...args: any[]) => {
  return s.replace(/{([0-9]+)}/g, (match, index) =>
    typeof args[index] === "undefined" ? match : args[index],
  );
};

export const asyncDebounce = <T extends (...args: any) => any>(
  func: T,
  wait: number = 500,
) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => resolve(await func(...args)), wait);
    });
  };
};
