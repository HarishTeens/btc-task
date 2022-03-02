#include "bip39.h"
#include "ecdsa.h"
#include "hasher.h"
#include "secp256k1.h"
#include "util.h"
#include <stdio.h>

int main()
{
    uint8_t private_key[64];
    const char *mnemonic_phrase = "repeat answer salmon special seminar proof leaf ladder oppose night social mad acquire radio all miracle fold under lyrics cry wisdom custom bundle festival";

    // Generate 256 Private key from mnemonic
    mnemonic_to_seed(mnemonic_phrase, "", private_key, 0);

    char wif[128];
    // Get WIF key from private key
    ecdsa_get_wif(private_key, 1, HASHER_SHA2_RIPEMD, wif, sizeof(wif));

    // Get Public Address
    uint8_t public_key[128];
    char address[64];
    ecdsa_get_public_key65(&secp256k1, private_key, public_key);
    ecdsa_get_address(public_key, 1, HASHER_SHA2_RIPEMD, HASHER_SHA2_RIPEMD, address, sizeof(address));
    printf("%s\n", address);

    return 0;
}