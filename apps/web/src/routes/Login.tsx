import { useState } from "react";
import LoginForm from "./LoginForm";
import Organisations from "./Organisations";

function Login() {
  const [showForm, setShowForm] = useState(false);
  const [organisationId, setOrganisationId] = useState<string>("");

  console.log(organisationId);

  return (
    <>
      {showForm ? (
        <LoginForm
          showForm={showForm}
          setShowForm={setShowForm}
          organisationId={organisationId}
        />
      ) : (
        <Organisations
          setShowForm={setShowForm}
          setOrganisationId={setOrganisationId}
        />
      )}
    </>
  );
}

export default Login;
