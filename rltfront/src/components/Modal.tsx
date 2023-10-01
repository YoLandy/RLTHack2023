import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { FC } from 'react';
import styled from 'styled-components';

import { Content, ContentProps } from './Content';

import { applyButton } from '@/theme/mixins';
import { theme } from '@/theme/theme';

export type ModalProps = {
	onClose?: () => void;
} & ContentProps;

const StyledRoot = styled.div`
	position: fixed;
	z-index: 500;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.4);
`;

const StyledCloseButton = styled.button`
	${applyButton}
	position: absolute;
	top: ${theme.values.md}px;
	right: ${theme.values.md}px;
	padding: 0;
	margin: 0;
	border: 0;
	background-color: transparent;
`;

const StyledCloseIcon = styled(HighlightOffOutlinedIcon)`
	height: ${theme.values.lg}px !important;
	width: ${theme.values.lg}px !important;
	color: ${theme.color.accent};
`;

const StyledContent = styled.div`
	position: relative;
	margin: ${theme.values.mg}px ${theme.values.mg * 1.5}px;
	background-color: ${theme.color.white};
	border-radius: ${theme.borderRadius.md}px;
	padding: ${theme.values.md}px;
`;

export const Modal: FC<ModalProps> = ({ onClose, ...contentProps }) => {
	return (
		<StyledRoot>
			<StyledContent>
				<StyledCloseButton onClick={onClose}>
					<StyledCloseIcon />
				</StyledCloseButton>

				<Content {...contentProps} />
			</StyledContent>
		</StyledRoot>
	);
};
