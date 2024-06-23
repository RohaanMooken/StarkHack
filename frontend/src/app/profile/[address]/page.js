"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
	getReportCount,
	getReports,
	getReportsFromAddress,
} from "@/lib/smartContractFunctions";
import ApproveDeny from "@/components/approveDeny";

export default function ProfilePage({ params }) {
	const cardData = [
		{ title: "Total XP", content: "$45,231.89 (+20.1% from last month)" },
		{
			title: "XP gained this month",
			content: "+2350 (+180.1% from last month)",
		},
		{ title: "Sales", content: "+12,234 (+19% from last month)" },
		{ title: "Active Now", content: "+573 (+201 since last hour)" },
	];

	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState([]);
	const [reports, setReports] = useState([]);
	const [onChainReports, setOnChainReports] = useState([]);

	useEffect(() => {
		fetch(
			`${siteConfig.backendURL}/bounties?owner_address=${params.address}`
		)
			.then((response) => response.json())
			.then((data) => {
				setData(data);
			})
			.catch((error) => {
				console.log(error);
			});

		fetch(
			`${siteConfig.backendURL}/reports?owner_address=${params.address}`
		)
			.then((response) => response.json())
			.then((data) => {
				setReports(data);
				setIsLoading(false);
			})
			.then(async () => {
				setOnChainReports(await getReportsFromAddress(params.address));
			})

			.catch((error) => {
				console.log(error);
				setIsLoading(false);
			});
	}, []);

	async function handleDownload(fileUrl) {
		try {
			const response = await fetch(
				`${siteConfig.backendURL}/media/?file_url=${fileUrl}`
			);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			// Create a Blob from the response
			const blob = await response.blob();

			// Create a link element
			const link = document.createElement("a");

			// Set the href to the object URL created from the Blob
			link.href = URL.createObjectURL(blob);

			// Set the download attribute to the desired file name
			link.setAttribute("download", fileUrl.split("/").pop());

			// Append the link to the body
			document.body.appendChild(link);

			// Programmatically click the link to trigger the download
			link.click();

			// Remove the link from the body
			document.body.removeChild(link);

			// Revoke the object URL to free up resources
			URL.revokeObjectURL(link.href);
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	}

	reports.forEach((report) => {
		// Convert uuid to BigInt for comparison
		const reportBugIdBigInt = BigInt(`0x${report.uuid}`);

		// Find the matching report in onChainReports
		const matchingOnChainReport = onChainReports.find(
			(onChainReport) => onChainReport.bug_id === reportBugIdBigInt
		);

		if (matchingOnChainReport) {
			// Extend the report with severity and status from the matching onChainReport
			report.severity = Number(matchingOnChainReport.severity);
			report.status = Number(matchingOnChainReport.status);
		}
	});

	return isLoading ? (
		<div>Loading...</div>
	) : (
		<div className="flex flex-col items-center space-y-20 mt-20">
			{() => {}}
			<h1 className="font-bold tracking-tight">Hacker Dashboard</h1>
			<div className="flex-1 space-y-4 p-8 pt-6 w-full md:w-[80%] lg:w-[70%] mx-auto mt-16">
				<div className="flex items-center justify-between space-y-2"></div>
				<Tabs defaultValue="overview" className="space-y-4">
					<TabsContent value="overview" className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total XP
									</CardTitle>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										className="h-4 w-4 text-muted-foreground"
									>
										<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
									</svg>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										2530
									</div>
									<p className="text-xs text-muted-foreground">
										+20% from last month
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										XP gained this month
									</CardTitle>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										className="h-4 w-4 text-muted-foreground"
									>
										<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
										<circle cx="9" cy="7" r="4" />
										<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
									</svg>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										+60
									</div>
									<p className="text-xs text-muted-foreground">
										+7% from last month
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total bug reports
									</CardTitle>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										className="h-4 w-4 text-muted-foreground"
									>
										<rect
											width="20"
											height="14"
											x="2"
											y="5"
											rx="2"
										/>
										<path d="M2 10h20" />
									</svg>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">14</div>
									<p className="text-xs text-muted-foreground">
										+15% from last month
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Pending submissions
									</CardTitle>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										className="h-4 w-4 text-muted-foreground"
									>
										<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
									</svg>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">7</div>
									<p className="text-xs text-muted-foreground">
										+3 since last week
									</p>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
			{/* Bounties */}
			{data.length > 0 ? (
				<Card className="w-6/12">
					<CardHeader>
						<CardTitle className="flex flex-col items-center">
							You're Bounties
						</CardTitle>
						<CardDescription>
							Here are the bounties you've created. If you click
							on one of them, you will be able to see all
							submitted reports and pay the reward amount.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col items-center space-y-8">
						<Accordion type="single" className="w-full" collapsible>
							{data.map((bounty, index) => (
								<AccordionItem
									value={`item-${index}`}
									key={index}
								>
									<AccordionTrigger>
										{bounty.name}
									</AccordionTrigger>
									<AccordionContent>
										{bounty.reports.length === 0 ? (
											<p>No reports submitted yet.</p>
										) : (
											bounty.reports.map(
												(report, index) => (
													<Card
														className="w-full"
														key={index}
													>
														<CardContent className="!pt-6 flex flex-row items-center space-x-4">
															<div
																dangerouslySetInnerHTML={{
																	__html: report.short_description,
																}}
															/>
															<Button
																onClick={() =>
																	handleDownload(
																		report.pdf
																	)
																}
																className={buttonVariants()}
															>
																Download {console.log(report)}
															</Button>
															<ApproveDeny
																reportID={
																	report.id
																}
																bountyIndex={
																	bounty.index
																}
																bugIndex={
																	report.index
																}
															/>
														</CardContent>
													</Card>
												)
											)
										)}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</CardContent>
				</Card>
			) : (
				<></>
			)}
			{/* Reports */}
			{reports.length > 0 ? (
				<Card className="w-6/12">
					<CardHeader>
						<CardTitle className="flex flex-col items-center">
							You're Reports
						</CardTitle>
						<CardDescription>
							Here are the reports you've created. If you click on
							one of them, you will be able to see all relevant
							information.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col items-center space-y-8">
						<Accordion type="single" className="w-full" collapsible>
							{reports.map((report, index) => (
								<AccordionItem
									value={`item-${index}`}
									key={index}
								>
									<AccordionTrigger>
										{report.id}
									</AccordionTrigger>
									<AccordionContent className="flex flex-col items-start">
										<div>
											<span className="font-bold">
												Bounty Name:
											</span>{" "}
											{report.bounty_name}
										</div>
										<div>
											<span className="font-bold">
												Short Description:
											</span>
											<div
												dangerouslySetInnerHTML={{
													__html: report.short_description,
												}}
											/>
										</div>
										<div>
											<span className="font-bold">
												Status:{" "}
											</span>{" "}
											{Number(report.status) === 0
												? "pending"
												: Number(report.status) === 1
												? "approved"
												: "denied"}
										</div>
										<div>
											<span className="font-bold">
												Severity:
											</span>{" "}
											{Number(report.severity) === 0
												? "Low"
												: Number(report.severity) === 1
												? "Medium"
												: Number(report.severity) === 2
												? "High"
												: "Critical"}
										</div>
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</CardContent>
				</Card>
			) : (
				<></>
			)}
		</div>
	);
}
