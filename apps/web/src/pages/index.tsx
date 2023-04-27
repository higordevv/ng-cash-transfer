import { useEffect, useState } from "react";
import { Button } from "ui";
const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

export default function Web() {
  return (
    <div className="bg-slate-900 w-screen h-screen">
      <h1>Web</h1>
    </div>
  );
}
