const STORAGE_KEY = 'embi_storage';

export const storage = {
	get: (key: string) => {
		try {
			const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

			return store[key] || null;
		} catch {
			return null;
		}
	},
	set: (key: string, value: unknown) => {
		try {
			const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

			localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...store, [key]: value }));

			return true;
		} catch {
			return false;
		}
	},
};
