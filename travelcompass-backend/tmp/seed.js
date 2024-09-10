const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Provider = require('../models/Provider');
const Adventure = require('../models/Adventure');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const connectDB = async () => {
  await mongoose.connect('mongodb://localhost:27017/travelcompass', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const clearDB = async () => {
  await User.deleteMany({});
  await Provider.deleteMany({});
  await Adventure.deleteMany({});
  await Booking.deleteMany({});
  await Review.deleteMany({});
};

const createUsers = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    { name: 'John Doe', email: 'john@example.com', password: hashedPassword, roles: ['user'], isAdmin: false },
    { name: 'Jane Smith', email: 'jane@example.com', password: hashedPassword, roles: ['provider'], isAdmin: true },
    { name: 'Super Admin', email: 'admin@example.com', password: hashedPassword, isSuperAdmin: true, roles: ['admin'] },
    { name: 'Alice Johnson', email: 'alice@example.com', password: hashedPassword, roles: ['user'], isAdmin: false },
    { name: 'Bob Brown', email: 'bob@example.com', password: hashedPassword, roles: ['provider'], isAdmin: true },
  ];

  return await User.insertMany(users);
};

const createProviders = async (users) => {
  const providers = [
    { name: 'Mountain Adventures Co.', description: 'Leading provider of mountain treks and adventure tours.', contactEmail: 'contact@mountainadventures.com', contactPhone: '123-456-7890', user: users[1]._id },
    { name: 'Safari Expeditions Ltd.', description: 'Offering unforgettable safaris across Africa.', contactEmail: 'info@safariexpeditions.com', contactPhone: '987-654-3210', user: users[1]._id },
    { name: 'Oceanic Adventures', description: 'Specializing in oceanic and marine adventures.', contactEmail: 'info@oceanicadventures.com', contactPhone: '555-555-5555', user: users[4]._id },
  ];

  return await Provider.insertMany(providers);
};

const createAdventures = async (providers) => {
  const adventures = [
    { title: 'Mount Everest Base Camp Trek', description: 'A 12-day trek to the base of the highest mountain in the world.', activityTypes: ['Trekking', 'Hiking', 'Mountaineering'], price: 1200, availability: [{ startDate: new Date(), endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000) }], location: 'Nepal', difficulty: 'Challenging', duration: 12, provider: providers[0]._id, photos: ['https://images.unsplash.com/photo-1504851149312-7a075b496cc7?q=80&w=1905&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://plus.unsplash.com/premium_photo-1721886880297-4490c951b95a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://plus.unsplash.com/premium_photo-1686090450488-48ce19426bbe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8TW91bnQlMjBFdmVyZXN0JTIwQmFzZSUyMENhbXAlMjBUcmVrfGVufDB8fDB8fHww'] },
    { title: 'Serengeti Safari', description: 'A 7-day safari adventure through the Serengeti plains.', activityTypes: ['Wildlife Safari', 'Photography'], price: 3000, availability: [{ startDate: new Date(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }], location: 'Tanzania', difficulty: 'Moderate', duration: 7, provider: providers[1]._id, photos: ['https://images.unsplash.com/photo-1602410132231-9e6c692e02db?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8U2VyZW5nZXRpJTIwU2FmYXJpfGVufDB8fDB8fHww', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fFNlcmVuZ2V0aSUyMFNhZmFyaXxlbnwwfHwwfHx8MA%3D%3D', 'https://images.unsplash.com/photo-1602410125631-7e736e36797c?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'] },
    { title: 'Yoga and Meditation Retreat', description: 'A peaceful retreat for relaxation and mindfulness.', activityTypes: ['Yoga', 'Meditation'], price: 800, availability: [{ startDate: new Date(), endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }], location: 'Bali, Indonesia', difficulty: 'Easy', duration: 5, provider: providers[0]._id, photos: ['https://plus.unsplash.com/premium_photo-1713720412484-2629861393f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8WW9nYSUyMGFuZCUyME1lZGl0YXRpb24lMjBSZXRyZWF0fGVufDB8fDB8fHww', 'https://images.unsplash.com/photo-1510034141778-a4d065653d92?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fFlvZ2ElMjBhbmQlMjBNZWRpdGF0aW9uJTIwUmV0cmVhdHxlbnwwfHwwfHx8MA%3D%3D', 'https://images.unsplash.com/photo-1552206735-e18f41fe76de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fFlvZ2ElMjBhbmQlMjBNZWRpdGF0aW9uJTIwUmV0cmVhdHxlbnwwfHwwfHx8MA%3D%3D', 'https://images.unsplash.com/photo-1561049501-e1f96bdd98fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8WW9nYSUyMGFuZCUyME1lZGl0YXRpb24lMjBSZXRyZWF0fGVufDB8fDB8fHww'] },
    { title: 'Sahara Desert Camel Trek', description: 'Experience the vastness of the Sahara Desert on a camel trek.', activityTypes: ['Trekking', 'Camping', 'Photography'], price: 1500, availability: [{ startDate: new Date(), endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000) }], location: 'Morocco', difficulty: 'Moderate', duration: 8, provider: providers[0]._id, photos: ['https://plus.unsplash.com/premium_photo-1661933991242-e7ee3a948e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8U2FoYXJhJTIwRGVzZXJ0JTIwQ2FtZWwlMjBUcmVrfGVufDB8fDB8fHww', 'https://plus.unsplash.com/premium_photo-1697729969603-1155a03ee785?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fFNhaGFyYSUyMERlc2VydCUyMENhbWVsJTIwVHJla3xlbnwwfHwwfHx8MA%3D%3D', 'https://images.unsplash.com/photo-1539571711714-62cd2534f96e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fFNhaGFyYSUyMERlc2VydCUyMENhbWVsJTIwVHJla3xlbnwwfHwwfHx8MA%3D%3D'] },
    { title: 'Galapagos Islands Cruise', description: 'Explore the unique wildlife of the Galapagos Islands on a luxury cruise.', activityTypes: ['Sightseeing', 'Photography', 'Snorkeling'], price: 5000, availability: [{ startDate: new Date(), endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) }], location: 'Ecuador', difficulty: 'Easy', duration: 10, provider: providers[1]._id, photos: ['https://images.unsplash.com/photo-1500687834377-1388ec3c5991?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEdhbGFwYWdvcyUyMElzbGFuZHMlMjBDcnVpc2V8ZW58MHx8MHx8fDA%3D', 'https://images.unsplash.com/photo-1504434026032-a7e440a30b68?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEdhbGFwYWdvcyUyMElzbGFuZHMlMjBDcnVpc2V8ZW58MHx8MHx8fDA%3D', 'https://images.unsplash.com/photo-1556645077-67f8cd93e08c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8R2FsYXBhZ29zJTIwSXNsYW5kcyUyMENydWlzZXxlbnwwfHwwfHx8MA%3D%3D'] },
    { title: 'Antarctic Expedition', description: 'Embark on a once-in-a-lifetime expedition to the icy continent of Antarctica.', activityTypes: ['Sightseeing', 'Photography', 'Wildlife Safari'], price: 12000, availability: [{ startDate: new Date(), endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }], location: 'Antarctica', difficulty: 'Challenging', duration: 14, provider: providers[0]._id, photos: ['https://images.unsplash.com/photo-1544947996-22a898be00d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8QW50YXJjdGljJTIwRXhwZWRpdGlvbnxlbnwwfHwwfHx8MA%3D%3D', 'https://plus.unsplash.com/premium_photo-1672234253962-f1244e5565d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8QW50YXJjdGljJTIwRXhwZWRpdGlvbnxlbnwwfHwwfHx8MA%3D%3D', 'https://images.unsplash.com/photo-1582036743525-de5e24c460f6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEFudGFyY3RpYyUyMEV4cGVkaXRpb258ZW58MHx8MHx8fDA%3D', 'https://plus.unsplash.com/premium_photo-1664304481949-7342698006f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fEFudGFyY3RpYyUyMEV4cGVkaXRpb258ZW58MHx8MHx8fDA%3D'] },
    { title: 'Machu Picchu Hike', description: 'Hike the famous Inca Trail to the ancient city of Machu Picchu.', activityTypes: ['Hiking', 'Cultural Tour', 'Photography'], price: 2000, availability: [{ startDate: new Date(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }], location: 'Peru', difficulty: 'Challenging', duration: 7, provider: providers[1]._id, photos: ['https://images.unsplash.com/photo-1717801556175-3a22bd4a0360?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fE1hY2h1JTIwUGljY2h1JTIwSGlrZXxlbnwwfHwwfHx8MA%3D%3D', 'https://images.unsplash.com/photo-1715478856457-fd10b38317d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA1fHxNYWNodSUyMFBpY2NodSUyMEhpa2V8ZW58MHx8MHx8fDA%3D', 'https://images.unsplash.com/photo-1539878335376-f5cf3ff323ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTcwfHxNYWNodSUyMFBpY2NodSUyMEhpa2V8ZW58MHx8MHx8fDA%3D' ] },
    { title: 'Northern Lights Tour', description: 'Witness the breathtaking Northern Lights in the Arctic Circle.', activityTypes: ['Sightseeing', 'Photography', 'Camping'], price: 1800, availability: [{ startDate: new Date(), endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }], location: 'Norway', difficulty: 'Moderate', duration: 5, provider: providers[0]._id, photos: ['https://plus.unsplash.com/premium_photo-1672234327063-b43b0a5c3ea0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fE5vcnRoZXJuJTIwTGlnaHRzJTIwVG91cnxlbnwwfHwwfHx8MA%3D%3D', 'https://plus.unsplash.com/premium_photo-1725404431371-c727f606a1bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fE5vcnRoZXJuJTIwTGlnaHRzJTIwVG91cnxlbnwwfHwwfHx8MA%3D%3D', 'https://images.unsplash.com/photo-1588171963482-fcb2dfb1739a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTF8fE5vcnRoZXJuJTIwTGlnaHRzJTIwVG91cnxlbnwwfHwwfHx8MA%3D%3D'] },
    { title: 'Great Barrier Reef Diving', description: 'Dive into the world\'s largest coral reef system.', activityTypes: ['Scuba Diving', 'Snorkeling'], price: 2500, availability: [{ startDate: new Date(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }], location: 'Australia', difficulty: 'Moderate', duration: 7, provider: providers[2]._id, photos: ['https://plus.unsplash.com/premium_photo-1661265851801-e523847e3932?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8R3JlYXQlMjBCYXJyaWVyJTIwUmVlZiUyMERpdmluZ3xlbnwwfHwwfHx8MA%3D%3D', 'https://plus.unsplash.com/premium_photo-1661889099855-b44dc39e88c9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fEdyZWF0JTIwQmFycmllciUyMFJlZWYlMjBEaXZpbmd8ZW58MHx8MHx8fDA%3D', 'https://plus.unsplash.com/premium_photo-1661812071978-771a70ca1516?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fEdyZWF0JTIwQmFycmllciUyMFJlZWYlMjBEaXZpbmd8ZW58MHx8MHx8fDA%3D'] },
    { title: 'Amazon Rainforest Expedition', description: 'Explore the diverse ecosystem of the Amazon Rainforest.', activityTypes: ['Hiking', 'Wildlife Safari', 'Photography'], price: 3500, availability: [{ startDate: new Date(), endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) }], location: 'Brazil', difficulty: 'Challenging', duration: 10, provider: providers[2]._id, photos: ['https://plus.unsplash.com/premium_photo-1664302947204-71f829a23da3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fEFtYXpvbiUyMFJhaW5mb3Jlc3QlMjBFeHBlZGl0aW9ufGVufDB8fDB8fHww', 'https://plus.unsplash.com/premium_photo-1687428554453-357a0bfcd46f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fEFtYXpvbiUyMFJhaW5mb3Jlc3QlMjBFeHBlZGl0aW9ufGVufDB8fDB8fHww', 'https://plus.unsplash.com/premium_photo-1724695601401-81126d8fce71?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzd8fEFtYXpvbiUyMFJhaW5mb3Jlc3QlMjBFeHBlZGl0aW9ufGVufDB8fDB8fHww'] },
  ];

  return await Adventure.insertMany(adventures);
};

const createBookings = async (adventures, users, providers) => {
  const bookings = [
    { adventure: adventures[0]._id, user: users[0]._id, provider: providers[0]._id, date: new Date(), totalAmount: 1200, paymentIntentId: 'pi_1', status: 'confirmed', paymentStatus: 'paid' },
    { adventure: adventures[1]._id, user: users[0]._id, provider: providers[1]._id, date: new Date(), totalAmount: 3000, paymentIntentId: 'pi_2', status: 'pending', paymentStatus: 'unpaid' },
    { adventure: adventures[2]._id, user: users[3]._id, provider: providers[0]._id, date: new Date(), totalAmount: 800, paymentIntentId: 'pi_3', status: 'confirmed', paymentStatus: 'paid' },
    { adventure: adventures[3]._id, user: users[3]._id, provider: providers[0]._id, date: new Date(), totalAmount: 1500, paymentIntentId: 'pi_4', status: 'confirmed', paymentStatus: 'paid' },
  ];

  return await Booking.insertMany(bookings);
};

const createReviews = async (adventures, users) => {
  const reviews = [
    { user: users[0]._id, adventure: adventures[0]._id, rating: 5, comment: 'Incredible experience, highly recommend!' },
    { user: users[0]._id, adventure: adventures[1]._id, rating: 4, comment: 'Amazing safari, saw so many animals!' },
    { user: users[1]._id, adventure: adventures[2]._id, rating: 5, comment: 'Very relaxing and rejuvenating retreat.' },
    { user: users[1]._id, adventure: adventures[3]._id, rating: 4, comment: 'Great experience, but the desert heat was intense.' },
    { user: users[0]._id, adventure: adventures[4]._id, rating: 5, comment: 'The cruise was luxurious and the wildlife was incredible.' },
    { user: users[0]._id, adventure: adventures[5]._id, rating: 5, comment: 'A once-in-a-lifetime experience, highly recommend!' },
    { user: users[1]._id, adventure: adventures[6]._id, rating: 4, comment: 'The hike was challenging but worth it for the views.' },
    { user: users[1]._id, adventure: adventures[7]._id, rating: 5, comment: 'The Northern Lights were breathtaking, an unforgettable trip.' },
    { user: users[3]._id, adventure: adventures[8]._id, rating: 5, comment: 'The diving experience was out of this world!' },
    { user: users[3]._id, adventure: adventures[9]._id, rating: 5, comment: 'The Amazon Rainforest was an adventure of a lifetime!' },
  ];

  return await Review.insertMany(reviews);
};

const updateAdventures = async (adventures, bookings, reviews) => {
  adventures[0].reviews.push(reviews[0]._id);
  adventures[0].bookingHistory.push(bookings[0]._id);
  await adventures[0].save();

  adventures[1].reviews.push(reviews[1]._id);
  adventures[1].bookingHistory.push(bookings[1]._id);
  await adventures[1].save();

  adventures[2].reviews.push(reviews[2]._id);
  adventures[2].bookingHistory.push(bookings[2]._id);
  await adventures[2].save();

  adventures[3].reviews.push(reviews[3]._id);
  adventures[3].bookingHistory.push(bookings[3]._id);
  await adventures[3].save();

  adventures[4].reviews.push(reviews[4]._id);
  await adventures[4].save();

  adventures[5].reviews.push(reviews[5]._id);
  await adventures[5].save();

  adventures[6].reviews.push(reviews[6]._id);
  await adventures[6].save();

  adventures[7].reviews.push(reviews[7]._id);
  await adventures[7].save();

  adventures[8].reviews.push(reviews[8]._id);
  await adventures[8].save();

  adventures[9].reviews.push(reviews[9]._id);
  await adventures[9].save();
};

const updateProviders = async (providers, adventures, bookings) => {
  providers[0].adventures.push(adventures[0]._id, adventures[2]._id, adventures[3]._id);
  providers[0].bookingHistory.push(bookings[0]._id, bookings[2]._id, bookings[3]._id);
  await providers[0].save();

  providers[1].adventures.push(adventures[1]._id, adventures[4]._id, adventures[6]._id);
  providers[1].bookingHistory.push(bookings[1]._id);
  await providers[1].save();

  providers[2].adventures.push(adventures[8]._id, adventures[9]._id);
  await providers[2].save();
};

const updateUsers = async (users, adventures) => {
  users[0].savedAdventures.push(adventures[0]._id, adventures[1]._id);
  users[0].bookingHistory.push({ adventure: adventures[0]._id, date: new Date() });
  await users[0].save();

  users[3].savedAdventures.push(adventures[2]._id, adventures[3]._id);
  users[3].bookingHistory.push({ adventure: adventures[2]._id, date: new Date() });
  await users[3].save();
};

const seedDatabase = async () => {
  await connectDB();

  try {
    await clearDB();

    const users = await createUsers();
    const providers = await createProviders(users);
    const adventures = await createAdventures(providers);
    const bookings = await createBookings(adventures, users, providers);
    const reviews = await createReviews(adventures, users);

    await updateAdventures(adventures, bookings, reviews);
    await updateProviders(providers, adventures, bookings);
    await updateUsers(users, adventures);

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed script
seedDatabase();