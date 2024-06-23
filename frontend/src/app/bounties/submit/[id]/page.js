"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Editor } from "@/components/editor";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { submitReport } from "@/lib/smartContractFunctions";

export default function SubmitBountyPage({ params }) {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState([]);

	const [editorContent, setEditorContent] = useState("");
	const [pdf, setPdf] = useState("");

	const [alertDialog, setAlertDialog] = useState(false);
	const { setShowAuthFlow, primaryWallet } = useDynamicContext();
	const walletConnector = primaryWallet?.connector;

	const router = useRouter();
	useEffect(() => {
		fetch(`${siteConfig.backendURL}/bounties?id=${params.id}`)
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

	// Submit the report to the server
	async function handleSubmit(e) {
		e.preventDefault();

		if (!primaryWallet?.connected) {
			setAlertDialog(true);
			return;
		}

		const walletAddress = primaryWallet?.address;

		const formData = new FormData();
		formData.append("short_description", editorContent);
		formData.append("pdf", pdf);
		formData.append("owner_address", walletAddress);

		const res = await fetch(
			`${siteConfig.backendURL}/bounties/?id=${params.id}`,
			{
				method: "POST",
				body: formData,
			}
		)
			.then(async (response) => {
				// Use async here to allow await inside
				const jsonData = await response.json(); // Wait for the JSON data
				return jsonData; // Return the JSON data so the next .then() receives it
			})
			.catch((err) => console.error(err));

		const account = await walletConnector.getSigner();

		await submitReport(res.bounty_index, res.report_uuid, account);
		router.push("/bounties");
	}

	return isLoading ? (
		<div>Loading...</div>
	) : (
		<div className="flex flex-col items-center space-y-20">
			<AlertDialog open={alertDialog} onOpenChange={setAlertDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Wallet not connected
						</AlertDialogTitle>
						<AlertDialogDescription>
							To continue the bounty report creation process,
							please connect your wallet below.
						</AlertDialogDescription>
						<AlertDialogFooter>
							<AlertDialogCancel
								onClick={() => (window.location.href = "/")}
							>
								Home
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => setShowAuthFlow(true)}
							>
								Connect Wallet
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>
			<h1>Submit Bounty for {data.name}</h1>
			<Card className="w-6/12">
				<CardContent className="flex flex-col items-center space-y-8">
					<Editor
						setEditorContent={setEditorContent}
						className="!w-full"
						editorPlaceholder={`Please provide a short description of the vulnerability.`}
						// editorPlaceholder="Please provide a short description of the vulnerability."
					/>
					<p>
						Please upload a pdf file containing the full bug report.
					</p>
					<Input
						id="pdf"
						type="file"
						accept=".pdf"
						onChange={(e) => setPdf(e.target.files[0])}
					/>
					<Button
						className={buttonVariants()}
						onClick={(e) => handleSubmit(e)}
					>
						Submit Report
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
