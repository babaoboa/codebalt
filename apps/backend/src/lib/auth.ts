import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database";
import * as schema from "../db/schema";


export const auth = betterAuth({
    emailAndPassword: { 
        enabled: true, 
    }, 
    database: drizzleAdapter(db, { 
        provider: "pg",
        schema,
    }), 
  //... the rest of your config
});
