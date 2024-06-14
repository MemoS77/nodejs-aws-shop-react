import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3d from 'aws-cdk-lib/aws-s3-deployment'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const bucketName = 'task-2-memos77-cdk'

    const bucket = new s3.Bucket(this, bucketName, {
      bucketName: bucketName,
      versioned: false,
      websiteIndexDocument: 'index.html',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publicReadAccess: false,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    })

    bucket.addToResourcePolicy(
      new cdk.aws_iam.PolicyStatement({
        sid: 's3BucketPublicRead ',
        effect: cdk.aws_iam.Effect.ALLOW,
        actions: ['s3:GetObject'],
        principals: [new cdk.aws_iam.AnyPrincipal()],
        resources: [`${bucket.bucketArn}/*`],
      }),
    )

    const distribution = new cloudfront.Distribution(
      this,
      `${bucketName}-distr`,
      {
        defaultBehavior: {
          origin: new cdk.aws_cloudfront_origins.S3Origin(bucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        comment: 'MemoS77 automatic distribution for study shop app',
        defaultRootObject: 'index.html',
      },
    )

    new s3d.BucketDeployment(this, `${bucketName}-deploy`, {
      sources: [cdk.aws_s3_deployment.Source.asset('../dist')],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    })

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
