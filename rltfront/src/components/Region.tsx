import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { FC, useCallback } from 'react';
import styled from 'styled-components';

import { FilterCard } from './FilterCard';

import { REGIONS } from '@/constants';

export type RegionProps = {
	className?: string;
	value: string;
	onChange?: (region: string) => void;
};

const StyledContainer = styled.div`
	min-width: 200px;

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

const regionsNames = REGIONS.reduce<Record<string, string>>(
	(acc, name) => ({ ...acc, [name]: name }),
	{}
);

export const Region: FC<RegionProps> = ({ className, value, onChange }) => {
	const handleChange = useCallback(
		(_: unknown, region: string) => {
			onChange?.(region);
		},
		[onChange]
	);

	return (
		<FilterCard className={className} value={value} label="Регион">
			<StyledContainer>
				<Autocomplete
					options={REGIONS}
					getOptionLabel={(value) => regionsNames[value]}
					autoComplete
					includeInputInList
					defaultValue={value}
					value={value}
					// @ts-ignore
					onChange={handleChange}
					renderInput={(params) => (
						<StyledTextField {...params} variant="standard" />
					)}
				/>
			</StyledContainer>
		</FilterCard>
	);
};
