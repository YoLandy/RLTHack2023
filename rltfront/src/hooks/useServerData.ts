import { useMemo, useCallback } from 'react';

import { SendRequest, Request, Response } from '../typings';
import {
	createServerDataCache,
	CreateServerDataCacheParams,
} from '../utils/createServerDataCache';

export type UseServerDataParams = {
	sendRequest: SendRequest;
	onData?: (data: Response) => void;
	onError?: (error: Error) => void;
} & Pick<CreateServerDataCacheParams, 'initialCache'>;

export const useServerData = ({
	sendRequest: sendRequestOrigin,
	onData,
	onError,
	initialCache,
}: UseServerDataParams) => {
	const serverDataCache = useMemo(() => {
		return createServerDataCache({ initialCache });
	}, []);

	const sendRequest: SendRequest = useCallback(
		async (request) => {
			const requestId = JSON.stringify(request);

			if (serverDataCache.has(requestId)) {
				return Promise.resolve(serverDataCache.get(requestId));
			}

			return sendRequestOrigin(request).then((response) => {
				serverDataCache.put(requestId, response);

				return serverDataCache.get(requestId);
			});
		},
		[sendRequestOrigin, serverDataCache]
	);

	const serverData = useCallback(
		async (request: Request) => {
			return sendRequest(request).then((result) => {
				if (result) {
					onData?.(result);
				} else {
					onError?.(result);
				}

				return result;
			}, onError);
		},
		[sendRequest, onData, onError]
	);

	return {
		serverData,
	};
};

export type ServerData = ReturnType<typeof useServerData>['serverData'];
