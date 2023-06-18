import type { Session, SessionData } from "express-session";
import { organisations } from "../eduarte/organisations";

export async function userOrganisation(token: string): Promise<Item> {
  const orgId = JSON.parse(atob(token.split(".")[1])).sub.split("\\")[0];
  const data = await organisations();
  const organisation = data?.items?.filter(
    (item) => item.organisatieUuid === orgId
  )[0];
  return organisation;
}

export type Organisations = {
  items: Item[];
};

export type Item = {
  $type: Type;
  links: any[];
  permissions: any[];
  additionalObjects: AdditionalObjects;
  organisatie: string;
  organisatieUuid: string;
  restUrl: string;
};

export enum Type {
  AuthRAppUrl = "auth.RAppUrl",
}

export type AdditionalObjects = {};
