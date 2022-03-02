src=$(wildcard main.c Crypto/*.c Crypto/ed25519-donna/*.c Crypto/chacha20poly1305/*.c Crypto/aes/aes_modes.c Crypto/aes/aescrypt.c Crypto/aes/aestab.c Crypto/aes/aeskey.c) 
obj=$(src: .c=.o)
dep=$(obj: .o=.d)
# one dependency file for each source

CFLAGS = -MMD     # option to generate a .d file during compilation

main: $(obj)
	gcc $^ -o $@ -I./Crypto -I./include

%.d: %.c
	@$(CPP) $(CFLAGS)  $< -MM -MT $(@:.d=.o) >$@ 