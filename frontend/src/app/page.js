import { siteConfig } from "@/config/site";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="flex flex-row items-center justify-between w-4/12">
				<p className="text-lg text-muted">This is a small description explaining the site.</p>
				<h1 className="font-bold">Welcome to {siteConfig.name}</h1>
			</div>
		</main>
	);
}
