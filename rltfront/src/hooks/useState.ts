import { useReducer, useMemo } from 'react';

import { reducer } from '../state/reducer';
import { defaultState, State } from '../state/state';

import { SetRegion } from '@/state/actions';
import { Seller } from '@/typings';

export type UseStateParams = {
	initialState?: Partial<State>;
};

export const useState = ({ initialState = {} }: UseStateParams = {}) => {
	const [state, reduce] = useReducer(reducer, { ...defaultState, ...initialState });

	const dispatch = useMemo(
		() => ({
			setRegion: (region: SetRegion['payload']) => {
				reduce({ type: 'SET_REGION', payload: region });
			},
			clearFilterFields: () => {
				reduce({ type: 'SET_FILTER_FIELDS', payload: [] });
			},
			clearCategory: () => {
				reduce({ type: 'SET_CATEGORY', payload: null });
			},
			setSeller: (seller: Seller) => {
				reduce({ type: 'SELLER', payload: seller });
			},
			clearSeller: () => {
				reduce({ type: 'SELLER', payload: null });
			},
		}),
		[reduce]
	);

	return {
		state,
		reduce,
		dispatch,
	};
};

export type Dispatch = ReturnType<typeof useState>['dispatch'];
