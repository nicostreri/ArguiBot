import { Generator, Names, INPUT_VALUE} from "blockly"

/**
 * Based on work of:
 *  - Fred Lin (gasolin@gmail.com) for Blocklyduino.
 *  - Project SenseBox Ardublockly https://github.com/sensebox/ardublockly
 *
 * @fileoverview Helper functions for generating Arduino language (C++).
 */

/**
 * Arduino code generator.
 * @type {!Blockly.Generator}
 */
const arduinoGenerator = new Generator("Arduino");

/**
 * List of illegal variable names.
 * @private
 */
arduinoGenerator.addReservedWords('Blockly,' +
    'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,' +
    'define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,integer,' +
    'constants,floating,point,void,boolean,char,unsigned,byte,int,word,long,' +
    'float,double,string,String,array,static,volatile,const,sizeof,pinMode,' +
    'digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,' +
    'noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,' +
    'min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,' +
    'lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,' +
    'detachInterrupt,interrupts,noInterrupts'
);

/**
 * C++ operators precedence
 */
arduinoGenerator.ORDER_ATOMIC = 0;         // 0 "" ...
arduinoGenerator.ORDER_UNARY_POSTFIX = 1;  // expr++ expr-- () [] .
arduinoGenerator.ORDER_UNARY_PREFIX = 2;   // -expr !expr ~expr ++expr --expr
arduinoGenerator.ORDER_MULTIPLICATIVE = 3; // * / % ~/
arduinoGenerator.ORDER_ADDITIVE = 4;       // + -
arduinoGenerator.ORDER_SHIFT = 5;          // << >>
arduinoGenerator.ORDER_RELATIONAL = 6;     // >= > <= <
arduinoGenerator.ORDER_EQUALITY = 7;       // == != === !==
arduinoGenerator.ORDER_BITWISE_AND = 8;    // &
arduinoGenerator.ORDER_BITWISE_XOR = 9;    // ^
arduinoGenerator.ORDER_BITWISE_OR = 10;    // |
arduinoGenerator.ORDER_LOGICAL_AND = 11;   // &&
arduinoGenerator.ORDER_LOGICAL_OR = 12;    // ||
arduinoGenerator.ORDER_CONDITIONAL = 13;   // expr ? expr : expr
arduinoGenerator.ORDER_ASSIGNMENT = 14;    // = *= /= ~/= %= += -= <<= >>= &= ^= |=
arduinoGenerator.ORDER_NONE = 99;          // (...)

/**
 * A list of types tasks that the pins can be assigned. Used to track usage and
 * warn if the same pin has been assigned to more than one task.
 */
arduinoGenerator.PinTypes = {
    INPUT: 'INPUT',
    OUTPUT: 'OUTPUT',
    PWM: 'PWM',
    SERVO: 'SERVO',
    STEPPER: 'STEPPER',
    SERIAL: 'SERIAL',
    I2C: 'I2C/TWI',
    SPI: 'SPI',
    CIRCUIT: 'CIRCUIT',
    CIRCUIT_INPUT: 'CIRCUIT_INPUT',
    CIRCUIT_OUTPUT: 'CIRCUIT_OUTPUT'
};

/**
 * Initialises the database of global definitions, the setup function, function
 * names, and variable names.
 * @param {Blockly.Workspace} workspace Workspace to generate code from.
 */
arduinoGenerator.init = function(workspace) {
    // Create a dictionary of definitions to be printed at the top of the sketch
    arduinoGenerator.includes_ = Object.create(null);
    // Create a dictionary of global definitions to be printed after variables
    arduinoGenerator.definitions_ = Object.create(null);
    // Create a dictionary of variables
    arduinoGenerator.variables_ = Object.create(null);
    // Create a dictionary of functions from the code generator
    arduinoGenerator.codeFunctions_ = Object.create(null);
    // Create a dictionary of functions created by the user
    arduinoGenerator.userFunctions_ = Object.create(null);
    // Create a dictionary mapping desired function names in definitions_
    // to actual function names (to avoid collisions with user functions)
    arduinoGenerator.functionNames_ = Object.create(null);
    // Create a dictionary of setups to be printed in the setup() function
    arduinoGenerator.setups_ = Object.create(null);
    // Create a dictionary of lines to be printed in the yield() function
    arduinoGenerator.yield_ = Object.create(null);
    // Create a dictionary of pins to check if their use conflicts
    arduinoGenerator.pins_ = Object.create(null);
    // Create a dictionaties of required libs
    arduinoGenerator.namedLibs_ = Object.create(null);
    arduinoGenerator.gitLibs_ = Object.create(null);
    // Create a dictionary of flags
    arduinoGenerator.flags_ = Object.create(null);
  
    if(!arduinoGenerator.nameDB_){
        arduinoGenerator.nameDB_ = new Names(arduinoGenerator.RESERVED_WORDS_);
    }else{
        arduinoGenerator.nameDB_.reset();
    }
  
    // Iterate through to capture all blocks types and set the function arguments
    let varsWithTypes = workspace.getAllVariables();
    arduinoGenerator.nameDB_.setVariableMap(workspace.getVariableMap());
    // Set variable declarations with their Arduino type in the defines dictionary
    for (let variable of varsWithTypes) {
        let varDeclarationCode = arduinoGenerator.getArduinoType_(variable.type) + ' ' + 
            arduinoGenerator.nameDB_.getName(variable.name, Names.NameType.VARIABLE) + ';';
        arduinoGenerator.addVariable(variable.name, varDeclarationCode);
    }
};

/**
 * Convert dictionary values into list
 * @param {Object} dict Dictionary to convert
 * @returns {string[]} Converted list
 */
arduinoGenerator.dictToList_ = function(dict){
    let newList = []
    for(let name in dict){
        newList.push(dict[name]);
    }
    if(newList.length) newList.push('\n');
    return newList;
}

/**
 * Prepare all generated code to be placed in the sketch specific locations.
 * @param {string} code Generated main program (loop function) code.
 * @return {string} Completed sketch code.
 */
arduinoGenerator.finish = function(code) {
    // Convert the includes, definitions, and functions dictionaries into lists
    let includes = arduinoGenerator.dictToList_(arduinoGenerator.includes_);
    let variables = arduinoGenerator.dictToList_(arduinoGenerator.variables_);
    let definitions = arduinoGenerator.dictToList_(arduinoGenerator.definitions_);
    let codeFunctions = arduinoGenerator.dictToList_(arduinoGenerator.codeFunctions_);
    let userFunctions = arduinoGenerator.dictToList_(arduinoGenerator.userFunctions_);    
    let functions = codeFunctions.concat(userFunctions);
    let namedLibs = arduinoGenerator.dictToList_(arduinoGenerator.namedLibs_);
    let gitLibs = arduinoGenerator.dictToList_(arduinoGenerator.gitLibs_);
    let libs = {namedLibs, gitLibs};

      
    // userSetupCode added at the end of the setup function without leading spaces
    let userSetupCode = '';
    if (arduinoGenerator.setups_['userSetupCode'] !== undefined) {
        userSetupCode = '\n' + arduinoGenerator.setups_['userSetupCode'];
        delete arduinoGenerator.setups_['userSetupCode'];
    }
    let setups = arduinoGenerator.dictToList_(arduinoGenerator.setups_);
    if (userSetupCode) setups.push(userSetupCode);

    // yield function
    let yields = arduinoGenerator.dictToList_(arduinoGenerator.yield_);
    
    // Clean up temporary data
    delete arduinoGenerator.includes_;
    delete arduinoGenerator.definitions_;
    delete arduinoGenerator.codeFunctions_;
    delete arduinoGenerator.userFunctions_;
    delete arduinoGenerator.functionNames_;
    delete arduinoGenerator.setups_;
    delete arduinoGenerator.yield_;
    delete arduinoGenerator.pins_;
    delete arduinoGenerator.namedLibs_;
    delete arduinoGenerator.gitLibs_;
    delete arduinoGenerator.flags_;
    arduinoGenerator.nameDB_.reset();
  
    let allDefs = includes.join('\n') + variables.join('\n') +
        definitions.join('\n') + functions.join('\n\n');
    let setup = 'void setup() {\n  ' + setups.join('\n  ') + '\n}\n\n';
    let yieldCode = 'void yield() {\n  ' + yields.join('\n  ') + '\n}\n\n'; 
    let loop = 'void loop() {\n  yield();\n  ' + code.replace(/\n/g, '\n  ') + '\n}\n';
    return allDefs + setup + yieldCode + loop + "// "+JSON.stringify(libs);
};

/**
 * Check if a string is a valid URL
 * @param {string} string Text to check
 * @returns {!boolean} Indicates if the string is a valid URL
 */
arduinoGenerator.isURL_ = (string) => {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

/**
 * Add a temporary flag that allows a value to be stored during code generation
 * @param {string} flag Identifier for this flag
 * @param {object} value Value for this flag
 */
arduinoGenerator.addFlag = function(flag, value){
    if(arduinoGenerator.flags_[flag] === undefined){
        arduinoGenerator.flags_[flag] = value;
    }
}

/**
 * Read a previously added temporary flag
 * @param {string} flag Flag identifier to look for
 * @returns {object} Current value or undefined if it does not exist
 */
arduinoGenerator.getFlag = function(flag){
    if(arduinoGenerator.flags_[flag] !== undefined){
        return arduinoGenerator.flags_[flag];
    }else{
        return undefined;
    }
}

/**
 * Adds a string of "include" code to be added to the sketch.
 * Once a include is added it will not get overwritten with new code.
 * @param {!string} includeTag Identifier for this include code.
 * @param {!string} code Code to be included at the very top of the sketch.
 * @param {!string} requiredLib name or download URL of the library that includes the header
 */
arduinoGenerator.addInclude = function(includeTag, code, requiredLib = "") {
    if(arduinoGenerator.includes_[includeTag] === undefined) {
        arduinoGenerator.includes_[includeTag] = code;

        if(requiredLib){
            if(arduinoGenerator.isURL_(requiredLib)){
                arduinoGenerator.gitLibs_[includeTag] = requiredLib;
            }else{
                arduinoGenerator.namedLibs_[includeTag] = requiredLib;
            }
        }
    }
};
  
/**
 * Adds a string of code to be declared globally to the sketch.
 * Once it is added it will not get overwritten with new code.
 * @param {!string} declarationTag Identifier for this declaration code.
 * @param {!string} code Code to be added below the includes.
 */
arduinoGenerator.addDeclaration = function(declarationTag, code) {
    if(arduinoGenerator.definitions_[declarationTag] === undefined) {
        arduinoGenerator.definitions_[declarationTag] = code;
    }
};

/**
 * Adds a string of code to declare a variable globally to the sketch.
 * Only if overwrite option is set to true it will overwrite whatever
 * value the identifier held before.
 * @param {!string} varName The name of the variable to declare.
 * @param {!string} code Code to be added for the declaration.
 * @param {boolean=} overwrite Flag to ignore previously set value.
 * @return {!boolean} Indicates if the declaration overwrote a previous one.
 */
arduinoGenerator.addVariable = function(varName, code, overwrite) {
    let overwritten = false;
    if(overwrite || (arduinoGenerator.variables_[varName] === undefined)){
        arduinoGenerator.variables_[varName] = code;
        overwritten = true;
    }
    return overwritten;
};

/**
 * Adds a string of code into the Arduino setup() function. It takes an
 * identifier to not repeat the same kind of initialisation code from several
 * blocks. If overwrite option is set to true it will overwrite whatever
 * value the identifier held before.
 * @param {!string} setupTag Identifier for the type of set up code.
 * @param {!string} code Code to be included in the setup() function.
 * @param {boolean=} overwrite Flag to ignore previously set value.
 * @return {!boolean} Indicates if the new setup code overwrote a previous one.
 */
arduinoGenerator.addSetup = function(setupTag, code, overwrite) {
    let overwritten = false;
    if(overwrite || (arduinoGenerator.setups_[setupTag] === undefined)){
        arduinoGenerator.setups_[setupTag] = code;
        overwritten = true;
    }
    return overwritten;
};

/**
 * Adds a string of code into the Arduino yield() function. It takes an
 * identifier to not repeat the same kind of code from several
 * blocks. If overwrite option is set to true it will overwrite whatever
 * value the identifier held before.
 * @param {!string} yieldTag Identifier for the type of code.
 * @param {!string} code Code to be included in the yield() function.
 * @param {boolean=} overwrite Flag to ignore previously set value.
 * @return {!boolean} Indicates if the new yield code overwrote a previous one.
 */
arduinoGenerator.addYield = function(yieldTag, code, overwrite) {
    let overwritten = false;
    if(overwrite || (arduinoGenerator.yield_[yieldTag] === undefined)){
        arduinoGenerator.yield_[yieldTag] = code;
        overwritten = true;
    }
    return overwritten;
};

/**
 * Adds a string of code as a function. It takes an identifier (meant to be the
 * function name) to only keep a single copy even if multiple blocks might
 * request this function to be created.
 * A function (and its code) will only be added on first request.
 * @param {!string} preferedName Identifier for the function.
 * @param {!string} code Function string code.
 * @return {!string} A unique function name based on input name.
 */
arduinoGenerator.addFunction = function(preferedName, code) {
    if(arduinoGenerator.codeFunctions_[preferedName] === undefined) {
        let uniqueName = arduinoGenerator.nameDB_.getDistinctName(preferedName, Names.NameType.PROCEDURE);
        arduinoGenerator.codeFunctions_[preferedName] = code.replace(arduinoGenerator.FUNCTION_NAME_PLACEHOLDER_, uniqueName);
        arduinoGenerator.functionNames_[preferedName] = uniqueName;
    }
    return arduinoGenerator.functionNames_[preferedName];
};

/**
 * Reserves a pin from the Arduino board, recording the purpose of its use
 * @param {!Blockly.Block} block The block that uses the pin
 * @param {!string} pin Arduino board pin.
 * @param {!arduinoGenerator.PinTypes} pinType Type assigned to pin
 * @param {!string} warningTag UUID.
 */
arduinoGenerator.reservePin = function(block, pin, pinType, warningTag) {
    if(arduinoGenerator.pins_[pin] !== undefined) {
        if (arduinoGenerator.pins_[pin] != pinType) {
            //TODO Add i18n
            let msg = "El pin %1 está siendo usado para dos propósitos diferentes (%2 - %3)."
            block.setWarningText(
                msg.replace('%1', pin)
                .replace('%2', pinType)
                .replace('%3', arduinoGenerator.pins_[pin]),
                warningTag
            );
        }else{
            block.setWarningText(null, warningTag);
        }
    }else{
        arduinoGenerator.pins_[pin] = pinType;
        block.setWarningText(null, warningTag);
    }
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything. A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
arduinoGenerator.scrubNakedValue = function(line) {
    return line + ';\n';
};
  
/**
 * Encode a string as a properly escaped Arduino string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Arduino string.
 * @private
 */
arduinoGenerator.quote_ = function(string) {
    string = string.replace(/\\/g, '\\\\')
                   .replace(/\n/g, '\\\n')
                   .replace(/\$/g, '\\$')
                   .replace(/'/g, '\\\'');
    return '\"' + string + '\"';
};
  
/**
 * Common tasks for generating Arduino from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Arduino code created for this block.
 * @return {string} Arduino code with comments and subsequent blocks added.
 * @this {Blockly.CodeGenerator}
 * @private
 */
arduinoGenerator.scrub_ = function(block, code) {
    if (code === null) { return ''; } // Block has handled code generation itself
  
    let commentCode = '';
    // Only collect comments for blocks that aren't inline
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
        // Collect comment for this block.
        let comment = block.getCommentText();
        if (comment) {
            commentCode += this.prefixLines(comment, '// ') + '\n';
        }
        // Collect comments for all value arguments
        // Don't collect comments for nested statements
        for (let x = 0; x < block.inputList.length; x++) {
            if (block.inputList[x].type == INPUT_VALUE) {
                let childBlock = block.inputList[x].connection.targetBlock();
                if (childBlock) {
                    let comment = this.allNestedComments(childBlock);
                    if (comment) {
                        commentCode += this.prefixLines(comment, '// ');
                    }
                }
            }
        }
    }
    let nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    let nextCode = this.blockToCode(nextBlock);
    return commentCode + code + nextCode;
};
  
/**
 * Generates Arduino Types from a Blockly Type.
 * @param {!Blockly.Type} typeBlockly The Blockly type to be converted.
 * @return {string} Arduino type for the respective Blockly input type, in a
 *     string format.
 * @private
 */
arduinoGenerator.getArduinoType_ = function(typeBlockly) {
    switch (typeBlockly) {
        case "Number":
            return "int";
        case "Boolean":
            return 'boolean';
        case "String":
            return 'String';
        default:
            return 'InvalidBlocklyType';
    }
};
  
/** Used for not-yet-implemented block code generators */
arduinoGenerator.noGeneratorCodeInline = function() {
    return ['(Not implemented - inline)', arduinoGenerator.ORDER_ATOMIC];
};
  
/** Used for not-yet-implemented block code generators */
arduinoGenerator.noGeneratorCodeLine = function() {
    return '(Not implemented)'; 
};

export default arduinoGenerator;