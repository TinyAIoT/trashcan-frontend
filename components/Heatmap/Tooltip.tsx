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

  const displayText = `${interactionData.value} bins (${Number(interactionData.yLabel) - 10}-${interactionData.yLabel}%)`;

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
          left: interactionData.xPos - 180,
          top: interactionData.yPos,
        }}
      >
        <span>{interactionData.xLabel}</span>
        <br/>
        <span>{displayText}</span>
      </div>
    </div>
  );
};
