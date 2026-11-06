"use client";

import { useMemo, useState } from "react";
import { demoPlots, statusLabel, type PlotStatus } from "@/data/plots";
import { cn } from "@/lib/cn";

/**
 * Lightweight local admin for demo inventory edits.
 * Production will use Supabase Auth + RLS; this UI proves the workflow.
 */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [plots, setPlots] = useState(demoPlots);
  const [note, setNote] = useState("");

  const expected = process.env.NEXT_PUBLIC_ADMIN_DEMO_PASSWORD || "change-me";

  const legend = useMemo(() => {
    return plots.reduce(
      (acc, p) => {
        acc[p.status] += 1;
        return acc;
      },
      { available: 0, held: 0, reserved: 0, sold: 0, unreleased: 0 } as Record<PlotStatus, number>,
    );
  }, [plots]);

  function updateStatus(id: string, status: PlotStatus) {
    setPlots((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status, statusVersion: p.statusVersion + 1 }
          : p,
      ),
    );
    setNote(`Updated ${id} → ${status} (local demo; wire to Supabase mutation in production).`);
  }

  if (!authed) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-forest-950 px-4">
        <form
          className="w-full max-w-sm rounded-2xl bg-white p-6"
          onSubmit={(e) => {
            e.preventDefault();
            setAuthed(password === expected);
            if (password !== expected) setNote("Incorrect password");
          }}
        >
          <h1 className="font-display text-2xl text-forest-900">Admin</h1>
          <p className="mt-2 text-sm text-stone-500">
            Demo gate. Production uses Supabase Auth roles.
          </p>
          <label className="mt-4 block text-sm">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-sand-200 px-3"
            />
          </label>
          <button
            type="submit"
            className="mt-4 h-11 w-full rounded-lg bg-brand-red text-sm font-semibold text-white"
          >
            Enter
          </button>
          {note ? <p className="mt-3 text-sm text-brand-red">{note}</p> : null}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-sand-50 pt-24">
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h1 className="font-display text-4xl text-forest-900">Inventory admin</h1>
        <p className="mt-2 text-stone-500">
          Local demo state. Persist via Supabase `plots` + audit table when env is linked.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {(Object.keys(legend) as PlotStatus[]).map((k) => (
            <span key={k} className="rounded-full bg-white px-3 py-1 border border-sand-200">
              {statusLabel[k]}: {legend[k]}
            </span>
          ))}
        </div>
        {note ? <p className="mt-4 text-sm text-forest-700">{note}</p> : null}

        <div className="mt-8 overflow-x-auto rounded-2xl border border-sand-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-sand-100 text-xs uppercase tracking-[0.12em] text-stone-500">
              <tr>
                <th className="px-3 py-3">Plot</th>
                <th className="px-3 py-3">Size</th>
                <th className="px-3 py-3">Price</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Version</th>
              </tr>
            </thead>
            <tbody>
              {plots.map((plot) => (
                <tr key={plot.id} className="border-t border-sand-100">
                  <td className="px-3 py-3 font-mono-data">{plot.code}</td>
                  <td className="px-3 py-3">
                    {plot.widthFt}×{plot.depthFt}
                  </td>
                  <td className="px-3 py-3 font-mono-data">
                    GH¢{plot.priceGhs.toLocaleString("en-GH")}
                  </td>
                  <td className="px-3 py-3">
                    <select
                      className={cn("h-10 rounded-lg border border-sand-200 px-2")}
                      value={plot.status}
                      onChange={(e) => updateStatus(plot.id, e.target.value as PlotStatus)}
                    >
                      {(Object.keys(statusLabel) as PlotStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {statusLabel[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3 font-mono-data">{plot.statusVersion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
