'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, Check, ChevronRight, CircleDot, Cpu, Download, Gauge, Layers3, Menu, Network, Pause, Play, RotateCcw, Send, Server, Terminal, Timer, X, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const priorities = ['Low', 'Normal', 'High', 'Critical']
const profiles = ['Light', 'Moderate', 'Heavy', 'Burst']
const stages = [
  ['01', 'GENERATE', 'Create a packet with source, destination, size, and priority.'],
  ['02', 'RECEIVE', 'Accept the packet at the router ingress.'],
  ['03', 'ENQUEUE', 'Insert it if the finite buffer has capacity.'],
  ['04', 'SCHEDULE', 'Select the next packet with the active policy.'],
  ['05', 'TRANSMIT', 'Remove and process the selected packet.'],
  ['06', 'MEASURE', 'Update traffic and performance statistics.'],
]
const initialPackets = [
  { id: 'P0042', priority: 'High', src: '10.0.0.8', dest: '172.16.2.4', size: 1240, tick: 12 },
  { id: 'P0043', priority: 'Normal', src: '10.0.0.12', dest: '172.16.2.9', size: 860, tick: 12 },
  { id: 'P0044', priority: 'Critical', src: '10.0.0.3', dest: '172.16.2.1', size: 1480, tick: 13 },
  { id: 'P0045', priority: 'Low', src: '10.0.0.18', dest: '172.16.2.7', size: 512, tick: 13 },
  { id: 'P0046', priority: 'High', src: '10.0.0.21', dest: '172.16.2.8', size: 960, tick: 14 },
]

function Logo() { return <a href="#overview" className="logo"><span className="logo-mark"><span /><span /><span /></span><span>ROUTIQ</span></a> }
function SectionLabel({ children }) { return <div className="section-label"><span>{children}</span></div> }
function Stat({ label, value, suffix }) { return <div className="stat"><span className="stat-value">{value}{suffix && <small>{suffix}</small>}</span><span className="stat-label">{label}</span></div> }
function RouterDiagram() {
  return <div className="router-diagram" aria-label="Network packet routing visualization">
    <div className="diagram-grid" />
    <div className="diagram-label ingress">INGRESS <span>→</span></div>
    <div className="route route-a"><i>P0042</i><i>P0043</i><i>P0044</i></div>
    <div className="router-node"><div className="router-core"><Network /></div><span>ROUTER</span><b>ACTIVE</b></div>
    <div className="route route-b"><i>P0041</i><i>P0039</i></div>
    <div className="diagram-label egress"><span>→</span> EGRESS</div>
    <div className="buffer-mini"><div className="mini-head"><span>BUFFER</span><b>05 / 16</b></div><div className="mini-slots">{Array.from({ length: 16 }, (_, i) => <span key={i} className={i < 5 ? 'filled' : ''} />)}</div></div>
    <div className="process-card"><span className="pulse" /> PROCESSING <b>P0042</b><small>priority: high</small></div>
  </div>
}

function Simulator({ compact = false }) {
  const [policy, setPolicy] = useState('circular')
  const [capacity, setCapacity] = useState(16)
  const [intensity, setIntensity] = useState(4)
  const [rate, setRate] = useState(2)
  const [profile, setProfile] = useState('Moderate')
  const [packets, setPackets] = useState(initialPackets)
  const [tick, setTick] = useState(14)
  const [generated, setGenerated] = useState(46)
  const [transmitted, setTransmitted] = useState(31)
  const [dropped, setDropped] = useState(2)
  const [running, setRunning] = useState(false)
  const [selected, setSelected] = useState(null)
  const runTick = useCallback((amount = 1) => {
    setTick(currentTick => {
      setGenerated(currentGenerated => currentGenerated + intensity * amount)
      setTransmitted(currentTransmitted => currentTransmitted + Math.min(rate * amount, packets.length))
      setPackets(currentPackets => {
        const transmittedNow = Math.min(rate * amount, currentPackets.length)
        const remainingPackets = currentPackets.slice(transmittedNow)
        const incomingCount = intensity * amount
        const availableSlots = Math.max(0, capacity - remainingPackets.length)
        const acceptedCount = Math.min(incomingCount, availableSlots)
        const droppedNow = incomingCount - acceptedCount

        setDropped(currentDropped => currentDropped + droppedNow)

        return [...remainingPackets, ...Array.from({ length: acceptedCount }, (_, i) => ({
          ...initialPackets[(currentTick + i) % initialPackets.length],
          id: `P${String(generated + i + 1).padStart(4, '0')}`,
          tick: currentTick + amount,
        }))]
      })
      return currentTick + amount
    })
  }, [capacity, generated, intensity, packets.length, rate])
  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => runTick(), 900)
    return () => window.clearInterval(timer)
  }, [running, runTick])
  const reset = () => { setPackets(initialPackets); setTick(14); setGenerated(46); setTransmitted(31); setDropped(2); setSelected(null); setRunning(false) }
  const utilization = Math.round((packets.length / capacity) * 100)
  const chart = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ h: 22 + ((i * 13 + tick) % 52), n: 18 + ((i * 7 + generated) % 38) })), [tick, generated])
  return <section id="simulator" className={`simulator-section ${compact ? 'compact' : ''}`}>
    {!compact && <div className="sim-head"><div><SectionLabel>04 / LIVE WORKSPACE</SectionLabel><h2>Run the traffic.</h2></div><div className="engine-chip"><span className="status-dot" /> C ENGINE <span className="chip-divider" /> DEMO ADAPTER</div></div>}
    <div className="sim-layout">
      <aside className="config card"><div className="card-kicker"><SlidersIcon /> SIMULATION CONFIGURATION</div>
        <label>Queue policy</label><div className="segmented"><button className={policy === 'circular' ? 'active' : ''} onClick={() => setPolicy('circular')}>Circular FIFO</button><button className={policy === 'priority' ? 'active' : ''} onClick={() => setPolicy('priority')}>Priority</button></div>
        <label>Buffer capacity <b>{capacity} slots</b></label><input type="range" min="4" max="64" value={capacity} onChange={e => setCapacity(+e.target.value)} />
        <label>Traffic intensity <b>{intensity} / interval</b></label><input type="range" min="1" max="20" value={intensity} onChange={e => setIntensity(+e.target.value)} />
        <label>Processing rate <b>{rate} / tick</b></label><input type="range" min="1" max="8" value={rate} onChange={e => setRate(+e.target.value)} />
        <label>Traffic profile</label><select value={profile} onChange={e => setProfile(e.target.value)}>{profiles.map(p => <option key={p}>{p}</option>)}</select>
        <div className="control-row"><Button aria-pressed={running} onClick={() => setRunning(current => !current)}><AnimatePresence mode="wait" initial={false}><motion.span key={running ? 'pause' : 'play'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }} className="inline-flex"><Play data-icon="inline-start" /></motion.span></AnimatePresence> {running ? 'Pause automation' : 'Start automation'}</Button><Button variant="outline" onClick={() => runTick()}><ChevronRight data-icon="inline-start" /> Step once</Button></div>
        <div className="control-row"><Button variant="secondary" onClick={() => runTick(100)}><Zap data-icon="inline-start" /> Run 100 ticks</Button><Button variant="ghost" aria-label="Reset simulation" onClick={reset}><RotateCcw data-icon="inline-start" /></Button></div>
        <div className="sim-help"><b>How to read this</b><p>Each tick removes packets at the processing rate, then adds new arrivals. Circular FIFO serves the oldest packet first; Priority serves the most important packet first.</p></div>
      </aside>
      <div className="workspace-main">
        <div className="card buffer-card"><div className="panel-head"><div><div className="card-kicker"><Layers3 /> PACKET BUFFER</div><h3>{policy === 'circular' ? 'Circular queue' : 'Priority queue'} <span>· tick {String(tick).padStart(3, '0')}</span></h3></div><div className="pointer-stats"><b>{packets.length}</b> / {capacity} occupied <span className="util">{utilization}%</span></div></div>
          <div className="queue-meta"><span><i className="legend front" /> FRONT <b>00</b></span><span><i className="legend rear" /> REAR <b>{String(Math.max(0, packets.length - 1)).padStart(2, '0')}</b></span><span>AVAILABLE <b>{Math.max(0, capacity - packets.length)}</b></span></div>
          <div className={`queue ${policy}`} style={{ '--cols': Math.min(capacity, 16) }}>{Array.from({ length: Math.min(capacity, 16) }, (_, i) => { const packet = packets[i]; return <motion.button layout key={i} onClick={() => setSelected(packet)} className={`slot ${packet ? 'occupied' : ''} ${packet?.priority.toLowerCase() || ''} ${i === 0 ? 'front-slot' : ''}`} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2, delay: i * 0.015 }}><span className="slot-index">{String(i).padStart(2, '0')}</span>{packet ? <><b>{packet.id}</b><small>{packet.priority}</small></> : <span className="empty-dash">—</span>}</motion.button> })}</div>
          <div className="legend-row"><span><i className="legend empty" /> Empty</span><span><i className="legend occupied-dot" /> Occupied</span><span><i className="legend high" /> Priority</span><span><i className="legend transmitted" /> Transmitting</span></div>
        </div>
        <div className="lower-grid"><div className="card inspector"><div className="card-kicker"><CircleDot /> PACKET INSPECTOR</div>{selected ? <><div className="packet-title"><b>{selected.id}</b><span className={`priority ${selected.priority.toLowerCase()}`}>{selected.priority}</span></div><div className="detail-grid"><span>SOURCE <b>{selected.src}</b></span><span>DESTINATION <b>{selected.dest}</b></span><span>SIZE <b>{selected.size} B</b></span><span>ARRIVAL TICK <b>{selected.tick}</b></span><span>QUEUE ENTRY <b>{selected.tick}</b></span><span>WAITING <b>{tick - selected.tick} ticks</b></span></div></> : <div className="empty-inspector"><Terminal />Select a packet slot to inspect its state.</div>}</div><div className="card event-log"><div className="panel-head"><div className="card-kicker"><Terminal /> EVENT LOG</div><span className="live-label"><span className="status-dot" /> LIVE</span></div><div className="events"><p><span>[TICK {String(tick).padStart(3, '0')}]</span> <b>PACKET {packets[0]?.id || 'P0000'} ENQUEUED</b></p><p><span>[TICK {String(tick - 1).padStart(3, '0')}]</span> <b className="green">P0041 TRANSMITTED</b></p><p><span>[TICK {String(tick - 2).padStart(3, '0')}]</span> <b className="amber">P0040 SCHEDULED</b></p><p><span>[TICK {String(tick - 3).padStart(3, '0')}]</span> <b className="red">BUFFER FULL — P0038 DROPPED</b></p></div></div></div>
      </div>
    </div>
    {!compact && <div className="metrics"><Stat label="PACKETS GENERATED" value={generated} /><Stat label="TRANSMITTED" value={transmitted} /><Stat label="DROPPED" value={dropped} /><Stat label="BUFFER UTILIZATION" value={utilization} suffix="%" /><Stat label="AVG WAITING TIME" value="2.8" suffix=" ticks" /><Stat label="THROUGHPUT" value="2.21" suffix=" / tick" /></div>}
    {!compact && <div className="analytics-grid"><div className="card chart-card"><div className="card-kicker"><Gauge /> TRAFFIC OVER TIME</div><div className="chart-legend"><span className="line-green" /> Transmitted <span className="line-amber" /> Generated <span className="line-red" /> Dropped</div><div className="bars">{chart.map((v, i) => <div className="bar-group" key={i}><i style={{ height: `${v.n}%` }} /><i style={{ height: `${v.h}%` }} /><i style={{ height: `${Math.max(8, v.h - 20)}%` }} /></div>)}</div><div className="axis"><span>01</span><span>05</span><span>09</span><span>13</span><span>{tick}</span></div></div><div className="card comparison"><div className="card-kicker"><Timer /> QUEUE COMPARISON</div><h3>Same traffic. Different behavior.</h3><p>Run both policies against an equivalent workload and compare what the data reveals.</p><div className="compare-row"><span>FIFO</span><b>2.8 ticks</b><em>avg wait</em></div><div className="compare-row"><span>PRIORITY</span><b>2.1 ticks</b><em>avg wait</em></div><Button variant="outline" onClick={() => runTick(20)}>Run comparison <ArrowRight data-icon="inline-end" /></Button></div></div>}
  </section>
}
const implementationSnippets = {
  'circular_queue.c': `#include "routiq.h"

void initCircularQueue(CircularQueue *q) {
  q->front = 0;
  q->rear = 0;
  q->size = 0;
}

int enqueueCircular(CircularQueue *q, Packet packet) {
  if (isCircularFull(q)) return 0;
  q->items[q->rear] = packet;
  q->rear = (q->rear + 1) % MAX_BUFFER;
  q->size++;
  return 1;
}

int dequeueCircular(CircularQueue *q, Packet *packet) {
  if (isCircularEmpty(q)) return 0;
  *packet = q->items[q->front];
  q->front = (q->front + 1) % MAX_BUFFER;
  q->size--;
  return 1;
}`,
  'priority_queue.c': `#include "routiq.h"

void initPriorityQueue(PriorityQueue *q) {
  q->size = 0;
}

int enqueuePriority(PriorityQueue *q, Packet packet) {
  if (q->size == MAX_BUFFER) return 0;
  int i = q->size++;
  while (i > 0 && q->items[i - 1].priority < packet.priority) {
    q->items[i] = q->items[i - 1];
    i--;
  }
  q->items[i] = packet;
  return 1;
}

int dequeuePriority(PriorityQueue *q, Packet *packet) {
  if (q->size == 0) return 0;
  *packet = q->items[0];
  for (int i = 1; i < q->size; i++)
    q->items[i - 1] = q->items[i];
  q->size--;
  return 1;
}`,
  'simulation.c': `#include "routiq.h"

int simulation_step(Simulation *sim) {
  Packet packet;
  sim->tick++;

  if (sim->policy == PRIORITY_POLICY)
    dequeuePriority(&sim->priority, &packet);
  else
    dequeueCircular(&sim->circular, &packet);

  sim->transmitted++;
  sim->waiting_ticks += sim->tick - packet.queue_tick;
  return 1;
}`,
}

function ImplementationCode() {
  const [file, setFile] = useState('circular_queue.c')
  return <div className="code-card card"><div className="code-tabs">{Object.keys(implementationSnippets).map((name) => <button key={name} className={file === name ? 'active' : ''} onClick={() => setFile(name)}>{name}</button>)}</div><pre><code>{implementationSnippets[file]}</code></pre><div className="code-foot"><span>✓ compiled with emcc</span><span>{file === 'priority_queue.c' ? 'O(n) ordered insert' : file === 'simulation.c' ? 'one tick / step' : 'O(1) enqueue / dequeue'}</span></div></div>
}

function SlidersIcon() { return <Gauge /> }

export default function Page() {
  return <main><nav className="nav"><Logo /><div className="nav-links"><a href="#overview">Overview</a><a href="#architecture">Architecture</a><a href="#simulator">Simulator</a><a href="#implementation">Implementation</a></div><div className="nav-actions"><span className="engine-status"><span className="status-dot" /> C ENGINE</span><Button onClick={() => document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' })}>Launch Simulator <ArrowRight data-icon="inline-end" /></Button><button className="menu-btn" aria-label="Menu"><Menu /></button></div></nav>
    <section className="hero" id="overview"><div className="hero-copy"><SectionLabel>DATA STRUCTURES / NETWORK SYSTEMS</SectionLabel><h1>Inside the logic of a <em>network router.</em></h1><p>ROUTIQ simulates how routers receive, buffer, prioritize, and process network packets. Explore circular queues, priority scheduling, buffer congestion, and packet drops through a live interactive simulation.</p><div className="hero-actions"><Button size="lg" onClick={() => document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' })}>Launch Simulator <ArrowRight data-icon="inline-end" /></Button><Button variant="outline" size="lg" onClick={() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })}>Explore Architecture</Button></div><div className="hero-facts"><Stat label="CORE QUEUE STRUCTURES" value="02" /><Stat label="SIMULATION ENGINE" value="C" /><Stat label="TRAFFIC METRICS" value="LIVE" /></div></div><RouterDiagram /></section>
    <section className="overview section" id="architecture"><SectionLabel>01 / SYSTEM OVERVIEW</SectionLabel><div className="section-intro"><h2>A router is only as<br /> efficient as its queue.</h2><p>Traffic is unpredictable. Buffer space is not. ROUTIQ makes the hidden trade-offs of packet scheduling visible.</p></div><div className="feature-grid">{[[Server,'Packet Ingress','Packets arrive with source, destination, size, arrival time, and priority.','packet_t → router'],[Layers3,'Finite-Capacity Buffer','Limited storage means bursts can create congestion and packet drops.','capacity = 16'],[Network,'Queue Scheduling','Compare FIFO order with priority-based scheduling under the same workload.','O(1) vs O(log n)'],[Gauge,'Traffic Analytics','Measure throughput, waiting time, utilization, congestion, and loss.','metrics(t) → live']].map(([Icon,title,desc,detail]) => <article className="feature-card" key={title}><Icon /><h3>{title}</h3><p>{desc}</p><code>{detail}</code></article>)}</div></section>
    <section className="lifecycle section"><SectionLabel>02 / PACKET LIFECYCLE</SectionLabel><div className="section-intro"><h2>From ingress to egress.</h2><p>Every tick is a small experiment in queue behavior.</p></div><div className="stages">{stages.map(([n,t,d], i) => <div className="stage" key={n}><span>{n}</span><div><b>{t}</b><p>{d}</p></div>{i < 5 && <ChevronRight />}</div>)}</div></section>
    <Simulator />
    <section className="under-hood section" id="implementation"><SectionLabel>03 / UNDER THE HOOD</SectionLabel><div className="section-intro"><h2>The data structures<br /> are the engine.</h2><p>The interface stays out of the way. Packets, queues, scheduling, and metrics are owned by the simulation layer.</p></div><div className="code-layout"><ImplementationCode /><div className="responsibility card"><div className="card-kicker"><Cpu /> SYSTEM BOUNDARY</div><div className="boundary-row"><span className="react-box">REACT UI</span><ArrowRight /><span className="wasm-box">WASM</span><ArrowRight /><span className="c-box">C ENGINE</span></div><p>React owns presentation, controls, and charts. The C engine owns packet state, capacity checks, scheduling, transmission, and statistics.</p><div className="trace"><span>LAST OPERATION</span><b>DEQUEUE → P0041</b><small>priority queue · tick 014</small></div></div></div></section>
    <footer><Logo /><span>Every packet has a path. Every queue has a cost.</span><span>DATA STRUCTURES PROJECT / 2026</span></footer>
  </main>
}
