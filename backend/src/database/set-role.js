require('dotenv').config({ path: './.env' });
const { Client } = require('pg');

async function setRole() {
  const email = process.argv[2];
  const role = process.argv[3]?.toUpperCase();

  const validRoles = ['CUSTOMER', 'SHOPKEEPER', 'DELIVERY_PARTNER', 'ADMIN'];

  if (!email || !role || !validRoles.includes(role)) {
    console.error(
      'Usage: node src/database/set-role.js <email> <CUSTOMER|SHOPKEEPER|DELIVERY_PARTNER|ADMIN>',
    );
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    const res = await client.query(
      'UPDATE users SET role = $1, is_verified = true WHERE email = $2 RETURNING id, email, role, full_name',
      [role, email],
    );

    if (res.rows.length === 0) {
      console.error(`User with email "${email}" not found.`);
    } else {
      console.log(`Successfully updated user:`, res.rows[0]);
    }
  } catch (err) {
    console.error('Error updating role:', err.message);
  } finally {
    await client.end();
  }
}

setRole();
