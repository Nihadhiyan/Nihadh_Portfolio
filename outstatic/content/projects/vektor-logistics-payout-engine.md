---
title: "Vektor — Real-Time Logistics & Payout Engine"
slug: "vektor-logistics-payout-engine"
description: "Distributed backend pipeline separating high-velocity telemetry ingestion from batch financial processing, using Kafka (KRaft mode) to ingest real-time GPS/delivery events and a partitioned Spring Batch pipeline for daily driver payouts with zero-data-loss bank dispatch via the Transactional Outbox pattern. Dockerized, with a Python telemetry simulator, secured by Keycloak (OAuth2), Redis rate-limiting, and Resilience4j — observable via Prometheus, Grafana, and Loki."
status: "published"
coverImage: ""
techStack: ["Java", "Spring Boot", "Spring Batch", "Apache Kafka", "Python", "Docker", "Keycloak", "Redis", "Resilience4j", "Prometheus", "Grafana"]
liveUrl: ""
repoUrl: "https://github.com/Nihadhiyan/Vektor-Real-Time-Logistics-Payout-Engine-"
featured: true
order: 2
publishedAt: "2026-07-12T12:08:39.000Z"
---

Distributed backend pipeline separating high-velocity telemetry ingestion from batch financial processing, using Kafka (KRaft mode) to ingest real-time GPS/delivery events and a partitioned Spring Batch pipeline for daily driver payouts with zero-data-loss bank dispatch via the Transactional Outbox pattern. Dockerized, with a Python telemetry simulator, secured by Keycloak (OAuth2), Redis rate-limiting, and Resilience4j — observable via Prometheus, Grafana, and Loki.
