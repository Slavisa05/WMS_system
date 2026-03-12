import { LogOut } from "lucide-react";

const LogoutButton = ({ btnText, onClick }: { btnText: string; onClick?: () => void }) => {
    return (
        <button
            onClick={onClick}
            className="group w-full inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm uppercase cursor-pointer transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-500 hover:shadow-md"
        >
            <LogOut size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden="true" />
            {btnText}
        </button>
    );
}

export default LogoutButton;