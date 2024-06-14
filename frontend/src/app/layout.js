import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/themeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "StarkHack",
	description: "Website for StarkHack 2024",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
