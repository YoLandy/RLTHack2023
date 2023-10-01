'use client';

import Pagination from '@mui/material/Pagination';
import { useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import { useAppLogic } from '../hooks/useAppLogic';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Company } from '@/components/Company';
import { Entity } from '@/components/Entity';
import { Filter } from '@/components/Filter';
import { InfoCard, InfoCardProps } from '@/components/InfoCard';
import { Loading } from '@/components/Loading';
import { Modal } from '@/components/Modal';
import { Region } from '@/components/Region';
import { Search } from '@/components/Search';
import { DATA_URL } from '@/constants';
import { theme } from '@/theme/theme';
import { Entity as EntityType, Filters } from '@/typings';
import { createApi } from '@/utils/createApi';
import { getKnownData } from '@/utils/getKnownData';

const api = createApi(DATA_URL);

// TODO: Вёрстка (табы на ToggleButton)
// TODO: Нужен onlyHasAllSearch?
// TODO: Добавить фильтр boolean?

const GlobalStyle = createGlobalStyle`
	html, body {
		margin: 0;
		padding: 0;
		background-color: ${theme.color.light100};
	}

	input, button, div, p {
		font-weight: 400;
		font-family: 'Roboto', sans-serif;
		color: ${theme.color.dark600};
		line-height: 1.25;
	}

	h1, h2, h3, h4, h5, h6 {
		margin: 0;
		font-weight: 500;
		line-height: 1.25;
		font-family: 'Roboto', sans-serif;
	}
`;

const StyledContainer = styled.div`
	width: 80vw;
	margin: 0 auto;
`;

const StyledCompany = styled(Company)`
	margin-bottom: ${theme.values.lg}px;
`;

const StyledHead = styled.div`
	background-color: ${theme.color.white};
	padding-top: ${theme.values.lg}px;
	padding-bottom: ${theme.values.lg}px;
`;

const StyledSearchHead = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: ${theme.values.sm}px;
`;

const StyledRegion = styled(Region)`
	max-width: 350px;
`;

const StyledBody = styled.div`
	margin-top: ${theme.values.sm}px;
`;

const StyledBrSm = styled.div`
	height: ${theme.values.sm}px;
`;

const StyledInfoCard = styled(InfoCard)`
	margin-bottom: ${theme.values.sm}px;
`;

const StyledPagination = styled(Pagination)`
	padding: ${theme.values.sm}px 0;
	margin: 0 auto;
`;

const StyledTextFound = styled.div`
	font-size: ${theme.fontSizes.h6}px;
	margin-bottom: ${theme.values.sm}px;
`;

const StyledCenterText = styled.div`
	font-size: ${theme.fontSizes.h3}px;
	margin-top: ${theme.values.mg}px;
	color: ${theme.color.dark400};
	text-align: center;
`;

export default () => {
	const {
		store: { state, dispatch, loading },
		search,
	} = useAppLogic({ sendRequest: api.get });

	const handlers = useMemo(
		() => ({
			search: (phrase: string) => {
				search.updateState({ search: phrase });
			},
			changeFilter: (filters: Filters) => {
				search.updateState({ filters });
			},
			openSeller: (sellerId: string | number) => {
				// @ts-ignore
				search.updateState({ sellerId: sellerId || null });
			},
			closeSeller: () => {
				search.updateState({ sellerId: null });
			},
			changeEntity: (entity: EntityType) => {
				search.setState({ entity });
			},
			goToPage: (pageNumber: number) => {
				search.updateState({ pageNumber });
			},
		}),
		[search.updateState]
	);

	const hasSearch = !!search.state.search;
	const view = (!hasSearch && 'HELLO') || (loading && 'LOADING') || search.state.entity;
	const hasGroupSearch =
		(search.state.search?.split('|').length || 1 > 1) && view === 'SELLERS';

	return (
		<>
			<GlobalStyle />

			<StyledHead>
				<StyledContainer>
					<StyledCompany />

					<StyledSearchHead>
						<Entity
							entity={search.state.entity!}
							onChange={handlers.changeEntity}
						/>
						<StyledRegion
							value={state.region}
							onChange={dispatch.setRegion}
						/>
					</StyledSearchHead>

					<Search
						placeholder={
							search.state.entity === 'PRODUCTS'
								? 'Введите название товара'
								: 'Укадите несколько товаров через символ `|`'
						}
						initialPhrase={search.state.search || undefined}
						onSearch={loading ? undefined : handlers.search}
					>
						{state.category && (
							<>
								<StyledBrSm />
								<Breadcrumbs
									list={[
										hasGroupSearch
											? 'Вы получили список компаний, имеющих все указанные товары, или большинство из них.'
											: '',
									]}
								/>
							</>
						)}

						{/* {!!state.filterFields.length && (
							<>
								<StyledBrSm />
								<Filter
									filterFields={state.filterFields}
									filters={search.state.filters || {}}
									onChange={handlers.changeFilter}
								/>
							</>
						)} */}
					</Search>
				</StyledContainer>
			</StyledHead>

			<StyledBody>
				<StyledContainer>
					{(() => {
						switch (view) {
							case 'HELLO':
								return <StyledCenterText>Здравствуйте!</StyledCenterText>;
							case 'SELLERS':
							case 'PRODUCTS':
								return (
									<>
										<StyledTextFound>
											Кол-во результатов:
											{` ~${(state.pagesCount || 1) * 25} шт.`}
										</StyledTextFound>

										{state.found.map((item, index) => {
											const product = item.products?.[0] || null;
											const productData = product?.data || {};

											const knownData = product
												? getKnownData(product)
												: {};

											// @ts-ignore
											const preparedProductData: Required<InfoCardProps>['list']['items'] =
												Object.entries({
													...knownData,
													...productData,
												}).reduce((acc, [title, value]) => {
													if (title.length < 45) {
														// @ts-ignore
														acc.push({ title, value });
													}

													return acc;
												}, []);

											return (
												<StyledInfoCard
													key={`${item.seller.id}-${index}`}
													title={item.seller.name}
													subtitle={item.seller.address}
													list={
														preparedProductData.length
															? {
																	title: 'Информация о заказе',
																	items: preparedProductData,
															  }
															: undefined
													}
													buttons={[
														{
															title: 'Подробнее о поставщике',
															onClick: () =>
																dispatch.setSeller(
																	item.seller
																),
														},
													]}
												/>
											);
										})}

										{state.pagesCount && (
											<StyledPagination
												count={state.pagesCount}
												onChange={(_, pn) =>
													handlers.goToPage(pn)
												}
											/>
										)}
									</>
								);
							case 'LOADING':
							default:
								return <StyledCenterText>Ищем...</StyledCenterText>;
						}
					})()}
				</StyledContainer>
			</StyledBody>

			{state.seller && (
				<Modal
					title={state.seller.name}
					// description={JSON.stringify(state.seller)}
					list={{
						title: 'Информация о поставщике',
						items: Object.entries(state.seller).reduce(
							(acc, [key, value]) => {
								if (
									typeof value === 'string' ||
									typeof value === 'number'
								) {
									// @ts-ignore
									acc.push({ title: key, value });
								}

								return acc;
							},
							[]
						),
					}}
					onClose={dispatch.clearSeller}
				/>
			)}
		</>
	);
};
