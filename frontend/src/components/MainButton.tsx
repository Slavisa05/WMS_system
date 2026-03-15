import { Loader2 } from 'lucide-react'

interface ButtonProps {
    type?: 'submit' | 'button' | 'reset';
    text: string;
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    loadingText?: string;
}

const variantStyles = {
    primary:   'bg-primary text-white hover:bg-primary-hover active:bg-primary',
    secondary: 'bg-transparent text-primary border border-primary hover:bg-primary/10 active:bg-primary/20',
};

const Button = ({ type = 'button', text, variant = 'primary', onClick, disabled, isLoading, loadingText }: ButtonProps) => {
    return(
        <button type={type} onClick={onClick} disabled={disabled || isLoading}
                className={`uppercase py-2 px-4 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 ${variantStyles[variant]}`}>
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                {isLoading ? (loadingText ?? text) : text}
        </button>
    );
}

export default Button