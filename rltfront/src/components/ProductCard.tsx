import { FC } from 'react';

export type ProductCardProps = {
	product: Record<string, unknown>;
	onClick?: (product: Record<string, unknown>) => void;
};

export const ProductCard: FC<ProductCardProps> = ({ product, onClick }) => {
	return (
		<div onClick={() => onClick?.(product)}>
			<h4>{JSON.stringify(product)}</h4>
		</div>
	);
};
