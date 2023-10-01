import { Action } from './actions';
import { State } from './state';

import { createTextPrice } from '@/utils/createTextPrice';
import { decodeStr } from '@/utils/decodeStr';
import { splitStr } from '@/utils/splitStr';

export const reducerOriginal = (state: State, action: Action): State => {
	switch (action.type) {
		case 'SET_REGION': {
			return {
				...state,
				region: action.payload,
			};
		}

		case 'SEARCH': {
			const data = action.payload;
			const isGroupSearch =
				data.searchList.length > 1 && data.searchBy === 'PRODUCTS';

			const clearly = data.found.map((item) => {
				const seller = Object.entries(item.seller).reduce((acc, [key, value]) => {
					// @ts-ignore
					acc[key] = typeof value === 'string' ? decodeStr(value) : value;

					return acc;
				}, {});

				// @ts-ignore
				const products = item.products?.map((product) => {
					return Object.entries(product).reduce((acc, [key, value]) => {
						// @ts-ignore
						acc[key] = typeof value === 'string' ? decodeStr(value) : value;

						if (key === 'description') {
							// @ts-ignore
							acc.data = splitStr(acc[key]);
						}

						// @ts-ignore
						if (key === 'fullPrice' && typeof acc[key] === 'number') {
							// @ts-ignore
							acc.textPrice = createTextPrice(acc[key]);
						}

						return acc;
					}, {});
				}, []);

				return {
					seller,
					products,
				};
			});

			return {
				...state,
				// Сервер это пришлёт?
				category: isGroupSearch ? null : data.category || null,
				filterFields: isGroupSearch ? [] : data.filters,
				// @ts-ignore
				found: clearly || [],
				pagesCount: action.payload.pagesCount || null,
			};
		}

		case 'SELLER': {
			return {
				...state,
				seller: action.payload,
			};
		}

		case 'SET_FILTER_FIELDS': {
			return {
				...state,
				filterFields: action.payload,
			};
		}

		case 'SET_CATEGORY': {
			return {
				...state,
				category: action.payload,
			};
		}

		default:
			return state;
	}
};

export const reducer: typeof reducerOriginal = (...args) => {
	const nextState = reducerOriginal(...args);

	// @ts-ignore
	window.__state = nextState;

	return nextState;
};
