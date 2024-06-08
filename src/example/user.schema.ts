import { z } from "zod";
import { localStorageApi } from '../index';
 
const schema = z.object({
  age: z
    .number()
    .min(0, {
      message: "No human has less than 0 years, or not?",
    })
    .max(120, {
      message: "You are too old for this app",
    }),
 
  link: z
    .string()
    .url({
      message: "Only valid URLs allowed here (or none)",
    })
    .optional(),
});
 
const userStorageApi = localStorageApi<typeof schema, "User">(schema);
type UserStorageApiData = z.output<typeof schema>;



export type { UserStorageApiData };
export { userStorageApi };
