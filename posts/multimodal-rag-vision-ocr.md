---
title: Multimodal RAG and Vision OCR for Complex Documents
date: 2025-07-22
description: Extracting tables and diagrams with page-level attribution using LangChain, Google Gemini 2.5 Flash, FAISS, and Server-Sent Events.
tags: ["RAG", "LLM", "FastAPI", "Python"]
---

Retrieval-Augmented Generation (RAG) is straightforward when querying clean, plain-text documents. However, enterprise PDFs — such as clinical guidelines, financial summaries, and engineering schematics — are filled with multi-column tables, visual charts, and embedded diagrams that standard text splitters mangle into unintelligible tokens.

To solve this, we architected **[PDFChatbot](https://github.com/shinas101/pdf-rag-chatbot)**: a multimodal RAG engine that merges computer vision, vector indexing, and asynchronous token streaming.

![PDFChatbot Application Interface](/projects/pdf-chatbot/pdf-chatbot-hero.webp)

---

## 1. The Shortcoming of Standard Text Extraction

Traditional Python PDF libraries (like basic text dumpers) discard geometric layout. When a document contains a comparison table:

```
| Metric      | Baseline | Proposed |
|-------------|----------|----------|
| Accuracy    | 88.4%    | 94.2%    |
| Latency     | 140ms    | 45ms     |
```

Raw string extraction often reads horizontally across columns, yielding scrambled sentences like _"Metric Baseline Proposed Accuracy 88.4% 94.2%"_. When fed into an embedding model, the semantic relationship between rows and columns is lost.

---

## 2. Multimodal Vision OCR Pipeline

Instead of treating PDFs as raw strings, our ingestion pipeline applies a hybrid approach:

1. **Page Decomposition with PyMuPDF**: High-resolution rendered page snapshots (rasterized at 300 DPI) are captured alongside extracted text bounding boxes.
2. **Vision Extraction via Gemini 2.5 Flash**: Complex graphical segments (tables, figures, charts) are dispatched to vision models with structured JSON schemas, generating markdown-formatted tables and descriptive semantic captions.
3. **FAISS Dense Retrieval**: Text chunks and visual captions are embedded and stored in FAISS, stamped with precise page coordinates and attribution metadata.

![PDFChatbot System Architecture](/projects/pdf-chatbot/pdf-chatbot-architecture.webp)

```python
import fitz  # PyMuPDF
from langchain_community.vectorstores import FAISS

def process_document_pages(pdf_path: str):
    doc = fitz.open(pdf_path)
    for page_idx, page in enumerate(doc):
        pix = page.get_pixmap(dpi=300)
        # Pass page image to multimodal vision model if complex graphics detected
        has_graphics = bool(page.get_drawings())
        yield page_idx + 1, page.get_text(), pix if has_graphics else None
```

---

## 3. Asynchronous Streaming via FastAPI & SSE

Users expect immediate feedback when asking complex questions. Rather than buffering the entire LLM response, the backend delivers real-time token streaming using **Server-Sent Events (SSE)**.

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

async def token_generator(query: str, context: str):
    async for chunk in generate_llm_stream(query, context):
        yield f"data: {chunk}\n\n"

@app.post("/api/chat/stream")
async def chat_stream(query: str):
    context = retrieve_faiss_context(query)
    return StreamingResponse(
        token_generator(query, context),
        media_type="text/event-stream"
    )
```

By decoupling the retrieval phase and piping tokens via SSE, the perceived time-to-first-token drops from several seconds to under 400 milliseconds.

---

## Key Takeaways

1. **Retain Layout Context**: Visual layout carries meaning. Use vision models alongside text extractors for complex documents.
2. **Page-Level Citations**: Always return source page attribution so users can verify factual claims.
3. **Stream Everything**: Asynchronous streaming over SSE dramatically improves perceived responsiveness for conversational search.
