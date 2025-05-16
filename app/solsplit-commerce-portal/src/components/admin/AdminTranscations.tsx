
import { transaction } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AdminTranscationListProps {
  transcations:transaction[];
  loading: boolean;
}

const AdminTranscations = ({ transcations, loading }: AdminTranscationListProps) => {
  // Helper function to convert byte array to base64 image
 
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-solana"></div>
      </div>
    );
  }
  
  if (transcations.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-500">No Transcations found.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Transcation ID</TableHead>
            <TableHead>Wallet Address</TableHead>
            <TableHead>email</TableHead>
            <TableHead>amount</TableHead>
            <TableHead className="w-24">Name</TableHead>
            <TableHead>Mode BNPL</TableHead>
             <TableHead>ProductId</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transcations.map((transaction) => (
            <TableRow key={transaction.transId}>
              <TableCell className="font-medium">{transaction.transId}</TableCell>
              <TableCell>{transaction.walletAddress}</TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate">{transaction.email}</div>
              </TableCell>
              <TableCell>${transaction.amount.toFixed(2)}</TableCell>
              <TableCell>{transaction.name}</TableCell>
              <TableCell>
                  <Badge variant="outline" className="text-gray-500">Unavailable</Badge>
              </TableCell>
               <TableCell>{transaction.productId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminTranscations;
