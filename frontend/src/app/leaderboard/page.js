"use client";

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { Provider, Contract, RpcProvider } from 'starknet';

// Initialize Provider
const provider = new RpcProvider({ nodeUrl: 'https://free-rpc.nethermind.io/sepolia-juno' });
const testAddress = '0x07a3b798f9ba55e603b97bf01bf6d2749037a92cdbde063af3e404979f1e3c85';

export default function Leaderboard() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBounties();
  }, []);

  async function fetchBounties() {
    try {
      const { abi: testAbi } = await provider.getClassAt(testAddress);
      if (!testAbi) {
        throw new Error('ABI not found for the contract.');
      }

      const myTestContract = new Contract(testAbi, testAddress, provider);
      
      const bountyResponse = await myTestContract.get_all_xp();
      
      // Assuming bountyResponse is an array of arrays
      const tempBounties = bountyResponse.map((bounty, index) => ({
        id: index,
        hacker_address: BigInt(bounty[0]), // Assuming the first element is xp
        xp: bounty[1] // Assuming the second element is hacker_address
      }));

      // Filter out duplicate hacker_address values, keeping only the first occurrence
      const uniqueBounties = [];
      const seenAddresses = new Set();

      for (const bounty of tempBounties) {
        if (!seenAddresses.has(bounty.hacker_address)) {
          uniqueBounties.push(bounty);
          seenAddresses.add(bounty.hacker_address);
        }
      }

      // Convert BigInt values to strings for display purposes and convert hacker_address to hex
      const displayBounties = uniqueBounties.map(bounty => ({
        ...bounty,
        xp: parseInt(bounty.xp.toString(), 10), // Convert XP to integer for sorting
        hacker_address: '0x' + BigInt(bounty.hacker_address).toString(16)
      }));

      // Sort by XP in descending order
      displayBounties.sort((a, b) => b.xp - a.xp);

      setTableData(displayBounties);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    {
      accessorKey: 'place',
      header: 'Place',
    },
    {
      accessorKey: 'hacker_address',
      header: 'Hacker Address',
    },
    {
      accessorKey: 'xp',
      header: 'XP',
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <div className="rounded-md border">
        {error && <div>Error: {error}</div>}
        {loading ? (
          <p>Loading bounties...</p>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : header.column.columnDef.header}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.column.id === 'place' ? index + 1 : cell.getValue()}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}