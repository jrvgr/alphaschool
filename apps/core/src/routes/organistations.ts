import { Router } from "express";
import { organisations } from "../eduarte/organisations";
import { organisationsAdapter } from "../lib/eduarteOrganisatiosAdapter";

const router = Router();

router.get("/", async (req, res) => {
  const response = await organisations();

  const data = organisationsAdapter(response);
  res.status(200).send(data);
});

export default router;
