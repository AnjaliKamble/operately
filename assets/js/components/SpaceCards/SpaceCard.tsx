import * as React from "react";
import * as Spaces from "@/models/spaces";
import * as Icons from "@tabler/icons-react";

import classnames from "classnames";

import { Card } from "./Card";

export interface SpaceCardProps {
  space: Spaces.Space;
  onClick?: () => void;
  shadowSize?: "base" | "lg";
  testId?: string;
  linkTo?: string;
}

export function SpaceCard(props: SpaceCardProps) {
  const { name, mission, color, icon, privateSpace } = props.space;
  const iconElement = Icons[icon!];
  const shadowSize = props.shadowSize ?? "base";

  const className = classnames(
    "cursor-pointer",
    "rounded-lg",
    "bg-surface",
    "px-4 py-3 w-64",
    "border border-surface-outline",
    "relative",
    {
      "hover:shadow transition-shadow": shadowSize === "base",
      "hover:shadow-lg transition-shadow": shadowSize === "lg",
    },
  );

  const cardProps = {
    linkTo: props.linkTo,
    testId: props.testId,
    onClick: props.onClick,
  };

  return (
    <Card className={className} title={name!} {...cardProps}>
      <div className="mt-2"></div>
      {React.createElement(iconElement, { size: 40, className: color, strokeWidth: 1 })}
      <div className="font-semibold mt-2">{name}</div>
      <div className="text-content-dimmed text-xs line-clamp-3">{mission}</div>

      {privateSpace && (
        <div className="absolute top-2 right-2 text-accent-1">
          <Icons.IconLock size={24} />
        </div>
      )}
    </Card>
  );
}
