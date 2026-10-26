const Therapist = require('../models/Therapist');

const generateSlug = async (name) => {
  let baseSlug = name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  let slug = baseSlug;
  let counter = 1;
  while (await Therapist.findOne({ slug })) {
    slug = baseSlug + '-' + counter;
    counter++;
  }
  return slug;
};

module.exports = generateSlug;
