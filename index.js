
const { verifyMinecraft, refreshToken, authenticateXboxLive, authorizeMojang, authenticateMinecraft, getProfileData } = require('./MAS');




async function startAuthenticationFlow(azureCredentials,refresh, accessToken, restore, force) {
    return new Promise(async (resolve, reject) => {
        try {
            const attemptToVerify = await verifyMinecraft(accessToken);

            let toReturn;

            if (attemptToVerify && !force) {
                const profileData = await getProfileData(accessToken)
                toReturn = { profile: profileData, xui: restore.xui, access_token: accessToken, user_id: restore.userId };
                // Restore From Previous
            } else {
                // Create a New Session
                let tokenRefreshed = await refreshToken(refresh,azureCredentials);
                if (!tokenRefreshed) {
                    reject('No Such Account')
                }
                const XBLIVEAUTH = await authenticateXboxLive(tokenRefreshed.access_token);
                const authMojang = await authorizeMojang(XBLIVEAUTH.Token);

                const AUTH_MC = await authenticateMinecraft(authMojang.Token, authMojang.DisplayClaims.xui[0].uhs)

                await verifyMinecraft(AUTH_MC.access_token);
                const profileData = await getProfileData(AUTH_MC.access_token)

                toReturn = { profile: profileData, refresh_token:tokenRefreshed.refresh_token , xui: authMojang.DisplayClaims.xui[0].uhs, access_token: AUTH_MC.access_token, user_id: AUTH_MC.username };
            }
            resolve(toReturn);
        } catch (err) {
            reject({ error: err.message });
        }
    });
}

module.exports = { startAuthenticationFlow };

