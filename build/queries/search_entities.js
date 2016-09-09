// Generated by CoffeeScript 1.10.0
(function() {
  var buildUrl, isPlainObject;

  buildUrl = require('../utils/build_url');

  isPlainObject = require('../utils/utils').isPlainObject;

  module.exports = function(search, language, limit, format, uselang) {
    var ref;
    if (isPlainObject(search)) {
      ref = search, search = ref.search, language = ref.language, limit = ref.limit, format = ref.format, uselang = ref.uselang;
    }
    if (!((search != null ? search.length : void 0) > 0)) {
      throw new Error("search can't be empty");
    }
    language || (language = 'en');
    uselang || (uselang = language);
    limit || (limit = '20');
    format || (format = 'json');
    return buildUrl('wikidata', {
      action: 'wbsearchentities',
      search: search,
      language: language,
      limit: limit,
      format: format,
      uselang: uselang
    });
  };

}).call(this);
