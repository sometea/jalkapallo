# Jalkapallo
Serverless API for a CMS using Express. The application can deployed to AWS lambda and uses Amazon DynamoDB for a database,
AWS Cognito for user management and S3 for file storage. It can therefore run in a completely serverless environment.
Currently, only offers endpoints for authentication and for two resources: "Articles" which are generic content types or blog posts
and "Images", which contain metadata for images stored via S3.

## Installation
After checking out, run ```npm install``` to install dependent packages and then ```npm run build``` to compile the TypeScript files down to JavaScript.
Afterwards, the application can be started using ```npm run start```, the unit tests are run using ```npm run test```.
Further commands:

```
npm run dynamodb-local
```
Pulls and runs the dynamodb docker container to have a local instance of dynamodb to test against. See [](https://hub.docker.com/r/amazon/dynamodb-local/).

```
npm run testtable
```
Creates dynamodb tables and populates them with some test data.

```
npm run package
```
Creates a zip-file containing the code and dependencies that can be deployed to AWS Lambda.

```
npm run deploy
```
Deployes the zip-file to AWS Lambda. The function is called "Jalkapallo". It is immediately published. Note that currently, you will have to manually
set up an API Gateway forwarding all requests to this Lambda function. In the future, a CloudFormation template is planned that automates this step.

## Configuration
The application takes some configuration data from objects defined in ```config.ts```, which is not a part of this repository. To create it, copy
```config.example.ts``` to ```config.ts``` and adapt it to your needs. Then, rebuild.

## Usage
To be written.

## Amazon AWS requirements
You will need an account with AWS to deploy and use this code. The software currently assumes that a global AWS configuration is present, e.g.
in ```~/.aws/config``` and ```~/.aws/credentials```. Further instructions for this can be found in the AWS documentation. Note that Amazon will charge
you for most services that this application depends on (although depending on usage you might be within free tier limits). It is still expected
that using Lambda for code execution and other cloud services, you will end up with a much cheaper service than with a classical VPS-based setup.

## License
This code is licensed under the terms of the GNU GPL v3. See LICENSE for details.
