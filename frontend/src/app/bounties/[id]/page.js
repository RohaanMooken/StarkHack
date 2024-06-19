"use client";
import { Component } from "react";
import { siteConfig } from "@/config/site";

class BountyPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
		};
	}

	componentDidMount() {
		const { params } = this.props; // Destructure params from props
		fetch(`${siteConfig.backendURL}/bounties?id=${params.id}`)
			.then((response) => response.json())
			.then((data) => {
				// Process the fetched data here
				this.setState({ data });
				console.log(data);
			})
			.catch((error) => {
				// Handle any errors that occur during the fetch
				console.log(error);
			});
	}

	render() {
		const { params } = this.props; // Destructure params from props
		return (
			<div className="flex flex-col items-center space-y-20">
				<h1>Bounty</h1>
				<h2>{params.id}</h2>
			</div>
		);
	}
}

export default BountyPage;
