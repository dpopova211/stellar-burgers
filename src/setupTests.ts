import '@testing-library/jest-dom';

if (!globalThis.crypto) {
  (globalThis as any).crypto = {};
}
if (!globalThis.crypto.randomUUID) {
  let counter = 0;
  globalThis.crypto.randomUUID = () => {
    const hex = counter.toString(16).padStart(12, '0');
    counter++;
    return `00000000-0000-0000-0000-${hex}` as `${string}-${string}-${string}-${string}-${string}`;
  };
}
