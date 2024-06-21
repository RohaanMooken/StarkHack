"use client";

import { Editor } from "@/components/editor";
import { ImpactsInScopeManager } from "@/components/impactsInScopeManager";
import { RewardsByThreatLevelManager } from "@/components/rewardsByThreatLevelManager";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AssetsInScopeManager } from "@/components/assetsInScopeManager";
import { siteConfig } from "@/config/site";
import { Input } from "@/components/ui/input";
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

export default function CreateBountyPage() {
	const [editor1Content, setEditor1Content] = useState("");
	const [editor2Content, setEditor2Content] = useState("");
	const [editor3Content, setEditor3Content] = useState("");
	const [editor4Content, setEditor4Content] = useState("");
	const [editor5Content, setEditor5Content] = useState("");

	const [impacts, setImpacts] = useState([]);
	const [assets, setAssets] = useState([]);
	const [categories, setCategories] = useState([]);
	const [name, setName] = useState("");

	const [alertDialog, setAlertDialog] = useState(false);
	const { setShowAuthFlow, primaryWallet } = useDynamicContext();

	const router = useRouter();
	// Submit the bounty to the server
	async function handleSubmit(e) {
		e.preventDefault();


		if (!primaryWallet?.connected) {
			setAlertDialog(true);
			return;
		}

		const walletAddress = primaryWallet?.address;

		const res = await fetch(`${siteConfig.backendURL}/bounties/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				owner_address: walletAddress,
				name: name,
				overview: editor1Content,
				rewards: {
					text: editor2Content,
					categories: categories,
				},
				assets: { text: editor3Content, assets: assets },
				impacts: { text: editor4Content, impacts: impacts },
				outOfScope: editor5Content,
			}),
		}).then((res) => {
			if (res.ok) {
				router.push("/bounties");
			}
		})
		.catch((err) => console.error(err));
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col items-center space-y-8"
		>
			<AlertDialog open={alertDialog} onOpenChange={setAlertDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Wallet not connected
						</AlertDialogTitle>
						<AlertDialogDescription>
							To continue the bounty creation process, please
							connect your wallet below.
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
			<h1>Create a Bounty</h1>
			<p className="mb-4">
				Please fill out the fields below accordingly to fit your
				requirements.
			</p>
			<Separator className="my-4 w-7/12" />
			<div className="flex flex-col items-center w-full">
				<h3>Program Overview</h3>
				<Input
					className="w-4/12"
					placeholder="Please enter you project name"
					value={name}
					onChange={(e) => {
						e.preventDefault();
						setName(e.target.value);
					}}
				/>
				<Editor setEditorContent={setEditor1Content} />
			</div>
			<Separator className="my-4 w-7/12" />
			<div className="flex flex-col items-center w-full">
				<h3>Rewards by Threat Level</h3>
				<Editor setEditorContent={setEditor2Content} />
				<RewardsByThreatLevelManager
					categories={categories}
					setCategories={setCategories}
				/>
			</div>
			<Separator className="my-4 w-7/12" />
			<div className="flex flex-col items-center w-full">
				<h3>Assets in Scope</h3>
				<AssetsInScopeManager assets={assets} setAssets={setAssets} />
				<Editor setEditorContent={setEditor3Content} />
			</div>
			<Separator className="my-4 w-7/12" />
			<div className="flex flex-col items-center w-full">
				<h3>Impacts in Scope</h3>
				<ImpactsInScopeManager
					impacts={impacts}
					setImpacts={setImpacts}
				/>
				<Editor setEditorContent={setEditor4Content} />
			</div>
			<Separator className="my-4 w-7/12" />
			<div className="flex flex-col items-center w-full">
				<h3>Out of Scope & Rules</h3>
				<Editor setEditorContent={setEditor5Content} />
			</div>
			<Button type="submit">Submit Bounty</Button>
		</form>
	);
}
