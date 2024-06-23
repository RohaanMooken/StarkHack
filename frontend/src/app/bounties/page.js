"use client";

import { columns } from "./columns";
import { DataTable } from "@/components/dataTable";
import { Component } from "react";
import { siteConfig } from "@/config/site";

export default class Bounties extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
		};
	}

	componentDidMount() {
		fetch(`${siteConfig.backendURL}/bounties`)
			.then((response) => response.json())
			.then((data) => {
				// Process the fetched data here
				this.setState({ data });
			})
			.catch((error) => {
				// Handle any errors that occur during the fetch
				console.log(error);
			});
	}

	render() {
		return (
			<main className="flex min-h-screen flex-col items-center p-24 space-y-20">
				<h1>Bounties</h1>
				<DataTable columns={columns} data={this.state.data} />
			</main>
		);
	}
}
