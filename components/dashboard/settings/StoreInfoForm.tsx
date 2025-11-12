import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StoreInfoFormProps {
  storeInfo: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    email: string;
  };
  onChange: (value: any) => void;
}

export function StoreInfoForm({ storeInfo, onChange }: StoreInfoFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="storeName">Store Name</Label>
          <Input
            id="storeName"
            value={storeInfo.name}
            onChange={(e) => onChange({ ...storeInfo, name: e.target.value })}
            placeholder="Your store name"
          />
        </div>
        <div>
          <Label htmlFor="storeEmail">Email</Label>
          <Input
            id="storeEmail"
            type="email"
            value={storeInfo.email}
            onChange={(e) => onChange({ ...storeInfo, email: e.target.value })}
            placeholder="store@example.com"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="storeAddress">Store Address</Label>
        <Input
          id="storeAddress"
          value={storeInfo.address}
          onChange={(e) => onChange({ ...storeInfo, address: e.target.value })}
          placeholder="123 Main Street"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={storeInfo.city}
            onChange={(e) => onChange({ ...storeInfo, city: e.target.value })}
            placeholder="City"
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={storeInfo.state}
            onChange={(e) => onChange({ ...storeInfo, state: e.target.value })}
            placeholder="State"
          />
        </div>
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={storeInfo.zipCode}
            onChange={(e) => onChange({ ...storeInfo, zipCode: e.target.value })}
            placeholder="ZIP"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={storeInfo.country}
            onChange={(e) => onChange({ ...storeInfo, country: e.target.value })}
            placeholder="Country"
          />
        </div>
        <div>
          <Label htmlFor="storePhone">Phone</Label>
          <Input
            id="storePhone"
            value={storeInfo.phone}
            onChange={(e) => onChange({ ...storeInfo, phone: e.target.value })}
            placeholder="(123) 456-7890"
          />
        </div>
      </div>
    </div>
  );
}