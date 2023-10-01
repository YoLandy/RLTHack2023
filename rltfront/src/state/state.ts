import { DEFAULT_REGION } from '../constants';
import {
	Entity,
	Category,
	FilterField,
	Filters,
	Seller,
	ResponseSearch,
} from '../typings';
import { storage } from '../utils/storage';

export type SearchState = {
	entity: Entity;
	search: string | null;
	filters: Filters | null;
	pageNumber: number | null;
	onlyHasAllSearch: boolean | null;
	sellerId: Seller['id'] | null;
};

export type State = {
	region: string;
	category: Category | null;
	hasSearch: boolean;
	filterFields: Array<FilterField>;
	found: ResponseSearch['payload']['found'];
	seller: Seller | null;
	pagesCount: number | null;
};

export const defaultState: State = {
	category: null,
	region: storage.get('region') || DEFAULT_REGION,
	hasSearch: false,
	filterFields: [],
	found: [],
	seller: null,
	pagesCount: null,
};
