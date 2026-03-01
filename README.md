# Expense Report App

A full-stack expense reporting application built with [Astro](https://astro.build), [SST](https://sst.dev), and [AWS](https://aws.amazon.com). This application allows users to create expense reports, add expenses to them, and view summaries.

## Features

- **Create Expense Reports**: Start a new report to track expenses.
- **Add Expenses**: Log individual expenses with details.
- **View Summaries**: See an overview of your expense reports.
- **Serverless Architecture**: Built on AWS Lambda and DynamoDB for scalability and low cost.
- **Infrastructure as Code**: Deployed and managed using SST.

## Architecture

### Tech Stack

- **Frontend**: [Astro](https://astro.build) (Static Site Generation & Server Side Rendering)
- **Styling**: [TailwindCSS](https://tailwindcss.com)
- **Backend**: [AWS Lambda](https://aws.amazon.com/lambda/) (Node.js)
- **Database**: [Amazon DynamoDB](https://aws.amazon.com/dynamodb/)
- **Infrastructure**: [SST](https://sst.dev) (Serverless Stack)

### Infrastructure

The application infrastructure is defined in `sst.config.ts` and includes:

- **DynamoDB Table**: `ExpenseReports` table with a composite primary key (`pk`, `sk`) to store reports and expenses.

#### Data Models

**Expense Report Item**

```json
{
  "type": "object",
  "properties": {
    "pk": { "type": "string", "description": "{userIpId}" },
    "sk": { "type": "string", "description": "expenseReport#{reportId}" },
    "data": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" }
      }
    }
  }
}
```

**Expense Item**

```json
{
  "type": "object",
  "properties": {
    "pk": { "type": "string", "description": "{userIpId}#{reportId}" },
    "sk": { "type": "string", "description": "expense#{expenseId}" },
    "data": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "description": { "type": "string" },
        "amount": { "type": "number" }
      }
    }
  }
}
```

- **API Gateway**: An HTTP API (`ExpensesApi`) that routes requests to Lambda functions.
- **Astro Site**: Hosted using the `sst.aws.Astro` construct, which deploys the frontend assets and server-side functions.

## Prerequisites

### Setting up Permissions

SST will need certain permissions to deploy into your account. There is an overview of the permissions here: https://sst.dev/docs/iam-credentials

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [AWS CLI](https://aws.amazon.com/cli/) configured with your credentials.

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd sst-aws-astro-expense-report-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup AWS Credentials

Ensure your AWS credentials are configured. You can find a guide here: [SST - AWS Accounts](https://sst.dev/docs/aws-accounts).

### 4. Run locally

Start the local development environment:

```bash
npx sst dev
```

This command will:
- Deploy a personal development stage of your infrastructure to AWS.
- Start the Astro development server.
- Watch for changes and reload automatically.

The application will be available at `http://localhost:4321`.

## Deployment

### Deploy to a Stage

To deploy the application to a specific stage (e.g., `dev`, `staging`, `prod`):

```bash
npx sst deploy --stage <stage-name>
```

This will build the application and deploy the infrastructure and assets to AWS. The URL for your deployment will be printed in the console.

### Automatic Deployment

The project is configured for automatic deployment in `sst.config.ts`. Pushes to the `master` branch will automatically trigger a deployment to the `production` stage.

```typescript
// sst.config.ts
autodeploy: {
  target(event) {
    if (event.type === "branch" && event.branch === "master" && event.action === "pushed") {
      return {
        stage: "production"
      };
    }
  }
}
```

### Remove Deployment

To remove a deployed stage and delete all associated resources:

```bash
npx sst remove --stage <stage-name>
```

## API Documentation

The backend API exposes the following endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/reports` | List all expense reports |
| `POST` | `/reports` | Create a new expense report |
| `GET` | `/reports/{reportId}` | Get details of a specific report |
| `POST` | `/reports/{reportId}/expenses` | Add an expense to a report |
| `GET` | `/reports/{reportId}/expenses` | List expenses for a report |
| `GET` | `/reports/{reportId}/expenses/{expenseId}` | Get details of a specific expense |
| `PUT` | `/reports/{reportId}/expenses/{expenseId}` | Update an expense |

## Project Structure

```
.
├── src/
│   ├── components/   # Astro components
│   ├── functions/    # Lambda function handlers
│   ├── layouts/      # Astro layouts
│   ├── pages/        # Astro pages and routes
│   ├── shared/       # Shared code/types
│   └── styles/       # Global styles
├── sst.config.ts     # SST infrastructure configuration
├── astro.config.mjs  # Astro configuration
├── package.json      # Dependencies and scripts
└── README.md         # Project documentation
```
