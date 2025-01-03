import { FormTab, Character } from "../types/character";

export const tabs: Array<{ id: FormTab; label: string }> = [
    { id: "basic", label: "Basic Info" },
    { id: "personality", label: "Personality" },
    { id: "messages", label: "Messages" },
    { id: "style", label: "Style & Topics" },
    { id: "integrations", label: "Integrations" },
];

export const validateSection = (section: FormTab, data: Character): boolean => {
    if (!data) return false;

    switch (section) {
        case "basic":
            return Boolean(data.name?.trim() && data.username?.trim());
        case "personality":
            return Boolean(
                data.system?.trim() &&
                    data.bio?.some((b) => b?.trim()) &&
                    data.knowledge?.some((k) => k?.trim())
            );
        case "messages":
            return Boolean(
                data.messageExamples?.some((example) =>
                    example?.every((msg) => msg?.content?.text?.trim())
                )
            );
        case "style":
            return Boolean(
                data.topics?.some((t) => t?.trim()) &&
                    data.adjectives?.some((a) => a?.trim())
            );
        case "integrations":
            // Integrations are optional, always valid
            return true;
        default:
            return false;
    }
};

export const getValidationMessage = (section: FormTab): string => {
    switch (section) {
        case "basic":
            return "Name and username are required";
        case "personality":
            return "System prompt and at least one bio and knowledge entry are required";
        case "messages":
            return "At least one complete message example is required";
        case "style":
            return "At least one topic and adjective are required";
        case "integrations":
            return ""; // No validation message needed for optional section
        default:
            return "Invalid section";
    }
};
