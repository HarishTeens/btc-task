#include "bip39.h"
#include "bip32.h"
#include "ecdsa.h"
#include "hasher.h"
#include "secp256k1.h"
#include "util.h"
#include <stdio.h>

#define PUBKEY_PREFIX 0x043587CF  // tpub
#define PRIVKEY_PREFIX 0x04358394 // tprv
#define COIN_TYPE 0

int main()
{
    uint8_t seed[64];
    const char *mnemonic_phrase = "repeat answer salmon special seminar proof leaf ladder oppose night social mad acquire radio all miracle fold under lyrics cry wisdom custom bundle festival";

    // Generate Seed value
    mnemonic_to_seed(mnemonic_phrase, "", seed, 0);

    // Populate Master HDNode from seed
    HDNode node;
    hdnode_from_seed(seed, 64, "secp256k1", &node);
    uint32_t fingerprint = 0;
    char ext_key[128];

    hdnode_private_ckd(&node, 0x8000002C); // m44'
    hdnode_private_ckd(&node, 0x80000001); // 1'
    hdnode_private_ckd(&node, 0x80000000); // 0'
    fingerprint = hdnode_fingerprint(&node);
    hdnode_private_ckd(&node, 0x00000000); // 0
    hdnode_fill_public_key(&node);

    char ext_pub_key[128], ext_prv_key[128];
    hdnode_serialize_private(&node, fingerprint, PRIVKEY_PREFIX, ext_prv_key, sizeof(ext_prv_key));
    hdnode_serialize_public(&node, fingerprint, PUBKEY_PREFIX, ext_pub_key, sizeof(ext_pub_key));
    printf("%s\n", ext_prv_key);
    printf("%s\n", ext_pub_key);

    return 0;
}