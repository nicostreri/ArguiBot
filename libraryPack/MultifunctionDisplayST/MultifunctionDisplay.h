#ifndef __MULTI_DISPLAY__
#define __MULTI_DISPLAY__
#include <Arduino.h>

class MultifunctionDisplay{
    private:
        int latchPIN;
        int clkPIN;
        int dataPIN;
        
        volatile uint8_t current_segment = 0;
        uint8_t display_raw_segment[4] = {0xff, 0xff, 0xff, 0xff};
        const uint8_t SEG_MAP[10] = {0xC0,0xF9,0xA4,0xB0,0x99,0x92,0x82,0xF8,0X80,0X90};
        const uint8_t SEG_SEL[4] = {0xf1, 0xf2, 0xf4, 0xf8};
    public:
        MultifunctionDisplay(int latch, int clock, int data);
        void write(float valueToShow);
        void write(int valueToShow);
        void write(uint8_t d1, uint8_t d2, uint8_t d3, uint8_t d4); 
        void clean();
        void refresh();
        ~MultifunctionDisplay();
};
#endif