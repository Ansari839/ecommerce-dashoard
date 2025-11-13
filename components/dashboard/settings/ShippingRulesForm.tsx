import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ShippingRule {
  id: number;
  name: string;
  country: string;
  minOrderAmount: number;
  cost: number;
  deliveryTime: string;
  enabled: boolean;
}

interface ShippingRulesFormProps {
  shippingRules: {
    freeShippingThreshold: number;
    couriers: Array<{ id: number; name: string; enabled: boolean }>;
    zones: ShippingRule[];
  };
  onChange: (value: any) => void;
}

export function ShippingRulesForm({ shippingRules, onChange }: ShippingRulesFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Free Shipping Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
            <Input
              id="freeShippingThreshold"
              type="number"
              value={shippingRules.freeShippingThreshold}
              onChange={(e) => onChange({ ...shippingRules, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
              placeholder="Minimum order amount for free shipping"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Available Couriers</h3>
        <div className="space-y-2">
          {shippingRules.couriers.map((courier) => (
            <div key={courier.id} className="flex items-center justify-between p-3 border rounded-md">
              <span className="font-medium">{courier.name}</span>
              <div className="flex items-center">
                <span className={`mr-3 text-sm ${courier.enabled ? 'text-green-600' : 'text-red-600'}`}>
                  {courier.enabled ? 'Enabled' : 'Disabled'}
                </span>
                <input
                  type="checkbox"
                  checked={courier.enabled}
                  onChange={(e) => {
                    const updatedCouriers = shippingRules.couriers.map(c =>
                      c.id === courier.id ? { ...c, enabled: e.target.checked } : c
                    );
                    onChange({ ...shippingRules, couriers: updatedCouriers });
                  }}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Delivery Zones</h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Zone Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Min Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Delivery Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Enabled</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {shippingRules.zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{zone.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <Input
                      value={zone.country}
                      onChange={(e) => {
                        const updatedZones = shippingRules.zones.map(z =>
                          z.id === zone.id ? { ...z, country: e.target.value } : z
                        );
                        onChange({ ...shippingRules, zones: updatedZones });
                      }}
                      className="w-32"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <Input
                      type="number"
                      value={zone.minOrderAmount}
                      onChange={(e) => {
                        const updatedZones = shippingRules.zones.map(z =>
                          z.id === zone.id ? { ...z, minOrderAmount: parseFloat(e.target.value) || 0 } : z
                        );
                        onChange({ ...shippingRules, zones: updatedZones });
                      }}
                      min="0"
                      step="0.01"
                      className="w-24"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <Input
                      type="number"
                      value={zone.cost}
                      onChange={(e) => {
                        const updatedZones = shippingRules.zones.map(z =>
                          z.id === zone.id ? { ...z, cost: parseFloat(e.target.value) || 0 } : z
                        );
                        onChange({ ...shippingRules, zones: updatedZones });
                      }}
                      min="0"
                      step="0.01"
                      className="w-24"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <Input
                      value={zone.deliveryTime}
                      onChange={(e) => {
                        const updatedZones = shippingRules.zones.map(z =>
                          z.id === zone.id ? { ...z, deliveryTime: e.target.value } : z
                        );
                        onChange({ ...shippingRules, zones: updatedZones });
                      }}
                      className="w-32"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={zone.enabled}
                        onChange={(e) => {
                          const updatedZones = shippingRules.zones.map(z =>
                            z.id === zone.id ? { ...z, enabled: e.target.checked } : z
                          );
                          onChange({ ...shippingRules, zones: updatedZones });
                        }}
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}