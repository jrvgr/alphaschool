import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useState } from "react";

const API_URL: string = import.meta.env.VITE_API_ENDPOINT;

const formSchema = z.object({
  url: z.string().url(),
});

function LoginForm({
  showForm,
  setShowForm,
  organisationId,
}: {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  organisationId: string;
}) {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { error, mutate, isError } = useMutation(
    async (url: string) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          url,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message);
      }

      const data = await res.json();
      return data;
    },
    {
      onSuccess: () => {
        navigate("/");
      },
    }
  );

  const responseError = error as Error;

  const onSubmit = handleSubmit((data) => {
    console.log("submit");
    console.log(data.url);
    mutate(data.url);
  });

  return (
    <>
      <div className="top-bar">
        <button onClick={() => setShowForm(!showForm)}>Back</button>
        <h1>Login</h1>
      </div>
      <a
        rel="norefferer"
        target="_blank"
        href={`https://login.educus.nl/oauth2/authorize?response_type=code&redirect_uri=http://student.eduarte.local/oauth-callback&fixed-organisatie=1&organisatieuuid=${organisationId}&client_id=3cdf9da3-705a-4899-b3c9-393db1fdc8b7`}>
        Click here to get your token
      </a>
      <p>
        after you walk through the login flow, you will get to a page that says
        it can't connect. When you get there copy the url and paste it in the
        input
      </p>
      <form onSubmit={onSubmit}>
        <input {...register("url")} type="url" name="url" />
        <input type="submit" value="Submit" />
      </form>

      {isError && <p>{responseError.message}</p>}
    </>
  );
}

export default LoginForm;
