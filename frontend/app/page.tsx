"use client";
import { ChangeEvent, useState } from "react";
import "./pageStyles.css";

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

    const res = await fetch("https://api.clipfarmer.app/process", {
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
      <h1>ClipFarmer.io</h1>
      <section className="hero-text">
        <p>
          Transform long-form videos into high-performing short clips using AI.
        </p>
        <p className="sub">
          Built for creators, podcasters, and growth-focused channels.
        </p>
      </section>

      <section className="how">
        <div>01 — Upload Video</div>
        <div>02 — AI Extracts Key Moments</div>
        <div>03 — Download Viral Clips</div>
      </section>

      <div className="marquee-container">
        <h3>Insert a video as input and get viral clips out of these</h3>
      </div>
      <input type="file" accept="video/*" onChange={handleChange} />

      {previewUrl && (
        <>
          <h4></h4>
          <video src={previewUrl} controls className="mt-4 w-full" />
        </>
      )}

      {file && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="generate"
        >
          <div className="top">
            {loading ? "Processing..." : "Generate Clips"}
          </div>
          <div className="bottom"></div>
        </button>
      )}

      {outputUrl && (
        <>
          <h4>Output vid</h4>
          <video src={outputUrl} controls className="mt-4 w-full outputVid" />
        </>
      )}

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-left">
            <h3>ClipFarmer</h3>
            <p>AI-powered tool to turn long videos into viral short clips.</p>
          </div>

          <div className="footer-right">
            <h4>Credits</h4>
            <p>
              Built & Designed by{" "}
              <a href="https://basitwarsi.vercel.app/" target="blank">
                <span className="highlight-name">BASIT WARSI</span>
              </a>
            </p>
            <a href="https://linkedin.com/in/basitwarsi" target="_blank">
              LinkedIn
            </a>
            <br />
            <a href="https://github.com/bats15" target="_blank">
              GitHub
            </a>
            <br />
            <p>© {new Date().getFullYear()} ClipFarmer</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
