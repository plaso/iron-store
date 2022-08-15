const ApiService = require('../services/api.service');
const apiService = new ApiService();

module.exports.list = (req, res, next) => {
  apiService
    .getAllCharacters()
    .then((response) => {
      res.render("characters/list", { characters: response.data });
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
};

module.exports.details = (req, res, next) => {
  const { id } = req.params;

  apiService
    .getOneCharacter(id)
    .then((response) => {
      res.render("characters/details", { character: response.data });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};