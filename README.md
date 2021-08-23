# twilio-watson

This repo contains everything needed to replicate the Twilio Watson blogpost.

The demo outline is: 

1. User connects via WhatsApp with a Watson Chatbot.
2. User provides their parameters through WhatsApp messages and Watson makes the API requests to the correct provider (in this case Yelp) and provides the results of the query.

## 🛠 Setup

1. Rename the .example.env to .env -> `mv .example.env .env` and substitute the environmental variables in the file as described in the blogpost
2. In the IBM Watson Assistant page, create a new assistant and upload the `skill-Watson-Blogpost.json` file.
3. In your Twilio account go to Twilio Studio, create a new Studio flow and at the import from JSON option upload the `studioFlow.json` 
4. Deploy your functions to your Twilio account with Twilio CLI.
   - `twilio login`
   - `twilio plugins:install @twilio-labs/plugin-serverless`
   - `cd serverless`
   - `twilio serverless:deploy`

## Resources
- Blogpost link
