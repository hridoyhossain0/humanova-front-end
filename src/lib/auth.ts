
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URL as string);
export const db = client.db("humanova_data");

export const auth = betterAuth({
    plugins: [
        jwt(),
    ],
    database: mongodbAdapter(db, {
        client,
    }),

    // Email and Password Authentication
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },

    // Google Authentication
    baseURL: process.env.BETTER_AUTH_URL,
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    // Session Configuration
    session: {
        cookieCache: {
            enabled:true,
            strategy: 'jwt',
            maxAge: 14 * 24 * 60 * 60

        }
    },
});
