# Cauldron Authentication
 
## What does this do?
Cauldron Authentication is responsible for authenticating Minecraft Users using the [Microsoft Authentication System](https://wiki.vg/Microsoft_Authentication_Scheme) which is the only way to login to Mojang now. This package provides all the tools needed to aquire a Minecraft Access token from a oauth token.

## Setup

To Install the package run the following command

```
npm i @jackcooper04/cauldronauthentication --save
```

## Using Cauldron Authentication

Cauldron Authentication is split into multiple exports. They are listed below.



| Name | Import | Description |
|------|--------|-------------|
|   [Main Functions](https://docs.cauldronmc.com/authentication/main)  |   ```@jackcooper04/cauldronauthentication```     |     Main Function
|   [MAS](https://docs.cauldronmc.com/authentication/mas)  |   ```@jackcooper04/cauldronauthentication/mas```     |      Provides Access to the indiviudal functions |



## Information

In order to use this package you need to provide a way to get a access token. In order to do this you need to create a Azure application. See [here](https://docs.cauldronmc.com/authentication/authentication) for more information.


[Wiki.vg](https://wiki.vg/) provides lots of information on how various parts of Minecraft works.