
const { verifyMinecraft, refreshToken, authenticateXboxLive, authorizeMojang, authenticateMinecraft, getProfileData } = require('./MAS');


async function startAuthenticationFlow(azureCredentials,refresh, accessToken, restore, force) {
    return new Promise(async (resolve, reject) => {
        try {
            const attemptToVerify = await verifyMinecraft(accessToken);

            let toSave = {};
            let toReturn;

            if (attemptToVerify && !force) {
                const profileData = await getProfileData(accessToken)
                toReturn = { profile: profileData.toReturn, xui: restore.xui, access_token: accessToken, user_id: restore.userId };
                // Restore From Previous
            } else {
                // Create a New Session
                let tokenRefreshed = await refreshToken(refresh,azureCredentials);
                if (!tokenRefreshed) {
                    reject('No Such Account')
                }
                toSave = Object.assign({}, toSave, tokenRefreshed.toSave);
                const XBLIVEAUTH = await authenticateXboxLive(tokenRefreshed.toReturn.access_token);
                const authMojang = await authorizeMojang(XBLIVEAUTH.Token);
                /**
                 * @param authMojang.toReturn.DisplayClaims
                 */
                toSave = Object.assign({}, toSave, authMojang.toSave);
                const AUTHMC = await authenticateMinecraft(authMojang.toReturn.Token, authMojang.toReturn.DisplayClaims.xui[0].uhs)
                toSave = Object.assign({}, toSave, AUTHMC.toSave);
                await verifyMinecraft(AUTHMC.toReturn.access_token);
                const profileData = await getProfileData(AUTHMC.toReturn.access_token)
                toSave = Object.assign({}, toSave, profileData.toSave);
                toReturn = { profile: profileData.toReturn, xui: authMojang.toReturn.DisplayClaims.xui[0].uhs, access_token: AUTHMC.toReturn.access_token, user_id: AUTHMC.toReturn.username };
            }
            resolve({ toSave: toSave, toReturn: toReturn });
        } catch (err) {
            reject({ error: err.message });
        }
    });
}

module.exports = { startAuthenticationFlow };

