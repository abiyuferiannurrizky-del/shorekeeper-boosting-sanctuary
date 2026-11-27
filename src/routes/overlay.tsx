import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import portrait from "@/assets/shorekeeper-portrait.jpg.asset.json";
import { Butterfly } from "@/components/brand/Butterfly";
import { activeQueue, queueStats } from "@/lib/queue/logic";
import { useQueue } from "@/lib/queue/store";
import { STATUS_LABEL } from "@/lib/queue/types";
import "@/components/overlay/overlay.css";

export const Route = createFileRoute("/overlay")({
  head: () => ({ meta: [{ title: "BONGJOKI Overlay" }, { name: "robots", content: "noindex" }] }),
  component: Overlay,
});

const W = 1920;
const H = 1080;

function Overlay() {
  const entries = useQueue();
  const list = activeQueue(entries).slice(0, 5);
  const stats = queueStats(entries);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div className="ov-canvas" style={{ transform: `scale(${scale})` }}>
      <section className="ov-panel">
        <header className="ov-header">
          <div className="ov-brand">
            <Butterfly className="ov-butterfly" />
            <div>
              <p className="ov-title">BONGJOKI</p>
              <p className="ov-sub">Black Shores Queue System</p>
            </div>
          </div>
          <span className="ov-live"><i /> Live Status</span>
        </header>
        <div className="ov-line" />
        <ul className="ov-list">
          {list.length === 0 && <li className="ov-empty">No active orders</li>}
          {list.map((e) => (
            <li key={e.id} className={`ov-row ov-${e.status}`}>
              <span className="ov-num">#{String(e.queue_number).padStart(3, "0")}</span>
              <span className="ov-who">
                <b>{e.customer_name}</b>
                <small>@{e.discord_username}</small>
              </span>
              <span className="ov-status">{STATUS_LABEL[e.status]}</span>
            </li>
          ))}
        </ul>
        <div className="ov-line" />
        <footer className="ov-stats">
          <div><b>{stats.active}</b><small>Active</small></div>
          <div><b>{stats.processing}</b><small>Processing</small></div>
          <div><b>{stats.completedToday}</b><small>Done today</small></div>
        </footer>
      </section>
      <div className="ov-art">
        <img src={portrait.url} alt="" />
      </div>
    </div>
  );
}
