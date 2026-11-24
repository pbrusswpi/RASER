import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as apigw from "aws-cdk-lib/aws-apigateway"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'node:path'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { Duration } from 'aws-cdk-lib'

export class ApplicationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const vpc = ec2.Vpc.fromVpcAttributes(this, 'VPC', {
      vpcId: 'vpc-05485704278b6553e',                                                                         // Replace with your VPC ID
      availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],                                          // Replace with your AZs
      privateSubnetIds: ['subnet-0a7394a2e9e43f21c', 'subnet-0b6fc8715fb3098a6', 'subnet-018f2585addb01807'], // Replace with your private subnet IDs
    })

    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'SG', 'sg-08a8f9fb81844baba', {             // Find your security group
      mutable: false
    })

    // generic default handler for any API function that doesn't get its own Lambda method
    const default_fn = new lambdaNodejs.NodejsFunction(this, 'LambdaDefaultFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'default.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'default')),
      vpc: vpc,                                                             // Reference the VPC defined above
      securityGroups: [securityGroup],                                      // Associate the security group
      timeout: Duration.seconds(3),                                         // Example timeout, adjust as needed
    })

    const api_endpoint = new apigw.LambdaRestApi(this, `raserapi`, {
      handler: default_fn,
      restApiName: `RaserAPI`,
      proxy: false,
      defaultCorsPreflightOptions: {                                        // Optional BUT very helpful: Add CORS configuration 
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
      },
    })

    // Create a resource (e.g., '/calc')
    const rubricResource = api_endpoint.root.addResource('rubric');
    const createRubricResource = rubricResource.addResource('create');
    const listRubricsResource = rubricResource.addResource('list');
    const viewRubricResource = rubricResource.addResource('view');
    const deleteRubricResource = rubricResource.addResource('delete');
    const editRubricResource = rubricResource.addResource('edit');
    const publishRubricResource = rubricResource.addResource('publish');
    const duplicateRubricResource = rubricResource.addResource('duplicate');
    const deprecateRubricResource = rubricResource.addResource('deprecate');

    const questionResource = api_endpoint.root.addResource('question')
    const addQuestionResource = questionResource.addResource('add');
    const editQuestionResource = questionResource.addResource('edit');
    const deleteQuestionResource = questionResource.addResource('delete');

    const journalResource = api_endpoint.root.addResource('journal');
    const registerJournalResource = journalResource.addResource('register');
    const withdrawJournalResource = journalResource.addResource('withdraw');
    const viewJournalsResource = journalResource.addResource('view');

    const issueResource = api_endpoint.root.addResource('issue');
    const createIssueResource = issueResource.addResource('create');
    const deleteIssueResource = issueResource.addResource('delete');

    const paperResource = api_endpoint.root.addResource('paper');
    const addPaperResource = paperResource.addResource('add');
    const withdrawPaperResource = paperResource.addResource('withdraw');

    // https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk-lib/aws-apigateway/README.md
    const integration_parameters = {
      proxy: false,
      passthroughBehavior: apigw.PassthroughBehavior.WHEN_NO_MATCH,

      integrationResponses: [
        {
          // Successful response from the Lambda function, no filter defined
          statusCode: '200',
          responseTemplates: {
            'application/json': '$input.json(\'$\')',       // should just pass JSON through untouched
          },
          responseParameters: {
            'method.response.header.Content-Type': "'application/json'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Credentials': "'true'"
          },
        },
        {
          // For errors, we check if the error message is not empty, get the error data
          selectionPattern: '(\n|.)+',
          statusCode: "400",
          responseTemplates: {
            'application/json': JSON.stringify({ state: 'error', message: "$util.escapeJavaScript($input.path('$.errorMessage'))" })
          },
          responseParameters: {
            'method.response.header.Content-Type': "'application/json'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Credentials': "'true'"
          },
        }
      ]
    }

    const response_parameters = {
      methodResponses: [
        {
          // Successful response from the integration
          statusCode: '200',
          // Define what parameters are allowed or not
          responseParameters: {
            'method.response.header.Content-Type': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Credentials': true
          },

        },
        {
          // Same thing for the error responses
          statusCode: '400',
          responseParameters: {
            'method.response.header.Content-Type': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Credentials': true
          },

        }
      ]
    }
    const create_rubric_fn = new lambdaNodejs.NodejsFunction(this, 'CreateRubricFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'create-rubric.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'create-rubric')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    createRubricResource.addMethod('POST', new apigw.LambdaIntegration(create_rubric_fn, integration_parameters), response_parameters)

    const list_rubrics_fn = new lambdaNodejs.NodejsFunction(this, 'ListRubricsFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'list-rubrics.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'list-rubrics')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    listRubricsResource.addMethod('GET', new apigw.LambdaIntegration(list_rubrics_fn, integration_parameters), response_parameters)

    const view_rubric_fn = new lambdaNodejs.NodejsFunction(this, 'ViewRubricFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'view-rubric.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'view-rubric')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    viewRubricResource.addMethod('POST', new apigw.LambdaIntegration(view_rubric_fn, integration_parameters), response_parameters)

    const delete_rubric_fn = new lambdaNodejs.NodejsFunction(this, 'DeleteRubricFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'delete-rubric.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'delete-rubric')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    deleteRubricResource.addMethod('POST', new apigw.LambdaIntegration(delete_rubric_fn, integration_parameters), response_parameters)

    const edit_rubric_fn = new lambdaNodejs.NodejsFunction(this, 'EditRubricFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'edit-rubric.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'edit-rubric')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    editRubricResource.addMethod('POST', new apigw.LambdaIntegration(edit_rubric_fn, integration_parameters), response_parameters)
  
    const publish_rubric_fn = new lambdaNodejs.NodejsFunction(this, 'PublishRubricFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'publish-rubric.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'publish-rubric')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    publishRubricResource.addMethod('POST', new apigw.LambdaIntegration(publish_rubric_fn, integration_parameters), response_parameters)

    const duplicate_rubric_fn = new lambdaNodejs.NodejsFunction(this, 'DuplicateRubricFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'duplicate-rubric.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'duplicate-rubric')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    duplicateRubricResource.addMethod('POST', new apigw.LambdaIntegration(duplicate_rubric_fn, integration_parameters), response_parameters)

    const deprecate_rubric_fn = new lambdaNodejs.NodejsFunction(this, 'DeprecateRubricFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'deprecate-rubric.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'deprecate-rubric')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    deprecateRubricResource.addMethod('POST', new apigw.LambdaIntegration(deprecate_rubric_fn, integration_parameters), response_parameters)

    const add_question_fn = new lambdaNodejs.NodejsFunction(this, 'AddQuestionFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'add-question.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'add-question')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    addQuestionResource.addMethod('POST', new apigw.LambdaIntegration(add_question_fn, integration_parameters), response_parameters)

    const edit_question_fn = new lambdaNodejs.NodejsFunction(this, 'EditQuestionFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'edit-question.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'edit-question')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    editQuestionResource.addMethod('POST', new apigw.LambdaIntegration(edit_question_fn, integration_parameters), response_parameters)

    const delete_question_fn = new lambdaNodejs.NodejsFunction(this, 'DeleteQuestionFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'delete-question.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'delete-question')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    deleteQuestionResource.addMethod('POST', new apigw.LambdaIntegration(delete_question_fn, integration_parameters), response_parameters)

    const register_journal_fn = new lambdaNodejs.NodejsFunction(this, 'RegisterJournalFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'register-journal.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'register-journal')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    registerJournalResource.addMethod('POST', new apigw.LambdaIntegration(register_journal_fn, integration_parameters), response_parameters)

    const withdraw_journal_fn = new lambdaNodejs.NodejsFunction(this, 'WithdrawJournalFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'withdraw-journal.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'withdraw-journal')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    withdrawJournalResource.addMethod('POST', new apigw.LambdaIntegration(withdraw_journal_fn, integration_parameters), response_parameters)

    const view_journals_fn = new lambdaNodejs.NodejsFunction(this, 'ViewJournalsFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'view-journals.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'view-journals')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    viewJournalsResource.addMethod('GET', new apigw.LambdaIntegration(view_journals_fn, integration_parameters), response_parameters)

    const create_issue_fn = new lambdaNodejs.NodejsFunction(this, 'CreateIssueFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'create-issue.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'create-issue')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    createIssueResource.addMethod('POST', new apigw.LambdaIntegration(create_issue_fn, integration_parameters), response_parameters)

    const delete_issue_fn = new lambdaNodejs.NodejsFunction(this, 'DeleteIssueFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'delete-issue.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'delete-issue')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    deleteIssueResource.addMethod('POST', new apigw.LambdaIntegration(delete_issue_fn, integration_parameters), response_parameters)

    const add_paper_fn = new lambdaNodejs.NodejsFunction(this, 'AddPaperFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'add-paper.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'add-paper')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    addPaperResource.addMethod('POST', new apigw.LambdaIntegration(add_paper_fn, integration_parameters), response_parameters)
    
    const withdraw_paper_fn = new lambdaNodejs.NodejsFunction(this, 'WithdrawPaperFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'withdraw-paper.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'withdraw-paper')),
      vpc: vpc,
      securityGroups: [securityGroup],
      timeout: Duration.seconds(3),
    })
    withdrawPaperResource.addMethod('POST', new apigw.LambdaIntegration(withdraw_paper_fn, integration_parameters), response_parameters)
  }
}
