"use client";
import { Component } from "react";
import { siteConfig } from "@/config/site";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default class BountyPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			isLoading: true, // Add a loading state
		};
	}

	componentDidMount() {
		const { params } = this.props; // Destructure params from props
		fetch(`${siteConfig.backendURL}/bounties?id=${params.id}`)
			.then((response) => response.json())
			.then((data) => {
				// Process the fetched data here
				this.setState({ data, isLoading: false }); // Set loading to false when data is fetched
			})
			.catch((error) => {
				// Handle any errors that occur during the fetch
				console.log(error);
				this.setState({ isLoading: false }); // Also set loading to false on error
			});
	}

	render() {
		const { params } = this.props; // Destructure params from props
		const { data, isLoading } = this.state; // Destructure data and isLoading from state

		if (isLoading) {
			return <div>Loading...</div>; // Render a loading message or a spinner
		}

		return (
			<div className="flex flex-col items-center space-y-20 mb-8">
				<h1>{data.name}</h1>
				<Card className="w-6/12">
					<CardHeader className="flex flex-col items-center">
						<h1>Program Overview</h1>
					</CardHeader>
					<CardContent>
						<div
							dangerouslySetInnerHTML={{
								__html: data.program_overview_html,
							}}
						/>
					</CardContent>
				</Card>
				<Card className="w-6/12">
					<CardHeader className="flex flex-col items-center">
						<h1>Rewards by Threat Level</h1>
					</CardHeader>
					<CardContent>
						<div
							dangerouslySetInnerHTML={{
								__html: data.rewards_by_threat_level_html,
							}}
						/>
					</CardContent>
					<CardFooter className="flex flex-col items-center space-y-8">
						{data.rewards.map((rewardCategory) => (
							<Card className="w-full">
								<CardHeader className="flex flex-col items-center">
									<h3>{rewardCategory.category}</h3>
								</CardHeader>
								<CardContent className="flex flex-col items-center">
									{rewardCategory.rewards.map(
										(reward, index) => (
											<div
												key={index}
												className="flex flex-row items-center justify-between w-full"
											>
												<p className="font-bold">
													{reward.threat_level}
												</p>
												{reward.reward_start ==
												reward.reward_end ? (
													<p className="mr-20">
														{reward.reward_start}
													</p>
												) : (
													<p className="mr-20">
														{reward.reward_start} -{" "}
														{reward.reward_end}
													</p>
												)}
											</div>
										)
									)}
								</CardContent>
							</Card>
						))}
					</CardFooter>
				</Card>
				<Card className="w-6/12">
					<CardHeader className="flex flex-col items-center">
						<h1>Assets in Scope</h1>
					</CardHeader>
					<CardContent>
						<div
							dangerouslySetInnerHTML={{
								__html: data.optional_assets_in_scope_html,
							}}
						/>
					</CardContent>
					<CardFooter className="flex flex-col items-center space-y-4">
						{data.assets.map((asset, index) => (
							<Card key={index} className="w-full">
								<CardContent className="flex flex-row items-center justify-between w-full">
									<p>{asset.target}</p>
									<p className="mr-20">{asset.type}</p>
								</CardContent>
							</Card>
						))}
					</CardFooter>
				</Card>
				<Card className="w-6/12">
					<CardHeader className="flex flex-col items-center">
						<h1>Impacts in Scope</h1>
					</CardHeader>
					<CardContent>
						<div
							dangerouslySetInnerHTML={{
								__html: data.optional_impacts_in_scope_html,
							}}
						/>
					</CardContent>
					<CardFooter className="flex flex-col items-center space-y-4">
						{data.impacts.map((impact, index) => (
							<Card key={index} className="w-full">
								<CardContent className="flex flex-row items-center w-full justify-between">
									<p className="font-bold">
										{impact.threat_level}
									</p>
									<p className="mr-20">{impact.impact}</p>
								</CardContent>
							</Card>
						))}
					</CardFooter>
				</Card>
				<Card className="w-6/12">
					<CardHeader className="flex flex-col items-center">
						<h1>Out of Scope</h1>
					</CardHeader>
					<CardContent>
						<div
							dangerouslySetInnerHTML={{
								__html: data.out_of_scope_html,
							}}
						/>
					</CardContent>
				</Card>
				<Link
					href={`/bounties/submit/${params.id}`}
					className={buttonVariants({ variant: "outline" })}
				>
					Submit Bounty <ChevronRight className="mr-2 h-6 w-6" />
				</Link>
			</div>
		);
	}
}
