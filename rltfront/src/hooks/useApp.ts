import { useEffect, useState, useCallback } from 'react';

import { Request } from '../typings';

import { useStore, UseStoreParams } from './useStore';

export type UseAppParams = UseStoreParams;

export const useApp = (params: UseAppParams) => {
	const [requests, setRequests] = useState<Array<Request>>([]);
	const { state, dispatch, serverData: serverDataOriginal } = useStore(params);

	useEffect(() => {
		if (requests.length) {
			Promise.allSettled(requests.map(serverDataOriginal)).finally(() => {
				setRequests([]);
			});
		}
	}, [requests, serverDataOriginal]);

	const serverData = useCallback((request: Request) => {
		setRequests((prevRequests) => [...prevRequests, request]);
	}, []);

	return {
		state,
		dispatch,
		serverData,
		loading: !!requests.length,
	};
};
