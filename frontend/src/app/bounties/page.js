import { data, columns } from "./columns";
import { DataTable } from "@/components/dataTable";

export default function Bounties() {
    return(
        <main className="flex min-h-screen flex-col items-center p-24">
			<h1>Bounties</h1>
            <DataTable columns={columns} data={data} />
		</main>
    );
}