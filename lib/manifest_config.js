'use strict';
import config from '../config.js';

export default class {
  constructor(){
    this.version = config.version;
    this.name = config.name;
    this.bundleId = `${config.id}.${config.name}`;
    this.extensionId = `${this.bundleId}.${this.version}`;
  }
}
