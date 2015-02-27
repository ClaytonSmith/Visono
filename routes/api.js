/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
  res.json({
      name: 'OMG, I FOUND THE API!! Look at this shit. I\'m a pimp',
      thing: 'look at this.'
  });
};
