import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ipToId } from "./shared/utils.mjs";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

export async function handler(event) {

  const userIpId = ipToId(event.requestContext.identity.sourceIp);
  const expenseReportId = event.pathParameters.id;

  const command = new QueryCommand({
    TableName: process.env.EXPENSE_REPORTS_TABLE,
    KeyConditionExpression:
      "pk = :pk AND begins_with(sk, :sk)",
    ExpressionAttributeValues: {
      ":pk": `${userIpId}#${expenseReportId}`,
      ":sk": "expense#"
    }
  });

  let response;
  try {
    response = await dynamodb.send(command);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'This is bad.' })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: response.Items.map((item) => item.data),
      ...response.LastEvaluatedKey &&  { lastEvaluatedKey: response.LastEvaluatedKey }
    })
  };
};