export const decodeStr = (str: string) => {
	try {
		const num = Number(str);

		if (!isNaN(num)) {
			return num;
		}
	} catch {}

	try {
		return decodeURIComponent(str);
	} catch {
		return str;
	}
};
