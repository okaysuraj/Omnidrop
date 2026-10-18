require('dotenv').config({ path: './.env' });
const { Client } = require('pg');

async function seed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    console.log('Connected to Neon PostgreSQL.');

    // 1. Check or promote existing user to ADMIN/SHOPKEEPER for testing
    const userRes = await client.query('SELECT id, email, role FROM users LIMIT 1;');
    let ownerId;
    if (userRes.rows.length > 0) {
      ownerId = userRes.rows[0].id;
      console.log(`Using existing user ${userRes.rows[0].email} as store owner.`);
    } else {
      console.log('No user found yet. Register on the web app first, then run seed.');
      await client.end();
      return;
    }

    // 2. Categories
    const categoriesData = [
      {
        name: 'Fresh Produce',
        slug: 'fresh-produce',
        imageUrl:
          'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80',
        sortOrder: 1,
      },
      {
        name: 'Dairy & Eggs',
        slug: 'dairy-eggs',
        imageUrl:
          'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
        sortOrder: 2,
      },
      {
        name: 'Bakery & Bread',
        slug: 'bakery-bread',
        imageUrl:
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
        sortOrder: 3,
      },
      {
        name: 'Beverages',
        slug: 'beverages',
        imageUrl:
          'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80',
        sortOrder: 4,
      },
      {
        name: 'Snacks & Munchies',
        slug: 'snacks-munchies',
        imageUrl:
          'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=400&q=80',
        sortOrder: 5,
      },
    ];

    const categoryMap = {};
    for (const cat of categoriesData) {
      const res = await client.query(
        `INSERT INTO categories (id, name, slug, image_url, sort_order, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, image_url = EXCLUDED.image_url
         RETURNING id, slug;`,
        [cat.name, cat.slug, cat.imageUrl, cat.sortOrder],
      );
      categoryMap[res.rows[0].slug] = res.rows[0].id;
    }
    console.log('Seeded categories:', Object.keys(categoryMap).length);

    // 3. Stores
    const storesData = [
      {
        name: 'Omni Fresh Supermarket',
        description:
          'Your neighborhood hub for fresh farm produce, organic dairy, and daily essentials.',
        imageUrl:
          'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
        address: 'Connaught Place, Central Delhi, 110001',
        lat: 28.6315,
        lng: 77.2167,
        radiusKm: 10,
        phone: '+91 9876543210',
      },
      {
        name: 'Ferment & Flour Bakery',
        description: 'Freshly baked artisanal sourdoughs, croissants, and morning pastries.',
        imageUrl:
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        address: 'Khan Market, New Delhi, 110003',
        lat: 28.6002,
        lng: 77.2272,
        radiusKm: 8,
        phone: '+91 9876543211',
      },
      {
        name: 'Green Orchard Organic Store',
        description:
          '100% certified pesticide-free vegetables, fruits, cold pressed oils, and honey.',
        imageUrl:
          'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
        address: 'South Extension II, New Delhi, 110049',
        lat: 28.5684,
        lng: 77.2217,
        radiusKm: 7,
        phone: '+91 9876543212',
      },
    ];

    const storeIds = [];
    for (const s of storesData) {
      const res = await client.query(
        `INSERT INTO stores (
          id, owner_id, name, description, image_url, address,
          lat, lng, radius_km, is_active, is_verified, rating, total_ratings,
          phone, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5,
          $6, $7, $8, true, true, 4.8, 42,
          $9, NOW(), NOW()
        ) RETURNING id, name;`,
        [ownerId, s.name, s.description, s.imageUrl, s.address, s.lat, s.lng, s.radiusKm, s.phone],
      );
      storeIds.push(res.rows[0].id);
    }
    console.log('Seeded stores:', storeIds.length);

    // 4. Products
    const productsData = [
      {
        name: 'Organic Hass Avocados (2 pcs)',
        slug: 'organic-hass-avocados',
        description:
          'Ripe and ready-to-eat buttery Hass avocados sourced directly from organic orchards.',
        mrp: 5.99,
        sellingPrice: 4.49,
        images: [
          'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
        ],
        categoryId: categoryMap['fresh-produce'],
        unit: 'pack',
        weight: '350g',
      },
      {
        name: 'Hydroponic English Cucumber',
        slug: 'hydroponic-english-cucumber',
        description:
          'Crisp, seedless, pesticide-free fresh cucumber grown in temperature-controlled hydroponics.',
        mrp: 2.5,
        sellingPrice: 1.99,
        images: [
          'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80',
        ],
        categoryId: categoryMap['fresh-produce'],
        unit: 'piece',
        weight: '300g',
      },
      {
        name: 'Farm Fresh Organic Whole Milk',
        slug: 'farm-fresh-organic-whole-milk',
        description: 'Non-homogenized, pasture-raised A2 whole milk in glass bottle.',
        mrp: 4.2,
        sellingPrice: 3.5,
        images: [
          'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
        ],
        categoryId: categoryMap['dairy-eggs'],
        unit: 'bottle',
        weight: '1 Litre',
      },
      {
        name: 'Free-Range Brown Eggs (6 Pack)',
        slug: 'free-range-brown-eggs-6',
        description:
          'Grade A farm fresh brown eggs from hens fed a certified organic, non-GMO diet.',
        mrp: 4.5,
        sellingPrice: 3.8,
        images: [
          'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80',
        ],
        categoryId: categoryMap['dairy-eggs'],
        unit: 'pack',
        weight: '6 eggs',
      },
      {
        name: 'Artisanal Country Sourdough Batard',
        slug: 'artisanal-country-sourdough-batard',
        description: '36-hour slow fermented sourdough with a blistered crust and open crumb.',
        mrp: 6.99,
        sellingPrice: 5.5,
        images: [
          'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
        ],
        categoryId: categoryMap['bakery-bread'],
        unit: 'loaf',
        weight: '750g',
      },
      {
        name: 'Flaky French Butter Croissants (2 pcs)',
        slug: 'french-butter-croissants-2',
        description:
          'Traditional layered Viennoiserie baked daily with pure French Normandy butter.',
        mrp: 5.0,
        sellingPrice: 4.2,
        images: [
          'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
        ],
        categoryId: categoryMap['bakery-bread'],
        unit: 'pack',
        weight: '160g',
      },
      {
        name: 'Nitro Cold Brew Coffee Can',
        slug: 'nitro-cold-brew-coffee-can',
        description: 'Smooth, creamy Ethiopian single-origin cold brew infused with pure nitrogen.',
        mrp: 4.5,
        sellingPrice: 3.75,
        images: [
          'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
        ],
        categoryId: categoryMap['beverages'],
        unit: 'can',
        weight: '250ml',
      },
      {
        name: 'Roasted Truffle Sea Salt Almonds',
        slug: 'roasted-truffle-sea-salt-almonds',
        description:
          'California almonds slow dry-roasted with black summer truffles and French grey salt.',
        mrp: 8.5,
        sellingPrice: 6.99,
        images: [
          'https://images.unsplash.com/photo-1508061257970-57e3467614ec?auto=format&fit=crop&w=600&q=80',
        ],
        categoryId: categoryMap['snacks-munchies'],
        unit: 'jar',
        weight: '200g',
      },
    ];

    const productIds = [];
    for (const p of productsData) {
      const res = await client.query(
        `INSERT INTO products (
          id, name, slug, description, mrp, selling_price, images, category_id, unit, weight, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, NOW(), NOW()
        ) ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name, selling_price = EXCLUDED.selling_price
        RETURNING id, slug;`,
        [
          p.name,
          p.slug,
          p.description,
          p.mrp,
          p.sellingPrice,
          JSON.stringify(p.images),
          p.categoryId,
          p.unit,
          p.weight,
        ],
      );
      productIds.push(res.rows[0].id);
    }
    console.log('Seeded products:', productIds.length);

    // 5. Inventory: Assign stock for every product in every store
    let inventoryCount = 0;
    for (const storeId of storeIds) {
      for (const prodId of productIds) {
        await client.query(
          `INSERT INTO inventory (
            id, store_id, product_id, stock, is_visible, created_at, updated_at
          ) VALUES (
            gen_random_uuid(), $1, $2, 25, true, NOW(), NOW()
          ) ON CONFLICT (store_id, product_id) DO UPDATE SET stock = 25;`,
          [storeId, prodId],
        );
        inventoryCount++;
      }
    }
    console.log('Seeded inventory records:', inventoryCount);

    console.log('\nSeeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await client.end();
  }
}

seed();
