import {
  aws_apigateway as apigw,
  aws_dynamodb as ddb,
  StackProps,
  Stack,
  aws_sns as sns,
  aws_ssm as ssm,
  Duration,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {RetentionDays} from "aws-cdk-lib/aws-logs";
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import * as path from 'path';
import { aws_lambda_nodejs } from 'aws-cdk-lib';
export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html
    // do not forget to do: npm install --save-dev esbuild@0
    // mayeb next time

    const snsTopic = new sns.Topic(this, 'SkiTopic', {
      topicName: 'ski-topic',
    });

    // const getSkiTrackState = new lambda.Function(this, 'GetSkiTrackHandler', {
    //   runtime: lambda.Runtime.NODEJS_14_X,
    //   code: lambda.Code.fromAsset('../code'),
    //   handler: 'get-ski-track-state.handler',
    //   logRetention: RetentionDays.ONE_WEEK,
    //   environment: {
    //     topicName: snsTopic.topicName,
    //     region: 'eu-west-1' 
    //   }
    // });

    const getSkiTrackState = new aws_lambda_nodejs.NodejsFunction(this, 'MyFunction', {
      entry: path.join(__dirname, '../../src/functions/get-ski-track-state.ts'),
      timeout: Duration.seconds(25),
      logRetention: RetentionDays.ONE_WEEK,
      depsLockFilePath: path.join(__dirname, '../../package-lock.json'),
      projectRoot: path.join(__dirname, '../..'),
      bundling: {
        nodeModules: ['@aws-sdk/client-sns', 'axios'],
      },
      environment: {
        topicArn: snsTopic.topicArn,
      }
    });

    snsTopic.grantPublish(getSkiTrackState);

    snsTopic.addSubscription(new EmailSubscription(process.env.email as string, {
      json: true
    }));
  }
}
