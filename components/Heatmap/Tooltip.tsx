import { InteractionData } from "./Heatmap";

type TooltipProps = {
  interactionData: InteractionData | null;
  width: number;
  height: number;
};

export const Tooltip = ({ interactionData, width, height }: TooltipProps) => {
  if (!interactionData) {
    return null;
  }

  return (
    // Wrapper div: a rect on top of the viz area
    <div
      style={{
        width,
        height,
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      {/* The actual box with white background */}
      <div
        className="chart-tooltip"
        style={{
          position: "absolute",
          left: interactionData.xPos - 170,
          top: interactionData.yPos,
        }}
      >
        <span>{interactionData.xLabel}</span>
        <br/>
        <span>{interactionData.value} bins ({interactionData.yLabel - 10}-{interactionData.yLabel}%)</span>
      </div>
    </div>
  );
};
