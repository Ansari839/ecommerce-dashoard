import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LocalizationFormProps {
  localization: {
    currency: string;
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
  };
  onChange: (value: any) => void;
}

export function LocalizationForm({ localization, onChange }: LocalizationFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select value={localization.currency} onValueChange={(value) => onChange({ ...localization, currency: value })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">US Dollar (USD)</SelectItem>
              <SelectItem value="EUR">Euro (EUR)</SelectItem>
              <SelectItem value="GBP">British Pound (GBP)</SelectItem>
              <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
              <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
              <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
              <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
              <SelectItem value="CNY">Chinese Yuan (CNY)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="language">Language</Label>
          <Select value={localization.language} onValueChange={(value) => onChange({ ...localization, language: value })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
              <SelectItem value="zh">Chinese</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="timezone">Timezone</Label>
        <Select value={localization.timezone} onValueChange={(value) => onChange({ ...localization, timezone: value })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
            <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
            <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
            <SelectItem value="CET">CET (Central European Time)</SelectItem>
            <SelectItem value="JST">JST (Japan Standard Time)</SelectItem>
            <SelectItem value="IST">IST (Indian Standard Time)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateFormat">Date Format</Label>
          <Select value={localization.dateFormat} onValueChange={(value) => onChange({ ...localization, dateFormat: value })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              <SelectItem value="Month DD, YYYY">Month DD, YYYY</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="timeFormat">Time Format</Label>
          <Select value={localization.timeFormat} onValueChange={(value) => onChange({ ...localization, timeFormat: value })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
              <SelectItem value="24h">24-hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}