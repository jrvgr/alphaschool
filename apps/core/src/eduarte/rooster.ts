import { ExpressError } from "../index";

export type EduarteRooster = {
  items: Item[];
};

export type Item = {
  type: TypeEnum;
  links: Link[];
  permissions: Permission[];
  additionalObjects: AdditionalObjects;
  titel: string;
  beginDatumTijd: Date;
  eindDatumTijd: Date;
  omschrijving?: string;
  afspraakLocatie?: string;
  participanten: Participanten[];
  afspraakType: AfspraakType;
  onderwijsproduct?: Onderwijsproduct;
  beginLesuur?: number;
  eindLesuur?: number;
  presentieRegistratieVerplicht: boolean;
  presentieRegistratieVerwerktOp?: Date;
  presentieRegistratieDeadline?: Date;
  auteur?: Auteur;
};

export type AdditionalObjects = {};

export type AfspraakType = {
  type: TypeEnum;
  links: Link[];
  permissions: any[];
  additionalObjects: AdditionalObjects;
  naam: AfspraakTypeNaam;
  category: Category;
};

export enum Category {
  Individueel = "INDIVIDUEEL",
  Rooster = "ROOSTER",
}

export type Link = {
  id: number;
  rel: Rel;
  type: TypeEnum;
  href?: string;
};

export enum Rel {
  Identiteit = "identiteit",
  Koppeling = "koppeling",
  Self = "self",
}

export enum TypeEnum {
  GroepRGroepPrimer = "groep.RGroepPrimer",
  OnderwijsproductROnderwijsproductPrimer = "onderwijsproduct.ROnderwijsproductPrimer",
  PersoonRDeelnemerPrimer = "persoon.RDeelnemerPrimer",
  PersoonRMedewerkerPrimer = "persoon.RMedewerkerPrimer",
  PersoonRPersoonLinkedPrimer = "persoon.RPersoonLinkedPrimer",
  PersoonRPersoonPrimer = "persoon.RPersoonPrimer",
  RoosterRAfspraak = "rooster.RAfspraak",
  RoosterRAfspraakParticipant = "rooster.RAfspraakParticipant",
  RoosterRAfspraakType = "rooster.RAfspraakType",
}

export enum AfspraakTypeNaam {
  Afspraak = "Afspraak",
  Begeleidingsgesprek = "Begeleidingsgesprek",
  BeroepsgerichtExamenMBO = "Beroepsgericht examen MBO",
  BeroepsgerichtExamenMBOZP = "Beroepsgericht examen MBO (ZP)",
  Roosterelement = "Roosterelement",
}

export type Auteur = {
  type: TypeEnum;
  links: Link[];
  permissions: Permission[];
  additionalObjects: AdditionalObjects;
  roepnaam?: string;
  voornamen?: string;
  voorletters?: string;
  voorvoegsel?: Voorvoegsel;
  achternaam: string;
  geslacht: Geslacht;
  geboortedatum?: Date;
  pasfotoURL?: string;
  deelnemernummer?: number;
  begindatum?: Date;
  afkorting?: string;
};

export enum Geslacht {
  Man = "Man",
  Vrouw = "Vrouw",
}

export type Permission = {
  full: string;
  type: PermissionType;
  operations: Operation[];
  instances: string[];
};

export enum Operation {
  Read = "READ",
}

export enum PermissionType {
  GroepRGroepPrimer = "groep.RGroepPrimer",
  OnderwijsproductROnderwijsproduct = "onderwijsproduct.ROnderwijsproduct",
  PersoonRDeelnemer = "persoon.RDeelnemer",
  PersoonRMedewerker = "persoon.RMedewerker",
  PersoonRPersoon = "persoon.RPersoon",
  RoosterRAfspraakPrimer = "rooster.RAfspraakPrimer",
}

export enum Voorvoegsel {
  De = "de",
  Den = "den",
  Van = "van",
  VanDen = "van den",
  VanDer = "van der",
}

export type Onderwijsproduct = {
  type: TypeEnum;
  links: Link[];
  permissions: Permission[];
  additionalObjects: AdditionalObjects;
  begindatum: Date;
  titel?: string;
  code: string;
  omschrijving?: string;
  naam?: OnderwijsproductNaam;
  leerjaar?: number;
};

export enum OnderwijsproductNaam {
  Webdeveloper = "Webdeveloper",
}

export type Participanten = {
  type: TypeEnum;
  links: Link[];
  permissions: any[];
  additionalObjects: AdditionalObjects;
  medewerker?: Auteur;
  groep?: Onderwijsproduct;
  deelnemer?: Auteur;
};

export async function rooster(
  url,
  token,
  sort?,
  beforeDate?,
  afterDate?
) {
  const searchparams = new URLSearchParams({
    sort: sort || "asc-beginDatumTijd",
    additional: "studietaken",
  });

  if (beforeDate) searchparams.append("beginDatumTijdBefore", beforeDate);
  if (afterDate) searchparams.append("beginDatumTijdAfter", afterDate);

  const response = await fetch(new URL(url + "/afspraak?" + searchparams), {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // wtf the json method on the response object doesn't work but this does
  // const data = await response.json();
  const data = await JSON.parse(await response.text());
  console.log(response.url);
  if (!response.ok) {
    throw new ExpressError(data.error_description, response.status);
  }
  const rooster: EduarteRooster = data;
  return rooster;
}
