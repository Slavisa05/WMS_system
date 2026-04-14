import { useState, useRef, useEffect } from "react"
import { ChevronDown, X } from "lucide-react"

interface Option {
    id: number
    label: string
}

interface SearchableSelectProps {
    label: string
    options: Option[]
    value: number | ''
    onChange: (id: number) => void
    placeholder?: string
    required?: boolean
    error?: string
}

const SearchableSelect = ({ label, options, value, onChange, placeholder = 'Pretraži...', required, error }: SearchableSelectProps) => {
    const [search, setSearch] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const selected = options.find(o => o.id === value)

    const filtered = options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase())
    )

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
                setSearch('')
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleSelect = (option: Option) => {
        onChange(option.id)
        setIsOpen(false)
        setSearch('')
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange('' as unknown as number)
        setSearch('')
    }

    return (
        <div className="flex flex-col gap-1" ref={containerRef}>
            <label className="text-sm text-sidebar-text">{label}</label>

            {/* Trigger */}
            <div
                className="relative flex items-center px-4 py-2 rounded-xl border border-border bg-sidebar text-sm cursor-pointer focus-within:border-primary"
                onClick={() => setIsOpen(prev => !prev)}
            >
                {isOpen ? (
                    <input
                        autoFocus
                        className="flex-1 bg-transparent outline-none text-sidebar-text placeholder:text-text-muted"
                        placeholder={placeholder}
                        value={search}
                        onChange={e => { e.stopPropagation(); setSearch(e.target.value) }}
                        onClick={e => e.stopPropagation()}
                    />
                ) : (
                    <span className={`flex-1 truncate ${selected ? 'text-sidebar-text' : 'text-text-muted'}`}>
                        {selected ? selected.label : placeholder}
                    </span>
                )}

                <div className="flex items-center gap-1 text-text-muted">
                    {selected && !isOpen && (
                        <X size={14} onClick={handleClear} className="hover:text-sidebar-text" />
                    )}
                    <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Hidden native input for required validation */}
                {required && (
                    <input
                        tabIndex={-1}
                        required
                        value={value === '' ? '' : String(value)}
                        onChange={() => {}}
                        className="absolute inset-0 opacity-0 pointer-events-none w-full"
                    />
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="z-50 max-h-52 overflow-y-auto rounded-xl border border-border bg-sidebar shadow-lg">
                    {filtered.length === 0 ? (
                        <p className="px-4 py-2 text-sm text-text-muted">Nema rezultata</p>
                    ) : (
                        filtered.map(o => (
                            <div
                                key={o.id}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-sidebar-hover ${o.id === value ? 'text-primary font-medium' : 'text-sidebar-text'}`}
                                onMouseDown={() => handleSelect(o)}
                            >
                                {o.label}
                            </div>
                        ))
                    )}
                </div>
            )}

            {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        </div>
    )
}

export default SearchableSelect
