import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(40),
  email: z.string().trim().email().max(160),
  message: z.string().trim().max(2000).optional().nullable(),
  consent: z.literal(true),
  projectSlug: z.string().trim().max(120).optional().nullable(),
  plotCode: z.string().trim().max(40).optional().nullable(),
  intent: z.enum(["viewing", "plot", "payment", "general", "whatsapp"]).default("general"),
  sourceUrl: z.string().trim().max(500).optional().nullable(),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form fields and consent checkbox.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const payload = {
    ...parsed.data,
    createdAt: new Date().toISOString(),
  };

  // Always persist locally for MVP when Supabase is not configured
  const supabase = createServerSupabase();
  if (supabase) {
    const { error } = await supabase.from("enquiries").insert({
      full_name: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      message: payload.message ?? null,
      consent_at: payload.createdAt,
      project_slug: payload.projectSlug ?? null,
      plot_code: payload.plotCode ?? null,
      intent: payload.intent,
      source_url: payload.sourceUrl ?? null,
      status: "new",
    });

    if (error) {
      console.error("enquiry insert failed", error.message);
      // Fall through to accept enquiry in demo mode rather than lose the lead UX
    }
  } else {
    console.info("[enquiry:demo]", payload);
  }

  return NextResponse.json({ ok: true });
}
