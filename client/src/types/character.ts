export type ModelProvider =
    | "openai"
    | "eternalai"
    | "anthropic"
    | "grok"
    | "groq"
    | "llama_cloud"
    | "together"
    | "llama_local"
    | "google"
    | "claude_vertex"
    | "redpill"
    | "openrouter"
    | "ollama"
    | "heurist"
    | "galadriel"
    | "falai"
    | "gaianet"
    | "ali_bailian"
    | "volengine"
    | "nanogpt"
    | "hyperbolic"
    | "venice"
    | "akash_chat_api"
    | "livepeer";

export type IntegrationSettings = {
    telegram?: {
        enabled: boolean;
    };
    twitter?: {
        username: string;
        email: string;
        enabled: boolean;
    };
};

export type Character = {
    name: string;
    username: string;
    avatarUrl: string;
    system: string;
    bio: string[];
    lore: string[];
    knowledge: string[];
    messageExamples: Array<
        Array<{
            user: string;
            content: { text: string };
        }>
    >;
    postExamples: string[];
    topics: string[];
    style: {
        all: string[];
        chat: string[];
        post: string[];
    };
    adjectives: string[];
    clients: string[];
    plugins: string[];
    modelProvider: ModelProvider[];
    settings: {
        secrets: {
            TELEGRAM_BOT_TOKEN?: string;
            TWITTER_PASSWORD?: string;
            [key: string]: string | undefined;
        };
        voice: {
            model: string;
        };
        integrations?: IntegrationSettings;
    };
    walletAddress?: string;
    details?: {
        walletAddress?: string;
        [key: string]: any;
    };
};

export type ArrayFields = Extract<
    keyof Character,
    "bio" | "lore" | "knowledge" | "postExamples" | "topics" | "adjectives"
>;

export type MessageExampleType = { user: string; content: { text: string } };

export type FormTab =
    | "basic"
    | "personality"
    | "messages"
    | "style"
    | "integrations";

export const defaultCharacter: Character = {
    name: "",
    username: "",
    avatarUrl: "",
    system: "",
    bio: [""],
    lore: [""],
    knowledge: [""],
    messageExamples: [
        [
            {
                user: "{{user1}}",
                content: { text: "" },
            },
            {
                user: "agent",
                content: { text: "" },
            },
        ],
    ],
    postExamples: [""],
    topics: [""],
    style: {
        all: [""],
        chat: [""],
        post: [""],
    },
    adjectives: [""],
    clients: [],
    plugins: [],
    modelProvider: ["openai"],
    settings: {
        secrets: {
            TELEGRAM_BOT_TOKEN: "",
            TWITTER_USERNAME: "",
            TWITTER_EMAIL: "",
            TWITTER_PASSWORD: "",
        },
        voice: {
            model: "en_US-hfc_female-medium",
        },
        integrations: {},
    },
};
