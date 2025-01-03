import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import {
    AgentRuntime,
    elizaLogger,
    getEnvVariable,
    validateCharacterConfig,
} from "@elizaos/core";

import { REST, Routes } from "discord.js";
import { DirectClient } from ".";

// Middleware d'authentification
function authMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): void {
    const apiKey = req.headers["x-api-key"];
    const validApiKey = getEnvVariable("API_KEY");

    if (!apiKey || apiKey !== validApiKey) {
        res.status(401).json({ error: "Unauthorized - Invalid API Key" });
        return;
    }

    next();
}

export function createApiRouter(
    agents: Map<string, AgentRuntime>,
    directClient: DirectClient
) {
    const router = express.Router();

    // Security middleware
    router.use(helmet());
    router.use(
        cors({
            origin: getEnvVariable("CORS_ORIGIN") || "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type", "x-api-key"],
        })
    );

    // Rate limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: { error: "Too many requests, please try again later" },
    });
    router.use(limiter);

    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(
        express.json({
            limit: getEnvVariable("EXPRESS_MAX_PAYLOAD") || "100kb",
        })
    );

    // Routes publiques
    router.get("/", (req, res) => {
        res.send("Welcome, this is the REST API!");
    });

    // Routes protégées
    router.use(authMiddleware);

    router.get("/hello", (req, res) => {
        res.json({ message: "Hello World!" });
    });

    router.post("/generate-character", async (req, res) => {
        try {
            const { prompt } = req.body;
            if (!prompt) {
                return res.status(400).json({ error: "Prompt is required" });
            }

            const openaiApiKey = getEnvVariable("OPENAI_API_KEY");
            if (!openaiApiKey) {
                return res
                    .status(500)
                    .json({ error: "OpenAI API key not configured" });
            }

            const response = await fetch(
                "https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${openaiApiKey}`,
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [
                            {
                                role: "system",
                                content: `Generate a character configuration in this exact format:
{
    "name": string,
    "username": string (lowercase),
    "system": string (roleplay instructions for the AI),
    "bio": string[] (5-8 action statements),
    "lore": string[] (5-8 dramatic stories),
    "knowledge": string[] (5-8 items with "knows/understands"),
    "messageExamples": [[{"user": "{{user1}}", "content": {"text": "q"}}, {"user": "agent", "content": {"text": "a"}}]],
    "postExamples": string[] (8-10 CAPS posts),
    "topics": string[] (8-10 topics),
    "style": {"all": string[8], "chat": string[8], "post": string[8]},
    "adjectives": string[] (8-10 CAPS words)
}
Make dramatic, use numbers/claims, CAPS for emphasis. The system field should be a clear instruction for how the AI should roleplay this character.`,
                            },
                            {
                                role: "user",
                                content: `Generate a character configuration for: ${prompt}`,
                            },
                        ],
                        temperature: 0.9,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("OpenAI API request failed");
            }

            const data = await response.json();
            const characterConfig = JSON.parse(data.choices[0].message.content);

            // Add default values for required fields
            const defaultConfig = {
                avatarUrl: "",
                clients: [],
                plugins: [],
                modelProvider: "openai",
                system: "Roleplay and generate interesting content",
                settings: {
                    secrets: {},
                    voice: {
                        model: "en_US-hfc_female-medium",
                    },
                },
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
            };

            res.json({ ...defaultConfig, ...characterConfig });
        } catch (error) {
            elizaLogger.error(`Error generating character: ${error}`);
            res.status(500).json({
                error: "Failed to generate character configuration",
            });
        }
    });

    router.get("/agents", (req, res) => {
        const agentsList = Array.from(agents.values()).map((agent) => {
            return {
                id: agent.agentId,
                name: agent.character.name,
                bio: agent.character.bio,
                lore: agent.character.lore,
                clients: Object.keys(agent.clients),
                modelProvider: agent.character.modelProvider,
                imageModelProvider: agent.character.imageModelProvider,
                topics: agent.character.topics,
                adjectives: agent.character.adjectives,
                avatarUrl: agent.character.avatarUrl,
            };
        });
        res.json({ agents: agentsList });
    });

    router.get("/agents/:agentId", (req, res) => {
        const agentId = req.params.agentId;
        const agent = agents.get(agentId);

        if (!agent) {
            res.status(404).json({ error: "Agent not found" });
            return;
        }

        res.json({
            id: agent.agentId,
            character: agent.character,
        });
    });

    router.post("/agents/:agentId/set", async (req, res) => {
        const agentId = req.params.agentId;
        console.log("agentId", agentId);
        let agent: AgentRuntime = agents.get(agentId);

        // update character
        if (agent) {
            // stop agent
            agent.stop();
            directClient.unregisterAgent(agent);
            // if it has a different name, the agentId will change
        }

        // load character from body
        const character = req.body;
        try {
            validateCharacterConfig(character);
        } catch (e) {
            elizaLogger.error(`Error parsing character: ${e}`);
            res.status(400).json({
                success: false,
                message: e.message,
            });
            return;
        }

        // start it up (and register it)
        agent = await directClient.startAgent(character);
        elizaLogger.log(`${character.name} started`);

        res.json({
            id: character.id,
            character: character,
        });
    });

    router.get("/agents/:agentId/channels", async (req, res) => {
        const agentId = req.params.agentId;
        const runtime = agents.get(agentId);

        if (!runtime) {
            res.status(404).json({ error: "Runtime not found" });
            return;
        }

        const API_TOKEN = runtime.getSetting("DISCORD_API_TOKEN") as string;
        const rest = new REST({ version: "10" }).setToken(API_TOKEN);

        try {
            const guilds = (await rest.get(Routes.userGuilds())) as Array<any>;

            res.json({
                id: runtime.agentId,
                guilds: guilds,
                serverCount: guilds.length,
            });
        } catch (error) {
            console.error("Error fetching guilds:", error);
            res.status(500).json({ error: "Failed to fetch guilds" });
        }
    });

    return router;
}
