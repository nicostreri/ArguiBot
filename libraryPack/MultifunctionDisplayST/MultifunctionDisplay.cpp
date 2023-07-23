#include <MultifunctionDisplay.h>

MultifunctionDisplay::MultifunctionDisplay(int latch, int clock, int data){
    this->latchPIN = latch;
    this->clkPIN = clock;
    this->dataPIN = data;
    pinMode(latchPIN, OUTPUT);
    pinMode(clkPIN, OUTPUT);
    pinMode(dataPIN, OUTPUT);
}

MultifunctionDisplay::~MultifunctionDisplay(){}

void MultifunctionDisplay::refresh(){
   noInterrupts();
   this->current_segment = (this->current_segment > 2) ? 0 : this->current_segment + 1;
   digitalWrite(this->latchPIN, LOW);
   shiftOut(this->dataPIN, this->clkPIN, MSBFIRST, this->display_raw_segment[this->current_segment]);
   shiftOut(this->dataPIN, this->clkPIN, MSBFIRST, this->SEG_SEL[this->current_segment]);
   digitalWrite(this->latchPIN, HIGH);
   interrupts();
}

void MultifunctionDisplay::write(float valueToShow) {
   int leftSideOfDecimalPoint = (int) valueToShow;
   int temp = (int) (valueToShow * 10);
   int rightSideOfDecimalPoint = temp % 10;
   noInterrupts();
   display_raw_segment[0] = SEG_MAP[(leftSideOfDecimalPoint / 100) % 10];
   display_raw_segment[1] = SEG_MAP[(leftSideOfDecimalPoint / 10) % 10];
   display_raw_segment[2] = (SEG_MAP[leftSideOfDecimalPoint % 10]) & 0b01111111;
   display_raw_segment[3] = SEG_MAP[rightSideOfDecimalPoint];
   if (leftSideOfDecimalPoint < 100) display_raw_segment[0] = 0xff;
   if (leftSideOfDecimalPoint < 10) display_raw_segment[1] = 0xff;
   interrupts();
}

void MultifunctionDisplay::write(int valueToShow) {
   noInterrupts();
   display_raw_segment[0] = SEG_MAP[valueToShow / 1000];
   display_raw_segment[1] = SEG_MAP[(valueToShow / 100) % 10];
   display_raw_segment[2] = SEG_MAP[(valueToShow / 10) % 10];
   display_raw_segment[3] = SEG_MAP[valueToShow % 10];
   if (valueToShow < 1000) display_raw_segment[0] = 0xff;
   if (valueToShow < 100) display_raw_segment[1] = 0xff;
   if (valueToShow < 10) display_raw_segment[2] = 0xff;
   interrupts();
}

void MultifunctionDisplay::write(uint8_t d1, uint8_t d2, uint8_t d3, uint8_t d4){
   noInterrupts();
   display_raw_segment[0] = d1;
   display_raw_segment[1] = d2;
   display_raw_segment[2] = d3;
   display_raw_segment[3] = d4;
   interrupts();
}

void MultifunctionDisplay::clean() {
   noInterrupts();
   display_raw_segment[0] = 0xff;
   display_raw_segment[1] = 0xff;
   display_raw_segment[2] = 0xff;
   display_raw_segment[3] = 0xff;
   interrupts();
}