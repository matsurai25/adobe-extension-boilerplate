/// <reference types="types-for-adobe/aftereffects/2018"/>
import * as CSInterface from '../../lib/CEP/CSInterface.js'
import {
  CSInterface as ICSInterface
} from 'csinterface-ts'

// CSInterfaceの注入
declare global {
  interface Window {
    CSInterface(): void
    cs: ICSInterface
  }
}

window.CSInterface = CSInterface
window.cs = new CSInterface() as ICSInterface

import 'reset-css'
import './vanilla.css'
import './main'
