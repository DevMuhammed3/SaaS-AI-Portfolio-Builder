import { getApiDocs } from "@/lib/swagger";
import * as React from "react";
import ReactSwagger from "./components/react-swagger";

export default function ApiDocs() {
  const spec = getApiDocs() as Record<string, unknown>;

  return (
    <section className="">
      <ReactSwagger spec={spec} />
    </section>
  );
}

// Nextjs dynamic metadata
export function generateMetadata() {
  return {
    title: `Full-Stack AI Portfolio Builder - API Documentation`,
    description: `API Documentation`,
    icons: {
      icon: `/logo_.png`,
    },
  };
}
