import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentGateway {
  id: number;
  name: string;
  enabled: boolean;
  credentials: {
    apiKey?: string;
    secretKey?: string;
    merchantId?: string;
    sandboxMode: boolean;
  };
}

interface PaymentGatewaysFormProps {
  paymentGateways: PaymentGateway[];
  onChange: (value: any) => void;
}

export function PaymentGatewaysForm({ paymentGateways, onChange }: PaymentGatewaysFormProps) {
  const updateGateway = (id: number, field: string, value: any) => {
    const updatedGateways = paymentGateways.map(gateway => {
      if (gateway.id === id) {
        return {
          ...gateway,
          [field]: typeof gateway[field] === 'object' 
            ? { ...gateway[field], ...value } 
            : value
        };
      }
      return gateway;
    });
    onChange(updatedGateways);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Payment Gateways</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Configure payment processors for your store
        </p>
        
        <div className="space-y-6">
          {paymentGateways.map((gateway) => (
            <div key={gateway.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium">{gateway.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${gateway.enabled ? 'text-green-600' : 'text-red-600'}`}>
                    {gateway.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <input
                    type="checkbox"
                    checked={gateway.enabled}
                    onChange={(e) => updateGateway(gateway.id, 'enabled', e.target.checked)}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                </div>
              </div>

              {gateway.name === 'Stripe' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`stripe-api-key-${gateway.id}`}>API Key</Label>
                    <Input
                      id={`stripe-api-key-${gateway.id}`}
                      type="password"
                      value={gateway.credentials.apiKey || ''}
                      onChange={(e) => updateGateway(gateway.id, 'credentials', { apiKey: e.target.value })}
                      placeholder="sk_live_..."
                    />
                  </div>
                  <div>
                    <Label htmlFor={`stripe-secret-key-${gateway.id}`}>Secret Key</Label>
                    <Input
                      id={`stripe-secret-key-${gateway.id}`}
                      type="password"
                      value={gateway.credentials.secretKey || ''}
                      onChange={(e) => updateGateway(gateway.id, 'credentials', { secretKey: e.target.value })}
                      placeholder="rk_live_..."
                    />
                  </div>
                </div>
              )}

              {gateway.name === 'PayPal' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`paypal-merchant-id-${gateway.id}`}>Merchant ID</Label>
                    <Input
                      id={`paypal-merchant-id-${gateway.id}`}
                      value={gateway.credentials.merchantId || ''}
                      onChange={(e) => updateGateway(gateway.id, 'credentials', { merchantId: e.target.value })}
                      placeholder="Merchant ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`paypal-api-key-${gateway.id}`}>Client ID</Label>
                    <Input
                      id={`paypal-api-key-${gateway.id}`}
                      type="password"
                      value={gateway.credentials.apiKey || ''}
                      onChange={(e) => updateGateway(gateway.id, 'credentials', { apiKey: e.target.value })}
                      placeholder="Client ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`paypal-secret-key-${gateway.id}`}>Client Secret</Label>
                    <Input
                      id={`paypal-secret-key-${gateway.id}`}
                      type="password"
                      value={gateway.credentials.secretKey || ''}
                      onChange={(e) => updateGateway(gateway.id, 'credentials', { secretKey: e.target.value })}
                      placeholder="Client Secret"
                    />
                  </div>
                </div>
              )}

              {gateway.name === 'Wallet' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`wallet-id-${gateway.id}`}>Wallet ID</Label>
                    <Input
                      id={`wallet-id-${gateway.id}`}
                      value={gateway.credentials.merchantId || ''}
                      onChange={(e) => updateGateway(gateway.id, 'credentials', { merchantId: e.target.value })}
                      placeholder="Wallet ID"
                    />
                  </div>
                </div>
              )}

              <div className="mt-3 flex items-center">
                <input
                  type="checkbox"
                  id={`sandbox-mode-${gateway.id}`}
                  checked={gateway.credentials.sandboxMode}
                  onChange={(e) => updateGateway(gateway.id, 'credentials', { sandboxMode: e.target.checked })}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
                <Label htmlFor={`sandbox-mode-${gateway.id}`} className="ml-2">
                  Sandbox Mode
                </Label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}