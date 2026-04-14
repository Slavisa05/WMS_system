interface FormInputProps {
    label: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
    type?: string
    required?: boolean
    disabled?: boolean
    error?: string
    min?: number
}

const FormInput = ({ label, value, onChange, placeholder, type = 'text', required, disabled, error, min }: FormInputProps) => {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-sidebar-text">{label}</label>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                type={type}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                min={min}
                className="px-4 py-2 rounded-xl border border-border text-sm focus:outline-none focus:border-primary disabled:opacity-50"
            />
            {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        </div>
    )
}

export default FormInput
