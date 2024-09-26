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
      name: "sst-aws-astro-expense-report-app",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const expenseReportsTable = new sst.aws.Dynamo("ExpenseReports", {
      fields: {
        pk: "string",
        sk: "string",
      },
      primaryIndex: {
        hashKey: "pk", rangeKey: "sk"
      }
    });

    const expensesApi = new sst.aws.ApiGatewayV2('ExpensesApi', {
      cors: {
        allowOrigins: ["*"],
        allowMethods: ["GET"],
        allowHeaders: ["*"],
      },
      transform: {
        route: {
          handler: (args) => {
            args.environment = {
              EXPENSE_REPORTS_TABLE: expenseReportsTable.name
            };
            args.architecture = "arm64";
          }
        }
      }
    });

    expensesApi.route("GET /reports", {
      handler: "src/functions/get-expense-reports.handler",
      permissions: [{
        actions: ["dynamodb:Query"],
        resources: [expenseReportsTable.arn]
      }]
    });

    expensesApi.route("POST /reports", {
      handler: "src/functions/add-expense-report.handler",
      permissions: [{
        actions: ["dynamodb:PutItem"],
        resources: [expenseReportsTable.arn]
      }]
    });

    expensesApi.route("GET /reports/{reportId}", {
      handler: "src/functions/get-expense-report.handler",
      permissions: [{
        actions: ["dynamodb:GetItem"],
        resources: [expenseReportsTable.arn]
      }]
    });

    expensesApi.route("POST /reports/{reportId}/expenses", {
      handler: "src/functions/put-expense.handler",
      permissions: [{
        actions: ["dynamodb:PutItem"],
        resources: [expenseReportsTable.arn]
      }]
    });

    expensesApi.route("GET /reports/{reportId}/expenses", {
      handler: "src/functions/get-expenses.handler",
      permissions: [{
        actions: ["dynamodb:Query"],
        resources: [expenseReportsTable.arn]
      }]
    });

    expensesApi.route("GET /reports/{reportId}/expenses/{expenseId}", {
      handler: "src/functions/get-expense.handler",
      permissions: [{
        actions: ["dynamodb:GetItem"],
        resources: [expenseReportsTable.arn]
      }]
    });

    expensesApi.route("PUT /reports/{reportId}/expenses/{expenseId}", {
      handler: "src/functions/put-expense.handler",
      permissions: [{
        actions: ["dynamodb:PutItem"],
        resources: [expenseReportsTable.arn]
      }]
    });

    const expenseReportWebApp = new sst.aws.Astro("ExpenseReportWebApp", {
      environment: {
        PUBLIC_EXPENSE_REPORT_API: expensesApi.url
      }
    });
  }
});