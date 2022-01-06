#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiPipelineStack } from "../lib/api-pipeline-stack";

// const region = process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION;
// const account = process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT;

// const env: cdk.Environment = {
//     region,
//     account,
// };

const app = new cdk.App();
new ApiPipelineStack(app, 'SkiNotifierPipelineStack', {});

app.synth();
