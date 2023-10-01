import { useRef, useEffect } from 'react';

import { useSearch } from '../hooks/useSearch';
import { storage } from '../utils/storage';

import { useApp, UseAppParams } from './useApp';

export type UseAppLogicParams = Omit<UseAppParams, 'onData'>;

export const useAppLogic = (params: UseAppLogicParams) => {
	const store = useApp(params);
	const stateRef = useRef(store.state);
	const search = useSearch();
	const searchPhraseRef = useRef(search.state.search);
	const searchPageNumberRef = useRef(search.state.pageNumber);

	useEffect(() => {
		if (
			search.state.search &&
			(search.state.search !== searchPhraseRef.current ||
				searchPageNumberRef.current !== search.state.pageNumber)
		) {
			searchPhraseRef.current = search.state.search;
			searchPageNumberRef.current = search.state.pageNumber;

			const { filters, entity } = search.state;

			store.serverData({
				type: 'SEARCH',
				params: {
					phrases: search.state.search,
					// TODO: Какой id у региона?
					filters: { ...(filters || {}), 155: stateRef.current.region },
					searchBy: entity!,
					limit: 25,
					pageNumber: search.state.pageNumber || 1,
					onlyHasAllSearch: true,
				},
			});
		}
	}, [search.state, store.serverData]);

	// useEffect(() => {
	// 	if (
	// 		search.state.sellerId !== null &&
	// 		typeof search.state.sellerId !== 'undefined'
	// 	) {
	// 		store.serverData({ type: 'SELLER', params: { id: search.state.sellerId } });
	// 	} else {
	// 		store.dispatch.clearSeller();
	// 	}
	// }, [search.state.sellerId, store.serverData]);

	useEffect(() => {
		store.dispatch.clearFilterFields();
		store.dispatch.clearCategory();
	}, [search.state.entity]);

	useEffect(() => {
		storage.set('region', store.state.region);
	}, [store.state.region]);

	useEffect(() => {
		stateRef.current = store.state;
	}, [store.state]);

	return { store, search };
};
