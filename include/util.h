/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * File:   util.h
 * Author: root
 *
 * Created on July 20, 2016, 5:41 PM
 */

#ifndef UTIL_H
#define UTIL_H

#ifdef __cplusplus
extern "C" {
#endif

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * 
 */

uint8_t *fromhex(const char *str) {
    static uint8_t buf[256];
    uint8_t c;
    int len = strlen(str);
    for (size_t i = 0; i < len / 2; i++) {
        c = 0;
        if (str[i * 2] >= '0' && str[i * 2] <= '9') c += (str[i * 2] - '0') << 4;
        if (str[i * 2] >= 'a' && str[i * 2] <= 'f') c += (10 + str[i * 2] - 'a') << 4;
        if (str[i * 2] >= 'A' && str[i * 2] <= 'F') c += (10 + str[i * 2] - 'A') << 4;
        if (str[i * 2 + 1] >= '0' && str[i * 2 + 1] <= '9') c += (str[i * 2 + 1] - '0');
        if (str[i * 2 + 1] >= 'a' && str[i * 2 + 1] <= 'f') c += (10 + str[i * 2 + 1] - 'a');
        if (str[i * 2 + 1] >= 'A' && str[i * 2 + 1] <= 'F') c += (10 + str[i * 2 + 1] - 'A');
        buf[i] = c;
    }
    return buf;
}

char *tohex(const uint8_t *bin, size_t l) {
    char *buf = (char *) malloc(l * 2 + 1);
    static char digits[] = "0123456789abcdef";
    for (size_t i = 0; i < l; i++) {
        buf[i * 2 ] = digits[(bin[i] >> 4) & 0xF];
        buf[i * 2 + 1] = digits[bin[i] & 0xF];
    }
    buf[l * 2] = 0;
    return buf;
}




#ifdef __cplusplus
}
#endif

#endif /* UTIL_H */
