
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShippingAddress } from "@/types";

interface CheckoutFormProps {
  address: ShippingAddress;
  setAddress: (address: ShippingAddress) => void;
}

const CheckoutForm = ({ address, setAddress }: CheckoutFormProps) => {
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={address.name}
            onChange={handleAddressChange}
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="addressLine1">Address Line 1</Label>
          <Input
            id="addressLine1"
            name="addressLine1"
            value={address.addressLine1}
            onChange={handleAddressChange}
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
          <Input
            id="addressLine2"
            name="addressLine2"
            value={address.addressLine2}
            onChange={handleAddressChange}
          />
        </div>
        
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={address.city}
            onChange={handleAddressChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="state">State/Province</Label>
          <Input
            id="state"
            name="state"
            value={address.state}
            onChange={handleAddressChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={address.postalCode}
            onChange={handleAddressChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={address.country}
            onChange={handleAddressChange}
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={address.phoneNumber}
            onChange={handleAddressChange}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
