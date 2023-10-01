export const createTextPrice = (num: number) => {
	if (typeof num !== 'number') {
		return num;
	}

	return `${Intl.NumberFormat('ru').format(num)} ₽`;
};
