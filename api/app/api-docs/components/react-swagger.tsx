"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import * as React from "react";

export default function ReactSwagger({
  spec,
}: {
  spec: Record<string, unknown>;
}) {
  return <SwaggerUI spec={spec} />;
}
