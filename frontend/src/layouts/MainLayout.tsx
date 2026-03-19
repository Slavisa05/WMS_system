import { useState } from "react";
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";
import {
    BarChart3,
    Building2,
    Boxes,
    FileText,
    Handshake,
    Truck,
    Users,
    LineChart,
    Settings,
    PanelLeftClose,
    PanelLeftOpen,
    ChevronDown,
} from "lucide-react";

type NavChild = { label: string; to: string };
type NavItem = {
    key: string;
    label: string;
    icon: React.ElementType;
    iconColor: string;
    to?: string;
    children?: NavChild[];
    roles?: ('Admin' | 'Menadzer' | 'Zaposlen')[];
};

const NAV_ITEMS: NavItem[] = [
    { key: "dashboard", label: "Dashboard", icon: BarChart3, iconColor: "group-hover:text-cyan-500", to: "/dashboard", roles: ['Admin', 'Menadzer'] },
    { key: "skladiste", label: "Skladišta", icon: Building2, iconColor: "group-hover:text-emerald-500", roles: ['Admin', 'Menadzer'], children: [
        { label: 'Sva skladista', to: "/skladista" },
    ]},
    { key: "inventar", label: "Inventar", icon: Boxes, iconColor: "group-hover:text-amber-500", children: [
        { label: "Kategorije", to: "/kategorije" },
        { label: "Proizvodi", to: "/proizvodi" },
        { label: "Zalihe", to: "/zalihe" },
    ]},
    { key: "dokumenta", label: "Dokumenta", icon: FileText, iconColor: "group-hover:text-blue-500", children: [
        { label: "Sva dokumenta", to: "/dokumenta" },
    ]},
    { key: "partneri", label: "Partneri", icon: Handshake, iconColor: "group-hover:text-rose-500", children: [
        { label: "Poslovni partneri", to: "/partneri" },
    ]},
    { key: "transport", label: "Transport", icon: Truck, iconColor: "group-hover:text-orange-500", children: [
        { label: "Vozila", to: "/vozila" },
        { label: "Transporti", to: "/transporti" },
    ]},
    { key: "zaposleni", label: "Zaposleni", icon: Users, iconColor: "group-hover:text-fuchsia-500", roles: ['Admin'], children: [
        { label: "Zaposleni", to: "/zaposleni" },
    ]},
    { key: "izvestaji", label: "Izveštaji", icon: LineChart, iconColor: "group-hover:text-lime-500", roles: ['Admin', 'Menadzer'], to: "/izvestaji" },
    { key: "podesavanja", label: "Podešavanja", icon: Settings, iconColor: "group-hover:text-violet-500", to: "/podesavanja" },
];

const MainLayout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [openItem, setOpenItem] = useState<string | null>(null);
    const { user, isAdmin, isMenadzer } = useAuth();
    const location = useLocation();

    const isActive = (to: string) => location.pathname === to;
    const isGroupActive = (children: NavChild[]) => children.some(c => location.pathname === c.to);

    const canSee = (item: NavItem) => {
        if (!item.roles) return true  
        if (item.roles.includes('Admin') && isAdmin) return true
        if (item.roles.includes('Menadzer') && isMenadzer) return true
        return false
    }

    const navLinkClass = "group uppercase inline-flex items-center gap-2 rounded-md px-4 py-2 transition-all duration-200 hover:shadow-md shadow-sidebar-hover hover:bg-foreground/5";
    const iconClass = "transition-all duration-200 group-hover:scale-110";

    const toggleItem = (key: string) => setOpenItem(prev => prev === key ? null : key);

    return(
        <main className={`w-full h-screen flex flex-row overflow-x-hidden transition-[padding] duration-300 py-3 ${isOpen ? "pl-[24vw]" : "pl-[4vw]"}`}>
            <nav className={`fixed top-0 left-0 bottom-0 overflow-hidden bg-sidebar text-sidebar-text transition-[width] duration-300 flex flex-col justify-between border-r ${isOpen ? "w-[20vw] border-r-foreground" : "w-0 border-r-transparent"}`}>
                <div className="flex flex-col gap-8 pt-4 pl-4 overflow-y-auto">
                    <strong className="text-xl italic">Dobrodošli {user?.username}!</strong>

                    <ul className="list-none flex flex-col gap-1 pr-2">
                        {NAV_ITEMS.filter(canSee).map(item => {
                            const Icon = item.icon;
                            const isExpanded = openItem === item.key;

                            if (!item.children) {
                                const active = isActive(item.to!);
                                return (
                                    <li key={item.key}>
                                        <Link
                                            className={`${navLinkClass} w-full ${
                                                active
                                                    ? "bg-primary/15 text-primary font-semibold"
                                                    : ""
                                            }`}
                                            to={item.to!}
                                        >
                                            <Icon
                                                className={`${iconClass} ${
                                                    active ? "text-primary" : item.iconColor
                                                }`}
                                                size={18}
                                                aria-hidden="true"
                                            />
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            }

                            return (
                                <li key={item.key}>
                                    <button
                                        onClick={() => toggleItem(item.key)}
                                        aria-expanded={isExpanded}
                                        className={`${navLinkClass} w-full justify-between cursor-pointer mt-2 ${
                                            isGroupActive(item.children) ? "text-primary" : ""
                                        }`}
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            <Icon
                                                className={`${iconClass} ${
                                                    isGroupActive(item.children) ? "text-primary" : item.iconColor
                                                }`}
                                                size={18}
                                                aria-hidden="true"
                                            />
                                            {item.label}
                                        </span>
                                        <ChevronDown
                                            size={14}
                                            className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                    <ul className={`overflow-hidden transition-all duration-300 list-none flex flex-col pl-9 ${
                                        isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                                    }`}>
                                        {item.children.map(child => (
                                            <li key={child.label}>
                                                <Link
                                                    to={child.to}
                                                    className={`block rounded-md px-4 py-2 text-sm transition-all duration-300 hover:shadow-md ${
                                                        isActive(child.to)
                                                            ? "text-primary font-semibold border-l-2 border-primary pl-3"
                                                            : "border-l-2 border-transparent pl-3"
                                                    }`}
                                                >
                                                    {child.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="w-[25vw] border-t px-4 py-4">
                    <LogoutButton btnText="Odjavi se" />
                </div>
            </nav>

            <button
                onClick={() => setIsOpen(o => !o)}
                className={`fixed top-3 z-50 rounded-md p-1 transition-all duration-300 hover:bg-foreground/10 ${isOpen ? "left-[20.5vw]" : "left-2"}`}
                aria-label={isOpen ? "Zatvori navigaciju" : "Otvori navigaciju"}
            >
                {isOpen ? <PanelLeftClose size={24} /> : <PanelLeftOpen size={24} />}
            </button>

            <div className="flex-1 overflow-y-auto">
                <Outlet />  
            </div>
        </main>
    );
}

export default MainLayout