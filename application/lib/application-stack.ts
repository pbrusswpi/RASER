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

    const api_endpoint = new apigw.LambdaRestApi(this, `calculatorapi`, {
      handler: default_fn,
      restApiName: `CalculatorAPI`,
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

    const questionResource = api_endpoint.root.addResource('question')
    const addQuestionResource = questionResource.addResource('add');
    const editQuestionResource = questionResource.addResource('edit');
    const deleteQuestionResource = questionResource.addResource('delete');

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
  }
}
