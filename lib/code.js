'use strict';

var fs = require('fs');
var path = require('path');
var block = require('to-gfm-code-block');
var html = require('./utils/html');
var obj = require('./object');

/**
 * Expose `helpers`
 */

var helpers = module.exports;

/**
 * Embed code from an external file as preformatted text.
 *
 * ```js
 * {{embed 'path/to/file.js'}}
 *
 * // specify the language to use
 * {{embed 'path/to/file.hbs' 'html')}}
 * ```
 *
 * @param {String} `fp` filepath to the file to embed.
 * @param {String} `language` Optionally specify the language to use for syntax highlighting.
 * @return {String}
 * @api public
 */

helpers.embed = function embed(fp, ext) {
  ext = typeof ext !== 'string'
    ? path.extname(fp).slice(1)
    : ext;

  var code = fs.readFileSync(fp, 'utf8');
  if (ext === 'markdown' || ext === 'md') {
    ext = 'markdown';
    // if the string is markdown, escape backticks
    code = code.split('`').join('&#x60');
  }
  return block(code, ext).trim() + '\n';
};

/**
 * Generate the HTML for a jsFiddle link with the given `params`
 *
 * ```js
 * {{jsfiddle id="0dfk10ks" tabs="true"}}
 * ```
 *
 * @param {Object} `params`
 * @return {String}
 * @api public
 */

helpers.jsfiddle = function jsFiddle(attr, context) {
  attr = obj.merge({}, attr, attr.hash);
  delete attr.name;
  delete attr.hash;
  delete attr.data;

  if (!attr || !obj.isObject(attr)) return '';
  attr.id = 'http://jsfiddle.net/' + (attr.id || '');
  attr.width = attr.width || '100%';
  attr.height = attr.height || '300';
  attr.skin = attr.skin || '/presentation/';
  attr.tabs = (attr.tabs || 'result,js,html,css') + attr.skin;
  attr.src = attr.id + '/embedded/' + attr.tabs;
  attr.allowfullscreen = attr.allowfullscreen || 'allowfullscreen';
  attr.frameborder = attr.frameborder || '0';

  delete attr.tabs;
  delete attr.skin;
  delete attr.id;
  return '<iframe ' + html.parseAttributes(attr) + '></iframe>';
};