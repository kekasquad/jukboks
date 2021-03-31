const EventEmitter = require('events');
const { Stream } = require('../models/Stream');

class Eventer extends EventEmitter {
  constructor() {
    this.pullInterval = 5;
    this.timeBefore = 60; // pull Streams that are due to start in less or eq than 60 sec

    this.start = this.start.bind(this);
    this.stop = this.stopt.bind(this);
    this.pull = this.pull.bind(this);
  }
  start() {
    this.pullTimeout = setInterval(this.pull, this.pullInterval)
    setImmediate(this.pull);
  }
  stop() {
    clearInterval(this.pullTimeout);
  }

  pull() {
    /**
     * Main logic for sending events
     * 
     * For Streams in status `SCHEDULED`:
     * 1. Pull soonest streams, i.e dt_start - now() <= this.timeBefore
     * 2. Set timers for firing `streamStarted` event
     * 3. Before firing an event, check that stream has not changed its state (?)
     * 4. On `streamStarted` event schedule timers for `song` event (send it 2s earlier?)
     */
  }
}

module.exports = { Eventer };
