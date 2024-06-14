"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function MainNav() {
	const pathName = usePathname();

	return (
		<div className="mr-4 hidden md:flex">
			<Link href="/" className="mr-6 flex items-center space-x-2">
				{/* Add Icon here if needed/wanted */}
				<span className="hidden font-bold sm:inline-block">
					{siteConfig.name}
				</span>
			</Link>
			<nav className="flex items-center gap-4 text-sm lg:gap-6">
				<Link
					href="/bounties"
					className={cn(
						"transition-colors hover:text-foreground/80",
						pathName === "/bounties"
							? "text-foreground"
							: "text-foreground/60"
					)}
				>
					Bounties
				</Link>
			</nav>
		</div>
	);
}
