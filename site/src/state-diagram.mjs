// Draws the gallery deletion state machine by hand, because Mermaid's
// automatic layout crosses its edges. The layouts are fixed; the labels are
// read from the article's Mermaid source, so both languages share them.
// The narrow layout fits a phone screen without sideways scrolling.

function wideLayout() {
  const node = { w: 150, h: 44, x: 150 };
  const rows = { idle: 56, confirming: 176, deleting: 296, failed: 416 };
  const mid = (name) => rows[name] + node.h / 2;
  const left = node.x;
  const right = node.x + node.w;
  const centre = node.x + node.w / 2;
  return {
    node,
    rows,
    startY: 16,
    viewBox: "34 0 560 520",
    edges: {
      "idle>confirming": { points: [[200, mid("idle") + 22], [200, rows.confirming]], label: [192, 143, "end"] },
      "confirming>idle": { points: [[250, rows.confirming], [250, mid("idle") + 22]], label: [258, 143, "start"] },
      "confirming>deleting": { points: [[centre, mid("confirming") + 22], [centre, rows.deleting]], label: [233, 263, "start"] },
      "deleting>failed": { points: [[centre, mid("deleting") + 22], [centre, rows.failed]], label: [233, 383, "start"] },
      "deleting>idle": {
        points: [[left, mid("deleting")], [40, mid("deleting")], [40, mid("idle")], [left, mid("idle")]],
        label: [52, 70, "start"],
      },
      "failed>confirming": {
        points: [[right, mid("failed")], [380, mid("failed")], [380, mid("confirming")], [right, mid("confirming")]],
        label: [388, 323, "start"],
      },
      "failed>idle": {
        points: [[centre, rows.failed + node.h], [centre, 492], [530, 492], [530, mid("idle")], [right, mid("idle")]],
        label: [380, 512, "middle"],
      },
    },
  };
}

function narrowLayout() {
  const node = { w: 104, h: 40, x: 108 };
  const rows = { idle: 52, confirming: 160, deleting: 268, failed: 376 };
  const mid = (name) => rows[name] + node.h / 2;
  const top = (name) => rows[name];
  const bottom = (name) => rows[name] + node.h;
  const left = node.x;
  const right = node.x + node.w;
  const centre = node.x + node.w / 2;
  return {
    node,
    rows,
    startY: 14,
    viewBox: "0 0 374 470",
    edges: {
      "idle>confirming": { points: [[146, bottom("idle")], [146, top("confirming")]], label: [138, 131, "end"] },
      "confirming>idle": { points: [[184, top("confirming")], [184, bottom("idle")]], label: [192, 131, "start"] },
      "confirming>deleting": { points: [[centre, bottom("confirming")], [centre, top("deleting")]], label: [152, 239, "end"] },
      "deleting>failed": { points: [[centre, bottom("deleting")], [centre, top("failed")]], label: [152, 347, "end"] },
      "deleting>idle": {
        points: [[left, mid("deleting")], [5, mid("deleting")], [5, mid("idle")], [left, mid("idle")]],
        label: [18, 64, "start"],
      },
      "failed>confirming": {
        points: [[right, mid("failed")], [342, mid("failed")], [342, mid("confirming")], [right, mid("confirming")]],
        // Sits over the line that leaves "failed", the one place with room for it.
        label: [334, 388, "end"],
      },
      // Leaves from the bottom of "failed", so its label can sit under the line.
      "failed>idle": {
        points: [[centre, bottom("failed")], [centre, 440], [362, 440], [362, mid("idle")], [right, mid("idle")]],
        label: [261, 462, "middle"],
      },
    },
  };
}

const layouts = { wide: wideLayout(), narrow: narrowLayout() };

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

export function parseStateDiagram(source) {
  const lines = source.trim().split("\n").map((l) => l.trim());
  if (lines[0] !== "stateDiagram-v2") return null;
  const labels = {};
  for (const line of lines.slice(1)) {
    const m = line.match(/^(\S+)\s*-->\s*(\S+?)(?::\s*(.+))?$/);
    if (!m || m[1] === "[*]") continue;
    labels[`${m[1]}>${m[2]}`] = m[3] ?? "";
  }
  const keys = Object.keys(labels).sort().join();
  return keys === Object.keys(layouts.wide.edges).sort().join() ? labels : null;
}

function arrow(points) {
  const [x1, y1] = points.at(-2);
  const [x2, y2] = points.at(-1);
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const bx = x2 - ux * 9;
  const by = y2 - uy * 9;
  return `<path class="sd-head" d="M${x2} ${y2} L${bx - uy * 4.5} ${by + ux * 4.5} L${bx + uy * 4.5} ${by - ux * 4.5} Z"/>`;
}

function render(layout, variant, labels, title) {
  const { node, rows, edges } = layout;
  const centre = node.x + node.w / 2;
  const parts = [];
  parts.push(`<circle class="sd-start" cx="${centre}" cy="${layout.startY}" r="7"/>`);
  const start = [[centre, layout.startY + 7], [centre, rows.idle]];
  parts.push(`<polyline class="sd-edge" points="${start.join(" ")}"/>${arrow(start)}`);
  for (const [key, edge] of Object.entries(edges)) {
    parts.push(`<polyline class="sd-edge" points="${edge.points.join(" ")}"/>${arrow(edge.points)}`);
    const [x, y, anchor, direction] = edge.label;
    const turn = direction === "up" ? ` transform="rotate(-90 ${x} ${y})"` : "";
    parts.push(`<text class="sd-label" x="${x}" y="${y}" text-anchor="${anchor}"${turn}>${esc(labels[key])}</text>`);
  }
  for (const [name, top] of Object.entries(rows)) {
    parts.push(
      `<rect class="sd-node" x="${node.x}" y="${top}" width="${node.w}" height="${node.h}" rx="${node.h / 2}"/>` +
        `<text class="sd-name" x="${centre}" y="${top + node.h / 2 + 6}" text-anchor="middle">${name}</text>`,
    );
  }
  return `<svg class="state-diagram state-diagram--${variant}" viewBox="${layout.viewBox}" role="img" aria-label="${esc(title)}" xmlns="http://www.w3.org/2000/svg">${parts.join("")}</svg>`;
}

export function stateDiagramSvg(labels, title) {
  return render(layouts.wide, "wide", labels, title) + render(layouts.narrow, "narrow", labels, title);
}
