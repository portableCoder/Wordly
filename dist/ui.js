"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importStar(require("react"));
var ink_1 = require("ink");
var random_words_1 = __importDefault(require("random-words"));
var keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];
var App = function () {
    var _a = (0, react_1.useState)([]), incorrectLetters = _a[0], setIncorrectLetters = _a[1];
    var _b = (0, react_1.useState)({
        won: false,
        completed: false
    }), game = _b[0], setGame = _b[1];
    var getRWord = function () {
        return (0, random_words_1["default"])({
            exactly: 1,
            maxLength: 5
        })[0].toUpperCase();
    };
    var word = (0, react_1.useState)(function () {
        var rword = getRWord();
        while (rword.length !== 5) {
            rword = getRWord();
        }
        return rword;
    })[0];
    var exit = (0, ink_1.useApp)().exit;
    var _c = (0, react_1.useState)(function () {
        var arr = [];
        for (var index = 0; index < 6; index++) {
            var arr_temp = [];
            for (var j = 0; j < 5; j++) {
                arr_temp.push({ bgColor: null, letter: '' });
            }
            arr.push(arr_temp);
        }
        return arr;
    }), wordMatrix = _c[0], setWordMatrix = _c[1];
    (0, ink_1.useInput)(function (input, key) {
        input = input.toUpperCase();
        if (key["return"]) {
            var c = currentRowCol.c, r = currentRowCol.r;
            var wMatrix = __spreadArray([], wordMatrix, true);
            var wordArr_1 = word.split('');
            var arr_1 = wMatrix[r];
            var potentialArr_1 = [];
            arr_1.forEach(function (l, i) {
                var letter = l.letter;
                var letterRandom = wordArr_1[i];
                if (letter === letterRandom) {
                    l.bgColor = 'green';
                    arr_1[i] = l;
                    potentialArr_1.forEach(function (el) {
                        if (el.index !== i && el.descriptor.letter === l.letter) {
                            arr_1[el.index] = __assign(__assign({}, el.descriptor), { bgColor: 'gray' });
                            setIncorrectLetters(function (prev) { return __spreadArray(__spreadArray([], prev, true), [el.descriptor.letter], false); });
                        }
                    });
                }
                else if (wordArr_1.find(function (rnd) { return rnd === letter; })) {
                    l.bgColor = "yellow";
                    arr_1[i] = l;
                    potentialArr_1.push({ descriptor: l, index: i });
                }
                else {
                    setIncorrectLetters(function (prev) { return __spreadArray(__spreadArray([], prev, true), [letter], false); });
                    l.bgColor = "gray";
                    arr_1[i] = l;
                }
            });
            wMatrix[r] = __spreadArray([], arr_1, true);
            setWordMatrix(__spreadArray([], wMatrix, true));
            var correctAnswers = arr_1.filter(function (ar) { return ar.bgColor === "green"; }).length;
            if (correctAnswers === 5) {
                setGame(function (prev) {
                    return __assign(__assign({}, prev), { completed: true, won: true });
                });
                exit();
            }
            r += 1;
            c = 0;
            if (r > 5) {
                var correctAnswers_1 = wordMatrix[5].filter(function (ar) { return ar.bgColor === "green"; }).length;
                if (correctAnswers_1 < 5) {
                    setGame(function (prev) {
                        return __assign(__assign({}, prev), { completed: true, won: false });
                    });
                }
                else if (correctAnswers_1 === 5) {
                    setGame(function (prev) {
                        return __assign(__assign({}, prev), { completed: true, won: true });
                    });
                }
                exit();
            }
            setCurrentRowCol({ c: c, r: r });
        }
        else if (key.backspace) {
            var currArr_1 = __spreadArray([], wordMatrix, true);
            var c = currentRowCol.c, r = currentRowCol.r;
            currArr_1[r][c] = __assign(__assign({}, currArr_1[r][c]), { letter: '' });
            if (c !== 0)
                c -= 1;
            setWordMatrix(function () { return __spreadArray([], currArr_1, true); });
            setCurrentRowCol({ c: c, r: r });
        }
        else if (input === keyboard.flat().find(function (el) { return el === input; })) {
            var currArr_2 = __spreadArray([], wordMatrix, true);
            var c = currentRowCol.c, r = currentRowCol.r;
            currArr_2[r][c] = __assign(__assign({}, currArr_2[r][c]), { letter: input });
            if (c + 1 > 4) {
                c = 4;
            }
            else {
                c += 1;
            }
            setWordMatrix(function () { return __spreadArray([], currArr_2, true); });
            setCurrentRowCol({ c: c, r: r });
        }
    });
    var _d = (0, react_1.useState)({ r: 0, c: 0 }), currentRowCol = _d[0], setCurrentRowCol = _d[1];
    (0, react_1.useEffect)(function () {
    }, [wordMatrix]);
    return react_1["default"].createElement(ink_1.Box, { flexDirection: 'column' },
        react_1["default"].createElement(ink_1.Box, { flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
            react_1["default"].createElement(ink_1.Text, { color: 'greenBright' },
                "You have ",
                6 - currentRowCol.r,
                " tries left "),
            react_1["default"].createElement(ink_1.Text, { color: 'red' }, " Press CTRL+C or esc to quit!"),
            react_1["default"].createElement(ink_1.Text, { color: "yellowBright" }, " Press Backspace to delete and ENTER to go to the next set  ")),
        wordMatrix.map(function (el, i) {
            var r = currentRowCol.r, c = currentRowCol.c;
            return react_1["default"].createElement(ink_1.Box, { key: i, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, el.map(function (t, j) { return react_1["default"].createElement(ink_1.Box, { key: j, width: 6, height: 2, borderColor: r === i && c == j ? 'redBright' : 'cyan', borderStyle: 'single' },
                react_1["default"].createElement(ink_1.Text, { bold: true, color: 'whiteBright', backgroundColor: wordMatrix[i][j].bgColor, key: j }, ' ' + wordMatrix[i][j].letter + ' ')); }));
        }),
        keyboard.map(function (el, i) {
            return react_1["default"].createElement(ink_1.Box, { key: i, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, el.map(function (t, j) {
                var color = incorrectLetters.find(function (ltr) { return t === ltr; }) ? 'gray' : 'white';
                return react_1["default"].createElement(ink_1.Box, { key: j, width: 6, alignItems: 'center', height: 2 },
                    react_1["default"].createElement(ink_1.Text, { backgroundColor: color, color: color === "white" ? "blackBright" : "whiteBright", bold: true }, '  ' + t + '  '));
            }));
        }),
        react_1["default"].createElement(ink_1.Box, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, game.completed && react_1["default"].createElement(ink_1.Text, { color: "white", backgroundColor: game.won ? "green" : "redBright" },
            " ",
            game.won ? "You win! the word is ".concat(word, " ") : "You lose! the word was ".concat(word),
            " ")));
};
module.exports = App;
exports["default"] = App;
