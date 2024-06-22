import { siteConfig } from "@/config/site";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import {
    PageHeader,
    PageActions,
    PageHeaderDescription,
} from "@/components/page-header";
import Image from "next/image";
import starkhack from "@/lib/starkhack.png";
import logo from "@/lib/logo.png";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="flex items-end w-full relative">
                <Image
                    src={starkhack}
                    alt="Starkhack"
                    width={1000} // Adjust the width as needed
                    className="neon-text m-20"
                />
                <div className="absolute inset-0 flex flex-col items-end justify-center pr-10">
				<div className="flex flex-col items-center space-y-4 sm:space-y-6 md:space-y-8" style={{ position: 'relative', left: '-600px' }}> {/* Added inline styles */}
						<Image
                            src={logo}
                            alt="logo"
                            width={200}
                            height={200}
                            className="neon-text"
                        />
                        <PageHeaderDescription className="text-xl text-center">
                            Protect and <br /> hack starknet
                        </PageHeaderDescription>
                        <PageActions className="flex justify-center">
                            <Link href="/bounties" className={cn(buttonVariants(), "neon-button h-11 rounded-md px-8 text-base")}>
                                Hack Now
                            </Link>
                        </PageActions>
                    </div>
                </div>
            </div>
            <PageHeader className="text-center">
				<PageHeaderDescription className="pb-10 pt-10">
					Starkhack is a bug bounty platform
					dedicated to protecting crypto projects on starknet, with
					focus on hacking Cairo smart contracts.
				</PageHeaderDescription>
                <PageActions className="mt-8 flex space-x-4 justify-center">
                    <Link
                        target="_blank"
                        rel="noreferrer"
                        href={siteConfig.links.github}
                        className={cn(buttonVariants({ variant: "outline" }), "neon-button-outline")}
                    >
                        <Icons.github className="mr-2 h-4 w-4" />
                        GitHub
                    </Link>
                </PageActions>
            </PageHeader>
        </main>
    );
}