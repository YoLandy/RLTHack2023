import { REGIONS } from './constants';
import { FilterField, Category, Seller, Product } from './typings';

export const filters: Array<FilterField> = [
	{
		id: 1,
		type: 'SELECT',
		name: 'Категории',
		items: ['Офис', 'Комплектующие', 'Компьютерная техника', 'Мебель', 'Столы'],
	},
	{
		id: 2,
		type: 'RANGE',
		name: 'Стоимость',
		from: 100,
		to: 500,
		unit: '₽',
	},
	// {
	// 	id: 3,
	// 	type: 'RADIO',
	// 	name: 'Выберите',
	// 	items: ['Красный', 'Зелёный', 'Синий'],
	// },
];

export const categories: Array<Category> = [
	{
		id: '1',
		name: 'Компьютерная техника',
		tree: ['Офис', 'Комплектующие'],
	},
	{
		id: '2',
		name: 'Столы',
		tree: ['Офис', 'Мебель'],
	},
	{
		id: '3',
		name: 'Стулья',
		tree: ['Офис', 'Мебель'],
	},
];

export const sellers: Array<Seller> = [
	// @ts-ignore
	{
		id: 1,
		inn: 7700983893,
		ogrn: 1067800132195,
		categories: [categories[0], categories[1]],
		regions: [REGIONS[0], REGIONS[1], REGIONS[2], REGIONS[3]],
		name: 'ООО Колготкин',
		birthday: 'Sat Sep 30 2023 13:26:55 GMT+0300 (Moscow Standard Time)',
	},
	// @ts-ignore
	{
		id: 2,
		inn: 7707054893,
		ogrn: 1027123132195,
		categories: [categories[0], categories[1]],
		regions: [REGIONS[0], REGIONS[1]],
		name: 'ПАО Конторкин',
		birthday: 'Sat Sep 30 2023 13:26:55 GMT+0300 (Moscow Standard Time)',
	},
];

export const products: Array<Product> = [
	// @ts-ignore
	{
		id: 1,
		title: 'Ноутбук Asus',
	},
	// @ts-ignore
	{
		id: 2,
		title: 'Ноутбук Apple',
	},
	// @ts-ignore
	{
		id: 3,
		title: 'iPhone 15 X Pro Super Max',
	},
];
