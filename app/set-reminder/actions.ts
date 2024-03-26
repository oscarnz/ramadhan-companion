'use server'

import { auth } from "@/auth";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Session } from "@/lib/types";
import { nanoid } from "nanoid";

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
            "user": {
                "S": authUser.user.email
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
            }
        },
        TableName: "RamadhanReminder"
    };

    const command = new PutItemCommand(input);
    const response = await client.send(command);

    return response
}