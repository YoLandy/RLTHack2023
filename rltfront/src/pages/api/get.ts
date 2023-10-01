import { parse } from 'lossless-json';
import { NextRequest, NextResponse } from 'next/server';

import { Request, Response } from '../../typings';

import { sellers, products, filters, categories } from '@/mocks';

export const runtime = 'edge';

const createResponse = (request: Request): Response | null => {
	switch (request.type) {
		case 'SEARCH': {
			const req = request.params;

			const found = (() => {
				if (req.searchBy === 'PRODUCTS') {
					return sellers.map((seller) => ({
						seller,
						products: products.map((product) => ({
							...product,
							fullPrice: '150 ₽',
							searchPhrase: req.phrases,
							category: seller.categories[0],
						})),
					}));
				}

				return sellers.map((seller) => ({
					seller,
					category: seller.categories,
				}));
			})();

			return {
				type: 'SEARCH',
				payload: {
					// @ts-ignore
					searchList: req.phrases,
					searchBy: req.searchBy,
					pagesCount: 5,
					// @ts-ignore
					found,
					filters: filters,
					category: categories[0],
				},
			};
		}

		case 'SELLER': {
			return {
				type: 'SELLER',
				payload: sellers[0],
			};
		}

		default:
			return null;
	}
};

export default async (nextRequest: NextRequest) => {
	const text = await nextRequest.text();
	const request = parse(text) as Request;

	const response = createResponse(request);

	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(NextResponse.json(response || {}, { status: response ? 200 : 500 }));
		}, 1);
	});
};
