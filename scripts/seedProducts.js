const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/database');
const Category = require('../models/Category');
const Product = require('../models/Product');

// Sample product data
const productsData = {
  mensClothes: [
    {
      name: 'Classic White Dress Shirt',
      description: 'Premium cotton dress shirt with button-down collar. Perfect for business and formal occasions.',
      price: 49.99,
      compareAtPrice: 69.99,
      sku: 'MC-SHIRT-001',
      stock: { quantity: 50, trackInventory: true, lowStockThreshold: 10 },
      tags: ['shirt', 'formal', 'business', 'cotton'],
      status: 'active',
      featured: true,
      rating: { average: 4.5, count: 120 },
    },
    {
      name: 'Slim Fit Denim Jeans',
      description: 'Comfortable slim-fit jeans made from premium denim. Perfect for casual wear.',
      price: 79.99,
      compareAtPrice: 99.99,
      sku: 'MC-JEANS-002',
      stock: { quantity: 75, trackInventory: true, lowStockThreshold: 10 },
      tags: ['jeans', 'denim', 'casual', 'slim-fit'],
      status: 'active',
      featured: true,
      rating: { average: 4.7, count: 200 },
    },
    {
      name: 'Cotton T-Shirt Pack (3 Pack)',
      description: 'Soft cotton t-shirts in assorted colors. Great for everyday wear.',
      price: 29.99,
      compareAtPrice: 39.99,
      sku: 'MC-TSHIRT-003',
      stock: { quantity: 100, trackInventory: true, lowStockThreshold: 10 },
      tags: ['tshirt', 'cotton', 'casual', 'pack'],
      status: 'active',
      rating: { average: 4.3, count: 150 },
    },
    {
      name: 'Wool Blend Blazer',
      description: 'Elegant wool blend blazer perfect for business meetings and formal events.',
      price: 149.99,
      compareAtPrice: 199.99,
      sku: 'MC-BLAZER-004',
      stock: { quantity: 30, trackInventory: true, lowStockThreshold: 10 },
      tags: ['blazer', 'formal', 'wool', 'business'],
      status: 'active',
      featured: true,
      rating: { average: 4.6, count: 85 },
    },
    {
      name: 'Cargo Pants',
      description: 'Durable cargo pants with multiple pockets. Ideal for outdoor activities.',
      price: 59.99,
      compareAtPrice: 79.99,
      sku: 'MC-CARGO-005',
      stock: { quantity: 60, trackInventory: true, lowStockThreshold: 10 },
      tags: ['pants', 'cargo', 'outdoor', 'durable'],
      status: 'active',
      rating: { average: 4.4, count: 95 },
    },
    {
      name: 'Hooded Sweatshirt',
      description: 'Warm and comfortable hooded sweatshirt. Perfect for cool weather.',
      price: 44.99,
      compareAtPrice: 59.99,
      sku: 'MC-HOODIE-006',
      stock: { quantity: 80, trackInventory: true, lowStockThreshold: 10 },
      tags: ['sweatshirt', 'hoodie', 'warm', 'casual'],
      status: 'active',
      rating: { average: 4.5, count: 180 },
    },
    {
      name: 'Chino Pants',
      description: 'Classic chino pants in various colors. Versatile for both casual and semi-formal wear.',
      price: 54.99,
      compareAtPrice: 74.99,
      sku: 'MC-CHINO-007',
      stock: { quantity: 65, trackInventory: true, lowStockThreshold: 10 },
      tags: ['pants', 'chino', 'casual', 'versatile'],
      status: 'active',
      rating: { average: 4.6, count: 110 },
    },
    {
      name: 'Polo Shirt',
      description: 'Classic polo shirt made from premium pique cotton. Perfect for smart casual occasions.',
      price: 39.99,
      compareAtPrice: 54.99,
      sku: 'MC-POLO-008',
      stock: { quantity: 90, trackInventory: true, lowStockThreshold: 10 },
      tags: ['polo', 'shirt', 'casual', 'cotton'],
      status: 'active',
      rating: { average: 4.4, count: 140 },
    },
    {
      name: 'Leather Jacket',
      description: 'Genuine leather jacket with quilted lining. Stylish and warm.',
      price: 199.99,
      compareAtPrice: 299.99,
      sku: 'MC-LEATHER-009',
      stock: { quantity: 25, trackInventory: true, lowStockThreshold: 10 },
      tags: ['jacket', 'leather', 'warm', 'stylish'],
      status: 'active',
      featured: true,
      rating: { average: 4.8, count: 75 },
    },
    {
      name: 'Track Pants',
      description: 'Comfortable track pants with elastic waistband. Perfect for workouts and lounging.',
      price: 34.99,
      compareAtPrice: 49.99,
      sku: 'MC-TRACK-010',
      stock: { quantity: 70, trackInventory: true, lowStockThreshold: 10 },
      tags: ['pants', 'track', 'sport', 'comfortable'],
      status: 'active',
      rating: { average: 4.3, count: 100 },
    },
  ],
  womensClothes: [
    {
      name: 'Floral Summer Dress',
      description: 'Beautiful floral print summer dress. Lightweight and perfect for warm weather.',
      price: 59.99,
      compareAtPrice: 79.99,
      sku: 'WC-DRESS-001',
      stock: { quantity: 55, trackInventory: true, lowStockThreshold: 10 },
      tags: ['dress', 'floral', 'summer', 'casual'],
      status: 'active',
      featured: true,
      rating: { average: 4.6, count: 150 },
    },
    {
      name: 'Skinny Jeans',
      description: 'Comfortable skinny jeans with stretch fabric. Flattering fit for all body types.',
      price: 69.99,
      compareAtPrice: 89.99,
      sku: 'WC-JEANS-002',
      stock: { quantity: 80, trackInventory: true, lowStockThreshold: 10 },
      tags: ['jeans', 'skinny', 'stretch', 'casual'],
      status: 'active',
      featured: true,
      rating: { average: 4.7, count: 220 },
    },
    {
      name: 'Blouse with Ruffles',
      description: 'Elegant blouse with ruffled details. Perfect for office or special occasions.',
      price: 49.99,
      compareAtPrice: 69.99,
      sku: 'WC-BLOUSE-003',
      stock: { quantity: 60, trackInventory: true, lowStockThreshold: 10 },
      tags: ['blouse', 'ruffles', 'elegant', 'formal'],
      status: 'active',
      rating: { average: 4.5, count: 130 },
    },
    {
      name: 'Maxi Skirt',
      description: 'Flowing maxi skirt in various patterns. Comfortable and stylish.',
      price: 44.99,
      compareAtPrice: 64.99,
      sku: 'WC-SKIRT-004',
      stock: { quantity: 50, trackInventory: true, lowStockThreshold: 10 },
      tags: ['skirt', 'maxi', 'flowing', 'casual'],
      status: 'active',
      rating: { average: 4.4, count: 95 },
    },
    {
      name: 'Cardigan Sweater',
      description: 'Cozy cardigan sweater perfect for layering. Available in multiple colors.',
      price: 54.99,
      compareAtPrice: 74.99,
      sku: 'WC-CARDIGAN-005',
      stock: { quantity: 65, trackInventory: true, lowStockThreshold: 10 },
      tags: ['cardigan', 'sweater', 'warm', 'layering'],
      status: 'active',
      rating: { average: 4.6, count: 120 },
    },
    {
      name: 'Crop Top',
      description: 'Trendy crop top in various styles. Perfect for casual outings.',
      price: 29.99,
      compareAtPrice: 39.99,
      sku: 'WC-CROP-006',
      stock: { quantity: 75, trackInventory: true, lowStockThreshold: 10 },
      tags: ['top', 'crop', 'casual', 'trendy'],
      status: 'active',
      rating: { average: 4.3, count: 110 },
    },
    {
      name: 'Leggings (2 Pack)',
      description: 'Comfortable leggings perfect for workouts or casual wear. High-waisted design.',
      price: 34.99,
      compareAtPrice: 49.99,
      sku: 'WC-LEGGINGS-007',
      stock: { quantity: 90, trackInventory: true, lowStockThreshold: 10 },
      tags: ['leggings', 'sport', 'comfortable', 'pack'],
      status: 'active',
      rating: { average: 4.5, count: 180 },
    },
    {
      name: 'Blazer for Women',
      description: 'Professional blazer perfect for business attire. Tailored fit.',
      price: 89.99,
      compareAtPrice: 129.99,
      sku: 'WC-BLAZER-008',
      stock: { quantity: 40, trackInventory: true, lowStockThreshold: 10 },
      tags: ['blazer', 'formal', 'business', 'professional'],
      status: 'active',
      featured: true,
      rating: { average: 4.7, count: 100 },
    },
    {
      name: 'Wrap Dress',
      description: 'Elegant wrap dress that flatters all body types. Perfect for special occasions.',
      price: 64.99,
      compareAtPrice: 89.99,
      sku: 'WC-WRAP-009',
      stock: { quantity: 45, trackInventory: true, lowStockThreshold: 10 },
      tags: ['dress', 'wrap', 'elegant', 'formal'],
      status: 'active',
      featured: true,
      rating: { average: 4.6, count: 85 },
    },
    {
      name: 'Tank Top (3 Pack)',
      description: 'Comfortable tank tops in assorted colors. Great for layering or casual wear.',
      price: 24.99,
      compareAtPrice: 34.99,
      sku: 'WC-TANK-010',
      stock: { quantity: 100, trackInventory: true, lowStockThreshold: 10 },
      tags: ['tank', 'top', 'casual', 'pack'],
      status: 'active',
      rating: { average: 4.2, count: 140 },
    },
  ],
  childrensClothes: [
    {
      name: 'Kids T-Shirt Pack (5 Pack)',
      description: 'Colorful t-shirts for kids. Made from soft, child-friendly materials.',
      price: 19.99,
      compareAtPrice: 29.99,
      sku: 'CC-TSHIRT-001',
      stock: { quantity: 120, trackInventory: true, lowStockThreshold: 10 },
      tags: ['tshirt', 'kids', 'pack', 'colorful'],
      status: 'active',
      featured: true,
      rating: { average: 4.5, count: 200 },
    },
    {
      name: 'Children\'s Jeans',
      description: 'Durable jeans designed for active kids. Reinforced knees for extra durability.',
      price: 34.99,
      compareAtPrice: 49.99,
      sku: 'CC-JEANS-002',
      stock: { quantity: 85, trackInventory: true, lowStockThreshold: 10 },
      tags: ['jeans', 'kids', 'durable', 'active'],
      status: 'active',
      rating: { average: 4.6, count: 150 },
    },
    {
      name: 'Kids Hoodie',
      description: 'Warm and cozy hoodie for children. Fun designs and colors.',
      price: 29.99,
      compareAtPrice: 39.99,
      sku: 'CC-HOODIE-003',
      stock: { quantity: 95, trackInventory: true, lowStockThreshold: 10 },
      tags: ['hoodie', 'kids', 'warm', 'cozy'],
      status: 'active',
      rating: { average: 4.4, count: 130 },
    },
    {
      name: 'Children\'s Shorts',
      description: 'Comfortable shorts perfect for playtime. Elastic waistband for easy wear.',
      price: 22.99,
      compareAtPrice: 32.99,
      sku: 'CC-SHORTS-004',
      stock: { quantity: 110, trackInventory: true, lowStockThreshold: 10 },
      tags: ['shorts', 'kids', 'play', 'comfortable'],
      status: 'active',
      rating: { average: 4.3, count: 120 },
    },
    {
      name: 'Kids Dress',
      description: 'Adorable dress for little girls. Perfect for parties and special occasions.',
      price: 39.99,
      compareAtPrice: 54.99,
      sku: 'CC-DRESS-005',
      stock: { quantity: 70, trackInventory: true, lowStockThreshold: 10 },
      tags: ['dress', 'kids', 'party', 'special'],
      status: 'active',
      featured: true,
      rating: { average: 4.7, count: 100 },
    },
    {
      name: 'Children\'s Pajamas Set',
      description: 'Comfortable pajama set for bedtime. Soft and cozy materials.',
      price: 24.99,
      compareAtPrice: 34.99,
      sku: 'CC-PAJAMAS-006',
      stock: { quantity: 100, trackInventory: true, lowStockThreshold: 10 },
      tags: ['pajamas', 'kids', 'sleep', 'comfortable'],
      status: 'active',
      rating: { average: 4.5, count: 140 },
    },
    {
      name: 'Kids Sweater',
      description: 'Warm sweater for children. Fun patterns and colors.',
      price: 32.99,
      compareAtPrice: 44.99,
      sku: 'CC-SWEATER-007',
      stock: { quantity: 80, trackInventory: true, lowStockThreshold: 10 },
      tags: ['sweater', 'kids', 'warm', 'patterns'],
      status: 'active',
      rating: { average: 4.4, count: 110 },
    },
    {
      name: 'Children\'s Leggings',
      description: 'Stretchy leggings perfect for active kids. Available in various colors.',
      price: 18.99,
      compareAtPrice: 27.99,
      sku: 'CC-LEGGINGS-008',
      stock: { quantity: 105, trackInventory: true, lowStockThreshold: 10 },
      tags: ['leggings', 'kids', 'stretchy', 'active'],
      status: 'active',
      rating: { average: 4.3, count: 125 },
    },
    {
      name: 'Kids Jacket',
      description: 'Weather-resistant jacket for children. Perfect for outdoor activities.',
      price: 44.99,
      compareAtPrice: 64.99,
      sku: 'CC-JACKET-009',
      stock: { quantity: 60, trackInventory: true, lowStockThreshold: 10 },
      tags: ['jacket', 'kids', 'weather', 'outdoor'],
      status: 'active',
      featured: true,
      rating: { average: 4.6, count: 90 },
    },
    {
      name: 'Children\'s Romper',
      description: 'Cute romper for toddlers. Easy to wear and comfortable.',
      price: 27.99,
      compareAtPrice: 39.99,
      sku: 'CC-ROMPER-010',
      stock: { quantity: 75, trackInventory: true, lowStockThreshold: 10 },
      tags: ['romper', 'kids', 'toddler', 'comfortable'],
      status: 'active',
      rating: { average: 4.4, count: 95 },
    },
  ],
  shoes: [
    {
      name: 'Running Shoes',
      description: 'High-performance running shoes with cushioned sole. Perfect for jogging and workouts.',
      price: 89.99,
      compareAtPrice: 129.99,
      sku: 'SH-RUNNING-001',
      stock: { quantity: 50, trackInventory: true, lowStockThreshold: 10 },
      tags: ['shoes', 'running', 'sport', 'athletic'],
      status: 'active',
      featured: true,
      rating: { average: 4.7, count: 250 },
    },
    {
      name: 'Leather Dress Shoes',
      description: 'Classic leather dress shoes. Perfect for formal occasions and business attire.',
      price: 119.99,
      compareAtPrice: 179.99,
      sku: 'SH-DRESS-002',
      stock: { quantity: 40, trackInventory: true, lowStockThreshold: 10 },
      tags: ['shoes', 'dress', 'leather', 'formal'],
      status: 'active',
      featured: true,
      rating: { average: 4.6, count: 180 },
    },
    {
      name: 'Casual Sneakers',
      description: 'Comfortable casual sneakers for everyday wear. Stylish and versatile.',
      price: 69.99,
      compareAtPrice: 99.99,
      sku: 'SH-SNEAKERS-003',
      stock: { quantity: 80, trackInventory: true, lowStockThreshold: 10 },
      tags: ['shoes', 'sneakers', 'casual', 'versatile'],
      status: 'active',
      rating: { average: 4.5, count: 200 },
    },
    {
      name: 'High Heels',
      description: 'Elegant high heels perfect for special occasions. Comfortable heel height.',
      price: 79.99,
      compareAtPrice: 119.99,
      sku: 'SH-HEELS-004',
      stock: { quantity: 45, trackInventory: true, lowStockThreshold: 10 },
      tags: ['shoes', 'heels', 'elegant', 'formal'],
      status: 'active',
      featured: true,
      rating: { average: 4.4, count: 150 },
    },
    {
      name: 'Boots',
      description: 'Durable boots perfect for winter and outdoor activities. Water-resistant.',
      price: 99.99,
      compareAtPrice: 149.99,
      sku: 'SH-BOOTS-005',
      stock: { quantity: 55, trackInventory: true, lowStockThreshold: 10 },
      tags: ['shoes', 'boots', 'winter', 'durable'],
      status: 'active',
      rating: { average: 4.6, count: 170 },
    },
    {
      name: 'Sandals',
      description: 'Comfortable sandals perfect for summer. Breathable and lightweight.',
      price: 39.99,
      compareAtPrice: 59.99,
      sku: 'SH-SANDALS-006',
      stock: { quantity: 70, trackInventory: true, lowStockThreshold: 10 },
      tags: ['shoes', 'sandals', 'summer', 'comfortable'],
      status: 'active',
      rating: { average: 4.3, count: 140 },
    },
    {
      name: 'Kids Sneakers',
      description: 'Durable sneakers for children. Perfect for school and play.',
      price: 44.99,
      compareAtPrice: 64.99,
      sku: 'SH-KIDS-007',
      stock: { quantity: 90, trackInventory: true, lowStockThreshold: 10 },
      tags: ['shoes', 'kids', 'sneakers', 'durable'],
      status: 'active',
      rating: { average: 4.5, count: 160 },
    },
    {
      name: 'Athletic Shoes',
      description: 'Multi-purpose athletic shoes for various sports activities.',
      price: 84.99,
      compareAtPrice: 124.99,
      sku: 'SH-ATHLETIC-008',
      stock: { quantity: 60, trackInventory: true, lowStockThreshold: 10 },
      tags: ['shoes', 'athletic', 'sport', 'multi-purpose'],
      status: 'active',
      rating: { average: 4.6, count: 190 },
    },
    {
      name: 'Loafers',
      description: 'Classic loafers perfect for business casual attire. Comfortable and stylish.',
      price: 74.99,
      compareAtPrice: 109.99,
      sku: 'SH-LOAFERS-009',
      stock: { quantity: 50, trackInventory: true, lowStockThreshold: 10 },
      tags: ['shoes', 'loafers', 'business', 'casual'],
      status: 'active',
      rating: { average: 4.5, count: 120 },
    },
    {
      name: 'Flip Flops',
      description: 'Comfortable flip flops for beach and pool. Lightweight and easy to wear.',
      price: 19.99,
      compareAtPrice: 29.99,
      sku: 'SH-FLIP-010',
      stock: { quantity: 100, trackInventory: true, lowStockThreshold: 10 },
      tags: ['shoes', 'flip-flops', 'beach', 'casual'],
      status: 'active',
      rating: { average: 4.2, count: 110 },
    },
  ],
};

// Seed function
const seedProducts = async () => {
  try {
    // Connect to database
    await connectDB();

    // Create or get categories
    console.log('Creating categories...');
    const mensCategory = await Category.findOneAndUpdate(
      { name: "Men's Clothes" },
      {
        name: "Men's Clothes",
        slug: "mens-clothes",
        description: 'Clothing for men including shirts, pants, jackets, and more',
        status: 'active',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const womensCategory = await Category.findOneAndUpdate(
      { name: "Women's Clothes" },
      {
        name: "Women's Clothes",
        slug: "womens-clothes",
        description: 'Clothing for women including dresses, blouses, skirts, and more',
        status: 'active',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const childrensCategory = await Category.findOneAndUpdate(
      { name: "Children's Clothes" },
      {
        name: "Children's Clothes",
        slug: "childrens-clothes",
        description: 'Clothing for children including t-shirts, dresses, pajamas, and more',
        status: 'active',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const shoesCategory = await Category.findOneAndUpdate(
      { name: 'Shoes' },
      {
        name: 'Shoes',
        slug: 'shoes',
        description: 'Footwear for men, women, and children',
        status: 'active',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log('Categories created/updated successfully!');

    // Clear existing products (optional - comment out if you want to keep existing)
    // await Product.deleteMany({});

    // Add products
    console.log('Adding products...');

    // Men's Clothes
    for (const productData of productsData.mensClothes) {
      await Product.findOneAndUpdate(
        { sku: productData.sku },
        {
          ...productData,
          category: mensCategory._id,
        },
        { upsert: true, new: true }
      );
      console.log(`Added/Updated: ${productData.name}`);
    }

    // Women's Clothes
    for (const productData of productsData.womensClothes) {
      await Product.findOneAndUpdate(
        { sku: productData.sku },
        {
          ...productData,
          category: womensCategory._id,
        },
        { upsert: true, new: true }
      );
      console.log(`Added/Updated: ${productData.name}`);
    }

    // Children's Clothes
    for (const productData of productsData.childrensClothes) {
      await Product.findOneAndUpdate(
        { sku: productData.sku },
        {
          ...productData,
          category: childrensCategory._id,
        },
        { upsert: true, new: true }
      );
      console.log(`Added/Updated: ${productData.name}`);
    }

    // Shoes
    for (const productData of productsData.shoes) {
      await Product.findOneAndUpdate(
        { sku: productData.sku },
        {
          ...productData,
          category: shoesCategory._id,
        },
        { upsert: true, new: true }
      );
      console.log(`Added/Updated: ${productData.name}`);
    }

    console.log('\n✅ All products seeded successfully!');
    console.log(`Total: 40 products (10 in each category)`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run seed function
seedProducts();

