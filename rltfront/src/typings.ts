export type Entity = 'PRODUCTS' | 'SELLERS';

export type Category = {
	id: string;
	name: string;
	tree?: Array<string>;
};

export type Seller = {
	id: string | number;
	name: string;
	logoUrl?: string;
	valueOfTransactions?: number;
	valueOfReviews?: number;
	/** Сумма оборота */
	volume?: number;
	regions: Array<string>;
	inn?: number;
	ogrn: number;
	/** Sat Sep 30 2023 13:26:55 GMT+0300 (Moscow Standard Time) */
	birthday: string;
	categories: Array<Category>;
	address: string;
	RNP: number;
	activeDebts: number;
	authorizedCapital: number;
	claimant: number;
	completedDebts: number;
	defendant: number;
	mainOkved: number;
	regDate: string;
	status: string;
	workers: 123;
	[key: string]: unknown;
};

export type Product = {
	title: string;
	/** Например, артикул */
	id: string | number;
	imageUrl?: string;
	description: string;
	category: string;
	fullPrice: number;
	textPrice?: string;
	reliability: string;
	searchPhrase: string;
	shippingRegion: string;
	data?: Record<string, string>;
	[key: string]: unknown;
};

export type FilterField =
	| {
			name: string;
			id: string | number;
			type: 'RANGE';
			from: number;
			to: number;
			unit: string;
	  }
	| {
			name: string;
			id: string | number;
			type: 'SELECT';
			items: Array<string>;
	  }
	| {
			name: 'Регион';
			id: 'region';
			type: 'REGION';
			items: Array<string>;
	  };

export type Filters = Record<FilterField['id'], string | number | Array<string | number>>;

// !ЗАПРОСЫ

// Поиск

/// Фронт отправляет запрос поиска: по кому поиск ('PRODUCTS' | 'SELLERS') + фильтры.
/// Получает: поставщиков и их позиции, доступные для заказа; + фильтры, доступные для этого запроса.

export type RequestSearch = {
	type: 'SEARCH';
	params: {
		searchBy: Entity;
		/**
		 * Поисквые запросы.
		 * Для type=PRODUCTS несколько запросов подразумевает поиск сразу нескольких позиций (групп. поиск).
		 * Для type=SELLERS в массиве будет только один запрос (ищет по: name | inn | ogrn)
		 */
		phrases: string;
		/** Список категорий, по которым идёт поиск */
		categories?: string;
		/** Только те поставщики, у кого есть все позиции (да/нет) */
		onlyHasAllSearch: boolean;
		/** Кол-во на странице */
		limit: number;
		/** Номер текущей страницы */
		pageNumber: number;
		/**
		 * Пользовательские фильтры (цена, регион, и т.д.).
		 * Отправляется в формате { id: value }
		 */
		filters?: Record<FilterField['id'], string | number | Array<string | number>>;
	};
};

export type ResponseSearch = {
	type: 'SEARCH';
	payload: {
		searchBy: Entity;
		/** Список запросов группового поиска, понятых сервером */
		searchList: Array<string>;
		/** Категория запроса. Не доступна для группового поиска */
		category?: Category;
		/** Доступные фильтры. Для группового поиска фильтр только по региону */
		filters: Array<FilterField>;
		/** Количество страниц для запроса */
		pagesCount: number;
		found: Array<{
			seller: Seller;
			/** Для searchBy=PRODUCTS */
			products?: Array<
				Product & {
					/** Цена за всю поставку в формате "120 000 ₽" */
					fullPrice: string;
					searchPhrase: string;
					category: Category;
				}
			>;
		}>;
	};
};

// Поставщик

export type RequestSeller = {
	type: 'SELLER';
	params: Partial<Pick<Seller, 'id' | 'inn' | 'ogrn'>>;
};

export type ResponseSeller = {
	type: 'SELLER';
	payload: Seller;
};

export type Request = RequestSearch | RequestSeller;
export type Response = ResponseSearch | ResponseSeller;

export type SendRequest = (request: Request) => Promise<Response>;

export type ServerDataCache = Record<string, Response>;
