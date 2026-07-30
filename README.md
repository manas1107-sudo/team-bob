# JanSetuAI-SOCF
![PyTorch](https://img.shields.io/badge/PyTorch-Deep%20Learning-green)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014-black)
![Backend](https://img.shields.io/badge/Backend-FastAPI-blue)

JanSetu AI is a next-generation AI Eligibility Intelligence Platform...
JanSetu AI (The People's Bridge) is a next-generation AI Eligibility Intelligence Platform. It acts as an intelligent bridge between citizens and thousands of government schemes, subsidies, scholarships, and welfare programs they rightfully qualify for but struggle to discover.

Built for the Summer Code of Fest Hackathon, this platform leverages an AI-driven matching architecture to cross-reference user demographics against a curated database of real-world government programs.

# Key Features:
* AI Match Engine: A custom Python/FastAPI microservice that calculates probabilistic match scores based on dynamic user demographics.
* High-Performance Frontend: Built with Next.js, React, Tailwind CSS, and Framer Motion for a scalable, mobile-first User Interface.
* Adaptive Onboarding: An intelligent flow that captures over 10 key data points in under 30 seconds without requiring complex document uploads.
* Explainable AI (XAI): 100% transparent reasoning on why a scheme was matched, empowering users to completely bypass exploitative middlemen.
* Extensive Database: Real-time cross-referencing against 1,500+ central and state government welfare schemes.

# Architecture
The project utilizes a highly scalable microservice architectures:

1. Core Web Application (Next.js): Handles the frontend UI, user state management, and the frictionless adaptive flow.
2. AI Eligibility Engine (Python / FastAPI): A dedicated backend microservice that mathematically evaluates user demographics against thousands of strict scheme rulebooks to score and rank eligibility.

# Getting Started
1. Start the Frontend (Next.js)
   ```
   npm install
   npm run dev
   ```
   The application will be available at http://localhost:3000

2. Start the AI Engine (FastAPI)
   ```
   pip install fastapi uvicorn pydantic pandas
   cd ai_engine
   uvicorn main:app --reload --port 8001
   ```
   The API will be listening http://127.0.0.1:8001

# The Vision
Navigating government welfare portals is notoriously complex and highly fragmented. JanSetu AI solves this by demanding zero initial research from the user. You simply provide basic parameters, and our AI instantly bridges the gap to the exact financial benefits you deserve, reducing discovery time from hours to under 30 seconds.

