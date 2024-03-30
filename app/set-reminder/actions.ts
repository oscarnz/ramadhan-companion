'use server'

import { auth } from "@/auth";
import { DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { Session } from "@/lib/types";
import { nanoid } from "nanoid";
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({
    region: "ap-southeast-1",
    credentials: {
        accessKeyId: process.env.AWS_DYNAMO_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_DYNAMO_SECRET_KEY as string
    }
});

interface Reminder {
    reminder: string;
    time: string;
    frequency: string;
}

export async function setReminder({ reminder, time, frequency }: Reminder) {
    const authUser = await auth() as Session;

    const input = {
        Item: {
            "id": {
                "S": nanoid()
            },
            "reminder": {
                "S": reminder
            },
            "time": {
                "S": time
            },
            "frequency": {
                "S": frequency
            },
            "createdAt": {
                "S": new Date().toISOString()
            },
            "email": {
                "S": authUser.user.email
            }
        },
        TableName: "prod-r-companion-infra-r-companion"
    };

    const command = new PutItemCommand(input);
    const response = await client.send(command);

    return response
}

export async function getReminder() {
    const authUser = await auth() as Session;

    const input = {
        IndexName: 'emailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': { S: `${authUser.user.email}` },
        },
        TableName: 'prod-r-companion-infra-r-companion',

    };

    const command = new QueryCommand(input);
    const response = await client.send(command);

    const data = response?.Items?.map((d) => unmarshall(d));

    return data
}

export async function deleteReminder({ id }: { id: string }) {

    const input = {
        Key: {
            "id": {
                "S": id
            },
        },
        TableName: "prod-r-companion-infra-r-companion"
    };

    const command = new DeleteItemCommand(input);


    const response = await client.send(command);
    console.log(response)

    return response

}