"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RewardsByThreatLevelManager({ categories, setCategories }) {
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

	const [categoryName, setCategoryName] = useState("");

	function handleCriticalChange(param, value) {
		if (param === "start") {
			setCriticalStart(parseFloat(value));
		} else {
			setCriticalEnd(parseFloat(value));
		}
	}

	function handleHighChange(param, value) {
		if (param === "start") {
			setHighStart(parseFloat(value));
		} else {
			setHighEnd(parseFloat(value));
		}
	}

	function handleMediumChange(param, value) {
		if (param === "start") {
			setMediumStart(parseFloat(value));
		} else {
			setMediumEnd(parseFloat(value));
		}
	}

	function handleLowChange(param, value) {
		if (param === "start") {
			setLowStart(parseFloat(value));
		} else {
			setLowEnd(parseFloat(value));
		}
	}

	function handleAddCategory() {
		const criticalReward =
			critical === "range"
				? [criticalStart, criticalEnd]
				: [criticalStart];
		const highReward =
			high === "range" ? [highStart, highEnd] : [highStart];
		const mediumReward =
			medium === "range" ? [mediumStart, mediumEnd] : [mediumStart];
		const lowReward = low === "range" ? [lowStart, lowEnd] : [lowStart];

		setCategories([
			...categories,
			{
				name: categoryName,
				critical: criticalReward,
				high: highReward,
				medium: mediumReward,
				low: lowReward,
			},
		]);
	}

	function handleDeleteCategory(index) {
		setCategories(categories.filter((_, i) => i !== index));
	}

	return (
		<Card className="w-6/12 p-2">
			<CardContent className="flex flex-col items-center space-y-12">
				<div className="flex flex-row items-center justify-evenly w-6/12">
					<Input
						placeholder="Category Name"
						value={categoryName}
						onChange={(e) => {
							e.preventDefault();
							setCategoryName(e.target.value);
						}}
					/>
					<Button type="button" onClick={handleAddCategory}>
						Add Category
					</Button>
				</div>
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
									handleCriticalChange(
										"start",
										e.target.value
									)
								}
							/>
							<Input
								type="number"
								placeholder="End"
								value={criticalEnd}
								onChange={(e) =>
									handleCriticalChange("end", e.target.value)
								}
							/>
						</div>
					) : (
						<Input
							type="number"
							placeholder="Critical Level Reward Amount"
							value={criticalStart}
							onChange={(e) =>
								handleCriticalChange("start", e.target.value)
							}
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
								onChange={(e) =>
									handleHighChange("start", e.target.value)
								}
							/>
							<Input
								type="number"
								placeholder="End"
								value={highEnd}
								onChange={(e) =>
									handleHighChange("end", e.target.value)
								}
							/>
						</div>
					) : (
						<Input
							type="number"
							placeholder="High Level Reward Amount"
							value={highStart}
							onChange={(e) =>
								handleHighChange("start", e.target.value)
							}
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
								onChange={(e) =>
									handleMediumChange("start", e.target.value)
								}
							/>
							<Input
								type="number"
								placeholder="End"
								value={mediumEnd}
								onChange={(e) =>
									handleMediumChange("end", e.target.value)
								}
							/>
						</div>
					) : (
						<Input
							type="number"
							placeholder="Medium Level Reward Amount"
							value={mediumStart}
							onChange={(e) =>
								handleMediumChange("start", e.target.value)
							}
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
								onChange={(e) =>
									handleLowChange("start", e.target.value)
								}
							/>
							<Input
								type="number"
								placeholder="End"
								value={lowEnd}
								onChange={(e) =>
									handleLowChange("end", e.target.value)
								}
							/>
						</div>
					) : (
						<Input
							type="number"
							placeholder="Low Level Reward Amount"
							value={lowStart}
							onChange={(e) =>
								handleLowChange("start", e.target.value)
							}
						/>
					)}
				</div>
			</CardContent>
			<CardFooter>
				{categories.map((category, index) => (
					<div
						key={index}
						className="flex flex-col items-center space-x-2 border"
					>
						<Label className="font-bold">{category.name}</Label>
						<Label>Critical: {category.critical.join(" - ")}</Label>
						<Label>High: {category.high.join(" - ")}</Label>
						<Label>Medium: {category.medium.join(" - ")}</Label>
						<Label>Low: {category.low.join(" - ")}</Label>
						<Button
							variant="destructive"
							onClick={() => handleDeleteCategory(index)}
						>
							Delete
						</Button>
					</div>
				))}
			</CardFooter>
		</Card>
	);
}
