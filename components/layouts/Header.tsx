import { Search, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Header({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b shadow-sm">
      <div className="flex items-center h-16 px-4">
        <div className="mr-4 hidden md:flex">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="flex flex-1 items-center justify-between">
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-full md:w-64"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}