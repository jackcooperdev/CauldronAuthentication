const axios = require("axios");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

/*
    Microsoft Authentication Flow:
    https://minecraft.wiki/w/Microsoft_authentication

    https://blog.jackcooper.me/posts/inside-authenticator
*/

// Step One: Setting up the Azure Application / Getting Microsoft Access Token

// You need to do this yourself... sorry. Check out this post for information: https://blog.jackcooper.me/posts/inside-authenticator

// Step Two: Authenticate with Xbox Live

// Authenticated Access Token with Xbox Live returning details about the user XBOX LIVE account
async function authenticateXboxLive(access_token) {
    let data = JSON.stringify({
        Properties: {
            AuthMethod: "RPS",
            SiteName: "user.auth.xboxlive.com",
            RpsTicket: `d=${access_token}`,
        },
        RelyingParty: "http://auth.xboxlive.com",
        TokenType: "JWT",
    });
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://user.auth.xboxlive.com/user/authenticate",
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    };
    try {
        const authXboxLive = await axios(config);
        return authXboxLive.data.Token;
    } catch (err) {
        throw new Error("XBOXLIVE_AUTH_FAIL");
    }
}

// Step Three: Authorize with Mojang
// Authorizes the XBOX LIVE token to access api.minecraftservices.com

async function authorizeMojang(token) {
    let data = JSON.stringify({
        Properties: {SandboxId: "RETAIL", UserTokens: [token]},
        RelyingParty: "rp://api.minecraftservices.com/",
        TokenType: "JWT",
    });
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://xsts.auth.xboxlive.com/xsts/authorize",
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    };
    try {
        const authMojang = await axios(config);
        return authMojang.data;
    } catch (err) {
        throw new Error("MOJANG_FAIL");
    }
}

// Step Four: Authenticate with Minecraft
// Authenticates the current user to api.minecraftservices.com

async function authenticateMinecraft(token, xuid) {
    let data = JSON.stringify({
        identityToken: `XBL3.0 x=${xuid};${token}`,
    });

    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api.minecraftservices.com/authentication/login_with_xbox",
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    };
    try {
        const mcAuth = await axios(config);
        return mcAuth.data;
    } catch (err) {
        throw new Error("MINECRAFT_FAIL");
    }
}

//Step Five: Verifies Ownership
// Verifies that the user owns a valid license of Minecraft

async function verifyMinecraft(access_token) {
    let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://api.minecraftservices.com/entitlements/mcstore",
        headers: {
            Authorization: "Bearer " + access_token,
        },
    };
    try {
        const verify = await axios(config);
        let verifyData = verify.data;
        let cert = fs.readFileSync(path.join(__dirname, "mojang.pem")); // get public key
        const verified = await jwt.verify(verifyData.signature, cert);
        return !!verified;
    } catch (err) {
        return false;
    }
}

// Step Six: Get Profile Data
// Retrieves Information regarding the user

async function getProfileData(access_token) {
    let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://api.minecraftservices.com/minecraft/profile",
        headers: {
            Authorization: "Bearer " + access_token,
        },
    };
    try {
        const profile = await axios(config);
        let profileData = profile.data;
        return {username: profileData.name, uuid: profileData.id};
    } catch {
        throw new Error("PROFILE_GET_ERROR");
    }
}

module.exports = {
    authenticateXboxLive,
    authorizeMojang,
    authenticateMinecraft,
    verifyMinecraft,
    getProfileData,
};
