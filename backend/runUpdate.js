const { updateBikeImages } = require('./utils/updateBikeImages');

updateBikeImages()
  .then(() => {
    console.log('Update finished.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
