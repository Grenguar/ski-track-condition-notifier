import { aws_ssm as ssm, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { MyPipelineAppStage } from './api-stack-stage';

export class ApiPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const connectionArn = ssm.StringParameter.valueForStringParameter(this, '/serverless-api/git/connection-arn', 1);
    const email = ssm.StringParameter.valueForStringParameter(this, '/billing/email', 1);

    const buildCommands = ['npm i', 'npm run build', 'npm run test', 'npx cdk synth'];

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'SkiNotifier-Pipeline',
      synth: new ShellStep('Build', {
        input: CodePipelineSource.connection('Grenguar/ski-track-condition-notifier', 'main', {
          connectionArn,
        }),
        commands: buildCommands,
        env: {
          email,
        },
      }),
      selfMutation: true,
    });

    pipeline.addStage(new MyPipelineAppStage(this, 'Deploy'));
  }
}
