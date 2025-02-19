export function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function loadFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || null;
} 