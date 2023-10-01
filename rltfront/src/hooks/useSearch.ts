import { useSearchParams } from 'next/navigation';
import Router from 'next/router';
import { useState, useEffect, useRef, useCallback } from 'react';

import { SearchState } from '../state/state';

import { Entity } from '@/typings';

const prepareSearchState = (
	stateOriginal: Partial<SearchState>
): Partial<SearchState> => {
	const nextState = { ...stateOriginal };

	if (stateOriginal.filters) {
		// @ts-ignore
		nextState.filters = JSON.stringify(stateOriginal.filters);
	}

	nextState.entity = nextState.entity || 'SELLERS';

	return Object.entries(nextState).reduce<Partial<SearchState>>((acc, [key, value]) => {
		if (value !== null) {
			// @ts-ignore
			acc[key] = value;
		}

		return acc;
	}, {});
};

const defaultSearchState = prepareSearchState({});

export const useSearch = () => {
	const searchParams = useSearchParams();
	const [searchState, setSearchState] =
		useState<Partial<SearchState>>(defaultSearchState);
	const searchStateRef = useRef<typeof searchState>(searchState);

	useEffect(() => {
		if (!searchParams) {
			setSearchState({});

			return;
		}

		searchStateRef.current = {
			entity: (searchParams.get('entity') as Entity) || 'SELLERS',
			search: searchParams.get('search') || null,
			filters: JSON.parse(searchParams.get('filters') || 'null') || null,
			pageNumber: Number(searchParams.get('pageNumber')) || null,
			onlyHasAllSearch: Boolean(searchParams.get('onlyHasAllSearch')) || null,
			sellerId: searchParams.get('sellerId') || null,
		};

		setSearchState(searchStateRef.current);
	}, [searchParams]);

	const updateState = useCallback((nextStateOriginal: Partial<SearchState>) => {
		const nextState = { ...searchStateRef.current, ...nextStateOriginal };

		// @ts-ignore
		Router.push({ query: prepareSearchState(nextState) });
	}, []);

	const setState = useCallback((nextState: Partial<SearchState>) => {
		// @ts-ignore
		Router.push({ query: prepareSearchState(nextState) });
	}, []);

	return {
		state: searchState,
		updateState,
		setState,
	};
};
