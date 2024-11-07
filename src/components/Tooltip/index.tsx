import { Tooltip as NextUITooltip } from "@nextui-org/react";
import React from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  radius?: "none" | "sm" | "md" | "lg" | "full";
  placement?:
    | "top-start"
    | "top"
    | "top-end"
    | "bottom-start"
    | "bottom"
    | "bottom-end"
    | "left-start"
    | "left"
    | "left-end"
    | "right-start"
    | "right"
    | "right-end";
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  radius,
  placement,
}) => {
  const isInlineElement = (child: React.ReactNode) =>
    React.isValidElement(child) &&
    typeof child.type === "string" &&
    ["a", "button", "span"].includes(child.type);
  return (
    <NextUITooltip
      showArrow={true}
      content={content}
      delay={0}
      closeDelay={0}
      radius={radius ? radius : "sm"}
      placement={placement ? placement : "top"}
    >
      {isInlineElement(children) ? children : <span>{children}</span>}
    </NextUITooltip>
  );
};

export default Tooltip;
