import { MainNav } from "@/components/mainNav";
import { ModeToggle } from "./modeToggle";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

export function Header() {

	return (
		<header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60:">
			<div className="container flex h-14 max-w-screen-2xl items-center">
				<MainNav />
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<nav className="flex items-center space-x-2">
						<DynamicWidget variant="modal" />
						<ModeToggle />
					</nav>
				</div>
			</div>
		</header>
	);
}
