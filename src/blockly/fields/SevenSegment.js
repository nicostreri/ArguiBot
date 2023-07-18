/**
 * @fileoverview 7-segment display input field.
 * @author nicolas@streri.com (Nicolás Streri)
 */

/**
 * Based on the work of
 *      Bitmap input field.
 *      @author gregoryc@outlook.com (Greg Cannon)
 *      @license
 *      Copyright 2021 Google LLC
 *      SPDX-License-Identifier: Apache-2.0
 */

import Blockly from 'blockly/core';

const SEGMENT_KEYS = ["a", "b", "c", "d", "e", "f", "g"];

const SVG_WIDTH = 42;
const SVG_HEIGHT = 70;

const FILLED_SEGMENT_COLOR = '#000000';
const EMPTY_SEGMENT_COLOR = '#d9d9d9';

/**
 * Field to enter a seven segment display.
 */
export class FieldSevenSegment extends Blockly.Field {
    /**
     * Constructor for the seven segment field.
     * @param {!Object=} value An object with boolean keys "a", "b", "c" ... for each segment
     * @param {Function=} validator A function that is called to validate.
     * @param {!Object=} config Config A map of options used to configure the field.
     */
    constructor(value = undefined, validator = undefined, config = undefined) {
        super(value, validator, config);

        this.SERIALIZABLE = true;

        // Set a default empty value
        if (this.getValue() === null) {
            this.setValue(this.getEmptyRepresentation_());
        }

        /**
         * Array holding info needed to unbind events.
         * Used for disposing.
         * @type {!Array<!Blockly.browserEvents.Data>}
         * @private
         */
        this.boundEvents_ = [];

        /** References to UI elements */
        this.fieldGroup_ = null;
        this.editorSegments_ = null;
        this.blockSegments_ = null;

        /** Stateful variables */
        this.mouseIsDown_ = false;
        this.valToPaintWith_ = undefined;
    }

    /**
     * Constructs a FieldSevenSegment from a JSON arg object.
     * @param {!Object} options A JSON object with options.
     * @returns {!FieldSevenSegment} The new field instance.
     * @package
     * @nocollapse
     */
    static fromJson(options) {
        // `this` might be a subclass of FieldSevenSegment if that class doesn't override
        // the static fromJson method.
        return new this(options && options['value'], undefined, options);
    }

    /**
     * Validates that a new value meets the requirements for a valid seven segment object.
     * @param {*} newValue The new value to be tested.
     * @returns {Object} The new value if it's valid, or null.
     */
    doClassValidation_(newValue = undefined) {
        if(!newValue) {
            return null;
        }
        // Check if all segments are present in the new value
        for(let k of SEGMENT_KEYS){
            if(!(k in newValue)) return null;
            if(typeof newValue[k] != "boolean") return null;
        }

        return newValue;
    }

    /**
     * Show the seven segment editor dialog.
     * @param {!Event=} e Optional mouse event that triggered the field to
     *     open, or undefined if triggered programmatically.
     * @param {boolean=} _quietInput Quiet input.
     * @protected
     */
    showEditor_(e = undefined, _quietInput = undefined) {
        const editor = this.dropdownCreate_();
        Blockly.DropDownDiv.getContentDiv().appendChild(editor);
        Blockly.DropDownDiv.showPositionedByField(
            this,
            this.dropdownDispose_.bind(this)
        );
    }

    /**
     * Updates the block display and editor dropdown when the field re-renders.
     * @protected
     * @override
     */
    render_() {
        super.render_();
        if (!this.getValue()) return;

        for(let key of SEGMENT_KEYS){
            const segmentValue = this.getValue()[key];

            if(this.editorSegments_){
                if(segmentValue){
                    this.editorSegments_[key].classList.remove("disabled");
                }else{
                    this.editorSegments_[key].classList.add("disabled");
                }
            }

            if(this.blockSegments_){
                this.blockSegments_[key].style.fill = segmentValue ? FILLED_SEGMENT_COLOR : EMPTY_SEGMENT_COLOR;
            }
        }
    }

    /**
     * Creates the seven segment editor and add event listeners.
     * @returns {!Element} The newly created dropdown menu.
     * @private
     */
    dropdownCreate_() {
        const dropdownEditor = this.createElementWithClassname_('div', 'dropdownEditor');
        this.bindEvent_(dropdownEditor, 'mouseup', this.onMouseUp_);
        this.bindEvent_(dropdownEditor, 'mouseleave', this.onMouseUp_);
        this.bindEvent_(dropdownEditor, 'dragstart', (e) => {
            e.preventDefault();
        });

        // Seven segment display
        const digitContainer = this.createElementWithClassname_('div', 'display-container');
        this.editorSegments_ = {};
        const segmentKeyPos = ['a-x', 'b-y', 'c-y', 'd-x', 'e-y', 'f-y', 'g-x'];
        for(let v of segmentKeyPos){
            const [sN, pos] = v.split("-");
            const segment = this.createElementWithClassname_('div', 'segment-' + pos + ' segment-' + sN);
            const segmentBorder = this.createElementWithClassname_('span', 'segment-border');
            segment.appendChild(segmentBorder);
            digitContainer.appendChild(segment);
            this.editorSegments_[sN] = segment;

            // Load the current segment value
            const isEnabled = this.getValue()[sN];
            if(!isEnabled) segment.classList.add("disabled");

            // Handle clicking a segment
            this.bindEvent_(segment, 'mousedown', () => {
                this.onMouseDownInSegment_(sN);
                return true;
            });
    
            // Handle dragging into a segment when mouse is down
            this.bindEvent_(segment, 'mouseenter', () => {
                this.onMouseEnterSegment_(sN);
            });
        } 
        dropdownEditor.appendChild(digitContainer);

        return dropdownEditor;
    }

    /**
     * Initializes the on-block display.
     * @override
     */
    initView() {
        //Based on https://es.wikinews.org/wiki/Archivo:7-segment_cdeg.svg
        const digitContainer = Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.G, { 
            id: "cdeg",
            style: "fill-rule:evenodd; stroke:#FFFFFF; stroke-width:0.25; stroke-opacity:1; stroke-linecap:butt; stroke-linejoin:miter;"
        }, this.fieldGroup_);

        const digitBackground = Blockly.utils.dom.createSvgElement('rect', {
            x: 0,
            y: 0,
            width: 10,
            height: 18,
            fill: "transparent",
            stroke: "transparent"
        }, digitContainer);

        const segments = [
            {id: "a", points: " 1, 1  2, 0  8, 0  9, 1  8, 2  2, 2"},
            {id: "b", points: " 9, 1 10, 2 10, 8  9, 9  8, 8  8, 2"},
            {id: "c", points: " 9, 9 10,10 10,16  9,17  8,16  8,10"},
            {id: "d", points: " 9,17  8,18  2,18  1,17  2,16  8,16"},
            {id: "e", points: " 1,17  0,16  0,10  1, 9  2,10  2,16"},
            {id: "f", points: " 1, 9  0, 8  0, 2  1, 1  2, 2  2, 8"},
            {id: "g", points: " 1, 9  2, 8  8, 8  9, 9  8,10  2,10"}
        ];

        this.blockSegments_ = {};
        for(let s of segments){
            const seg = Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.POLYGON,
                { id: s.id, points: s.points, fill: EMPTY_SEGMENT_COLOR},
                digitContainer
            );
            this.blockSegments_[s.id] = seg;
        }

        const digit = Blockly.utils.dom.createSvgElement('svg', { width: SVG_WIDTH, height: SVG_HEIGHT, viewBox: "-1 -1 12 20" }, this.fieldGroup_);
        digit.appendChild(digitContainer);
    }

    /**
     * Updates the size of the block based on the size of the underlying image.
     * @override
     * @protected
     */
    updateSize_() {
        this.size_.width = SVG_WIDTH;
        this.size_.height = SVG_HEIGHT;
    }

    /**
     * Disposes of events belonging to the seven segment editor.
     * @private
     */
    dropdownDispose_() {
        for (const event of this.boundEvents_) {
            Blockly.browserEvents.unbind(event);
        }
        this.boundEvents_.length = 0;
        this.editorSegments_ = null;
    }

    /**
     * Constructs an object representing a digit with all segments turned off
     * @returns {!Object} The new value.
     */
    getEmptyRepresentation_() {
        const newVal = { a: false, b: false, c: false, d: false, e: false, f: false, g: false };
        return newVal;
    }

    /**
     * Called when a mousedown event occurs within the bounds of a segment.
     * @private
     * @param {string} key Segment ID
     */
    onMouseDownInSegment_(key) {
        // Toggle that segment to the opposite of its value
        const newSegmentValue = !this.getValue()[key];
        this.setSegment_(key, newSegmentValue);
        this.mouseIsDown_ = true;
        this.valToPaintWith_ = newSegmentValue;
    }

    /**
     * Called when the mouse drags over a segment in the editor.
     * @private
     * @param {string} key Segment ID
     */
    onMouseEnterSegment_(key) {
        if (!this.mouseIsDown_) return;
        
        if (this.getValue()[key] !== this.valToPaintWith_) {
            this.setSegment_(key, this.valToPaintWith_);
        }
    }

    /**
     * Resets mouse state (e.g. After either a mouseup event or if the mouse
     * leaves the editor area).
     * @private
     */
    onMouseUp_() {
        this.mouseIsDown_ = false;
        this.valToPaintWith_ = undefined;
    }

    /**
     * Sets the value of a particular segment.
     * @param {string} key Segment ID
     * @param {boolean} newValue Value of the segment.
     * @private
     */
    setSegment_(key, newValue) {
        const newDisplay = JSON.parse(JSON.stringify(this.getValue()));
        newDisplay[key] = newValue;
        this.setValue(newDisplay);
    }

    /**
     * Creates a new element with the specified type and class.
     * @param {string} elementType Type of html element.
     * @param {string} className ClassName of html element.
     * @returns {!HTMLElement} The created element.
     */
    createElementWithClassname_(elementType, className) {
        const newElt = document.createElement(elementType);
        newElt.className = className;
        return newElt;
    }

    /**
     * Binds an event listener to the specified element.
     * @param {!HTMLElement} element Specified element.
     * @param {string} eventName Name of the event to bind.
     * @param {Function} callback Function to be called on specified event.
     */
    bindEvent_(element, eventName, callback) {
        this.boundEvents_.push(
            Blockly.browserEvents.
                conditionalBind(element, eventName, this, callback)
        );
    }
}

Blockly.fieldRegistry.register('field_sevensegment', FieldSevenSegment);

/**
 * CSS for seven segment field.
 */
Blockly.Css.register(`
    .dropdownEditor {
        align-items: center;
        flex-direction: column;
        display: flex;
        justify-content: center;
    }

    .display-container {
        width: 53px;
        height: 64px;
        position: relative;
        float: left;
    }

    .display-container div.segment-x,
    .display-container div.segment-y {
        position: absolute;
    }

    .display-container span.segment-border {
        display: block;
        position: absolute;
    }

    .display-container .segment-x {
        width: 18px;
        left: 13px;
        border-bottom: 4px solid #000;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
    }

    .display-container .segment-x .segment-border {
        top: 4px;
        left: -4px;
        right: -4px;
        border-top: 4px solid #000;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
    }

    .display-container .segment-y {
        height: 18px;
        width: 0;
        border-right: 4px solid #000;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
    }

    .display-container .segment-y .segment-border {
        position: relative;
        left: 4px;
        height: 18px;
        margin-top: -4px;
        border-left: 4px solid #000;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
    }

    .display-container .segment-a {
        top: 0;
    }

    .display-container .segment-b {
        top: 5px;
        left: 36px;
    }

    .display-container .segment-c {
        top: 33px;
        left: 36px;
    }

    .display-container .segment-d {
        top: 56px;
    }

    .display-container .segment-e {
        top: 33px;
        left: 8px;
    }

    .display-container .segment-f {
        top: 5px;
        left: 8px;
    }

    .display-container .segment-g {
        top: 28px;
    }

    .disabled {
        opacity: 0.15;
    }
`);