
const { verifyMinecraft, authenticateXboxLive, authorizeMojang, authenticateMinecraft, getProfileData } = require('./MAS');




async function startAuthenticationFlow(accessToken, restoreData, forceRefresh) {
    return new Promise(async (resolve, reject) => {
        try {
            const attemptToVerify = await verifyMinecraft(accessToken);

            let toReturn;

            if (attemptToVerify && !forceRefresh) {
                const profileData = await getProfileData(accessToken)
                toReturn = { profile: profileData, xui: restoreData.xui, access_token: accessToken, user_id: restoreData.userId };
                // Restore From Previous
            } else {
                // Create a New Session
                if (!accessToken) {
                    reject('No Such Account')
                }
                const XBLIVEAUTH = await authenticateXboxLive(accessToken);
                const authMojang = await authorizeMojang(XBLIVEAUTH.Token);

                const AUTH_MC = await authenticateMinecraft(authMojang.Token, authMojang.DisplayClaims.xui[0].uhs)

                await verifyMinecraft(AUTH_MC.access_token);
                const profileData = await getProfileData(AUTH_MC.access_token)

                toReturn = { profile: profileData , xui: authMojang.DisplayClaims.xui[0].uhs, access_token: AUTH_MC.access_token, user_id: AUTH_MC.username };
            }
            resolve(toReturn);
        } catch (err) {
            reject({ error: err.message });
        }
    });
}

module.exports = { startAuthenticationFlow };

