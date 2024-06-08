# RSSchool AWS Course May-August 2024

## Task 2

https://github.com/rolling-scopes-school/aws/blob/main/aws-developer/02_serving_spa/task.md

## Self score: 70/100

### +30 Manual deploy to S3

https://task2-manual.s3.eu-west-1.amazonaws.com/index.html

### +40 Use Cloudfront for this deploy access

https://d1bdrxjk76zexq.cloudfront.net

### +0/30 Automatic CDK Deploy

- Go to project root

- Run `npm install --force`

- Run `npm run build` (will be created dist folder)

- Go to CDK directory `cd cdk`

- Install CDK globally if you don't have it yet `npm install -g aws cdk`

- Run `npm install` (will be created node_modules for cdk)

- Create `.env` file and fill your AWS id amd region with field like in `.env.example` (or reaname it to `.env` and fix data)

- Run `npm run bootstrap`. It's will launch boostrap command

- Run `npm run deploy`. It's will deploy app

- Make confirmation and wait few minutes (see console)

- Go to you AWS account (S3 and Cloudfront sections) and check links to deployments

- Run `npm run destroy`. It's will destroy app
