import { ServerDataCache, Response } from '../typings';

export type CreateServerDataCacheParams = {
	initialCache?: ServerDataCache;
};

export const createServerDataCache = ({
	initialCache = {},
}: CreateServerDataCacheParams = {}) => {
	const cache: ServerDataCache = { ...initialCache };

	const has = (key: keyof ServerDataCache) => {
		return !!cache[key];
	};

	const get = (key: keyof ServerDataCache) => {
		return cache[key] || null;
	};

	const put = (key: string, value: Response) => {
		cache[key] = value;
	};

	return {
		has,
		get,
		put,
		get current() {
			return { ...cache };
		},
	};
};
