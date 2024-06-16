"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";

export function RewardsByThreatLevelManager() {
	const [categories, setCategories] = useState([]);

	return (
		<Card className="w-6/12 p-2">
			<CardContent className="flex flex-col items-center space-y-12">
				<div className="flex flex-row items-center justify-evenly w-6/12 space-x-8">
					<Label>Critical</Label>
					<RadioGroup defaultValue="single">
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="single" id="option-one" />
							<Label htmlFor="option-one">Single Value</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="range" id="option-two" />
							<Label htmlFor="option-two">Range</Label>
						</div>
					</RadioGroup>
					<Input
						type="number"
						placeholder="Threat Level Reward Amount"
					></Input>
				</div>
                <div className="flex flex-row items-center justify-evenly w-6/12 space-x-8">
					<Label>High</Label>
					<RadioGroup defaultValue="single">
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="single" id="option-one" />
							<Label htmlFor="option-one">Single Value</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="range" id="option-two" />
							<Label htmlFor="option-two">Range</Label>
						</div>
					</RadioGroup>
					<Input
						type="number"
						placeholder="Threat Level Reward Amount"
					></Input>
				</div>
                <div className="flex flex-row items-center justify-evenly w-6/12 space-x-8">
					<Label>Medium</Label>
					<RadioGroup defaultValue="single">
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="single" id="option-one" />
							<Label htmlFor="option-one">Single Value</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="range" id="option-two" />
							<Label htmlFor="option-two">Range</Label>
						</div>
					</RadioGroup>
					<Input
						type="number"
						placeholder="Threat Level Reward Amount"
					></Input>
				</div>
                <div className="flex flex-row items-center justify-evenly w-6/12 space-x-8">
					<Label>Low</Label>
					<RadioGroup defaultValue="single">
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="single" id="option-one" />
							<Label htmlFor="option-one">Single Value</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="range" id="option-two" />
							<Label htmlFor="option-two">Range</Label>
						</div>
					</RadioGroup>
					<Input
						type="number"
						placeholder="Threat Level Reward Amount"
					></Input>
				</div>
			</CardContent>
		</Card>
	);
}
