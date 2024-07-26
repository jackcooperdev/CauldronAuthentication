const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const homedir = require('os').homedir();
const path = require('path');
const jwt = require('jsonwebtoken');
const appConfig = require('./config.json');

// Auth Code Varible (Defaults: unset)
var auth_code = "unset";

// Set Auth Code
function setAuthCode(code) {
    auth_code = code;
};

async function refreshToken(refresh_token) {
    return new Promise(async (resolve) => {
        let data = qs.stringify({
            'client_id': appConfig.auth.CLIENT_ID,
            'scope': 'XboxLive.signin offline_access',
            'refresh_token': refresh_token,
            'grant_type': 'refresh_token'
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://login.microsoftonline.com/consumers/oauth2/v2.0/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: data
        };
        try {
            const response = await axios(config);
            resolve({toSave:{refresh_token: response.data.refresh_token},toReturn:{access_token:response.data.access_token}});
        } catch (err) {
            (err)
            resolve(false);
        }
    })
}

/*
    Microsoft Authentication Flow:
    https://wiki.vg/Microsoft_Authentication_Scheme
*/


// Step Two: Redeem Token
// Redeems token for access token and refresh token

async function redeemToken(token) {
    let data = qs.stringify({
        'client_id': appConfig.auth.CLIENT_ID,
        'scope': 'XboxLive.signin offline_access',
        'code': token,
        'redirect_uri': appConfig.auth.REDIRECT_URI,
        'grant_type': 'authorization_code',
        'code_verifier': appConfig.auth.VERIFY_CODE
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://login.microsoftonline.com/consumers/oauth2/v2.0/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data
    };
    try {
        const response = await axios(config);
        //writeToAuthFile(identifier, { refresh_token: response.data.refresh_token })
        return {refresh_token: response.data.refresh_token};
    } catch (err) {
        //console.log(err)
        throw new Error('REDEEMFAIL')
    };
};

// Step Three: Authenticate with Xbox Live
// Authenticated Access Token with Xbox Live returning details about the user XBLIVE account
async function authenticateXboxLive(access_token) {
    let data = JSON.stringify({ "Properties": { "AuthMethod": "RPS", "SiteName": "user.auth.xboxlive.com", "RpsTicket": `d=${access_token}` }, "RelyingParty": "http://auth.xboxlive.com", "TokenType": "JWT" });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://user.auth.xboxlive.com/user/authenticate',
        headers: {
            'Content-Type': 'application/json',
        },
        data: data
    };
    try {
        const authXboxLive = await axios(config);
        return authXboxLive.data;
    } catch (err) {
        (authXboxLiver)
        throw new Error('XBLIVEAUTHFAIL');
    };
};

// Step Four: Authorize with Mojang
// Authroizes the XBLIVE token to access api.minecraftservices.com

async function authorizeMojang(token) {
    let data = JSON.stringify({ "Properties": { "SandboxId": "RETAIL", "UserTokens": [token] }, "RelyingParty": "rp://api.minecraftservices.com/", "TokenType": "JWT" });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://xsts.auth.xboxlive.com/xsts/authorize',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    try {
        const authMojang = await axios(config);
        //writeToAuthFile(email, { xuid: authMojang.data.DisplayClaims.xui[0].uhs });
        return {toSave:{ xuid: authMojang.data.DisplayClaims.xui[0].uhs},toReturn:authMojang.data};
    } catch (err) {
        throw new Error('MOJANGFAIL');
    }
};

// Step Five: Authenticate with Minecraft
// Authenticates the current user to api.minecraftservices.com

async function authenticateMinecraft(token, xuid) {
    let data = JSON.stringify({
        "identityToken": `XBL3.0 x=${xuid};${token}`
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.minecraftservices.com/authentication/login_with_xbox',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    try {
        const mcAuth = await axios(config);
        return {toSave:{ user_id: mcAuth.data.username, access_token: mcAuth.data.access_token },toReturn:mcAuth.data};
    } catch (err) {
        throw new Error('MINECRAFTFAIL');
    };
};

//Step Six: Verifies Ownership
// Verifies that the user owns a valid license of Minecraft

async function verifyMinecraft(access_token) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.minecraftservices.com/entitlements/mcstore',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    };
    try {
        const verify = await axios(config)
        var verifyData = verify.data;
        var cert = fs.readFileSync(path.join(__dirname, 'mojang.pem'));  // get public key
        const verified = await jwt.verify(verifyData.signature, cert);
        //console.log(verified)
        if (verified) {
            return true;
        } else {
            return false;
        }
    } catch(err) {
        //console.log(err)
        return false;
    };
};

// Step Seven: Get Profile Data
// Retreives Information regarding the user

async function getProfileData(access_token) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.minecraftservices.com/minecraft/profile',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    };
    try {
        const profile = await axios(config)
        var profileData = profile.data;
        return {toSave:{ username: profileData.name, uuid: profileData.id },toReturn:{uuid: profileData.id, username: profileData.name}};

        return {  };
    } catch {
        throw new Error('PROFILEGETERROR');
    }
};





module.exports = { setAuthCode,refreshToken, redeemToken, authenticateXboxLive, authorizeMojang, authenticateMinecraft, verifyMinecraft, getProfileData}