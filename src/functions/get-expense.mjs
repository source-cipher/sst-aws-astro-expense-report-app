import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ipToId } from "./shared/utils.mjs";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

export async function handler(event) {
  const userIpId = ipToId(event.requestContext.http.sourceIp);

  const expenseReportId = event.pathParameters.reportId;
  const expenseId = event.pathParameters.expenseId;

  const command = new GetCommand({
    TableName: process.env.EXPENSE_REPORTS_TABLE,
    Key: {
      pk: `${userIpId}#${expenseReportId}`,
      sk: `expense#${expenseId}`
    }
  });

  let response;
  try {
    response = await dynamodb.send(command);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Something went wrong.' })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response.Item.data)
  };
};