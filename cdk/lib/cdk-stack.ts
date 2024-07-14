import { Construct } from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3d from 'aws-cdk-lib/aws-s3-deployment'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import { PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import {
  CloudFrontWebDistribution,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront'
import { Source } from 'aws-cdk-lib/aws-s3-deployment'

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const bucketName = 'shop-cdk'

    const bucket = new s3.Bucket(this, bucketName, {
      versioned: false,
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
    })

    const oai = new cloudfront.OriginAccessIdentity(this, 'OAI', {
      comment: `OAI for ${bucketName}`,
    })

    const distribution = new CloudFrontWebDistribution(
      this,
      `${bucketName}-distr`,
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: oai,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
              },
            ],
          },
        ],
        defaultRootObject: 'index.html',
      },
    )

    bucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [bucket.arnForObjects('*')],
        principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
        conditions: {
          StringEquals: {
            'AWS: SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
          },
        },
      }),
    )

    bucket.grantRead(oai)

    new s3d.BucketDeployment(this, `${bucketName}-deploy`, {
      sources: [Source.asset('../dist')],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    })

    new CfnOutput(this, 'CloudFrontURL', {
      value: distribution.distributionDomainName,
      description: 'CloudFront Public URL',
    })

    new CfnOutput(this, 'S3', {
      value: bucket.bucketWebsiteUrl,
      description: 'S3 Private Bucket',
    })
  }
}
