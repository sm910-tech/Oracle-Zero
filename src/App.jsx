import React, { useState } from 'react'

const HARDWARE_PROFILES = {
  legacy_laptop: {
    label: 'Legacy Dual-Core (i3-4005U / 6GB DDR3 / SATA SSD)',
    cpuScore: 38,
    gpuScore: 22,
    ramScore: 55,
    storageScore: 78,
    status: 'BOTTLENECK DETECTED',
    badgeClass: 'badge-warning',
    bottleneck: 'CPU & Integrated Graphics (Intel HD 4400)',
    recommendations: [
      'Upgrade RAM to 8GB or 16GB Dual-Channel DDR3L-1600MHz to maximize integrated GPU bandwidth.',
      'Use lightweight Linux or stripped Windows build with hardware-accelerated scheduling.',
      'Maintain clean fan/heatsink assembly with fresh thermal paste to hold 1.70 GHz sustained clock.',
    ],
    logs: [
      '[KERNEL] Probing SMBIOS & PCI Express root complex...',
      '[CPU] Intel Core i3-4005U @ 1.70GHz (2C/4T Haswell-ULT) detected.',
      '[MEM] 6144 MB DDR3L @ 1600 MT/s (Asymmetric Dual-Channel mode).',
      '[IO] 256GB SATA-III 6.0Gb/s SSD — Sequential read nominal (~520 MB/s).',
      '[NET] Ralink RT3290 802.11n 2.4GHz PCIe Adapter — high congestion sensitivity.',
      '[VERDICT] Compute bottleneck on heavy compilation & 3D workloads. I/O responsiveness saved by SATA SSD.',
    ],
  },
  midrange_workstation: {
    label: 'Balanced Engineering Rig (Ryzen 5 / 16GB DDR5 / RTX 3050)',
    cpuScore: 82,
    gpuScore: 76,
    ramScore: 85,
    storageScore: 92,
    status: 'OPTIMAL BALANCE',
    badgeClass: 'badge-success',
    bottleneck: 'Minor VRAM Ceiling (4GB/6GB GDDR6 in heavy 3D)',
    recommendations: [
      'Enable EXPO/XMP profile in BIOS to ensure full DDR5 memory bandwidth.',
      'Allocate dedicated NVMe scratch disk for CAD, VLSI simulation, and container builds.',
      'Configure NVIDIA Studio / CUDA compute profiles for accelerated workloads.',
    ],
    logs: [
      '[KERNEL] Initializing PCIe Gen 4.0 x16 telemetry bus...',
      '[CPU] 6-Core / 12-Thread Zen Architecture — Boost clocks nominal.',
      '[MEM] 16384 MB DDR5 Dual-Channel active — latency within optimal thresholds.',
      '[GPU] Dedicated Ampere CUDA cores online — hardware encoding ready.',
      '[VERDICT] Well-balanced pipeline (<6% variance between CPU frame prep and GPU render).',
    ],
  },
  gpu_starved: {
    label: 'High-CPU / Weak-GPU Setup (Core i7 / 32GB RAM / GT 1030)',
    cpuScore: 91,
    gpuScore: 28,
    ramScore: 94,
    storageScore: 88,
    status: 'SEVERE GPU BOTTLENECK',
    badgeClass: 'badge-danger',
    bottleneck: 'Discrete GPU Shader & Memory Bus (64-bit)',
    recommendations: [
      'Upgrade GPU to at least an RTX 3060 / RX 6600 or higher to match CPU throughput.',
      'Verify PSU wattage (550W+ 80+ Bronze/Gold) before installing a high-TDP GPU.',
      'Offload parallel tasks to CPU threads until GPU upgrade is completed.',
    ],
    logs: [
      '[KERNEL] Analyzing frame-time delivery & PCIe lane saturation...',
      '[CPU] High multi-core headroom — 74% idle wait states during graphics load.',
      '[GPU] Frame buffer saturated — 100% core utilization with high frame-time spikes.',
      '[VERDICT] Severe graphical mismatch. CPU is waiting on GPU render completion.',
    ],
  },
}

export default function App() {
  const [selectedKey, setSelectedKey] = useState('legacy_laptop')
  const [customWorkload, setCustomWorkload] = useState('Engineering & Dev Workloads')
  const [terminalLines, setTerminalLines] = useState(
    HARDWARE_PROFILES.legacy_laptop.logs
  )

  const profile = HARDWARE_PROFILES[selectedKey]

  const handleProfileChange = (e) => {
    const key = e.target.value
    setSelectedKey(key)
    setTerminalLines(HARDWARE_PROFILES[key].logs)
  }

  const runDeepScan = () => {
    const timestamp = new Date().toLocaleTimeString()
    setTerminalLines((prev) => [
      ...prev,
      `[${timestamp}] Executing deep telemetry sweep for workload: "${customWorkload}"...`,
      `[${timestamp}] Bottleneck focus confirmed: ${profile.bottleneck}`,
    ])
  }

  return (
    <>
      <header className="navbar">
        <div className="brand-title">
          <span>🔮</span>
          <span>ORACLE ZERO</span>
          <span className="badge">v2.4 KERNEL</span>
        </div>
        <div className="flex items-center">
          <span className={`badge ${profile.badgeClass}`}>{profile.status}</span>
        </div>
      </header>

      <main className="container">
        <div className="mb-6">
          <h1>Hardware Bottleneck & Decision Engine</h1>
          <p>
            Select a hardware architecture profile or simulate workload stress to inspect
            subsystem telemetry, bus saturation, and kernel-level upgrade paths.
          </p>
        </div>

        {/* Control Panel */}
        <section className="card mb-6">
          <div className="grid-2">
            <div>
              <label htmlFor="profile-select">Target Hardware Architecture</label>
              <select
                id="profile-select"
                value={selectedKey}
                onChange={handleProfileChange}
              >
                {Object.entries(HARDWARE_PROFILES).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="workload-input">Primary Target Workload</label>
              <div className="flex">
                <input
                  id="workload-input"
                  type="text"
                  value={customWorkload}
                  onChange={(e) => setCustomWorkload(e.target.value)}
                  placeholder="e.g., Python Dev, VLSI Simulation, Gaming"
                />
                <button type="button" onClick={runDeepScan}>
                  Scan
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Telemetry Metrics */}
        <div className="grid-2 mb-6">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3>Subsystem Telemetry</h3>
              <span className="badge">LIVE INDEX</span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>CPU Compute Throughput</span>
                <span className="text-mono text-accent">{profile.cpuScore}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${profile.cpuScore}%` }}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>GPU Shader / Render Pipeline</span>
                <span className="text-mono text-accent">{profile.gpuScore}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${profile.gpuScore}%` }}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Memory Bandwidth & Capacity</span>
                <span className="text-mono text-accent">{profile.ramScore}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${profile.ramScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Storage I/O Responsiveness</span>
                <span className="text-mono text-accent">{profile.storageScore}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${profile.storageScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Upgrade Recommendations */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3>Upgrade & Optimization Matrix</h3>
              <span className={`badge ${profile.badgeClass}`}>ACTIONABLE</span>
            </div>
            <p className="mb-4">
              <strong>Primary Limiter:</strong>{' '}
              <span className="text-warning">{profile.bottleneck}</span>
            </p>
            <div className="flex-col">
              {profile.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(15, 20, 32, 0.7)',
                    borderLeft: '3px solid var(--accent-primary)',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.92rem',
                  }}
                >
                  {rec}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnostic Terminal */}
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
            </div>
            <span>oracle-zero@kernel-diagnostics:~</span>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
              onClick={() => setTerminalLines(profile.logs)}
            >
              Reset Log
            </button>
          </div>
          <div className="terminal-body">
            {terminalLines.map((line, index) => (
              <span key={index} className="terminal-line">
                <span className="terminal-prompt">$</span>
                {line}
              </span>
            ))}
          </div>
        </div>
      </main>

      <footer>
        ORACLE ZERO — Decision Exploration & Hardware Diagnostic Platform • Built with
        React & Vite
      </footer>
    </>
  )
}
