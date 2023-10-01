import { FC } from 'react';
import styled, { css } from 'styled-components';

import { applyButton } from '@/theme/mixins';
import { theme } from '@/theme/theme';
import { Entity as EntityType } from '@/typings';

export type EntityProps = {
	entity: EntityType;
	onChange: (entity: EntityType) => void;
};

const StyledSwitch = styled.div`
	display: inline-flex;
	align-items: center;
	background-color: ${theme.color.light100};
	border-radius: ${Math.round(theme.borderRadius.sm * 1.4)}px;
	padding: ${theme.values.xs}px;
`;

const StyledButton = styled.button<{ accent?: boolean }>`
	${applyButton}
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: ${theme.borderRadius.sm}px;
	padding: ${theme.values.xs}px ${Math.round(theme.values.xs * 1.33)}px;
	border-width: 0;
	font-size: ${theme.fontSizes.h6}px;
	cursor: pointer;
	${({ accent }) => css`
		color: ${accent ? theme.color.dark800 : theme.color.dark600};
		background-color: ${accent ? theme.color.light200 : 'transparent'};
	`}
`;

const entities: Array<EntityType> = ['PRODUCTS', 'SELLERS'];

const entitiesNames = {
	PRODUCTS: 'Товары',
	SELLERS: 'Поставщики',
};

export const Entity: FC<EntityProps> = ({ entity, onChange }) => {
	return (
		<div>
			<StyledSwitch>
				{entities.map((id, index) => (
					<StyledButton
						key={`${id}-${index}`}
						onClick={() => onChange?.(id)}
						accent={id === entity}
					>
						{entitiesNames[id]}
					</StyledButton>
				))}
			</StyledSwitch>
		</div>
	);
};
