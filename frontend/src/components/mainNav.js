"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import Image from "next/image";
import starkhack from "@/lib/starkhack.png";
import logo from "@/lib/logo.png";

export function MainNav() {
	const pathName = usePathname();
	const { primaryWallet } = useDynamicContext();

	return (
		<div className="mr-4 hidden md:flex">
			<Link href="/" className="mr-6 flex items-center space-x-2">
				{/* Add Icon here if needed/wanted */}
				<Image src={logo} alt="logo" className="h-6 w-6" />
				<span className="hidden font-bold sm:inline-block text-2xl">
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
				{primaryWallet?.connected && (
					<Link
						href="/bounties/create"
						className={cn(
							"transition-colors hover:text-foreground/80",
							pathName === "/bounties/create"
								? "text-foreground"
								: "text-foreground/60"
						)}
					>
						Create Bounty
					</Link>
				)}
				{primaryWallet?.connected && (
					<Link
						href={`/profile/${primaryWallet?.address}`}
						className={cn(
							"transition-colors hover:text-foreground/80",
							pathName === `/profile/${primaryWallet?.address}`
								? "text-foreground"
								: "text-foreground/60"
						)}
					>
						Profile
					</Link>
				)}
			</nav>
		</div>
	);
}
