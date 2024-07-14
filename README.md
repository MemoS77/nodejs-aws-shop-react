# RSSchool AWS Course May-August 2024

## First time use

- Go to project root

- Run `npm install --force`

- Go to CDK directory `cd cdk`

- Run `npm install`

- Install CDK globally if you don't have it yet `npm install -g aws cdk`

- Create `.env` file and fill your AWS id amd region with field like in `.env.example` (or reaname it to `.env` and fix data)

## Deploy to AWS

- Run `npm run bootstrap`. Before first time deploy. It's will create AWS resources.

- Run `npm run deploy`. It's will build & deploy front app

- Run `npm run destroy`. It's will destroy app
