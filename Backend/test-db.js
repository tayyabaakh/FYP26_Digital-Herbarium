const db = require('./config/db');

async function testDatabase() {
    try {
        const [rows] = await db.query('SELECT 1 AS result');

        console.log('✅ TiDB connection successful!');
        console.log(rows);

        const [schema] = await db.query(
    'SELECT DATABASE() AS database_name'
);

console.log(schema);
        process.exit(0);
    } catch (error) {
        console.error('❌ TiDB connection failed!');
        console.error(error);
        process.exit(1);
    }
}

testDatabase();