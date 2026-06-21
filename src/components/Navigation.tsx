import { Home, Plus, Package, Users, MapPin, FileText, Settings, Menu } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { InstallButton } from '@/components/InstallButton';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const Navigation = () => {
  const [open, setOpen] = useState(false);
  
  const navItems = [
    { to: '/', icon: Home, label: 'Início' },
    { to: '/nova-compra', icon: Plus, label: 'Nova Compra' },
    { to: '/lotes', icon: Package, label: 'Lotes' },
    { to: '/produtores', icon: Users, label: 'Produtores' },
    { to: '/fazendas', icon: MapPin, label: 'Fazendas' },
    { to: '/relatorios', icon: FileText, label: 'Relatórios' },
    { to: '/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src={logo} alt="BoiControl Logo" className="h-10 w-10" />
            <span className="text-xl font-bold text-foreground">BoiControl</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className="px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                activeClassName="bg-primary text-primary-foreground hover:bg-primary"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
            <InstallButton />
          </div>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Abrir menu de navegação">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <img src={logo} alt="BoiControl Logo" className="h-8 w-8" />
                  <h2 className="text-lg font-bold text-foreground">BoiControl</h2>
                </div>
                
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-md text-base font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-3"
                    activeClassName="bg-primary text-primary-foreground hover:bg-primary"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </NavLink>
                ))}
                
                <div className="mt-4 px-4">
                  <InstallButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
