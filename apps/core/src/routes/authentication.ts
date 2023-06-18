import { Router } from "express";
import { authenticate } from "../eduarte/authentication";
import { userOrganisation } from "../lib/organisation";
import { userId } from "../lib/user";
import { ExpressError } from "../index";
import { z } from "zod";
import { user } from "../eduarte/user";
import { validateToken } from "../eduarte/checklogin";

const router = Router();

const bodySchema = z.object({
  url: z.string().url(),
});

router.post("/login", async (req, res, next) => {
  const parsedBody = bodySchema.safeParse(req.body);
  if (!parsedBody.success) {
    console.log(parsedBody.error);
    throw new ExpressError("No valid url provided", 400);
  }

  const code = new URL(req.body.url).searchParams.get("code");
  if (!code) {
    throw new ExpressError("No code parameter provided", 400);
  }

  const response = await authenticate(code, "authorization_code");

  req.session!.expiresAt = Date.now() + response.expires_in * 1000;
  req.session!.authenticated = true;
  req.session!.token = response.access_token;
  req.session!.refreshToken = response.refresh_token;

  if (req.session!.authenticated && req.session.token) {
    const organisation = await userOrganisation(req.session.token);
    req.session!.organisationId = organisation.organisatieUuid;
    req.session!.apiUrl = organisation.restUrl;
    req.session!.userId = userId(req.session.token);
  }

  // req.session.save();

  res.status(200).send({ authenticated: true });
});

router.post("/logout", (req, res) => {
  req.session!.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error logging out");
      return;
    }
  });
  res.status(200).send("logged out");
});

export async function checkAuthentication(req, res, next) {
  if (req.url === "/auth/login" || req.url === "/organisations") {
    next();
    return;
  }

  if (
    !req.session?.apiUrl &&
    !req.session?.token &&
    !req.session?.refreshToken
  ) {
    throw new ExpressError("Not logged in, please log in first", 401);
  }

  const validated = await validateToken(
    req.session?.token,
    req.session?.apiUrl
  );

  if (!validated) {
    throw new ExpressError("Token not valid", 401);
  }

  next();
}

export async function refreshTokens(req, res, next) {
  if (req.session?.token || !req.session?.apiUrl) {
    next();
    return;
  }

  console.log("refreshing tokens")

  const response = await authenticate(
    req.session.refreshToken,
    "refresh_token"
  );

  if (!response || response.error) {
    throw new ExpressError(
      "Authentication with refresh token failed, please log in again",
      401
    );
  }

  req.session.expiresAt = Date.now() + response.expires_in * 1000;
  req.session.token = response.access_token;
  req.session.refreshToken = response.refresh_token;
  req.session.cookie.expires = new Date(req.session.expiresAt);
  req.session.cookie.maxAge = response.expires_in * 1000;

  console.log(response);

  next();
}

export default router;
