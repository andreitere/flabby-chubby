import { z } from "zod";

// Define the schema for our environment variables
const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.string().transform(Number).default("3005"),
});

// Type inference from the schema
type Env = z.infer<typeof envSchema>;

// Function to validate environment variables
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
    console.log(`here`)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => err.path.join("."))
        .join(", ");
      throw new Error(
        `Missing or invalid environment variables: ${missingVars}`
      );
    }
    throw error;
  }
}

// Create and export the config object
const config = {
  env: validateEnv(),
} as const;

export default config;
