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
        address: "1 ABC St",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 39.8937,
        lng: -125.9823647,
        name: "Quaint getaway cabin",
        description: "A tranquil contemplative nature retreat, in a magnificent setting surrounded by a creek, meadow and woodlands. You’ll love this place because of the light, the comfy beds and the location.",
        price: 250,
        avgRating: 4.95
      },
      {
        ownerId: 2,
        address: "2 DEF St",
        city: "Oakdale",
        state: "California",
        country: "United States of America",
        lat: 40.1248793,
        lng: -130.1238394,
        name: "Zen House on 15 acres",
        description: "Surrounded by redwood trees inside & out, on an amazingly unique property full of wonders.",
        price: 450,
        avgRating: 4.97
      },
      {
        ownerId: 3,
        address: "3 GHI St",
        city: "Felton",
        state: "California",
        country: "United States of America",
        lat: 60.0834212,
        lng: -170.123074,
        name: "Whiskey Hollow, A Cozy Cabin in the Redwoods",
        description: "Whiskey Hollow is a true get-away! Wake up to bird song through the skylights, lounge on the deck under the redwoods with a cup of coffee, luxuriate in the oversized bathtub with candles, and cozy up in front of the wood fireplace.",
        price: 300,
        avgRating: 4.93
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