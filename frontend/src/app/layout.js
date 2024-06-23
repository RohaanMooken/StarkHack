import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/themeProvider";
import { Header } from "@/components/header";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { StarknetWalletConnectors } from "@dynamic-labs/starknet";
import { SdkViewType, SdkViewSectionType } from "@dynamic-labs/sdk-api";
import { EthereumIcon, StarknetIcon } from "@dynamic-labs/iconic";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "StarkHack",
	description: "Website for StarkHack 2024",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<DynamicContextProvider
				settings={{
					environmentId: "335d68f2-8120-4d7a-9778-2c1ab0260e82",
					walletConnectors: [
						StarknetWalletConnectors,
					],
				}}
			>
				<body className={`${inter.className} bg-background`}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<Header />
						{children}
					</ThemeProvider>
				</body>
			</DynamicContextProvider>
		</html>
	);
}
