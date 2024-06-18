"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ImpactsInScopeManager({ impacts, setImpacts }) {
	// const [impacts, setImpacts] = useState([]);
	const [threatLevel, setThreatLevel] = useState(null);
	const [impactDescription, setImpactDescription] = useState("");

	function handleAddImpact() {
		setImpacts([
			...impacts,
			{ level: threatLevel, description: impactDescription },
		]);
	}

	function handleDeleteImpact(index) {
		setImpacts(impacts.filter((_, i) => i !== index));
	}

	return (
		<Card className="w-6/12 p-2">
			<CardContent className="flex flex-col items-center mt-2 space-y-4">
				<div className="flex flex-row items-center w-full space-x-2">
					<Select onValueChange={setThreatLevel}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Threat Level" />
						</SelectTrigger>
						<SelectContent side="top">
							<SelectItem value="critical">Critical</SelectItem>
							<SelectItem value="high">High</SelectItem>
							<SelectItem value="medium">Medium</SelectItem>
							<SelectItem value="low">Low</SelectItem>
						</SelectContent>
					</Select>
					<Input
						placeholder="Describe the impact here."
						value={impactDescription}
						onChange={(e) => setImpactDescription(e.target.value)}
					/>
					<Button type="button" onClick={handleAddImpact}>Add</Button>
				</div>
				<div className="flex flex-col items-center space-y-2 w-full">
					{impacts.map((impact, index) => (
						<Card key={index} className="w-full">
							<CardContent className="w-full p-2 flex flex-row items-center justify-between">
								<p className="font-bold text-sm w-2/12">
									{impact.level.toUpperCase()}
								</p>
								<p className="text-sm w-8/12">
									{impact.description}
								</p>
								<Button
									className="w-2/12"
									variant="destructive"
									onClick={() => handleDeleteImpact(index)}
								>
									Delete
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
