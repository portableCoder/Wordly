#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var ink_1 = require("ink");
var ui_1 = __importDefault(require("./ui"));
(0, ink_1.render)(react_1["default"].createElement(ui_1["default"], null));
