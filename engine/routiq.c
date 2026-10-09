#include "routiq.h"
void initCircularQueue(CircularQueue *q) { q->front = 0; q->rear = 0; q->size = 0; }
int isCircularFull(CircularQueue *q) { return q->size == MAX_BUFFER; }
int isCircularEmpty(CircularQueue *q) { return q->size == 0; }
int enqueueCircular(CircularQueue *q, Packet packet) { if (isCircularFull(q)) return 0; q->items[q->rear] = packet; q->rear = (q->rear + 1) % MAX_BUFFER; q->size++; return 1; }
int dequeueCircular(CircularQueue *q, Packet *packet) { if (isCircularEmpty(q)) return 0; *packet = q->items[q->front]; q->front = (q->front + 1) % MAX_BUFFER; q->size--; return 1; }
int simulation_step(void) { return 1; }
