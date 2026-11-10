/**
 * Compatibility entry point. The masterplan module is the source of truth;
 * this file keeps older imports (admin, filters) working.
 */
export {
  allPlots as demoPlots,
  plotsForProject,
  getPlot,
  plotLegend,
  statusLabel,
  statusColor,
  type Plot,
  type PlotStatus,
} from "./masterplan";
