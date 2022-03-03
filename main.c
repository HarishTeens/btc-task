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
   // printf("%s\n", ext_prv_key);
   // printf("%s\n", ext_pub_key);
   printf("%s\n", tohex(node.private_key, sizeof(node.private_key)));

   const char raw_tx[] = "02000000012a645ad13d734de93bbef80b891f7e1e1e6c466b484237dcf694e64295f9cab7000000001976a9146c62b6d40a546e08a47320d0143c9a61da78c0e188acffffffff0206000000000000001976a914ae23807896aefc4a1ad5a826d1a964972ba2809588ac90c50000000000001976a914f14a3e31d18ede8ad0e0530a435b9ca9d880f66188ac0000000001000000";
   uint8_t *tx_hash = fromhex(raw_tx);

   uint8_t sig[64];
   int ans = hdnode_sign_digest(&node, tx_hash, sig, NULL, NULL);
   printf("%s\n", tohex(sig, sizeof(sig)));

   return 0;
}