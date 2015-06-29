/**
 * A little queue based on https://github.com/mapbox/basic-queue but
 * if you try to queue.add() a task already in the queue it will return
 * false and not add the task to the queue.
 */

var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter
var serialize = require('json-stable-stringify')
var unserialize = JSON.parse

module.exports = Queue

function Queue (worker, concurrency) {
  this.worker = worker
  this.concurrency = concurrency || 10
  this.add = this.add.bind(this)
  this.next = this.next.bind(this)
  this.invoke = this.invoke.bind(this)
  this.tasks = []
  this.callbacks = []
  this.running = 0
}

inherits(Queue, EventEmitter)

Queue.prototype.add = function (task, callback) {
  var serializedTask = serialize(task)

  if (this.tasks.indexOf(serializedTask) > -1) return false

  this.tasks.push(serializedTask)
  this.callbacks.push(callback)
  if (this.running < this.concurrency) {
    this.running++
    this.next()
  }
  return true
}

Queue.prototype.invoke = function () {
  if (this.tasks.length) {
    var callback = this.callbacks.shift()
    var task = unserialize(this.tasks.shift())
    this.worker(task, function () {
      callback.apply(global, arguments)
      this.next.apply(this, arguments)
    }.bind(this))
  } else {
    this.next()
  }
}

Queue.prototype.next = function () {
  if (this.tasks.length) {
    setTimeout(this.invoke, 0)
  } else {
    this.running--
    if (!this.running) {
      this.emit('empty')
    }
  }
}
