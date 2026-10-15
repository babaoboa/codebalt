/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { ComponentProps } from "react";
import "./styles.css";

type ButtonProps = ComponentProps<"button">;

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={["ui-button", className].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  );
}
