import { css } from 'styled-components';

export const applyFontHeadline = css`
	font-weight: 500;
`;

export const applyButton = css`
	cursor: pointer;
	transition: 0.2s;

	&:active {
		transform: scale(1.05);
	}
`;
