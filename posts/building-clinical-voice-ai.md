---
title: Architecting a Resilient Voice AI & Medical Receptionist Platform
date: 2025-08-10
description: How we leveraged LiveKit WebRTC, OpenAI GPT-4o, and an embedded SQLite failover layer to guarantee zero downtime for clinical operations.
tags: ["AI", "Python", "WebRTC", "Architecture"]
---

Handling patient inquiries, scheduling, and emergency triage over telephony requires two critical guarantees: **sub-second audio latency** and **uncompromising system reliability**. In medical environments, dropping an active conversation or losing an appointment record due to database latency is unacceptable.

In this post, I will share the architectural choices and lessons learned while developing our real-time Clinical Voice AI platform (**[ABC Health Care — Ai-Receptionist](https://github.com/shinas101/Ai-Receptionist)**).

![ABC Health Care Clinical Dashboard & Voice Assistant](/projects/clinical-voice-ai/clinical-voice-ai-hero.webp)

---

## 1. Low-Latency Voice Streaming with LiveKit & WebRTC

Traditional HTTP request-response patterns introduce noticeable lag that breaks the natural cadence of a voice conversation. Humans detect latency as low as 200–300 milliseconds.

To achieve fluid, bi-directional interaction:

- We utilized **LiveKit** running over **WebRTC** for real-time media ingestion and audio streaming.
- Microservices issue cryptographically signed **WebRTC JWT tokens** through an asynchronous `aiohttp` authentication service.
- Audio packets are streamed directly to speech recognition and OpenAI GPT-4o audio models, generating response tokens with minimum perceptible delay.

```python
import aiohttp
from livekit import api

async def generate_patient_token(room_name: str, identity: str) -> str:
    token = api.AccessToken(API_KEY, API_SECRET) \
        .with_identity(identity) \
        .with_name(f"Patient-{identity}") \
        .with_grants(api.VideoGrants(
            room_join=True,
            room=room_name,
            can_publish=True,
            can_subscribe=True,
        ))
    return token.to_jwt()
```

---

## 2. The Dual-Database Failover Pattern

One of the key engineering challenges was managing PostgreSQL during peak call volumes or brief network drops. Even a 5-second database freeze could block incoming appointment write requests.

To mitigate this, we implemented a dual-database architecture:

1. **Primary Store**: PostgreSQL 16 utilizing `asyncpg` connection pooling for concurrent transactional operations and `pgvector` for semantic document lookup.
2. **Local Fallback**: An embedded SQLite buffer layer running in-process with the worker node.

```
       [ Patient Voice Call ]
                 │
                 ▼
         [ LiveKit / WebRTC ]
                 │
                 ▼
         [ Python Worker ]
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
 [ PostgreSQL 16 ]    [ SQLite Buffer ]
 (Primary / Async)    (Failover Layer)
```

If a PostgreSQL write times out or fails connection health checks, the worker transparently diverts the serialized appointment payload to the encrypted SQLite cache. A background worker periodically monitors PostgreSQL health and replays buffered mutations in chronological order once the primary database recovers.

---

## 3. Container Security & Ingress Hardening

Because medical applications deal with sensitive patient data, every ingress point requires stringent security controls:

- **Nginx Ingress Proxy**: Configured with TLS 1.3 only, strict HTTP Strict Transport Security (HSTS), and CORS policies restricted to trusted clinical domains.
- **Rate-Limiting**: Token bucket rate-limiting prevents credential stuffing on JWT issuance endpoints.
- **Docker & Kubernetes Deployment**: Microservices are containerized with lightweight distroless Python images, isolating the media workers from backend datastores.

---

## Conclusion

Building real-time voice applications for high-stakes domains requires designing for failure at every boundary. By decoupling ingestion via WebRTC, optimizing async connection pools, and building localized SQLite buffers, we created a voice receptionist that remains responsive even in adverse network conditions.
