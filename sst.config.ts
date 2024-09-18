/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  console:{
    autodeploy: {
      target(event) {
        if (event.type === "branch" && event.branch === "master" && event.action === "pushed") {
          return {
            stage: "production"
          };
        }
      }
    }
  },
  app(input) {
    return {
      name: "aws-astro",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Astro("MyWeb");
  },
});
