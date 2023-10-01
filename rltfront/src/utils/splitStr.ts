export const splitStr = (str: string) => {
	if (typeof str !== 'string') {
		return str;
	}

	try {
		return Object.fromEntries(str.split(';').map((item) => item.split(':')));
	} catch {
		return str;
	}
};
