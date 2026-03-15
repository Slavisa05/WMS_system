import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface Trend {
    value: number;
    direction: 'up' | 'down'
}

interface KPICardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: Trend; 
}

const KPICard = ({ title, value, icon: Icon, trend }: KPICardProps) => {
    return(
        <div className="basis-[calc(25%-0.75rem)] min-w-50 grow p-3 bg-sidebar text-sidebar-text rounded-xl flex flex-col gap-3.5 transition-all ease-out duration-300 hover:transform-[translateY(-10px)] hover:bg-sidebar-hover">
            <div className="flex items-center justify-between">
                <p>{title}</p>
                <Icon />
            </div>

            <strong className="text-2xl">{value}</strong>

            {trend && (
                <div className={`inline-flex items-center gap-1 text-sm font-medium ${
                    trend.direction === 'up' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                    {trend.direction === 'up'
                        ? <TrendingUp size={15} />
                        : <TrendingDown size={15} />
                    }
                    <span>{trend.value}% u odnosu na prošli mesec</span>
                </div>
            )}
        </div>
    );
}

export default KPICard