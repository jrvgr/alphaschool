import { Router } from "express";
import { user } from "../eduarte/user";
import { userAdapter } from "../lib/eduarteUserAdapter";

const router = Router();

router.get("/:id", async (req, res) => {
  if (!req.session?.apiUrl) {
    res.status(401).send("not logged in");
    return;
  }
  const response = await user(
    req.session!.token,
    req.session!.apiUrl,
    req.params.id
  );

  if (req.body.raw === "true") {
    res.status(200).send(response);
    return;
  }

  const adaptedResponse = userAdapter(response);

  res.status(200).send(adaptedResponse);
});

router.get("/logged-in", (req, res) => {
  console.log(req.session)
  if (!req.session?.apiUrl) {
    res.status(401).send("not logged in");
    return;
  }
  res.status(200).send({ loggedIn: true });
});

export default router;
