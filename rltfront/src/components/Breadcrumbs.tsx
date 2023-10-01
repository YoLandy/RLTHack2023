import { FC } from 'react';
import styled from 'styled-components';

import { theme } from '@/theme/theme';

export type BreadcrumbsProps = {
	className?: string;
	list: string[];
};

const StyledList = styled.div`
	display: inline-flex;
	color: ${theme.color.dark400};

	& > * {
		margin-right: ${theme.values.sm}px;
	}

	& > *:last-child {
		color: ${theme.color.dark800};
	}
`;

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ className, list }) => {
	return (
		<div className={className}>
			<StyledList>
				{list.map((item, index) => (
					<div key={`${item}-${index}`}>{item}</div>
				))}
			</StyledList>
		</div>
	);
};
