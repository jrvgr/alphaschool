import { Router } from "express";
import { rooster } from "../eduarte/rooster";
import { roosterAdapter } from "../lib/eduarteRoosterAdapter";

import { z } from "zod";
import { ExpressError } from "../index";

const router = Router();

const bodySchema = z.object({
  beforeDate: z.string().optional(),
  afterDate: z.string().optional(),
  sort: z.string().optional(),
  raw: z.string().optional(),
});

router.post("/:id?", async (req, res) => {
  const reqBody = bodySchema.safeParse(req.body);
  if (!reqBody.success) {
    throw new ExpressError(reqBody.error.message, 400);
  }

  let userId = req.params.id;

  if (req?.params.id === "me") {
    userId = undefined
  }

  console.log(req.body.beforeDate, req.body.afterDate, req.body.sort)

  const response = await rooster(
    req.session!.apiUrl,
    req.session!.token,
    req.body.sort ?? undefined,
    req.body.beforeDate ?? undefined,
    req.body.afterDate ?? undefined
  );

  if (req.body.raw === "true") {
    res.status(200).send(response);
    return;
  }

  const adaptedResponse = roosterAdapter(response, req.session!.organisationId);

  res.status(200).send(adaptedResponse);
});

export default router;
