import e from "express";
import { EduarteRooster, Item } from "../eduarte/rooster";

type Afspraak = {
  id: number;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  startPeriod: number;
  endPeriod: number;
  location: string;
  presentieVerplicht: boolean;

  teachers: Teacher[];
  classes: Class[];
};

type Teacher = {
  id: number;
  firstName: string;
  fullFirstName: string;
  nameLetterPrefix: string;
  insertion?: string | undefined;
  lastName: string;
  gender: string;
  abbreviation: string;
};

type Class = {
  id: number;
  name: string;
  abbreviation: string;
  schoolYear: number;
};

type Rooster = Afspraak[];

export function roosterAdapter(rooster: EduarteRooster, organisationId): Rooster {
  const afspraken: Rooster = rooster.items.map((item: Item) => {
    let title;
    if (organisationId === "8BE9B97BF36843248BA3F9DCE143A176" && item.omschrijving?.includes(" - ")) {
      title = item.omschrijving!.split(" - ")[1];
    } else {
      title = item.titel!;
    }
    return {
      id: item.links[0].id!,
      title: title!,
      description: item.omschrijving!,
      startTime: new Date(item.beginDatumTijd!),
      endTime: new Date(item.eindDatumTijd!), startPeriod: item.beginLesuur!,
      endPeriod: item.eindLesuur!,
      location: item.afspraakLocatie!,
      presentieVerplicht: item.presentieRegistratieVerplicht!,
      teachers: item.participanten!
        .filter((participant) => participant.medewerker)
        .map((teacher) => {
          return {
            id: teacher.medewerker?.links[0].id!,
            firstName: teacher.medewerker?.roepnaam!,
            fullFirstName: teacher.medewerker?.voornamen!,
            nameLetterPrefix: teacher.medewerker?.voorletters!,
            insertion: teacher.medewerker?.voorvoegsel! ?? undefined,
            lastName: teacher.medewerker?.achternaam!,
            abbreviation: teacher.medewerker?.afkorting!,
            gender: teacher.medewerker?.geslacht!,
          };
        }),
      classes: item.participanten!
        .filter((participant) => participant.groep)
        .map((classItem) => {
          return {
            id: classItem.groep?.links[0].id!,
            name: classItem.groep?.naam!,
            abbreviation: classItem.groep?.code!,
            schoolYear: classItem.groep?.leerjaar!,
          };
        }),
    };
  });
  return afspraken;
}
