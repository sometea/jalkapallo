#!/bin/bash

# Update the lambda function by uploading the lambda package
aws s3 cp deployment.zip s3://jalkapallo-deployment
aws lambda update-function-code --function-name JalkapalloLambda --s3-bucket jalkapallo-deployment --s3-key deployment.zip --publish
