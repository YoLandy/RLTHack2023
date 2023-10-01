import { FC, ReactNode, useRef } from 'react';
import styled, { css } from 'styled-components';

import { useFocus } from '@/hooks/useFocus';
import { applyButton } from '@/theme/mixins';
import { theme } from '@/theme/theme';

export type FilterCardProps = {
	className?: string;
	label: string;
	children: ReactNode;
	useAccent?: boolean;
	useBackground?: boolean;
	size?: 'sm' | 'md';
	value?: string | number | null;
};

const StyledRoot = styled.div<{
	accent: string;
	background: string;
	borderRadius: number;
	padding: number;
}>`
	display: inline-flex;
	align-items: center;
	${({ accent, background, borderRadius, padding }) => css`
		border: ${theme.borderWidth.sm}px solid ${accent};
		background-color: ${background};
		border-radius: ${borderRadius}px;
		padding: ${padding}px ${Math.round(padding * 1.33)}px;
	`}

	& > * {
		width: 100%;
	}
`;

const StyledText = styled.div<{ color: string; fontSize: number }>`
	${applyButton}
	color: ${({ color }) => color};
	font-size: ${({ fontSize }) => fontSize}px;
`;

export const FilterCard: FC<FilterCardProps> = ({
	className,
	useAccent,
	useBackground,
	value,
	label,
	size = 'md',
	children,
}) => {
	const rootRef = useRef<HTMLDivElement>(null);
	const { inFocus, canRender } = useFocus(rootRef);

	if (!canRender) {
		return null;
	}

	return (
		<StyledRoot
			ref={rootRef}
			className={className}
			accent={useAccent && value ? theme.color.light300 : 'transparent'}
			background={
				(!useBackground && 'transparent') ||
				(useAccent && value ? theme.color.light200 : theme.color.light100)
			}
			borderRadius={theme.borderRadius.xs}
			padding={theme.values.xs}
		>
			{inFocus ? (
				children
			) : (
				<StyledText
					color={value ? theme.color.dark800 : theme.color.dark400}
					fontSize={size === 'md' ? theme.fontSizes.h6 : theme.fontSizes.xs}
				>
					{value || label}
				</StyledText>
			)}
		</StyledRoot>
	);
};
