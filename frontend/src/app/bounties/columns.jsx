"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const columnHelper = createColumnHelper();

export const data = [
	{
		id: 0,
		name: "SSV Network",
		vault_tvl: 2400000,
		max_bounty: 1000000,
		total_paid: "Private",
		last_updated: "08/04/2024",
	},
	{
		id: 1,
		name: "Beanstalk",
		vault_tvl: 2200000,
		max_bounty: 1100000,
		total_paid: 1300000,
		last_updated: "06/06/2024",
	},
	// ...
];

export const columns = [
	columnHelper.accessor("name", {
		accessorKey: "name",
		header: () => <div className="text-center uppercase">name</div>,
        cell: ({ row }) => {
            const value = row.getValue("name");
            return <div className="text-center">{value}</div>;
        }
	}),
	columnHelper.accessor("vault_tvl", {
		accessorKey: "vault_tvl",
		header: () => <div className="text-center uppercase">Vault TVL</div>,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("vault_tvl"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(amount);

			return <div className="text-center">{formatted}</div>;
		},
	}),
	columnHelper.accessor("max_bounty", {
		accessorKey: "max_bounty",
		header: () => <div className="text-center uppercase">Max Bounty</div>,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("max_bounty"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(amount);

			return <div className="text-center">{formatted}</div>;
		},
	}),
	columnHelper.accessor("total_paid", {
		accessorKey: "total_paid",
		header: () => <div className="text-center uppercase">Total Paid</div>,
		cell: ({ row }) => {
            const value = row.getValue("total_paid");
			const amount = parseFloat(value);
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(amount);

            if (value === "Private") {
                return <div className="text-center">Private</div>;
            } else {
                return <div className="text-center">{formatted}</div>;
            }
		},
	}),
	// TODO
	// convert to nice datetime format
	columnHelper.accessor("last_updated", {
		accessorKey: "last_updated",
		header: () => <div className="text-center uppercase">last updated</div>,
        cell: ({ row }) => {
            const value = row.getValue("last_updated");
            return <div className="text-center">{value}</div>;
        }
	}),
	{
		id: "actions",
		cell: ({ row }) => {
			const bounty = row.original;

			// TODO
			// Update for dyanmic bounty page
			return (
				<Link
					href="/bounties"
					className={buttonVariants({ variant: "outline" })}
				>
					<ChevronRight className="h-4 w-12" />
				</Link>
			);
		},
	},
];
