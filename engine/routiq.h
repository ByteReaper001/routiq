#ifndef ROUTIQ_H
#define ROUTIQ_H
#define MAX_BUFFER 64
typedef enum { LOW=0, NORMAL=1, HIGH=2, CRITICAL=3 } Priority;
typedef struct { char id[8]; Priority priority; int arrival_tick; int queue_tick; int size; } Packet;
typedef struct { Packet items[MAX_BUFFER]; int front; int rear; int size; } CircularQueue;
void initCircularQueue(CircularQueue *q); int isCircularFull(CircularQueue *q); int isCircularEmpty(CircularQueue *q); int enqueueCircular(CircularQueue *q, Packet packet); int dequeueCircular(CircularQueue *q, Packet *packet);
#endif
// Compile with: emcc routiq.c -O2 -s WASM=1 -s EXPORTED_FUNCTIONS='["_simulation_step"]' -o routiq.js
