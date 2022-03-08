
import hashlib, ecdsa, base58, utils
import random


def privateKeyToWif(key_hex):    
    return base58.b58encode(0x80, key_hex.encode())
    
def privateKeyToPublicKey(s):
    sk = ecdsa.SigningKey.from_string(s.encode(), curve=ecdsa.SECP256k1)
    vk = sk.verifying_key
    return ('\04' + sk.verifying_key.to_string()).encode('hex')
    
def pubKeyToAddr(s):
    ripemd160 = hashlib.new('ripemd160')
    ripemd160.update(hashlib.sha256(s.encode()).digest())
    return base58.b58encode(0, ripemd160.digest())

def keyToAddr(s):
    return pubKeyToAddr(privateKeyToPublicKey(s))

# Warning: this random function is not cryptographically strong and is just for example
private_key = ''.join(['%x' % random.randrange(16) for x in range(0, 64)])
print (privateKeyToWif(private_key))
print (keyToAddr(private_key))