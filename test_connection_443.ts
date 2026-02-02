import { Client } from "pg";

const user = "postgres.cbelstkpchxoumslftco";
const password = "CTZ{9g@z5I}MQOg1gq4tra(vLaTE]QY73sL$UoEX]-$Q9IS$WB";
const host = "aws-0-us-west-2.pooler.supabase.com";
const port = 443; // Testing port 443
const database = "postgres";

const encodedPassword = encodeURIComponent(password);
const connectionString = `postgresql://${user}:${encodedPassword}@${host}:${port}/${database}`;

console.log(`Testing connection to ${host}:${port}...`);

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function test() {
    try {
        await client.connect();
        console.log("Successfully connected to the database on port 443!");
        const res = await client.query('SELECT NOW()');
        console.log("Query result:", res.rows[0]);
        await client.end();
    } catch (err: any) {
        console.error("Connection error:", err.message);
        if (err.code) console.error("Error code:", err.code);
        process.exit(1);
    }
}

test();
