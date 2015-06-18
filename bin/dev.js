#!/usr/bin/env node
var lrload = require('livereactload')

var app = require('budo')('index.jsx:bundle.js', {
    stream: process.stdout,
    transform: ['babelify', 'livereactload']
  })
  .watch() // watch for *.html, *.css
  .live()  // start LiveReload server for CSS/HTML
  .on('connect', function () {
    lrload.listen() // listen for HMR
  })
  .on('update', function () {
    lrload.notify()  // trigger HMR
  })
  .on('watch', function (ev, file) {
    app.reload(file) // trigger CSS injection / HTML reload
  })
