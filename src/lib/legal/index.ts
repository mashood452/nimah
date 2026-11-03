import { cookies } from "./cookies";
import { privacy } from "./privacy";
import { returns } from "./returns";
import { shipping } from "./shipping";
import { lastUpdated } from "./shared";
import { terms } from "./terms";
import type { LegalDoc } from "./types";

/** Order here is the order shown in the policy switcher. */
export const legalDocs: LegalDoc[] = [privacy, terms, cookies, shipping, returns];

export const legalLastUpdated = lastUpdated;
export type { LegalDoc };
