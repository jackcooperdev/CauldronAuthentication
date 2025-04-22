import {
  verifyMinecraft,
  authenticateXboxLive,
  authorizeMojang,
  authenticateMinecraft,
  getProfileData,
} from "./MAS.js";

async function startAuthenticationFlow(microsoftAccessToken) {
  return new Promise(async (resolve, reject) => {
    try {
      let toReturn;

      if (!microsoftAccessToken) {
        reject("NO_ACCESS_TOKEN");
      }
      const XBOX_LIVE_TOKEN = await authenticateXboxLive(microsoftAccessToken);
      const authMojang = await authorizeMojang(XBOX_LIVE_TOKEN);

      const AUTH_MC = await authenticateMinecraft(
        authMojang.Token,
        authMojang.DisplayClaims.xui[0].uhs,
      );

      await verifyMinecraft(AUTH_MC.access_token);
      const profileData = await getProfileData(AUTH_MC.access_token);

      toReturn = {
        profile: profileData,
        xui: authMojang.DisplayClaims.xui[0].uhs,
        access_token: AUTH_MC.access_token,
        user_id: AUTH_MC.username,
      };
      resolve(toReturn);
    } catch (err) {
      reject({ error: err.message });
    }
  });
}

export  { startAuthenticationFlow };
