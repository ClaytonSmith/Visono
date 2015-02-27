ejs = require('ejs');

exports.index = function(req, res){
    console.log(res.params);
  res.render('index');
};


exports.partial = function (req, res) {
   console.log(res.params);
    var name = req.params.name;
    console.log(name);   
    res.render('partials/' + name );
};
