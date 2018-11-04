#!/bin/bash

# Update the lambda function by uploading the lambda package
aws lambda update-function-code --function-name Jalkapallo --zip-file fileb://deployment.zip --publish
