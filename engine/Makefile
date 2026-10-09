CC ?= emcc
CFLAGS ?= -O2
all:
	$(CC) routiq.c $(CFLAGS) -s WASM=1 -s EXPORTED_FUNCTIONS='["_simulation_step"]' -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' -o routiq.js
clean:
	rm -f routiq.js routiq.wasm
