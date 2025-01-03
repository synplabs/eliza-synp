import { FormTab } from "../../types/character";
import { tabs } from "../../constants/create";

type Props = {
    currentTab: FormTab;
    onTabChange: (tab: FormTab) => void;
};

export const FormTabs = ({ currentTab, onTabChange }: Props) => {
    return (
        <div className="flex space-x-1 bg-white/[0.02] p-1 rounded-lg mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                        ${
                            currentTab === tab.id
                                ? "bg-[#00D2BE] text-white"
                                : "text-white/70 hover:text-white hover:bg-white/[0.05]"
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
