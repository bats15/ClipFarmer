export async function POST(req: Request) {
  const body = await req.formData();

  const res = await fetch("http://13.60.91.241:8000/process", {
    method: "POST",
    body,
  });

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": "video/mp4",
    },
  });
}
