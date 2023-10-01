import { useMemo, useCallback } from 'react';

import { useServerData, UseServerDataParams } from '../hooks/useServerData';
import { useState, UseStateParams } from '../hooks/useState';
import { SendRequest, Response } from '../typings';

import { Action } from '@/state/actions';

export type UseStoreParams = {
	sendRequest: SendRequest;
} & Pick<UseStateParams, 'initialState'> &
	Pick<UseServerDataParams, 'initialCache'>;

export const useStore = ({ sendRequest, initialState, initialCache }: UseStoreParams) => {
	const { state, dispatch, reduce: onData } = useState({ initialState });

	const onError = useCallback((error: Error) => {
		console.error('GET_SERVER_DATA_ERROR:', error);
	}, []);

	const { serverData } = useServerData({ sendRequest, onData, onError, initialCache });

	const store = useMemo(
		() => ({ state, dispatch, serverData }),
		[state, dispatch, serverData]
	);

	return store;
};
