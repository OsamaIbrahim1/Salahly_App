import { z } from 'zod';

// Define the schema for headers
export const headersSchema = z.object({
    accesstoken: z.string(),
    "postman-token": z.string(),
    "cache-control": z.string(),
    host: z.string(),
    "content-type": z.string(),
    "content-length": z.string(),
    "user-agent": z.string(),
    accept: z.string(),
    "accept-encoding": z.string(),
    connection: z.string(),
}).required({ accesstoken: true });

// Infer the type from the schema (optional)
export type HeadersDto = z.infer<typeof headersSchema>;

