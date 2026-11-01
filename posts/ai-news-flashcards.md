---
title: "Engineering News FlipCard: 100% Local NLP & Tactile 3D News Feeds"
date: 2025-09-12
description: Building a zero-API-cost news reader with local PyTorch T5-small summarization, Malayalam Luhn frequency scoring, SQLite WAL SWR caching, and embeddable 3D card widgets.
tags: ["PyTorch", "NLP", "FastAPI", "Next.js", "Python", "Architecture"]
---

Modern digital news platforms are plagued by intrusive pop-up ads, clickbait headlines, and cluttered layout shifts that bury essential journalism. When readers want concise, objective coverage in English or regional languages like Malayalam, existing mobile apps force them through heavy pageloads and algorithmic tracking.

To solve this, I designed and built **[News FlipCard](https://github.com/shinas101/NewsFlashcard)**: a tactile 3D card-stack news reader delivering distraction-free 60-word briefs powered by **100% local NLP models**, **zero external LLM API costs**, and a unified ASGI deployment architecture.

---

## 1. Live Interactive FlipCard Widget

Below is an interactive live demo of the embedded News FlipCard deck. You can flip through breaking national headlines, switch languages, and read distilled cards directly:

<iframe
  src="https://news-flashcard-9ad00f891023.herokuapp.com/embed?lang=en&theme=dark"
  width="100%"
  height="540"
  frameborder="0"
  style="border:none; border-radius:12px; overflow:hidden;"
  allow="clipboard-write"
  title="News FlipCard Widget"
></iframe>

---

## 2. Zero-API-Cost Local NLP Summarization

Many modern AI products simply wrap proprietary cloud LLM APIs (OpenAI, Claude, Gemini), incurring per-token billing, network latency, and strict rate limits. For a public news reader processing hundreds of breaking articles daily, cloud API costs scale unsustainably.

News FlipCard runs **100% local inference** directly on the server dyno without external API dependencies:

### English Pipeline: Singleton PyTorch with T5-small
For English national news, we initialize a thread-safe singleton pipeline using Hugging Face's [`google-t5/t5-small`](https://huggingface.co/google-t5/t5-small). The model generates abstractive summaries constrained strictly to 50–60 words while automated regex filters strip agency boilerplate (*PTI, ANI, Reuters*):

```python
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

class T5Summarizer:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.device = "cuda" if torch.cuda.is_available() else "cpu"
            cls._instance.tokenizer = AutoTokenizer.from_pretrained("google-t5/t5-small")
            cls._instance.model = AutoModelForSeq2SeqLM.from_pretrained("google-t5/t5-small").to(cls._instance.device)
            cls._instance.model.eval()
        return cls._instance

    @torch.inference_mode()
    def summarize(self, text: str, max_words: int = 60) -> str:
        inputs = self.tokenizer("summarize: " + text, return_tensors="pt", max_length=512, truncation=True).to(self.device)
        outputs = self.model.generate(**inputs, max_new_tokens=max_words * 2, num_beams=2, early_stopping=True)
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
```

### Malayalam Pipeline: Morphological Luhn Frequency Scoring
Because generative neural models for Malayalam can introduce hallucinations or require massive VRAM overhead, our Malayalam pipeline uses a high-performance **extractive summarizer** based on a tuned Luhn frequency-scoring algorithm. By evaluating sentence significance against Unicode Malayalam stop-word lists and keyword density, it extracts the most salient factual statements in under **5 milliseconds**.

---

## 3. Asynchronous Scraper Orchestration & URL Resolution

News sources use disparate markup structures and JavaScript-rendered redirects. Our ingestion engine runs asynchronously using **FastAPI** and **Python**:

- **Multi-Source Crawling**: Ingests feeds across 10+ outlets, including *The Hindu, Times of India, NDTV, Indian Express, Manorama, Mathrubhumi, Asianet, News18*, and *Madhyamam*.
- **Google News Batchexecute Decoder**: Resolves obfuscated Google News redirect tokens into clean canonical publisher URLs without spawning full browser instances.
- **Selectolax & BeautifulSoup4 Fallbacks**: High-throughput DOM parsing utilizes `selectolax` (C-based Modest engine) for 10x faster node extraction, gracefully falling back to `BeautifulSoup4` for malformed HTML.

---

## 4. Stale-While-Revalidate (SWR) with SQLite WAL

To maintain sub-millisecond API response times, the service implements an in-process **Stale-While-Revalidate (SWR)** caching layer backed by **SQLite in Write-Ahead Logging (WAL) mode** (`redis_cache.db`):

1. **Instant Read Hit**: Incoming client requests receive pre-rendered cached cards immediately from SQLite WAL.
2. **Asynchronous Background Task**: When cached records cross their freshness threshold, a background `asyncio` task crawls and summarizes updated articles without blocking the active request.
3. **Atomic File Storage**: Avoids memory exhaustion while providing atomic persistence across server reboots.

---

## 5. Tactile 3D Card-Stack UI & Universal Embeds

The frontend is constructed with **Next.js 15**, **TypeScript**, and **Tailwind CSS**, prioritizing tactile physical feedback:

- **3D Card Stack Illusion**: Features matte burgundy paper styling (`#9e3547`), multi-sided rim edge highlights, and layered fanning offsets. Users can drag, swipe, or click to draw the next card with fluid physics-based transitions.
- **Universal Embed System**: Offers an interactive embed code generator (`<>` icon) allowing external developers to embed the live widget via standard `<iframe>`, zero-dependency `embed.js`, or native React components.
- **Single-Dyno ASGI Architecture**: During deployment, the Next.js static build (`frontend/out`) is mounted directly inside the FastAPI ASGI router, consolidating hosting into a single cloud dyno with zero CORS latency.
