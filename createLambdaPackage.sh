#!/bin/bash

# Create a zip file for AWS Lambda Deployment
mkdir -p deployment
cp -R dist/* deployment/
cp -R node_modules deployment/
cd deployment
zip -r ../deployment.zip *
cd ..
rm -rf deployment
