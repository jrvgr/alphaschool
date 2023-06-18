type organisations = {
  name: string;
  id: string;
  url: string;
};

export function organisationsAdapter(organisations) {
  const organisationsList: organisations[] = organisations.items.map(
    (organisation) => {
      return {
        name: organisation.organisatie,
        id: organisation.organisatieUuid,
        url: organisation.restUrl,
      };
    }
  );

  return organisationsList;
}
