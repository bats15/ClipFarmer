"use client";
import { ChangeEvent, useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };


  const handleSubmit = async () => {

    console.log("clicked");
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("video", file);

    const res = await fetch("/api/process", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      alert("Processing failed");
      setLoading(false);
      return;
    }
    const blob = await res.blob();
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(URL.createObjectURL(blob));

    setLoading(false);
  };

  return (
    <main>
      <h1>Welcome to clipFarmer</h1>
      <h3>Inserjendwkent a video as input and get viral clips out of these</h3>

      <input type="file" accept="video/*" onChange={handleChange} />

      {previewUrl && (
        <>
          <h4>Input video</h4>
          <video src={previewUrl} controls className="mt-4 w-full" />
        </>
      )}

      {file && (
        <button type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Generate Clips"}
        </button>
      )}

      {outputUrl && (
        <>
          <h4>Output vid</h4>
          <video src={outputUrl} controls className="mt-4 w-full" />
        </>
      )}
    </main>
  );
}
