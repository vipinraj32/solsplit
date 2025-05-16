
import { Product } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AdminProductListProps {
  products: Product[];
  loading: boolean;
}

const AdminProductList = ({ products, loading }: AdminProductListProps) => {
  // Helper function to convert byte array to base64 image
  const getImageSrc = (imageData: string) => {
    try {
      return `data:image/jpeg;base64,${imageData}`;
    } catch (error) {
      console.error("Error parsing image data:", error);
      return "/placeholder.svg"; // Fallback image
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-solana"></div>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-500">No products found.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">ID</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-24">Price</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="w-24">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.productId}>
              <TableCell className="font-medium">{product.productId}</TableCell>
              <TableCell>
                <div className="h-16 w-16 overflow-hidden rounded">
                  <img
                    src={getImageSrc(product.imageData)}
                    alt={product.productName}
                    className="h-full w-full object-cover object-center"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
              </TableCell>
              <TableCell>{product.productName}</TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate">{product.description}</div>
              </TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.productType}</TableCell>
              <TableCell>
                {product.available ? (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">Available</Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">Unavailable</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminProductList;
