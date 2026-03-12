import { useState } from "react";
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

type NavChild = { label: string; href: string };
type NavItem = {
    key: string;
    label: string;
    icon: React.ElementType;
    iconColor: string;
    href?: string;
    children?: NavChild[];
};

const NAV_ITEMS: NavItem[] = [
    { key: "dashboard", label: "Dashboard", icon: BarChart3, iconColor: "group-hover:text-cyan-500", href: "#" },
    { key: "skladiste", label: "Skladište", icon: Building2, iconColor: "group-hover:text-emerald-500", children: [
        { label: "Skladišta", href: "#" },
        { label: "Sektori", href: "#" },
        { label: "Slotovi", href: "#" },
    ]},
    { key: "inventar", label: "Inventar", icon: Boxes, iconColor: "group-hover:text-amber-500", children: [
        { label: "Kategorije", href: "#" },
        { label: "Proizvodi", href: "#" },
        { label: "Zalihe", href: "#" },
    ]},
    { key: "dokumenta", label: "Dokumenta", icon: FileText, iconColor: "group-hover:text-blue-500", children: [
        { label: "Sva dokumenta", href: "#" },
        { label: "Stavke dokumenta", href: "#" },
    ]},
    { key: "partneri", label: "Partneri", icon: Handshake, iconColor: "group-hover:text-rose-500", children: [
        { label: "Poslovni partneri", href: "#" },
    ]},
    { key: "transport", label: "Transport", icon: Truck, iconColor: "group-hover:text-orange-500", children: [
        { label: "Vozila", href: "#" },
        { label: "Transporti", href: "#" },
    ]},
    { key: "zaposleni", label: "Zaposleni", icon: Users, iconColor: "group-hover:text-fuchsia-500", children: [
        { label: "Pozicije", href: "#" },
        { label: "Zaposleni", href: "#" },
    ]},
    { key: "izvestaji", label: "Izveštaji", icon: LineChart, iconColor: "group-hover:text-lime-500", href: "#" },
    { key: "podesavanja", label: "Podešavanja", icon: Settings, iconColor: "group-hover:text-violet-500", href: "#" },
];

const MainLayout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [openItem, setOpenItem] = useState<string | null>(null);

    const navLinkClass = "group uppercase inline-flex items-center gap-2 rounded-md px-4 py-2 transition-all duration-200 hover:shadow-md hover:bg-foreground/5";
    const iconClass = "transition-all duration-200 group-hover:scale-110";

    const toggleItem = (key: string) => setOpenItem(prev => prev === key ? null : key);

    return(
        <main className={`w-screen h-screen flex flex-row transition-[padding] duration-300 pt-10 pl-12 ${isOpen ? "pl-[28vw]" : "pl-4"}`}>
            <nav className={`fixed top-0 left-0 bottom-0 overflow-hidden transition-[width] duration-300 flex flex-col justify-between border-r ${isOpen ? "w-[25vw] border-r-foreground" : "w-0 border-r-transparent"}`}>
                <div className="flex flex-col gap-8 w-[25vw] pt-4 pl-4 overflow-y-auto">
                    <strong className="text-xl italic">Dobrodošli korisniče!</strong>

                    <ul className="list-none flex flex-col gap-1 pr-2">
                        {NAV_ITEMS.map(item => {
                            const Icon = item.icon;
                            const isExpanded = openItem === item.key;

                            if (!item.children) {
                                return (
                                    <li key={item.key}>
                                        <a className={`${navLinkClass} w-full`} href={item.href}>
                                            <Icon className={`${iconClass} ${item.iconColor}`} size={18} aria-hidden="true" />
                                            {item.label}
                                        </a>
                                    </li>
                                );
                            }

                            return (
                                <li key={item.key}>
                                    <button
                                        onClick={() => toggleItem(item.key)}
                                        aria-expanded={isExpanded}
                                        className={`${navLinkClass} w-full justify-between cursor-pointer mt-2`}
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            <Icon className={`${iconClass} ${item.iconColor}`} size={18} aria-hidden="true" />
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
                                                <a
                                                    href={child.href}
                                                    className="block rounded-md px-4 py-2 text-sm transition-all duration-300 hover:shadow-md"
                                                >
                                                    {child.label}
                                                </a>
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
                className={`fixed top-3 z-50 rounded-md p-1 transition-all duration-300 hover:bg-foreground/10 ${isOpen ? "left-[25.5vw]" : "left-2"}`}
                aria-label={isOpen ? "Zatvori navigaciju" : "Otvori navigaciju"}
            >
                {isOpen ? <PanelLeftClose size={24} /> : <PanelLeftOpen size={24} />}
            </button>

            <h1>Drugi Test</h1>
        </main>
    );
}

export default MainLayout