import { FC } from 'react';
import styled, { css } from 'styled-components';

import { Content, ContentProps } from './Content';

import { applyButton } from '@/theme/mixins';
import { theme } from '@/theme/theme';

export type InfoCardProps = {
	className?: string;
	// expandInfoTitle: string;
	buttons?: Array<{
		title: string;
		onClick: (id?: unknown) => void;
		accent?: boolean;
	}>;
} & ContentProps;

const StyledRoot = styled.div`
	display: flex;
	background-color: ${theme.color.white};
	border-radius: ${theme.borderRadius.md}px;
`;

const StyledBody = styled.div<{ width?: string }>`
	${({ width }) => (width ? `width: ${width};` : '')}
	padding: ${theme.values.md}px;
`;

const StyledAside = styled.div`
	min-width: 24%;
	border-left: ${theme.borderWidth.sm}px solid ${theme.color.light200};
	padding: ${theme.values.md}px;
	display: flex;
	flex-direction: column;
`;

const StyledButton = styled.button<{ accent?: boolean }>`
	${applyButton}
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: ${theme.borderRadius.sm}px;
	padding: ${theme.values.xsp}px ${Math.round(theme.values.xsp * 1.33)}px;
	border-width: 0;
	font-size: ${theme.fontSizes.h6}px;
	cursor: pointer;
	margin-bottom: ${theme.values.sm}px;
	${({ accent }) => css`
		color: ${accent ? theme.color.white : theme.color.dark600};
		background-color: ${accent ? theme.color.accent : theme.color.light200};
	`}
`;

export const InfoCard: FC<InfoCardProps> = ({ className, buttons, ...contentProps }) => {
	// const [expanded, setExpanded] = useState(false);

	// const list = useMemo(() => {
	// 	if (!contentProps.list?.items) {
	// 		return contentProps.list;
	// 	}

	// 	const nextList = { ...contentProps.list };

	// 	if (expanded) {
	// 		return nextList;
	// 	}

	// 	nextList.items = contentProps.list.items.slice(0, 3);

	// 	return nextList;
	// }, [expanded, contentProps.list?.items]);

	return (
		<StyledRoot className={className}>
			<StyledBody width={buttons?.length ? '76%' : undefined}>
				<Content {...contentProps} />
			</StyledBody>

			{buttons && (
				<StyledAside>
					{buttons.map((button, index) => (
						<StyledButton
							key={`${button.title}-${index}`}
							onClick={button.onClick}
							accent={button.accent}
						>
							{button.title}
						</StyledButton>
					))}
				</StyledAside>
			)}
		</StyledRoot>
	);
};
