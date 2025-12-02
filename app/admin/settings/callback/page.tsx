"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState("Processing...");

    useEffect(() => {
        const code = searchParams.get("code");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        console.log("Callback Params:", Object.fromEntries(searchParams.entries()));

        if (code) {
            exchangeCode(code);
        } else if (error) {
            setStatus(`Error from Tesla: ${error} - ${errorDescription}`);
        } else {
            setStatus(`No code found in URL. Params: ${JSON.stringify(Object.fromEntries(searchParams.entries()))}`);
        }
    }, [searchParams]);

    const exchangeCode = async (code: string) => {
        try {
            setStatus("Exchanging code for tokens...");
            const response = await client.queries.teslaConnect({
                code,
                redirectUri: window.location.origin + '/admin/settings/callback'
            });

            const tokens = JSON.parse(response?.data as string);

            if (tokens.access_token) {
                setStatus("Saving tokens...");
                // Save to Data Store
                // First, clear any existing tokens (simple singleton pattern)
                const { data: existing } = await client.models.TeslaIntegration.list();
                for (const item of existing) {
                    await client.models.TeslaIntegration.delete({ id: item.id });
                }

                await client.models.TeslaIntegration.create({
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    expiresIn: tokens.expires_in,
                    tokenType: tokens.token_type
                });

                setStatus("Success! Redirecting...");
                setTimeout(() => router.push("/admin/settings"), 1000);
            } else {
                throw new Error("No access token received");
            }
        } catch (error) {
            console.error("Error exchanging code:", error);
            setStatus("Error: " + String(error));
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Tesla Connection</h2>
                <p className="text-gray-600">{status}</p>
            </div>
        </div>
    );
}

export default function SettingsCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
