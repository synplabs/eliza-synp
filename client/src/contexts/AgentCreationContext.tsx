import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { Character, defaultCharacter, FormTab } from "../types/character";

type AgentCreationContextType = {
    prompt: string;
    setPrompt: (prompt: string) => void;
    formData: Character;
    setFormData: (data: Character) => void;
    activeTab: "quick" | "advanced";
    setActiveTab: (tab: "quick" | "advanced") => void;
    currentFormTab: FormTab;
    setCurrentFormTab: (tab: FormTab) => void;
    clearState: () => void;
};

const STORAGE_KEY = "agent-creation";

const AgentCreationContext = createContext<AgentCreationContextType | null>(
    null
);

export function AgentCreationProvider({ children }: { children: ReactNode }) {
    // Load initial state from localStorage
    const loadInitialState = () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return {
                prompt: parsed.prompt || "",
                formData: parsed.formData || defaultCharacter,
                activeTab: parsed.activeTab || "quick",
                currentFormTab: parsed.currentFormTab || "basic",
            };
        }
        return {
            prompt: "",
            formData: defaultCharacter,
            activeTab: "quick",
            currentFormTab: "basic",
        };
    };

    const initialState = loadInitialState();
    const [prompt, setPrompt] = useState(initialState.prompt);
    const [formData, setFormData] = useState<Character>(initialState.formData);
    const [activeTab, setActiveTab] = useState<"quick" | "advanced">(
        initialState.activeTab as "quick" | "advanced"
    );
    const [currentFormTab, setCurrentFormTab] = useState(
        initialState.currentFormTab
    );

    // Save state to localStorage whenever it changes
    useEffect(() => {
        if (formData !== defaultCharacter || prompt.trim()) {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    prompt,
                    formData,
                    activeTab,
                    currentFormTab,
                })
            );
        }
    }, [prompt, formData, activeTab, currentFormTab]);

    const clearState = () => {
        localStorage.removeItem(STORAGE_KEY);
        setPrompt("");
        setFormData(defaultCharacter);
        setActiveTab("quick");
        setCurrentFormTab("basic");
    };

    return (
        <AgentCreationContext.Provider
            value={{
                prompt,
                setPrompt,
                formData,
                setFormData,
                activeTab,
                setActiveTab,
                currentFormTab,
                setCurrentFormTab,
                clearState,
            }}
        >
            {children}
        </AgentCreationContext.Provider>
    );
}

export function useAgentCreation() {
    const context = useContext(AgentCreationContext);
    if (!context) {
        throw new Error(
            "useAgentCreation must be used within an AgentCreationProvider"
        );
    }
    return context;
}
