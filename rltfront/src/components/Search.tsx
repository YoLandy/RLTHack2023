import { FC, ReactNode, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

import { applyButton } from '@/theme/mixins';
import { theme } from '@/theme/theme';

export type SearchProps = {
	className?: string;
	placeholder?: string;
	initialPhrase?: string;
	size?: 'md' | 'lg';
	onSearch?: (phrase: string) => void;
	children?: ReactNode;
};

const StyledInputRoot = styled.div<Pick<SearchProps, 'size'>>`
	display: flex;
	align-items: center;
	width: 100%;
	background-color: ${theme.color.white};
	${({ size }) => css`
		border-radius: ${Math.round(
			theme.borderRadius[size === 'lg' ? 'md' : 'sm'] * 1.4
		)}px;
	`}
	border: ${theme.borderWidth.md}px solid ${theme.color.accent};
	padding: ${theme.values.xs}px;
`;

const StyledInput = styled.input<Pick<SearchProps, 'size'>>`
	padding: 0;
	margin: 0;
	background-color: transparent;
	width: 100%;
	border-width: 0;
	border-radius: ${theme.borderRadius.md}px;
	margin-right: ${theme.values.xs}px;
	padding: 0 ${theme.values.xs}px;
	font-size: ${({ size }) =>
		size === 'lg' ? theme.fontSizes.h4 : theme.fontSizes.h5}px;
	color: ${theme.color.dark800};
	outline: none;
`;

const StyledButton = styled.button<Pick<SearchProps, 'size'>>`
	${applyButton}
	display: flex;
	justify-content: center;
	align-items: center;
	border-width: 0;
	${({ size }) => {
		return css`
			border-radius: ${theme.borderRadius[size === 'lg' ? 'md' : 'sm']}px;
			font-size: ${theme.fontSizes[size === 'lg' ? 'h4' : 'h5']}px;
			padding: ${theme.values.sm}px ${Math.round(theme.values.sm * 1.33)}px;
		`;
	}}
	color: ${theme.color.white};
	background-color: ${theme.color.accent};
	cursor: pointer;
`;

export const Search: FC<SearchProps> = ({
	className,
	placeholder,
	initialPhrase = '',
	// size = 'lg',
	onSearch,
	children,
}) => {
	const [canUseInitialPhrase, setCanUseInitialPhrase] = useState(true);
	const [phrase, setPhrase] = useState(initialPhrase);

	useEffect(() => {
		if (canUseInitialPhrase) {
			setPhrase(initialPhrase);
		}
	}, [initialPhrase, canUseInitialPhrase]);

	const handleSearch = () => {
		onSearch?.(phrase);
	};

	const handleKeyDown = (key: string) => {
		setCanUseInitialPhrase(false);

		if (key === 'Enter') {
			handleSearch();
		}
	};

	return (
		<div className={className}>
			<StyledInputRoot>
				<StyledInput
					type="text"
					value={phrase}
					placeholder={placeholder}
					onChange={({ target: { value } }) => setPhrase(value)}
					onKeyDown={({ key }) => handleKeyDown(key)}
				/>
				<StyledButton onClick={handleSearch}>Найти</StyledButton>
			</StyledInputRoot>
			<div>{children}</div>
		</div>
	);
};
