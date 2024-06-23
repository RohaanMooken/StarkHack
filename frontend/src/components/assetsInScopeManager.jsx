"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function AssetsInScopeManager({ assets, setAssets }) {
	// const [impacts, setImpacts] = useState([]);
	const [target, setTarget] = useState("");
	const [type, setType] = useState("");

	function handleAddAsset() {
		setAssets([...assets, { target: target, type: type }]);
	}

	function handleDeleteAsset(index) {
		setAssets(assets.filter((_, i) => i !== index));
	}

	return (
		<Card className="w-6/12 p-2">
			<CardContent className="flex flex-col items-center mt-2 space-y-4">
				<div className="flex flex-row items-center w-full space-x-2">
					<Input
						placeholder="Target"
						value={target}
						onChange={(e) => setTarget(e.target.value)}
					></Input>
					<Input
						placeholder="Type"
						value={type}
						onChange={(e) => setType(e.target.value)}
					/>
					<Button type="button" onClick={handleAddAsset}>Add</Button>
				</div>
				<div className="flex flex-col items-center space-y-2 w-full">
					{assets.map((asset, index) => (
						<Card key={index} className="w-full">
							<CardContent className="w-full p-2 flex flex-row items-center justify-between">
								<p className="text-sm w-5/12">{asset.target}</p>
								<p className="text-sm w-5/12">{asset.type}</p>
								<Button
									className="w-2/12"
									variant="destructive"
									onClick={() => handleDeleteAsset(index)}
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
