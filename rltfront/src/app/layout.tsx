import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Эмби',
	description: 'Быстрый поиск поставщиков для вашего бизнеса',
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					// @ts-ignore
					crossorigin
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap"
					rel="stylesheet"
				/>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</head>

			<body className={inter.className}>{children}</body>
		</html>
	);
}
