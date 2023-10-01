import Image from 'next/image';
import { FC } from 'react';
import styled from 'styled-components';

import { theme } from '@/theme/theme';

export type CompanyProps = {
	className?: string;
};

const StyledRoot = styled.div`
	text-align: center;
`;

const StyledLogo = styled(Image)`
	width: auto;
	height: ${theme.values.mg}px;
	margin-bottom: ${theme.values.xsp}px;
`;

const StyledText = styled.div`
	font-size: ${theme.fontSizes.h4}px;
	color: ${theme.color.dark400};
`;

export const Company: FC<CompanyProps> = ({ className }) => {
	return (
		<StyledRoot className={className}>
			<StyledLogo src="/embi.png" width={1277} height={375} alt="" />
			<StyledText>Поиск поставщиков для вашего бизнеса</StyledText>
		</StyledRoot>
	);
};
