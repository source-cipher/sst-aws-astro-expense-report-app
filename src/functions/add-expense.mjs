import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ipToId } from "./shared/utils.mjs";
import { ulid } from 'ulid'

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

export async function handler(event) {
  const userIpId = ipToId(event.requestContext.identity.sourceIp);

  const expenseReportId = event.pathParameters.id;

  const body = JSON.parse(event.body);
  const expenseId = ulid();
  
  const command = new PutCommand({
    TableName: process.env.EXPENSE_REPORTS_TABLE,
    Item: {
      pk: `${userIpId}#${expenseReportId}`,
      sk: `expense#${expenseId}`,
      data: {
        id: expenseId,
        description: body.description,
        amount: body.amount
      }
    },
  });

  try {
    await dynamodb.send(command);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'This is bad.' })
    };
  }

  return {
    statusCode: 201,
    body: JSON.stringify({ id: expenseId })
  };
};