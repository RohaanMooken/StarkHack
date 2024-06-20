import { siteConfig } from "@/config/site";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center space-y-20 p-24">
			<div className="flex flex-row items-center justify-between w-4/12">
				<p className="text-lg text-muted">
					{siteConfig.name} is a fully anonymus bug bounty platform
					designed to help developers find bugs and critical errors in
					their Cairo and Starknet technologies.
				</p>
				<h1 className="font-bold">Welcome to {siteConfig.name}</h1>
			</div>
			<Link className={buttonVariants({ variant: "default" })} href={"/bounties"}>View Bounties</Link>
		</main>
	);
}
