import { StackProps, Stack, aws_sns as sns, Duration, aws_lambda_nodejs } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import * as path from 'path';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { addLambdaPermission, LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html
    // do not forget to do: npm install --save-dev esbuild@0
    // mayeb next time

    const snsTopic = new sns.Topic(this, 'SkiTopic', {
      topicName: 'ski-topic',
    });

    const eventRule = new Rule(this, 'LambdaTrigger', {
      schedule: Schedule.rate(Duration.minutes(30)),
    });

    const getSkiTrackStateHandler = new aws_lambda_nodejs.NodejsFunction(this, 'MyFunction', {
      entry: path.join(__dirname, '../../src/functions/get-ski-track-state.ts'),
      timeout: Duration.seconds(30),
      logRetention: RetentionDays.ONE_WEEK,
      environment: {
        topicArn: snsTopic.topicArn,
        region: props?.env?.region as string,
        timeInterval: '30',
      },
    });

    eventRule.addTarget(new LambdaFunction(getSkiTrackStateHandler));

    addLambdaPermission(eventRule, getSkiTrackStateHandler);

    snsTopic.grantPublish(getSkiTrackStateHandler);

    snsTopic.addSubscription(
      new EmailSubscription(process.env.email as string, {
        json: false,
      })
    );
  }
}
