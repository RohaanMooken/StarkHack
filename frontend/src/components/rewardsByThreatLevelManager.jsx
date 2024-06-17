"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";

export function RewardsByThreatLevelManager() {
	const [critical, setCritical] = useState("single");
	const [high, setHigh] = useState("single");
	const [medium, setMedium] = useState("single");
	const [low, setLow] = useState("single");

	const [criticalStart, setCriticalStart] = useState(0);
	const [criticalEnd, setCriticalEnd] = useState(0);
	const [highStart, setHighStart] = useState(0);
	const [highEnd, setHighEnd] = useState(0);
	const [mediumStart, setMediumStart] = useState(0);
	const [mediumEnd, setMediumEnd] = useState(0);
	const [lowStart, setLowStart] = useState(0);
	const [lowEnd, setLowEnd] = useState(0);

	return (
		<Card className="w-6/12 p-2">
			<CardContent className="flex flex-col items-center space-y-12">
				<div className="flex flex-row items-center justify-evenly w-6/12 space-x-8">
					<Label>Critical</Label>
					<RadioGroup
						defaultValue="single"
						value={critical}
						onValueChange={setCritical}
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="single" id="option-one" />
							<Label htmlFor="option-one">Single Value</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="range" id="option-two" />
							<Label htmlFor="option-two">Range</Label>
						</div>
					</RadioGroup>
					{critical === "range" ? (
						<div className="flex flex-row items-center space-x-2">
							<Input
								type="number"
								placeholder="Start"
								value={criticalStart}
								onChange={(e) =>
									setCriticalStart(e.target.value)
								}
							/>
							<Input
								type="number"
								placeholder="End"
								value={criticalEnd}
								onChange={(e) => setCriticalEnd(e.target.value)}
							/>
						</div>
					) : (
						<Input
							type="number"
							placeholder="Critical Level Reward Amount"
							value={criticalStart}
							onChange={(e) => setCriticalStart(e.target.value)}
						/>
					)}
				</div>
				<div className="flex flex-row items-center justify-evenly w-6/12 space-x-8">
					<Label>High</Label>
					<RadioGroup
						defaultValue="single"
						value={high}
						onValueChange={setHigh}
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="single" id="option-one" />
							<Label htmlFor="option-one">Single Value</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="range" id="option-two" />
							<Label htmlFor="option-two">Range</Label>
						</div>
					</RadioGroup>
					{high === "range" ? (
						<div className="flex flex-row items-center space-x-2">
							<Input
								type="number"
								placeholder="Start"
								value={highStart}
								onChange={(e) => setHighStart(e.target.value)}
							/>
							<Input
								type="number"
								placeholder="End"
								value={highEnd}
								onChange={(e) => setHighEnd(e.target.value)}
							/>
						</div>
					) : (
						<Input
							type="number"
							placeholder="High Level Reward Amount"
							value={highStart}
							onChange={(e) => setHighStart(e.target.value)}
						/>
					)}
				</div>
				<div className="flex flex-row items-center justify-evenly w-6/12 space-x-8">
					<Label>Medium</Label>
					<RadioGroup
						defaultValue="single"
						value={medium}
						onValueChange={setMedium}
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="single" id="option-one" />
							<Label htmlFor="option-one">Single Value</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="range" id="option-two" />
							<Label htmlFor="option-two">Range</Label>
						</div>
					</RadioGroup>
					{medium === "range" ? (
						<div className="flex flex-row items-center space-x-2">
							<Input
								type="number"
								placeholder="Start"
								value={mediumStart}
								onChange={(e) => setMediumStart(e.target.value)}
							/>
							<Input
								type="number"
								placeholder="End"
								value={mediumEnd}
								onChange={(e) => setMediumEnd(e.target.value)}
							/>
						</div>
					) : (
						<Input
							type="number"
							placeholder="Medium Level Reward Amount"
							value={mediumStart}
							onChange={(e) => setMediumStart(e.target.value)}
						/>
					)}
				</div>
				<div className="flex flex-row items-center justify-evenly w-6/12 space-x-8">
					<Label>Low</Label>
					<RadioGroup
						defaultValue="single"
						value={low}
						onValueChange={setLow}
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="single" id="option-one" />
							<Label htmlFor="option-one">Single Value</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="range" id="option-two" />
							<Label htmlFor="option-two">Range</Label>
						</div>
					</RadioGroup>
					{low === "range" ? (
						<div className="flex flex-row items-center space-x-2">
							<Input
								type="number"
								placeholder="Start"
								value={lowStart}
								onChange={(e) => setLowStart(e.target.value)}
							/>
							<Input
								type="number"
								placeholder="End"
								value={lowEnd}
								onChange={(e) => setLowEnd(e.target.value)}
							/>
						</div>
					) : (
						<Input
							type="number"
							placeholder="Low Level Reward Amount"
							value={lowStart}
							onChange={(e) => setLowStart(e.target.value)}
						/>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
