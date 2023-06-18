import { useQuery } from "@tanstack/react-query";

const API_URL: string = import.meta.env.VITE_API_ENDPOINT;

function organisationSelector({
  setShowForm,
  setOrganisationId,
}: {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setOrganisationId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { data, isLoading, isError, error } = useQuery(
    ["organisations"],
    async () => {
      const res = await fetch(`${API_URL}/organisations`, {
        credentials: "include",
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message);
      }

      const data = await res.json();
      return data;
    }
  );

  const responseError = error as Error;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {responseError.message}</div>;
  }

  const organisations = data as { name: string; id: string; href: string }[];

  return (<>
    {organisations
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((organisation: any) => {
        return (
          <div className="organisation" key={organisation.id}>
            <button
              onClick={() => {
                setOrganisationId(organisation.id);
                setShowForm(true);
              }}>
              {organisation.name}
            </button>
          </div>
        );
      })}
  </>
  );
}

export default organisationSelector;
