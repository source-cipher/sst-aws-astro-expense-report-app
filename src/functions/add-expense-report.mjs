import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ipToId } from "./shared/utils.mjs";
import { ulid } from 'ulid'

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

export async function handler(event) {
  const userIpId = ipToId(event.requestContext.http.sourceIp);
  const body = JSON.parse(event.body);
  const expenseReportId = ulid();
  
  const command = new PutCommand({
    TableName: process.env.EXPENSE_REPORTS_TABLE,
    Item: {
      pk: userIpId,
      sk: `expenseReport#${expenseReportId}`,
      data: {
        id: expenseReportId,
        name: body.name
      }
    },
  });

  try {
    await dynamodb.send(command);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Something went wrong.' })
    };
  }

  return {
    statusCode: 201,
    body: JSON.stringify({ id: expenseReportId })
  };
};