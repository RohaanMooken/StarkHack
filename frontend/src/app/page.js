import { siteConfig } from "@/config/site";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import {
	PageHeader,
	PageActions,
	PageHeaderDescription,
	PageHeaderHeading,
} from "@/components/page-header";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center space-y-20 p-24">
			<PageHeader>
				<PageHeaderHeading>
					Welcome to {siteConfig.name}
				</PageHeaderHeading>
				<PageHeaderDescription>
					Starkhack is a bug bounty and security services platform
					dedicated to protecting crypto projects, with a special
					focus on securing Cairo smart contract code from Web3
					vulnerabilities.
				</PageHeaderDescription>
				<PageActions>
					<Link href="/bounties" className={cn(buttonVariants())}>
						Get Started
					</Link>
					<Link
						target="_blank"
						rel="noreferrer"
						href={siteConfig.links.github}
						className={cn(buttonVariants({ variant: "outline" }))}
					>
						<Icons.github className="mr-2 h-4 w-4" />
						GitHub
					</Link>
				</PageActions>
			</PageHeader>
		</main>
	);
}
