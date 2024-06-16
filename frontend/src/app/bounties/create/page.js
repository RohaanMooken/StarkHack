import { Editor } from "@/components/editor";
import { ImpactsInScopeManager } from "@/components/impactsInScopeManager";
import { RewardsByThreatLevelManager } from "@/components/rewardsByThreatLevelManager";
import { Separator } from "@/components/ui/separator";

export default function CreateBountyPage() {
	return (
		<div className="flex flex-col items-center space-y-8">
			<h1>Create a Bounty</h1>
			<p className="mb-4">
				Please fill out the fields below accordingly to fit your
				requirements.
			</p>
            <Separator className="my-4 w-7/12"/>
			<div className="flex flex-col items-center w-full">
				<h3>Program Overview</h3>
				<Editor />
			</div>
            <Separator className="my-4 w-7/12"/>
			<div className="flex flex-col items-center w-full">
				<h3>Rewards by Threat Level</h3>
				<Editor />
                <RewardsByThreatLevelManager />
			</div>
            <Separator className="my-4 w-7/12"/>
			<div className="flex flex-col items-center w-full">
				<h3>Impacts in Scope</h3>
				<Editor />
                <ImpactsInScopeManager />
			</div>
            <Separator className="my-4 w-7/12"/>
			<div className="flex flex-col items-center w-full">
				<h3>Out of Scope & Rules</h3>
				<Editor />
			</div>
		</div>
	);
}
