import { NextResponse } from "next/server";
import { getStats } from "@/data/seed";

export async function GET() {
  return NextResponse.json(getStats());
}
