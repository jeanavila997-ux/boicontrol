import { Home, Plus, Package, Users, MapPin, Settings } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { InstallButton } from '@/components/InstallButton';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

export const Navigation = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Início' },
    { to: '/nova-compra', icon: Plus, label: 'Nova Compra' },
    { to: '/lotes', icon: Package, label: 'Lotes' },
    { to: '/produtores', icon: Users, label: 'Produtores' },
    { to: '/fazendas', icon: MapPin, label: 'Fazendas' },
    { to: '/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src={logo} alt="BoiControl Logo" className="h-10 w-10" />
            <h1 className="text-xl font-bold text-foreground">BoiControl</h1>
          </div>
          
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
        </div>
      </div>
    </nav>
  );
};
