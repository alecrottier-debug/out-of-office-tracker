const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    try {
        const connectionString = process.env.AzureWebJobsStorage;
        const tableClient = TableClient.fromConnectionString(connectionString, "OutDates");

        // Ensure table exists
        await tableClient.createTable().catch(() => {});

        // Get all entities
        const entities = [];
        for await (const entity of tableClient.listEntities()) {
            entities.push({
                person: entity.person,
                dateKey: entity.dateKey,
                isOut: entity.isOut
            });
        }

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: entities
        };
    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            body: { error: error.message }
        };
    }
};
