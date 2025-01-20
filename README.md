# Cauldron Authentication

## What does this do?

Cauldron Authentication is responsible
for authenticating Minecraft Users
using the [Microsoft Authentication System](https://minecraft.wiki/w/Microsoft_authentication)
which is the only way to log in to Mojang now.
This package provides all the tools needed to acquire a Minecraft Access token from an oauth token.

## Setup

To Install the package, run the following command

```
npm i @jackcooperdev/cauldronauthentication --save
```

## Using Cauldron Authentication

## Information

To use this package, you need to provide a way to get an access token.
To do this, you need to create an Azure application.
See [here](https://blog.jackcooper.me/posts/inside-authenticator) for more information.

Wiki.vg was a great resource that provided lots of information on how various parts of Minecraft works.
It has been merged into Minecraft Wiki
and can be viewed [here](https://minecraft.wiki/w/Microsoft_authentication#Navigation)


## Functions

### startAuthenticationFlow (access_token)

This function performs the authentication flow turning a microsoft access token into a minecraft access token and getting the profile information for the user.

It takes the following parameters

+ `access_token` - Microsoft Access Token Acquired through oAuth flow.

On completion,
the function will return an object that can be used to launch a Minecraft Instance.

### Sample Output

```json
{
    "profile": {
      "uuid": "069a79f444e94726a5befca90e38aaf5",
      "username": "Notch"
    },
    "xui": "0000000000000000",
    "access_token": "ACCESS_TOKEN",
    "user_id": "aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa"
}
```

## Additional Modules

| Name                                                  | Import                                     | Description                                 |
|-------------------------------------------------------|--------------------------------------------|---------------------------------------------|
| [MAS](https://docs.cauldronmc.com/authentication/mas) | `@jackcooperdev/cauldronauthentication/mas` | Provides Access to the individual functions |

