# Omni-Bot
### Twitter bot using Omni.fyi API to create Ethereum wallets and token transactions. 

Contact me for API keys (omni)


**To start web app:** ```npm start```

### On start:
- Autoregisters a webhook with ngrok to Twitters Account Activity API on start up
- Connects with Adventure API to establish bearer token

### Application functionanlity:
- On Twitter user follow: the application will follow back the user, register user with Omni.fyi services, create their Ethereum wallet and direct message them their user information.
- Tweet transactions: when application is mentioned in a tweet, will check for transaction information (i.e amount and token ticker), process transaction through Adventure API. (Transaction completion notificaiton in progress)
- Wallet information request: users can direct message the application to obtain wallet address in ether scan link. 
