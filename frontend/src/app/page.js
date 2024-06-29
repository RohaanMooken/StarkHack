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
import Image from "next/image";
import starkhack from "@/lib/starkhack.png";
import logo from "@/lib/logo.png";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center space-y-20">
      <PageHeader className="!mx-0 !w-full space-y-12 md:space-y-20">
        <PageHeaderHeading className="flex flex-col md:flex-row items-center justify-evenly !w-full">
        <Image 
          src={starkhack} 
          alt="starkhack" 
          width={1000} 
          className="w-full md:w-auto px-8 md:px-0 mt-4" 
          />
          <div className="flex flex-col items-center space-y-8 justify-evenly mt-12 md:mt-0">
            <div className="relative w-24 h-24 md:w-48 md:h-48">
              <Image
                src={logo}
                alt="logo"
                layout="fill"
                objectFit="contain"
                className="mt-4 md:mt-0"
              />
            </div>
            <PageHeaderDescription className="!tracking-normal">
              Protect and hack Starknet
            </PageHeaderDescription>
            <PageActions>
              <Link
                href="/bounties"
                className={cn(buttonVariants(), "!tracking-normal")}
              >
                Get Started
              </Link>
              <Link
                target="_blank"
                rel="noreferrer"
                href={siteConfig.links.github}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "!tracking-normal"
                )}
              >
                <Icons.github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </PageActions>
          </div>
        </PageHeaderHeading>
        <PageHeaderDescription className="max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] mx-auto text-center">
          Starkhack is a bug bounty platform dedicated to protecting
          crypto projects on starknet, with focus on hacking Cairo
          smart contracts.
        </PageHeaderDescription>
      </PageHeader>
    </main>
  );
}