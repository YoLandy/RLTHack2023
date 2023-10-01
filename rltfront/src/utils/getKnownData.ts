const knownData = {
	reliability: 'Надёжность',
	shippingRegion: 'Регион доставки',
	textPrice: 'Полная стоимость',
	address: 'Адрес',
	authorizedCapital: 'Уставной капитал',
	mainOkved: 'Основной ОКВЭД',
	name: 'Имя',
	ogrn: 'ОГРН',
	regDate: 'Дата регистрации',
	status: 'Статус работы',
	workers: 'Кол-во сотрудников',
};

export const getKnownData = (data: Record<string, unknown>) => {
	return Object.entries(data).reduce((acc, [key, value]) => {
		// @ts-ignore
		if (knownData[key]) {
			// @ts-ignore
			acc[knownData[key]] = value;
		}

		return acc;
	}, []);
};
