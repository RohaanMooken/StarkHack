import { siteConfig } from "@/config/site";
import { Account, Contract, RpcProvider } from "starknet";

const provider = new RpcProvider({ nodeUrl: siteConfig.nodeURL });

// Helper function to convert hex to ASCII
export function hexToAscii(hex) {
	let ascii = "";
	for (let i = 0; i < hex.length; i += 2) {
		ascii += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	}
	return ascii;
}

// Helper function to convert BigInt values to strings
export function stringifyBigInt(obj) {
	return JSON.stringify(obj, (key, value) =>
		typeof value === "bigint" ? value.toString() : value
	);
}

export async function fetchBounties() {
	try {
		const { abi: testAbi } = await provider.getClassAt(
			siteConfig.testAddress
		);

		if (!testAbi) {
			throw new Error("ABI not found for the contract.");
		}

		const myTestContract = new Contract(
			testAbi,
			siteConfig.testAddress,
			provider
		);

		let index = 0;
		const tempBounties = [];

		while (true) {
			try {
				const bountyResponse = await myTestContract.get_bounty(index);

				const allZero = Object.values(bountyResponse).every(
					(value) =>
						value === 0 || value === "0" || value === BigInt(0)
				);

				if (allZero) {
					break;
				}

				// Convert name from decimal to hex, then to ASCII
				const nameHex = BigInt(bountyResponse.name).toString(16);
				const nameAscii = hexToAscii(nameHex);

				// Convert team_address to hex
				const addressHex =
					"0x" + BigInt(bountyResponse.team_address).toString(16);

				tempBounties.push({
					id: index,
					data: {
						...bountyResponse,
						name: nameAscii,
						team_address: addressHex,
					},
				});
				index++;
			} catch (error) {
				break;
			}
		}
		return tempBounties;
	} catch (error) {
		console.log(error);
	}
}

export async function submitReport(bountyIndex, bugUUID, account) {
	try {
		const { abi: testAbi } = await provider.getClassAt(
			siteConfig.testAddress
		);

		if (!testAbi) {
			throw new Error("ABI not found for the contract.");
		}

		const myTestContract = new Contract(
			testAbi,
			siteConfig.testAddress,
			provider
		);

		myTestContract.connect(account);

		const create = await myTestContract.submit_bug(bountyIndex, bugUUID);

		return;
	} catch (error) {
		console.log(error);
	}
}

export async function createBounty(
	name,
	startDate,
	endDate,
	maxReward,
	account
) {
	try {
		const { abi: testAbi } = await provider.getClassAt(
			siteConfig.testAddress
		);

		if (!testAbi) {
			throw new Error("ABI not found for the contract.");
		}

		const myTestContract = new Contract(
			testAbi,
			siteConfig.testAddress,
			provider
		);

		myTestContract.connect(account);

		const stake = await myTestContract.stake();
		await provider.waitForTransaction(stake.transaction_hash);

		const create = await myTestContract.create_bounty(
			name,
			startDate,
			endDate,
			maxReward
		);

		return;
	} catch (error) {
		console.log(error);
	}
}

export async function getBountyCount() {
	try {
		const { abi: testAbi } = await provider.getClassAt(
			siteConfig.testAddress
		);

		if (!testAbi) {
			throw new Error("ABI not found for the contract.");
		}

		const myTestContract = new Contract(
			testAbi,
			siteConfig.testAddress,
			provider
		);

		const bountyCount = await myTestContract.get_bounty_count();

		return bountyCount;
	} catch (error) {
		console.log(error);
	}
}
