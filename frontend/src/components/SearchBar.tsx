import { Search } from "lucide-react";
import type { ReactNode } from "react";

interface FilterSelect {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    options: string[];
}

interface SearchBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filters?: FilterSelect[];
    action?: ReactNode;
}

const SearchBar = ({ search, onSearchChange, searchPlaceholder = 'Pretraži...', filters, action }: SearchBarProps) => {
    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                    type="text"
                    placeholder={searchPlaceholder}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-border text-sm transition-all duration-150 hover:border-primary focus:outline-none focus:border-primary"
                />
            </div>

            {filters?.map((f, i) => (
                <select
                    key={i}
                    value={f.value}
                    onChange={e => f.onChange(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-border text-sm transition-all duration-150 hover:border-primary focus:outline-none focus:border-primary bg-background text-text"
                >
                    <option value="">{f.placeholder}</option>
                    {f.options.map(o => (
                        <option key={o} value={o}>{o}</option>
                    ))}
                </select>
            ))}

            {action}
        </div>
    );
}

export default SearchBar
