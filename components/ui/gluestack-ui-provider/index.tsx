import React from "react";
import { GluestackUIProvider as BaseProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

type Props = { children?: React.ReactNode };

export function GluestackUIProvider({ children }: Props) {
  return <BaseProvider config={config}>{children}</BaseProvider>;
}
