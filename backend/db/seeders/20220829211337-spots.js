'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: "123 ABC St",
        city: "Beverly Hills",
        state: "California",
        country: "United States of America",
        lat: 34.0736,
        lng: 118.4004,
        name: "Beverly Hills Mansion",
        description: "Private, gated French country chateau-inspired home sits at the end of a cul de sac on nearly 2 acres of land and is surrounded by stately trees, mature landscaping, and verdant canyon views.",
        price: 2500,
      },
      {
        ownerId: 1,
        address: "000 XYZ Ave",
        city: "Big Bear",
        state: "California",
        country: "United States of America",
        lat: 34.2439,
        lng: 116.9114,
        name: "Luxury Cabin in the Woods",
        description: "A tranquil contemplative nature retreat, in a magnificent setting surrounded by a creek, meadow and woodlands. You’ll love this place because of the light, the comfy beds and the location.",
        price: 2000,
      },
      {
        ownerId: 2,
        address: "456 DEF St",
        city: "Oakdale",
        state: "California",
        country: "United States of America",
        lat: 40.1248793,
        lng: -130.1238394,
        name: "Zen Lux Treehouse on 45 acres",
        description: "Surrounded by redwood trees inside & out, on an amazingly unique property full of wonders.",
        price: 4500,
      },
      {
        ownerId: 3,
        address: "789 GHI Ln",
        city: "Felton",
        state: "California",
        country: "United States of America",
        lat: 60.0834212,
        lng: -170.123074,
        name: "Whiskey Hollow, A High End Cabin in the Redwoods",
        description: "Whiskey Hollow is a true get-away! Wake up to bird song through the skylights, and lounge on the deck under the redwoods with a cup of coffee.",
        price: 3000,
      },
      {
        ownerId: 3,
        address: "012 JKL St",
        city: "Napa Valley",
        state: "California",
        country: "United States of America",
        lat: 38.5025,
        lng: 122.2654,
        name: "Luxury stay in Napa",
        description: "It doesn’t get any better than this stately boutique hotel in the heart of Napa. 17 ensuite bedrooms, a full-time staff, and an expertly manicured estate are ready to cater to your every whim.",
        price: 12000,
      },
      {
        ownerId: 1,
        address: "345 MNO Ave",
        city: "Dillon",
        state: "California",
        country: "United States of America",
        lat: 45.2166,
        lng: 112.6389,
        name: "Sky House - Boutique Modern Villa",
        description: "Shades of blue from powder to periwinkle echo the hues of the scenery outside this futuristic hillside villa on the California coast.",
        price: 2485,
      },
      {
        ownerId: 1,
        address: "678 PQR Ct",
        city: "Carnelian Bay",
        state: "California",
        country: "United States of America",
        lat: 39.2269,
        lng: 120.0819,
        name: "Tewesi Manor, Classic Tahoe manor near Carnelian Bay",
        description: "A private pier, swim platform, and fire pit fill 200 feet of lake frontage at this secluded villa built in the mold of a classic Old Tahoe manor.",
        price: 4000,
      },
      {
        ownerId: 3,
        address: "901 STU St",
        city: "Calistoga",
        state: "California",
        country: "United States of America",
        lat: 38.5788,
        lng: 122.5797,
        name: "Casa Acantilado",
        description: "Vineyards and state parks sprawl around this porch-lined Calistoga home. Outdoor sitting and dining areas are tucked into gardens off the porch, and there’s a patio with a pool and hot tub.",
        price: 5200,
      },
      {
        ownerId: 2,
        address: "234 VWX Ave",
        city: "Santa Rose",
        state: "California",
        country: "United States of America",
        lat: 38.4404,
        lng: 122.7141,
        name: "Iconia: Historic Mansion",
        description: "Experience the ideas and principles of Frank Lloyd Wright's modern architecture in this grand mansion overlooking the hills of Sonoma.",
        price: 2110,
      },
      {
        ownerId: 2,
        address: "567 YZA Ln",
        city: "Del Monte Forest",
        state: "California",
        country: "United States of America",
        lat: 36.5863,
        lng: -121.9475,
        name: "Pebble Beach Guest House",
        description: "Pebble Beach guest house located in the quiet Del Monte Forest, a golf destination and gated community.",
        price: 3370,
      },
      {
        ownerId: 2,
        address: "890 BCD St",
        city: "Geyserville",
        state: "California",
        country: "United States of America",
        lat: 38.7075,
        lng: 122.9028,
        name: "Luxurious Wine Country Estate",
        description: "Fully renovated Iconic Victorian estate built Circa 1870. Situated on a level acre, a short walk to some of the finest dining and wine tasting. ",
        price: 3500,
      },
      {
        ownerId: 1,
        address: "112 EFG Ave",
        city: "Castro Valley",
        state: "California",
        country: "United States of America",
        lat: 37.6955,
        lng: 122.0739,
        name: "The Ranch at Castro Valley",
        description: "Beautiful, private home with 7 bedrooms/5 baths located on nearly 150 densely forested acres. Stunning views of the canyon and a charming creek sweeping through the property.",
        price: 1200,
      },
      {
        ownerId: 2,
        address: "334 HIJ Ln",
        city: "Malibu",
        state: "California",
        country: "United States of America",
        lat: 34.0259,
        lng: 118.7798,
        name: "Malibu Dream Resort",
        description: "Boasting with trickling waterfalls, weeping greenery, and flowing branches decorated with fairy lights, The Malibu Dream Resort is in a class of its own.",
        price: 14300,
      },
      {
        ownerId: 1,
        address: "556 KLM St",
        city: "Skyforest",
        state: "California",
        country: "United States of America",
        lat: 34.2355,
        lng: 117.1794,
        name: "Castle in the Forest",
        description: "Surrounded by towering pine and dogwood trees, this secluded 10,000 square foot chateau provides an unforgettable intimate setting for your stay.",
        price: 3450,
      },
      {
        ownerId: 1,
        address: "778 NOP Ave",
        city: "Big Bear",
        state: "California",
        country: "United States of America",
        lat: 34.2439,
        lng: 116.9114,
        name: "Tranquility Lodge",
        description: "This breathe-taking home is located in the sought after Castle Glen Neighborhood of Big Bear.",
        price: 5260,
      },
      {
        ownerId: 3,
        address: "990 QRS Ln",
        city: "Agoura Hills",
        state: "California",
        country: "United States of America",
        lat: 34.1533,
        lng: 118.7617,
        name: "Stunning Spanish Villa",
        description: "Privately nestled in the horse community of Old Agoura, this stunning 5,000 sq ft villa, on a ½ acre lot, overlooks lush oak hills, and has its own vineyard. ",
        price: 3895,
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Spots')
  }
};
