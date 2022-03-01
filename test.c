#include "bip39.h"
#include <stdio.h>

int main()
{
    uint8_t seed[64];
    const char *mnemonic_phrase = "repeat answer salmon special seminar proof leaf ladder oppose night social mad acquire radio all miracle fold under lyrics cry wisdom custom bundle festival";

    // Generate 256 Private key from mnemonic
    mnemonic_to_seed(mnemonic_phrase, "", seed, 0);
    
    printf("Seed: ");
    for(int i = 0; i < 64; i++){
    	printf("%x", seed[i]);
    }
    // printf("\n");

    return 0;
}