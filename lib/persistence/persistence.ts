/**
 * Get the persistence with the given key.
 * @param {string} key The key to get the persistence from.
 * @returns {T | null} The persistence with the given key, or null if it doesn't exist.
 */
export const getPersistence = <T>(key: string): T | null => {
  const resultAsString = localStorage.getItem(key);
  if (!resultAsString) return null;
  const result = JSON.parse(resultAsString) as T;
  return result;
};

/**
 * Set the persistence with the given key and value.
 * @param {string} key The key to set the persistence to.
 * @param {T} value The value to set the persistence to.
 * @returns {void}
 */
export const setPersistence = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * Bind an event listener to the persistence. When it gets changed, the callback will be called.
 * @param {string} key The key to bind the event listener to.
 * @param {(value: T | null) => void} callback The callback to call when the persistence gets changed.
 * @returns {void}
 */
export const bindPersistence = <T>(
  key: string,
  callback: (value: T | null) => void
): void => {
  window.addEventListener('storage', (event) => {
    if (event.key === key) {
      const result = getPersistence<T>(key);
      callback(result);
    }
  });
};

/**
 * Remove the persistence with the given key.
 */
export const removePersistence = (key: string): void => {
  localStorage.removeItem(key);
};
