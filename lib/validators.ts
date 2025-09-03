import { z } from "zod";
export const teamSignupSchema = z.object({
  tournamentId: z.string().cuid(),
  teamName: z.string().min(3).max(32),
  captainDiscord: z.string().min(2).max(64),
  embark1: z.string().min(2),
  embark2: z.string().min(2),
  embark3: z.string().min(2),
  embarkSub: z.string().optional(),
  platform: z.enum(["PC","Xbox","PlayStation"]),
  region: z.enum(["NA","EU","APAC"]),
  agree: z.literal(true),
  turnstileToken: z.string().optional()
});
export const askQuestionSchema = z.object({
  title: z.string().min(5).max(120),
  body: z.string().min(5).max(2000),
  tags: z.array(z.string()).max(5),
  tournamentId: z.string().optional()
});