export function blurWebActiveElement() {
  if (typeof document === 'undefined') {
    return;
  }

  const activeElement = document.activeElement;
  if (activeElement && 'blur' in activeElement && typeof activeElement.blur === 'function') {
    activeElement.blur();
  }
}
