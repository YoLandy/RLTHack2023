import { Category, FilterField, ResponseSearch, ResponseSeller } from '@/typings';

export type SetRegion = {
	type: 'SET_REGION';
	payload: string;
};

export type SetFilterFields = {
	type: 'SET_FILTER_FIELDS';
	payload: Array<FilterField>;
};

export type SetCategory = {
	type: 'SET_CATEGORY';
	payload: Category | null;
};

export type Search = ResponseSearch;

export type Seller = {
	type: ResponseSeller['type'];
	payload: ResponseSeller['payload'] | null;
};

export type Action = SetRegion | SetFilterFields | SetCategory | Search | Seller;
