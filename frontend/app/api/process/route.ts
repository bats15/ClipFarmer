export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const formData = await req.formData();

  const res = await fetch("http://13.60.91.241:8000/process", {
    method: "POST",
    body: formData,
  });

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": "video/mp4",
    },
  });
}
