import Autocomplete from '@mui/material/Autocomplete';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import { FC } from 'react';
import styled from 'styled-components';

import { FilterCard } from './FilterCard';

import { theme } from '@/theme/theme';
import { FilterField, Filters } from '@/typings';

export type FilterProps = {
	filterFields: Array<FilterField>;
	filters: Filters;
	onChange?: (filters: Filters) => void;
};

const StyledRoot = styled.div`
	display: flex;
	align-items: center;
`;

const StyledFieldContainer = styled.div`
	margin-right: ${theme.values.sm}px;
`;

const StyledFieldCardChildContainer = styled.div`
	width: 300px;

	& > * {
		width: 100%;
	}
`;

const StyledTextField = styled(TextField)`
	div::after,
	div::before {
		display: none;
	}
`;

export const Filter: FC<FilterProps> = ({ filterFields, filters, onChange }) => {
	return (
		<StyledRoot>
			{filterFields.map((field, index) => {
				const key = `${field.id}-${field.name}-${index}`;

				switch (field.type) {
					case 'SELECT': {
						const getOptionLabel = (value: string) => {
							const itemsNames = field.items.reduce<Record<string, string>>(
								(acc, name) => ({ ...acc, [name]: name }),
								{}
							);

							return itemsNames[value];
						};

						const value = filters[field.id] as string;

						return (
							<StyledFieldContainer key={key}>
								<FilterCard
									label={field.name}
									value={value}
									size="sm"
									useAccent
									useBackground
								>
									<StyledFieldCardChildContainer>
										<Autocomplete
											options={field.items}
											getOptionLabel={getOptionLabel}
											autoComplete
											includeInputInList
											value={value}
											onChange={(_, value) =>
												// @ts-ignore
												onChange?.({
													...filters,
													[field.id]: value,
												})
											}
											renderInput={(params) => (
												<StyledTextField
													{...params}
													size="small"
													variant="standard"
												/>
											)}
										/>
									</StyledFieldCardChildContainer>
								</FilterCard>
							</StyledFieldContainer>
						);
					}

					case 'RANGE': {
						if (field.from >= field.to) {
							return null;
						}

						const getText = (value: number) => `${value} ${field.unit}`;

						return (
							<StyledFieldContainer key={key}>
								<FilterCard
									label={field.name}
									value={
										typeof filters[field.id] !== 'undefined'
											? getText(filters[field.id] as number)
											: undefined
									}
									size="sm"
									useAccent
									useBackground
								>
									<StyledFieldCardChildContainer>
										<Slider
											aria-label={field.name}
											defaultValue={field.to}
											getAriaValueText={getText}
											valueLabelDisplay="auto"
											min={field.from}
											max={field.to}
											onChange={(_, value) =>
												// @ts-ignore
												onChange?.({
													...filters,
													[field.id]: value,
												})
											}
											marks
										/>
									</StyledFieldCardChildContainer>
								</FilterCard>
							</StyledFieldContainer>
						);
					}

					case 'REGION':
					default:
						return null;
				}
			})}
		</StyledRoot>
	);
};
