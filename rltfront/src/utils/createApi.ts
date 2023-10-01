import { SendRequest, Request } from '../typings';

export const createApi = (dataUrl: string) => {
	// @ts-ignore
	const get: SendRequest = (request: Request): Promise<Response> => {
		return fetch(`${dataUrl}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(request),
		})
			.then((result) => result.json())
			.catch(() => null);
	};

	return {
		get,
	};
};

export type Api = ReturnType<typeof createApi>;
