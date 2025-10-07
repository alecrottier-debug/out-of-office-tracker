const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    try {
        const { person, dateKey, isOut } = req.body;

        if (!person || !dateKey) {
            context.res = {
                status: 400,
                body: { error: 'Missing person or dateKey' }
            };
            return;
        }

        const connectionString = process.env.AzureWebJobsStorage;
        const tableClient = TableClient.fromConnectionString(connectionString, "OutDates");

        // Ensure table exists
        await tableClient.createTable().catch(() => {});

        // Create a unique key
        const rowKey = `${person}_${dateKey}`.replace(/[^a-zA-Z0-9-_]/g, '_');

        if (isOut) {
            // Insert or update
            const entity = {
                partitionKey: "outdate",
                rowKey: rowKey,
                person: person,
                dateKey: dateKey,
                isOut: isOut
            };
            await tableClient.upsertEntity(entity);
        } else {
            // Delete
            try {
                await tableClient.deleteEntity("outdate", rowKey);
            } catch (e) {
                // Entity might not exist, that's okay
            }
        }

        context.res = {
            status: 200,
            body: { success: true }
        };
    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            body: { error: error.message }
        };
    }
};
