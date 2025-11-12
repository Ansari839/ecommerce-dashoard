import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaxSettingsFormProps {
  taxSettings: {
    taxSystem: string;
    taxRate: number;
    taxIncluded: boolean;
    regions: Array<{ id: number; name: string; rate: number; enabled: boolean }>;
  };
  onChange: (value: any) => void;
}

export function TaxSettingsForm({ taxSettings, onChange }: TaxSettingsFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="taxSystem">Tax System</Label>
        <Select value={taxSettings.taxSystem} onValueChange={(value) => onChange({ ...taxSettings, taxSystem: value })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select tax system" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no_tax">No Tax</SelectItem>
            <SelectItem value="vat">VAT (Value Added Tax)</SelectItem>
            <SelectItem value="gst">GST (Goods and Services Tax)</SelectItem>
            <SelectItem value="sales_tax">Sales Tax</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
          <Input
            id="taxRate"
            type="number"
            value={taxSettings.taxRate}
            onChange={(e) => onChange({ ...taxSettings, taxRate: parseFloat(e.target.value) || 0 })}
            min="0"
            max="100"
            step="0.01"
            placeholder="e.g. 8.5"
          />
        </div>
        <div className="flex items-end">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="taxIncluded"
              checked={taxSettings.taxIncluded}
              onChange={(e) => onChange({ ...taxSettings, taxIncluded: e.target.checked })}
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
            />
            <Label htmlFor="taxIncluded">Tax Included in Product Prices</Label>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Regional Tax Rates</h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tax Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Enabled</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {taxSettings.regions.map((region) => (
                <tr key={region.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{region.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <Input
                      type="number"
                      value={region.rate}
                      onChange={(e) => {
                        const updatedRegions = taxSettings.regions.map(r => 
                          r.id === region.id ? { ...r, rate: parseFloat(e.target.value) || 0 } : r
                        );
                        onChange({ ...taxSettings, regions: updatedRegions });
                      }}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-24"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={region.enabled}
                        onChange={(e) => {
                          const updatedRegions = taxSettings.regions.map(r => 
                            r.id === region.id ? { ...r, enabled: e.target.checked } : r
                          );
                          onChange({ ...taxSettings, regions: updatedRegions });
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