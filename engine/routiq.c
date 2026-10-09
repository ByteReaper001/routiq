#include "routiq.h"
void initCircularQueue(CircularQueue *q) { q->front = 0; q->rear = 0; q->size = 0; }
int isCircularFull(CircularQueue *q) { return q->size == MAX_BUFFER; }
int isCircularEmpty(CircularQueue *q) { return q->size == 0; }
int enqueueCircular(CircularQueue *q, Packet packet) { if (isCircularFull(q)) return 0; q->items[q->rear] = packet; q->rear = (q->rear + 1) % MAX_BUFFER; q->size++; return 1; }
int dequeueCircular(CircularQueue *q, Packet *packet) { if (isCircularEmpty(q)) return 0; *packet = q->items[q->front]; q->front = (q->front + 1) % MAX_BUFFER; q->size--; return 1; }
void initPriorityQueue(PriorityQueue *q) { q->size = 0; }
int enqueuePriority(PriorityQueue *q, Packet packet) { if (q->size == MAX_BUFFER) return 0; int i = q->size++; while (i > 0 && q->items[i - 1].priority < packet.priority) { q->items[i] = q->items[i - 1]; i--; } q->items[i] = packet; return 1; }
int dequeuePriority(PriorityQueue *q, Packet *packet) { if (q->size == 0) return 0; *packet = q->items[0]; for (int i = 1; i < q->size; i++) q->items[i - 1] = q->items[i]; q->size--; return 1; }
int simulation_step(Simulation *sim) { Packet packet; sim->tick++; int removed = sim->policy == PRIORITY_POLICY ? dequeuePriority(&sim->priority, &packet) : dequeueCircular(&sim->circular, &packet); if (!removed) return 0; sim->transmitted++; sim->waiting_ticks += sim->tick - packet.queue_tick; return 1; }
