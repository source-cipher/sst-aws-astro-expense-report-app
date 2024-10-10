# Running the Application Locally

### Setting up AWS Credentials
Make sure you have your AWS credentials set up. There is an overview for your AWS account set up here: https://sst.dev/docs/aws-accounts.

### Setting up Permissions

SST will need certain permissions to deploy into you account. There is an overview of the permissions here: https://sst.dev/docs/iam-credentials

### Setting up SST Console (Optional)

Creating an account to access the SST console is recomended. Its an easy way to track deployments, troubleshoot deployment issues, and track resources. You can also set up auto deployments for events that occur in GitHub. Autodeploy is configured in the sst.config.ts file and wired to the necessary accounts through the console.

This is what is currently configured for the autodeploy in the sst.config.ts file:
`autodeploy: {
  target(event) {
    if (event.type === "branch" && event.branch === "master" && event.action === "pushed") {
      return {
        stage: "production"
      };
    }
  }
}
`

### Running the application

To start the application locally run the command `npx sst dev`. This will host the application on http://localhost:4321

# Deploying the application

### Stage deployment
To deploy the entire application including its front end assets run the command `npx sst deploy --stage STAGE_NAME`. This will statically host the application in S3 with a Cloudfront distribution sitting in front of it. The urls for your api and fronend will be printed in the terminal or console.

### Delete deployment
To delete all of the assets for a deployment run the command `npx sst remove --stage STAGE_NAME`
