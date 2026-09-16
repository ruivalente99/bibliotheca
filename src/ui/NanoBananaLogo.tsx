"use client";

import React from "react";
import { Logo, LogoProps, LogoClassNames } from "./Logo";

export type NanoBananaLogoClassNames = LogoClassNames;
export type NanoBananaLogoProps = LogoProps;

/**
 * @deprecated Use `Logo` instead. NanoBananaLogo is preserved as a backward-compatibility alias.
 */
export function NanoBananaLogo(props: NanoBananaLogoProps) {
  return <Logo {...props} />;
}
