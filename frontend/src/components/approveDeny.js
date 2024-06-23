"use client";

import { useState } from "react";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { approveBug, denyBug } from "@/lib/smartContractFunctions";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { shortString } from "starknet";
import { Input } from "@/components/ui/input";

export default function ApproveDeny({ bountyIndex, bugIndex, reportID }) {
	const [isApproveOpen, setIsApproveOpen] = useState(false);
	const [isDenyOpen, setIsDenyOpen] = useState(false);
	const [formData, setFormData] = useState({
		severity: "",
		xp: 0,
		denyReason: "",
	});
	const { primaryWallet } = useDynamicContext();
	const walletConnector = primaryWallet?.connector;

	const handleSelectChange = (value) => {
		let xp = 0;
		switch (value) {
			case "low":
				xp = 10;
				break;
			case "medium":
				xp = 25;
				break;
			case "high":
				xp = 50;
				break;
			case "critical":
				xp = 100;
				break;
		}
		setFormData((prevData) => ({
			...prevData,
			severity: value,
			xp: xp,
		}));
	};

	const handleDenyReasonChange = (e) => {
		setFormData((prevData) => ({
			...prevData,
			denyReason: e.target.value,
		}));
	};

	const handleApproveSubmit = async (e) => {
		e.preventDefault();
		console.log("Submitted data (approve):", formData);
		setIsApproveOpen(false);

		const account = await walletConnector.getSigner();
		const severity = formData.xp;

		console.log(bugIndex)
		console.log(typeof bugIndex)

		try {
			await approveBug(bountyIndex, bugIndex, severity, account);
			console.log("Bug approved successfully");
		} catch (error) {
			console.error("Error approving bug:", error);
		}
	};

	const handleDenySubmit = async (e) => {
		e.preventDefault();
		console.log("Submitted data (deny):", formData);
		setIsDenyOpen(false);
		const account = await walletConnector.getSigner();

		const reason = formData.denyReason;
		const encStr = shortString.encodeShortString(reason);

		try {
			await denyBug(bountyIndex, bugIndex, encStr, account);
			console.log("Bug approved successfully");
		} catch (error) {
			console.error("Error approving bug:", error);
		}
	};

	return (
		<div className="flex space-x-4">
			<AlertDialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
				<AlertDialogTrigger asChild>
					<Button variant="outline">Approve</Button>
				</AlertDialogTrigger>
				<AlertDialogContent className="p-0 max-w-[95vw] max-h-[90vh] w-[350px]">
					<ScrollArea className="h-full max-h-[80vh]">
						<Card className="border-0">
							<CardHeader>
								<CardTitle>Approve bug {reportID}</CardTitle>
								<CardDescription>
									Set the severity score to payout the hacker
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleApproveSubmit}>
									<div className="grid w-full items-center gap-4">
										<div className="flex flex-col space-y-1.5">
											<Label htmlFor="severity">
												Severity
											</Label>
											<Select
												onValueChange={
													handleSelectChange
												}
												value={formData.severity}
											>
												<SelectTrigger id="severity">
													<SelectValue placeholder="Select" />
												</SelectTrigger>
												<SelectContent position="popper">
													<SelectItem value="low">
														Low
													</SelectItem>
													<SelectItem value="medium">
														Medium
													</SelectItem>
													<SelectItem value="high">
														High
													</SelectItem>
													<SelectItem value="critical">
														Critical
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
								</form>
							</CardContent>
							<CardFooter className="flex justify-between">
								<Button
									variant="outline"
									onClick={() => setIsApproveOpen(false)}
								>
									Cancel
								</Button>
								<Button onClick={handleApproveSubmit}>
									Approve!
								</Button>
							</CardFooter>
						</Card>
					</ScrollArea>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={isDenyOpen} onOpenChange={setIsDenyOpen}>
				<AlertDialogTrigger asChild>
					<Button variant="outline">Deny</Button>
				</AlertDialogTrigger>
				<AlertDialogContent className="p-0 max-w-[95vw] max-h-[90vh] w-[350px]">
					<ScrollArea className="h-full max-h-[80vh]">
						<Card className="border-0">
							<CardHeader>
								<CardTitle>Deny bug {reportID}</CardTitle>
								<CardDescription>
									Provide a reason for denying the bug
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleDenySubmit}>
									<div className="grid w-full items-center gap-4">
										<div className="flex flex-col space-y-1.5">
											<Label htmlFor="denyReason">
												Reason
											</Label>
											<Input
												id="denyReason"
												value={formData.denyReason}
												onChange={
													handleDenyReasonChange
												}
												placeholder="Enter reason for denial"
											/>
										</div>
									</div>
								</form>
							</CardContent>
							<CardFooter className="flex justify-between">
								<Button
									variant="outline"
									onClick={() => setIsDenyOpen(false)}
								>
									Cancel
								</Button>
								<Button onClick={handleDenySubmit}>Done</Button>
							</CardFooter>
						</Card>
					</ScrollArea>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
