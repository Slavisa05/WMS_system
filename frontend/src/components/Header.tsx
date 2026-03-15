interface HeaderProps {
    heading: string;
}

const Header = ({ heading }: HeaderProps) => {
    return(
        <div className="w-full px-6 py-3 rounded-xl bg-sidebar text-sidebar-text transition-all duration-300 hover:bg-sidebar-hover">
            <h1>{heading}</h1>
        </div>
    );
}

export default Header