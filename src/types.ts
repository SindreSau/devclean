import { LANGUAGES } from "./constants.ts";

export type Config = {
  languages: (keyof typeof LANGUAGES)[];
};
