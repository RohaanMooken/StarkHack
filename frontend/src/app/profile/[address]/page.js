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

export default function ProfilePage({ params }) {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch(
			`${siteConfig.backendURL}/bounties?owner_address=${params.address}`
		)
			.then((response) => response.json())
			.then((data) => {
				setData(data);
				setIsLoading(false);
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
			console.log(fileUrl.split("/").pop());
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

	return isLoading ? (
		<div>Loading...</div>
	) : (
		<div className="flex flex-col items-center space-y-20 mt-20">
			<Card>
				<CardHeader>
					<CardTitle className="flex flex-col items-center">
						You're Bounties
					</CardTitle>
					<CardDescription>
						Here are the bounties you've created. If you click on
						one of them, you will be able to see all submitted
						reports and pay the reward amount.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center space-y-8">
					<Accordion type="single" className="w-full" collapsible>
						{data.map((bounty, index) => (
							<AccordionItem value={`item-${index}`} key={index}>
								<AccordionTrigger>
									{bounty.name}
								</AccordionTrigger>
								<AccordionContent>
									{bounty.reports.length === 0 ? (
										<p>No reports submitted yet.</p>
									) : (
										bounty.reports.map((report, index) => (
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
														Download
													</Button>
													<a
														href="#"
														className={buttonVariants(
															{
																variant:
																	"secondary",
															}
														)}
													>
														Pay
													</a>
												</CardContent>
											</Card>
										))
									)}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</CardContent>
			</Card>
		</div>
	);
}
