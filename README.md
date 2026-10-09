# ROUTIQ
### Network Packet Buffer & Traffic Simulator

**ROUTIQ** is a network traffic simulation project that models how a router receives, buffers, and processes network packets under different traffic conditions. Built using **C**, the project demonstrates the practical application of fundamental data structures in network traffic management.

The simulator models limited buffer capacity, packet scheduling, congestion, packet drops, and traffic processing to help analyze how different queue policies affect router performance.

---

## Overview

Modern routers handle packets arriving from multiple devices and transmit them toward their destinations. Since packets may arrive faster than a router can process them, routers require buffers and scheduling mechanisms to manage incoming traffic efficiently.

ROUTIQ simulates this process in a controlled environment, allowing users to generate network traffic, configure buffer capacity, select packet processing policies, and analyze simulation results.

## Key Features

- **Packet Generation** — Simulate incoming network packets with configurable traffic loads.
- **Circular Queue** — Manage packet buffering efficiently using a fixed-capacity circular queue.
- **Priority Queue** — Process packets according to their assigned priority levels.
- **Buffer Management** — Model limited router buffer capacity and track buffer utilization.
- **Congestion Simulation** — Observe how high traffic loads affect packet processing.
- **Packet Drop Detection** — Track packets dropped when the buffer reaches its capacity.
- **Traffic Analysis** — Compare throughput, packet drops, processing rates, and buffer utilization.
- **Interactive Simulation** — Observe packet arrivals, queue operations, and processing behavior.
- **Policy Comparison** — Evaluate how different packet scheduling strategies perform under varying traffic conditions.

## Core Data Structures

### 1. Circular Queue

A circular queue manages the router's packet buffer using a fixed-size array. The rear and front positions wrap around when they reach the end of the array, allowing freed positions to be reused without shifting existing elements.

**Operations:**
- Enqueue: Add an incoming packet.
- Dequeue: Remove a packet for processing.
- Full-buffer detection: Identify when no additional packets can be accepted.
- Empty-buffer detection: Identify when no packets are waiting.

### 2. Priority Queue

A priority queue schedules packets based on their assigned priority. Higher-priority packets are selected for processing before lower-priority packets, according to the scheduling policy implemented in the simulator.

**Operations:**
- Insert packets with priority levels.
- Select packets according to priority.
- Remove processed packets.
- Track packet processing order.

The simulator demonstrates how priority-based scheduling differs from standard queue processing.

## Simulation Metrics

ROUTIQ tracks key performance indicators to evaluate the simulated router:

| Metric | Description |
|---|---|
| Total Packets | Number of packets generated during a simulation |
| Processed Packets | Packets successfully processed by the router |
| Dropped Packets | Packets rejected because the buffer is full |
| Pending Packets | Packets still waiting for processing |
| Throughput | Number of packets processed per unit of simulated time |
| Packet Drop Rate | Percentage of generated packets that were dropped |
| Buffer Utilization | Percentage of buffer capacity currently occupied |
| Average Waiting Time | Average time packets spend waiting in the buffer |

These metrics help illustrate the relationship between incoming traffic, buffer capacity, scheduling policies, and router performance.

## Technology Stack

- **C** — Core simulation logic and data structure implementation.
- **Circular Queue** — Fixed-capacity packet buffering.
- **Priority Queue** — Priority-based packet scheduling.
- **HTML, CSS, JavaScript, React, and shadcn/ui** — Optional presentation layer for an interactive web interface, if used by the final implementation.

The packet simulation and its core data structures are implemented in C. Any web interface serves as a presentation layer and does not replace the C implementation.

## Project Objectives

- Apply circular queues and priority queues to a practical networking scenario.
- Understand packet buffering and scheduling in router systems.
- Simulate congestion and buffer overflow.
- Analyze packet loss and throughput under different traffic loads.
- Compare scheduling behavior using measurable performance metrics.
- Demonstrate the practical relevance of data structures in computer networking.

## Getting Started

### Prerequisites

- A C compiler, such as GCC.
- A terminal or command-line environment.
- A compatible operating system, such as Windows, Linux, or macOS.

### Compilation

Once the C source file is available, compile it using GCC:

```bash
gcc main.c -o routiq
```

### Run the Simulator

**Linux / macOS**

```bash
./routiq
```

**Windows**

```bash
routiq.exe
```

> Update the source filename and compilation command if the final project uses multiple C source files.

## Expected Workflow

1. Configure the router buffer capacity and traffic parameters.
2. Generate incoming packets with relevant attributes.
3. Store packets in the buffer using the selected queue policy.
4. Process packets according to the scheduling rules.
5. Handle buffer overflow and record packet drops.
6. Collect simulation statistics.
7. Compare performance under different traffic loads and scheduling policies.

## Learning Outcomes

Through ROUTIQ, the project demonstrates:

- Array-based circular queue implementation.
- Priority queue operations and scheduling.
- Queue overflow and underflow handling.
- Simulation of producer-consumer behavior.
- Basic network traffic and congestion concepts.
- Performance measurement and comparative analysis.
- The application of data structures to real-world systems.

## Project Scope

ROUTIQ is an educational simulator. It models selected aspects of router buffering and packet scheduling rather than transmitting real network traffic or replacing production router software.

Its results depend on the implemented arrival model, processing model, buffer configuration, and scheduling rules.

## Future Enhancements

- Additional scheduling policies.
- Configurable packet arrival and processing rates.
- More detailed traffic patterns and congestion scenarios.
- Expanded performance analytics and simulation history.
- Exportable simulation reports.
- Support for additional queueing algorithms.

## Author

Developed as a **Data Structures project** to explore the role of fundamental data structures in network packet management and traffic simulation.

---

**ROUTIQ — Simulate Traffic. Analyze Queues. Understand Performance.**
