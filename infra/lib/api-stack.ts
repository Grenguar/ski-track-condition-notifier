import {
  aws_apigateway as apigw,
  aws_lambda as lambda,
  aws_dynamodb as ddb,
  StackProps,
  Stack,
  aws_sns as sns,
  aws_ssm as ssm,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {RetentionDays} from "aws-cdk-lib/aws-logs";
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html
    // do not forget to do: npm install --save-dev esbuild@0
    // mayeb next time

    const snsTopic = new sns.Topic(this, 'SkiTopic', {
      topicName: 'ski-topic',
    });

    const getSkiTrackState = new lambda.Function(this, 'GetSkiTrackHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('../code'),
      handler: 'create.handler',
      logRetention: RetentionDays.ONE_WEEK,
      environment: {
        topicName: snsTopic.topicName,
        region: 'eu-west-1' 
      }
    });

    snsTopic.grantPublish(getSkiTrackState);

    snsTopic.addSubscription(new EmailSubscription(process.env.email as string, {
      json: true
    }));
  }
}
