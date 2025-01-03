import { InteractionData } from "./Heatmap";
import * as d3 from "d3";

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
    <div className={`absolute top-0 left-0 w-[${width}] h-[${height}] pointer-events-none`}>
      <div
        className="tooltip tooltip absolute bg-white border border-gray-300 p-2.5 rounded-md pointer-events-none opacity-95"
        style={{
          left: interactionData.xPos - 180,
          top: interactionData.yPos,
        }}
      >
        <span>Date: {d3.timeFormat('%Y-%m-%d')(new Date(interactionData.xLabel))}</span>
        <br/>
        <span>{interactionData.value} bins ({Number(interactionData.yLabel) - 25}-{interactionData.yLabel}%)</span>
      </div>
    </div>
  );
};
