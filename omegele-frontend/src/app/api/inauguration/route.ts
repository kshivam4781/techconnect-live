import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

const INAUGURATION_KEY = "SURETrust2026";
const STATUS_FILE = join(process.cwd(), ".inauguration-status.json");

// Helper to read status file
async function getInaugurationStatus(): Promise<boolean> {
  try {
    // Check environment variable first (for production)
    if (process.env.INAUGURATION_COMPLETED === "true") {
      return true;
    }

    // Check status file (for development/persistence)
    try {
      const data = await readFile(STATUS_FILE, "utf-8");
      const status = JSON.parse(data);
      return status.completed === true;
    } catch {
      // File doesn't exist, inauguration not completed
      return false;
    }
  } catch (error) {
    console.error("Error reading inauguration status:", error);
    return false;
  }
}

// Helper to write status file
async function setInaugurationCompleted(): Promise<void> {
  try {
    const status = { completed: true, completedAt: new Date().toISOString() };
    await writeFile(STATUS_FILE, JSON.stringify(status, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing inauguration status:", error);
    // Don't throw - environment variable can still be used
  }
}

// GET /api/inauguration - Check inauguration status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    // Check if key matches
    if (key !== INAUGURATION_KEY) {
      return NextResponse.json(
        { error: "Invalid key", isValid: false },
        { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Check if inauguration is already completed
    const isCompleted = await getInaugurationStatus();

    return NextResponse.json({
      isValid: true,
      isCompleted,
      key: INAUGURATION_KEY,
    }, {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error checking inauguration status:", error);
    return NextResponse.json(
      { error: "Failed to check inauguration status", isValid: false },
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

// POST /api/inauguration - Mark inauguration as completed
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, action } = body as { key: string; action: string };

    // Verify key
    if (key !== INAUGURATION_KEY) {
      return NextResponse.json(
        { error: "Invalid key" },
        { status: 401 }
      );
    }

    // If action is "complete", mark it as done
    if (action === "complete") {
      await setInaugurationCompleted();
      
      return NextResponse.json({
        success: true,
        message: "Inauguration marked as completed.",
        isCompleted: true,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing inauguration:", error);
    return NextResponse.json(
      { error: "Failed to complete inauguration" },
      { status: 500 }
    );
  }
}

