"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Editor } from "@/components/editor";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SubmitBountyPage({ params }) {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState([]);

	const [editorContent, setEditorContent] = useState("");
    const [pdf, setPdf] = useState("");

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

        const formData = new FormData();
        formData.append("short_description", editorContent);
        formData.append("pdf", pdf);

		const res = await fetch(`${siteConfig.backendURL}/bounties/?id=${params.id}`, {
			method: "POST",
			body: formData,
		}).catch((err) => console.error(err));
	}

	return isLoading ? (
		<div>Loading...</div>
	) : (
		<div className="flex flex-col items-center space-y-20">
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
					<Input id="pdf" type="file" accept=".pdf" onChange={(e) => setPdf(e.target.files[0])}/>
					<Button onClick={(e) => handleSubmit(e)}>
						Submit Report
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
