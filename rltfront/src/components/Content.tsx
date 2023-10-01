import { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { theme } from '@/theme/theme';

export type ContentProps = {
	className?: string;
	title?: string;
	subtitle?: string;
	description?: string;
	list?: {
		title?: string;
		items: Array<{
			icon?: ReactNode;
			title: string;
			subtitle?: string;
			value?: string | number;
		}>;
	};
};

const StyledTitle = styled.div`
	font-size: ${theme.fontSizes.h3}px;
	color: ${theme.color.dark800};
`;

const StyledSubtitle = styled.div`
	font-size: ${theme.fontSizes.xs}px;
	color: ${theme.color.dark600};
	margin-top: ${theme.values.sm}px;
`;

const StyledDescription = styled.div`
	font-size: ${theme.fontSizes.h6}px;
	color: ${theme.color.dark600};
	margin-top: ${theme.values.md}px;
`;

const StyledListContainer = styled.div`
	margin-top: ${theme.values.md}px;

	& > *:not(:last-child) {
		border-bottom: ${theme.borderWidth.sm}px solid ${theme.color.light100};
		padding-bottom: ${theme.values.xs}px;
		margin-bottom: ${theme.values.xs}px;
	}
`;

const StyledListTitle = styled.div`
	font-size: ${theme.fontSizes.h5}px;
	color: ${theme.color.dark600};
	margin-bottom: ${theme.values.sm}px !important;
	border: 0 !important;
	padding: 0 !important;
`;

const StyledListItemContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
`;

const StyledListItemTitle = styled.div`
	font-size: ${theme.fontSizes.h6}px;
	color: ${theme.color.dark600};
`;

const StyledListItemSubtitle = styled.div`
	font-size: ${theme.fontSizes.xs}px;
	color: ${theme.color.dark400};
`;

const StyledListItemValue = styled.div`
	font-size: ${theme.fontSizes.h6}px;
	color: ${theme.color.dark400};
`;

export const Content: FC<ContentProps> = ({
	className,
	title,
	subtitle,
	description,
	list,
}) => {
	return (
		<div className={className}>
			{title && <StyledTitle>{title}</StyledTitle>}

			{subtitle && <StyledSubtitle>{subtitle}</StyledSubtitle>}

			{!!list?.items.length && (
				<StyledListContainer>
					{list.title && <StyledListTitle>{list.title}</StyledListTitle>}

					{list.items.map(({ title, subtitle, value }, index) => (
						<StyledListItemContainer key={`${title}-${value}-${index}`}>
							<div>
								<StyledListItemTitle>{title}</StyledListItemTitle>
								{subtitle && (
									<StyledListItemSubtitle>
										{subtitle}
									</StyledListItemSubtitle>
								)}
							</div>
							{value && <StyledListItemValue>{value}</StyledListItemValue>}
						</StyledListItemContainer>
					))}
				</StyledListContainer>
			)}

			{description && <StyledDescription>{description}</StyledDescription>}
		</div>
	);
};
