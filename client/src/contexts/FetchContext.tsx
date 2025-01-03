import { createContext, useContext, ReactNode } from "react";

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

type CustomFetch = (url: string, options?: FetchOptions) => Promise<any>;

const FetchContext = createContext<CustomFetch | null>(null);

// Fournisseur de contexte
export const FetchProvider = ({
    children,
    apiKey,
    baseUrl,
}: {
    children: ReactNode;
    apiKey: string;
    baseUrl: string;
}) => {
    const customFetch = async (url: string, options: FetchOptions = {}) => {
        const defaultHeaders = {
            "x-api-key": apiKey,
        };

        const mergedOptions = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...(options.headers || {}),
            },
        };

        const response = await fetch(
            `${baseUrl}${url.replace("api/", "")}`,
            mergedOptions
        );

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`);
        }

        return response.json();
    };

    return (
        <FetchContext.Provider value={customFetch}>
            {children}
        </FetchContext.Provider>
    );
};

// Hook pour utiliser le fetch configuré
export const useFetch = () => {
    const context = useContext(FetchContext);
    if (!context) {
        throw new Error("useFetch must be used within a FetchProvider");
    }
    return context;
};
