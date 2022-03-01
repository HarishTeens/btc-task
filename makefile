CFLAGS = -I./trezor-firmware/crypto

test:
	gcc -o bip39 test.c ./trezor-firmware/crypto/rand.c ./trezor-firmware/crypto/memzero.c ./trezor-firmware/crypto/sha2.c ./trezor-firmware/crypto/hmac.c ./trezor-firmware/crypto/pbkdf2.c ./trezor-firmware/crypto/bip39.c $(CFLAGS)