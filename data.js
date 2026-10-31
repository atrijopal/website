/* All content lives here. Sources: resume PDF + github.com/atrijopal (repo descriptions & READMEs). */
const C = {pink:'#FF6FB1',mint:'#3FE0BC',sun:'#FFCB3D',sky:'#6F8CFF',tang:'#FF8A4C',lilac:'#C6A4FF',ink:'#17143B'};
const GH = 'https://github.com/atrijopal/';

const LANES = ['ML & Research','LLM & Agents','Full-stack & Web','Web3 & Systems','Coursework'];

const PROJECTS = [
 {
  id:'sem', name:'SEM Image Restoration', short:'SEM\nRestoration', lane:0, tags:['ML & Research','Hackathon'], w:9, color:C.pink,
  date:'2026-09-19', award:'★ Top 5 Finalist · KLA AI Hackathon 2026', awardColor:C.pink, team:'Team ECE_Lords',
  repo:'semfin', lang:'Python',
  blurb:'A joint denoising + 2× super-resolution model for noisy, low-res semiconductor SEM images — a 29M-parameter NAFNet that beats bicubic by 3.3 dB and every classical baseline I threw at it.',
  facts:[
   'Scores <b>23.5 dB PSNR / 0.632 SSIM / 0.143 LPIPS</b> vs 20.2 dB / 0.500 for bicubic (<b>+3.3 dB</b>).',
   'Analysed 1,197 image pairs first: AIC-ranked 5 noise models showed the noise is a <b>Poisson + speckle mixture</b> (R² 0.999); checked for train/test leakage.',
   'Beat classical baselines — Wiener, Richardson-Lucy, VST+BM3D (best 23.08 vs 23.34 dB). Gains shrink from +5.05 to +1.59 dB on fine textures; traced a checkerboard artifact (85× spike) to PixelShuffle.',
   'Redesigned (native-resolution trunk, resize-conv decoder, physics-informed VST, non-local attention): <b>9.6× faster</b> (30→290 img/s) for a 1.2 dB cost. <b>fp16 gives NAFNet a lossless 2.5× speedup</b>; fp4 was rejected (−2.3 dB).'],
  skills:['PyTorch','NAFNet','torch.compile','fp16 / Model Optimization','Python','Signal Processing']
 },
 {
  id:'pcop', name:'PCOP — Predictive Customer Outreach', short:'PCOP', lane:1, tags:['LLM & Agents','ML & Research','Hackathon'], w:9, color:C.mint,
  date:'2026-10-10', award:'🥈 2nd Place · Union Bank IDEATHON 2.0', awardColor:C.mint, team:'Team MoneyLords',
  repo:'cline_pcop', lang:'Python',
  blurb:'A 7-layer AI platform (8 microservices) that lets retail banks detect churn early, act on it, and — crucially — prove the outreach caused the outcome. The repo version runs every agent on the Cline SDK for the Cline AI Builder Hackathon.',
  facts:[
   '<b>Detection + scoring:</b> 18 behavioural streams per customer, change-point detection with FDR control (<b>false alarms 37% → 5%</b>); 5-model ensemble (GRU, XGBoost, GraphSAGE, DeepHit) reaches <b>AUC 0.85–0.93</b> on public benchmarks, with 90% confidence intervals.',
   '<b>Action:</b> a LangGraph agent (15 tools) picks the next-best action and drafts outreach for 5 channels, with mandatory human approval.',
   '<b>Proof:</b> a doubly-robust uplift engine with holdout groups measures true causal retention. DPDPA / TRAI / RBI compliance built in; modelled <b>11.6× ROI</b> (INR 128 Cr/yr for a 2.5 Cr-customer bank).'],
  honest:'Straight from the repo: a working prototype on synthetic data. The CRM is simulated; there is no live core-banking or UPI integration and no real money moves.',
  skills:['LangGraph','PyTorch','XGBoost','GNNs','Causal Inference','Python','Cline SDK','LLM Tool-Calling']
 },
 {
  id:'bdh', name:'BDH-ECHR — Post-Transformer Legal AI', short:'BDH-ECHR', lane:0, tags:['ML & Research','Hackathon'], w:9, color:C.sun,
  date:'2026-01-20', award:'🥇 1st Prize · Kriti 2026', awardColor:C.sun, team:'Inter-Hostel Hackathon, IIT Guwahati',
  repo:'bdh-brain-scanner', repoLabel:'Companion repo: BDH Brain Scanner', lang:'JavaScript',
  blurb:'A Dragon Hatchling (BDH) post-transformer trained for multi-label European Court of Human Rights article-violation classification — small, sparse, and interpretable.',
  facts:[
   '<b>Micro-F1 0.7716</b> at 20.4M params — <b>+13.2 F1 over BERT-base</b>, and on par with Longformer at <b>5.4× fewer parameters</b>.',
   'Neuron-to-concept interpretability audit: <b>218 interpretable neurons across 477 legal concepts</b>, with <b>4.5× sparser</b> activations than transformer MLPs.'],
  skills:['PyTorch','NLP','Interpretability','Python','Sparse Models']
 },
 {
  id:'split', name:'SplitSnap', short:'SplitSnap', lane:0, tags:['ML & Research','Full-stack','Hackathon'], w:8, color:C.tang,
  date:'2026-10-09', award:'Nalafaad Hackathon · Track 1', awardColor:C.tang,   repo:'naala_ml_tharki_ap', lang:'Python',
  blurb:'Photograph a restaurant bill, fix what was misread, and split it exactly. A self-fine-tuned Donut model reads items and charges from one photo, then divides every tax, service charge, packaging fee and discount in proportion — down to the paisa — with a written explanation for each person.',
  facts:[
   'Fine-tuned <b>Donut (202M params)</b>: on held-out CORD, <b>TED 0.930, field F1 0.894, grand total correct 94.7%</b>; SROIE micro-F1 0.872.',
   'Pretrained-only vs fine-tuned on 30 unseen bills: field F1 0.000 → <b>0.988</b>; grand total 0/30 → <b>30/30</b>.',
   '<b>0.455 s per bill</b> on a Kaggle T4 (fp16). Fully open-source and local — no closed or paid API in the extraction pipeline.'],
  honest:'The repo is upfront: no real photographed Indian bills were available, so that accuracy is explicitly not measured. Those numbers are on generated bills and public benchmarks.',
  skills:['PyTorch','Donut','Computer Vision','Python','Model Fine-tuning']
 },
 {
  id:'meet', name:'Meeting Intelligence Assistant', short:'Meeting\nIntel', lane:1, tags:['LLM & Agents','Full-stack','Hackathon'], w:8, color:C.lilac,
  date:'2026-10-04', award:'Inter IIT Bootcamp · ML Problem Statement', awardColor:C.lilac, team:'Team Linear Regression · Akansha Das, Atrijo Pal, Anuj Sharma',
  repo:'boot', lang:'Python',
  blurb:'From a recorded meeting to a verified, structured record: transcript, terminology corrections, minutes, decisions and action items — with every line traceable to what was actually said.',
  facts:[
   '<b>Every item has a quote</b>: a record is kept only if its quote appears word-for-word in the transcript — and may not skip a negation.',
   'Corrections are edit-only and gated; a second model family can only <b>remove or weaken</b> a decision, never add one. Nothing is guessed: owners and deadlines are “unspecified” unless actually stated.',
   '<b>181 tests passing.</b> Python 3.12, FastAPI backend, LangGraph orchestration, one source for both the human (PDF/MD/HTML) and machine (JSON) record.'],
  skills:['FastAPI','LangGraph','Python','LLM Tool-Calling','NLP','Testing']
 },
 {
  id:'hero', name:'Community Hero', short:'Community\nHero', lane:2, tags:['Full-stack','LLM & Agents'], w:7, color:C.sky,
  date:'2026-06-25', award:'Live on Google App Engine', awardColor:C.sky,
  repo:'community-hero', lang:'JavaScript', live:'https://community-hero-fc07d.appspot.com',
  blurb:'AI-powered civic issue reporting built for Kolkata, designed for India. Photograph a pothole or a garbage dump and file it in under 60 seconds — an AI agent classifies it, routes it to the right officer, enforces a deadline and keeps you updated on WhatsApp.',
  facts:[
   'Gemini verifies the photo matches the issue type and extracts GPS; <b>AI severity score 1–10</b> routes it to the right department; duplicate detection stops repeat filings.',
   'Public tracking by ticket ID with no login; 10+ neighbour corroborations trigger priority escalation.',
   '<b>Autonomous RTI:</b> after 30 days of inaction the platform generates and logs a Right to Information application by itself.'],
  skills:['JavaScript','Gemini','WhatsApp API','Full-stack']
 },
 {
  id:'guard', name:'Sports Guardian', short:'Sports\nGuardian', lane:2, tags:['ML & Research','Full-stack','Hackathon'], w:6, color:C.pink,
  date:'2026-04-28', award:'Built for a Google hackathon', awardColor:C.pink,
  repo:'sports-guardian', lang:'HTML',
  blurb:'Multi-layer sports-media piracy detection: video fingerprinting, real-time SSL-certificate threat intelligence and invisible watermarking for source attribution.',
  facts:[
   'Video fingerprinting with <b>pHash + Chromaprint + DNA matching</b>.',
   'Real-time SSL cert threat intel with Google Safe Browsing plus AI analysis.',
   'Invisible watermarking so a leak can be traced back to its source.'],
  skills:['Computer Vision','Audio Fingerprinting','Python','Threat Intelligence']
 },
 {
  id:'proven', name:'Proven Autonomous Bug Detection & Auto-PR', short:'Auto-PR\nSystem', lane:1, tags:['LLM & Agents'], w:7, color:C.mint,
  date:'2026-06-17', award:'Evidence-gated fixes', awardColor:C.mint,
  repo:'Proven-Autonomous-Bug-Detection-Auto-PR-System', lang:'Python',
  blurb:'Every fix ships with proof: a test that fails on buggy code, passes after the fix, and survives mutation testing. A second model attacks the patch. If the evidence doesn’t clear the bar, no PR is opened.',
  facts:[
   'Multi-agent LangGraph pipeline: ingests a repo, builds a knowledge graph, finds bugs &amp; CVEs by static analysis, writes a <b>witness test</b>, patches, validates in a sandbox.',
   'Mutation-testing gate (MuTAP) + an adversary agent that tries to break the patch.',
   'Phase 2 ran in 22.8 s wall time; phase 3 passed 24/24 tests, phase 4 22/22.'],
  skills:['LangGraph','Python','Static Analysis','Mutation Testing','LLM Tool-Calling']
 },
 {
  id:'neuro', name:'Neuro-Symbolic Memory', short:'Neuro-\nSymbolic', lane:1, tags:['LLM & Agents','ML & Research'], w:6, color:C.lilac,
  date:'2026-02-12', award:'Cognitive architecture', awardColor:C.lilac,
  repo:'neuro-symbolic-memory', lang:'Python',
  blurb:'A dual-process cognitive architecture that merges LLMs with Knowledge Graphs for effectively infinite, self-correcting memory.',
  facts:['A dual-process design: the LLM and a Knowledge Graph work together.','Memory that can correct itself instead of drifting.'],
  skills:['LLMs','Knowledge Graphs','Python','RAG']
 },
 {
  id:'matiks', name:'Matiks Brand Intelligence', short:'Matiks\nScraper', lane:1, tags:['LLM & Agents','Full-stack'], w:5, color:C.sun,
  date:'2026-02-25', award:'Automated pipeline', awardColor:C.sun,
  repo:'makiks-scrapper', lang:'Python',
  blurb:'Automated brand intelligence for Matiks — scrapes Reddit, Play Store, App Store and Twitter every 6 hours, classifies with an LLM, and serves a live filterable dashboard.',
  facts:['Four sources, one pipeline, refreshed every 6 h.','LLM classification feeding a live, filterable dashboard.'],
  skills:['Python','Web Scraping','LLMs','Dashboards']
 },
 {
  id:'scanner', name:'BDH Brain Scanner', short:'Brain\nScanner', lane:0, tags:['ML & Research','Full-stack'], w:6, color:C.sky,
  date:'2026-01-20', award:'Interpretability tool', awardColor:C.sky,
  repo:'bdh-brain-scanner', lang:'JavaScript',
  blurb:'A real-time interpretability dashboard for sparse neural language models (BDH) — watch which neurons light up as the model reads.',
  facts:['Live visualisation of sparse activations for BDH models.','The tooling side of the BDH-ECHR work.'],
  skills:['JavaScript','Interpretability','Data Visualization','PyTorch']
 },
 {
  id:'agri', name:'AgriBot Crop Predictor', short:'AgriBot', lane:1, tags:['ML & Research','LLM & Agents'], w:5, color:C.mint,
  date:'2026-01-20', award:'Agri-tech assistant', awardColor:C.mint,
  repo:'agribot-crop-predictor', lang:'Python',
  blurb:'An AI-powered agricultural assistant that recommends crops with XGBoost and answers farming questions with GenAI.',
  facts:['XGBoost-powered crop recommendation.','GenAI layer for natural-language farming queries.'],
  skills:['XGBoost','Python','GenAI']
 },
 {
  id:'dm', name:'AI Dungeon Master', short:'Dungeon\nMaster', lane:1, tags:['LLM & Agents'], w:5, color:C.tang,
  date:'2026-01-20', award:'Infinite storytelling', awardColor:C.tang,
  repo:'Dungeon-Master-', lang:'Python',
  blurb:'A Dungeon Master engine capable of infinite storytelling — Groq (Llama 3) for fast narrative generation, ChromaDB (RAG) for long-term memory of quests, NPCs and world events.',
  facts:['Remembers past quests, NPC interactions and world events indefinitely.','High-speed generation via Groq-hosted Llama 3.'],
  skills:['Groq / Llama 3','ChromaDB','RAG','Python']
 },
 {
  id:'lotto', name:'Lottery DApp', short:'Lottery\nDApp', lane:3, tags:['Web3 & Systems','Full-stack'], w:5, color:C.pink,
  date:'2025-12-15', award:'IITG FEC club recruitment', awardColor:C.pink,
  repo:'Lottery-Dapp-for-iitg-fec-club-recruitment', lang:'JavaScript',
  blurb:'A decentralized lottery built with React, Solidity and Chainlink VRF v2.5 — provably fair winner selection on the Sepolia testnet.',
  facts:['Randomness from <b>Chainlink VRF v2.5</b>, so nobody (including me) can rig the draw.','React front-end, Solidity contract, deployed on Sepolia.'],
  skills:['Solidity','React','Chainlink VRF','JavaScript']
 },
 {
  id:'veil', name:'VeilAid', short:'VeilAid', lane:3, tags:['Web3 & Systems','Full-stack'], w:5, color:C.lilac,
  date:'2026-08-10', award:'Solidity · CLI · web', awardColor:C.lilac,
  repo:'veilaid', lang:'Solidity',
  blurb:'A Solidity project with smart contracts, a command-line client and a web front-end.',
  facts:['Contracts, CLI and web app in one repo.'],
  skills:['Solidity','TypeScript','Smart Contracts']
 },
 {
  id:'mlmod', name:'Coding Club · ML Module Task', short:'ML Module\nTask', lane:4, tags:['Coursework','ML & Research'], w:4, color:C.sky,
  date:'2025-12-28', award:'Coding Club IIT Guwahati', awardColor:C.sky,
  repo:'ML-MODULE-TASK', lang:'Jupyter',
  blurb:'The machine-learning module task for the Coding Club of IIT Guwahati, where I’m now Deputy Coordinator of the ML Module.',
  facts:['Jupyter notebooks, end-to-end ML workflow.'],
  skills:['Python','Jupyter','scikit-learn']
 },
 {
  id:'iitgai', name:'IITG.ai Task', short:'IITG.ai\nTask', lane:4, tags:['Coursework','ML & Research'], w:4, color:C.sun,
  date:'2026-01-05', award:'IITG.ai', awardColor:C.sun,
  repo:'iitg.ai-_task', lang:'Jupyter',
  blurb:'A task submission for IITG.ai, the AI society at IIT Guwahati, where I’m now an Associate.',
  facts:['Jupyter notebook submission.'],
  skills:['Python','Jupyter','PyTorch']
 }
];

/* Skill families (from the resume) */
const SKILL_FAMILIES = {
 'Languages':['Python','C++','C','Java','TypeScript','SQL','JavaScript','Solidity'],
 'ML / AI':['PyTorch','XGBoost','NAFNet','GNNs','NLP','LangGraph','RAG','LLMs','ChromaDB','Qdrant','Causal Inference','LLM Tool-Calling','fp16 / Model Optimization','torch.compile','Computer Vision','Interpretability','Groq / Llama 3','Donut','Gemini','GenAI','Knowledge Graphs','Model Fine-tuning','Sparse Models','Signal Processing','Cline SDK','scikit-learn'],
 'Backend & Systems':['FastAPI','PostgreSQL','Redis','Kafka','Docker','Azure','MLflow','Git','Linux','Testing','Static Analysis','Mutation Testing','Smart Contracts','Chainlink VRF','Web Scraping','Audio Fingerprinting','Threat Intelligence','WhatsApp API','Jupyter'],
 'Frontend & Core':['React','Next.js','Tailwind CSS','Data Structures & Algorithms','Dashboards','Data Visualization','Full-stack']
};

/* Metric bubbles for the Numbers board (editorial size `s`) */
const NUMBERS = [
 {v:'+3.3 dB', t:'SEM PSNR over bicubic', d:'Joint denoise + 2× super-resolution NAFNet: 23.5 dB vs 20.2 dB bicubic. KLA AI Hackathon Top 5.', s:100, c:C.pink, p:'sem'},
 {v:'9.6×', t:'faster SEM model', d:'Redesign took inference from 30 → 290 img/s for a 1.2 dB cost. fp16 adds a lossless 2.5× on NAFNet.', s:92, c:C.sun, p:'sem'},
 {v:'37→5%', t:'false alarms, PCOP', d:'Change-point detection with FDR control cut churn false alarms from 37% to 5%.', s:96, c:C.mint, p:'pcop'},
 {v:'11.6×', t:'modelled ROI', d:'PCOP for a 2.5 Cr-customer bank: INR 128 Cr/yr modelled (prototype, synthetic data).', s:84, c:C.lilac, p:'pcop'},
 {v:'0.85–0.93', t:'AUC · 5-model ensemble', d:'GRU + XGBoost + GraphSAGE + DeepHit on public benchmarks, 90% confidence intervals.', s:76, c:C.sky, p:'pcop'},
 {v:'+13.2 F1', t:'over BERT-base', d:'BDH post-transformer, Micro-F1 0.7716 at only 20.4M parameters. Kriti 2026 — 1st Prize.', s:98, c:C.sun, p:'bdh'},
 {v:'5.4×', t:'fewer params vs Longformer', d:'Matches Longformer on ECHR classification with 5.4× fewer parameters.', s:80, c:C.tang, p:'bdh'},
 {v:'218', t:'interpretable neurons', d:'Across 477 legal concepts; activations are 4.5× sparser than transformer MLPs.', s:72, c:C.pink, p:'bdh'},
 {v:'7', t:'prod modules shipped', d:'Sole engineer on KensaraAI’s M1 Data Intelligence Core — multi-tenant B2B SaaS on Azure.', s:86, c:C.sky, p:null},
 {v:'30+', t:'table PG schema', d:'Row-level tenant isolation, immutable audit logs, async task architecture.', s:66, c:C.mint, p:null},
 {v:'4', t:'jurisdictions in RoPA', d:'GDPR · DPDPA · CCPA · PDPL with Kimi K2 generation + RAG over regulation.', s:62, c:C.lilac, p:null},
 {v:'94.7%', t:'grand totals correct', d:'SplitSnap on held-out CORD (95 receipts). 30/30 on unseen generated bills. 0.455 s per bill.', s:78, c:C.tang, p:'split'},
 {v:'181', t:'tests passing', d:'Meeting Intelligence Assistant — where every record needs a verbatim quote.', s:64, c:C.pink, p:'meet'},
 {v:'1482', t:'Codeforces rating', d:'Competitive programming, since before the hackathons.', s:68, c:C.sun, p:null},
 {v:'99.7', t:'JEE Main percentile', d:'JEE Advanced AIR 1649 · WBJEE Rank 26.', s:60, c:C.mint, p:null},
 {v:'19', t:'public repos', d:'From Solidity lotteries to LangGraph agents to SEM restoration.', s:58, c:C.lilac, p:null}
];

/* Before / after bars */
const COMPARES = [
 {h:'SEM · image quality (PSNR dB)', rows:[['Bicubic',20.2,23.5,C.sun,'20.2'],['Ours (NAFNet)',23.5,23.5,C.pink,'23.5']], note:'Same SEM pairs; higher is better. +3.3 dB.'},
 {h:'PCOP · false alarms (%)', rows:[['Before',37,37,C.sun,'37%'],['After FDR',5,37,C.mint,'5%']], note:'Change-point detection with FDR control.'},
 {h:'SEM · throughput (img/s)', rows:[['Original',30,290,C.sun,'30'],['Redesigned',290,290,C.sky,'290']], note:'9.6× faster for a 1.2 dB cost.'},
 {h:'BDH vs Longformer · parameters', rows:[['BDH',1,5.4,C.mint,'1×'],['Longformer',5.4,5.4,C.lilac,'5.4×']], note:'Comparable ECHR classification at 5.4× fewer parameters.'}
];

/* Timeline */
const JOURNEY = [
 {d:'2023', h:'ICSE · 98.6%', p:'Secondary school — plus NSEP/NSEC Top 1% (State), a qualified RMO and JBNSTS State Rank 13.', c:C.sun},
 {d:'2025', h:'CBSE 93.4% · JEE Advanced AIR 1649', p:'JEE Main 99.701 percentile, WBJEE Rank 26. Admitted to IIT Guwahati — Electronics & Communication.', c:C.mint},
 {d:'May 2025', h:'First commit', p:'GitHub account created. The bubble starts to form.', c:C.pink},
 {d:'2025 → now', h:'Joined KensaraAI as AI Engineer (Full-Stack)', p:'Remote. Became the sole engineer on the M1 Data Intelligence Core of a multi-tenant privacy-compliance SaaS.', c:C.sky},
 {d:'2025 → now', h:'Deputy Coordinator, ML Module · Coding Club IITG', p:'Also an Associate at IITG.ai, the AI society.', c:C.lilac},
 {d:'Dec 2025', h:'Provably-fair lottery on-chain', p:'React + Solidity + Chainlink VRF v2.5 DApp for the IITG FEC club recruitment.', c:C.tang},
 {d:'Jan – Feb 2026', h:'LLM memory, dungeon masters, interpretability', p:'AgriBot, AI Dungeon Master, BDH Brain Scanner, Neuro-Symbolic Memory, Matiks scraper — a lot of small bubbles.', c:C.pink},
 {d:'Apr – Jun 2026', h:'Piracy detection → autonomous bug fixing', p:'Sports Guardian (Google hackathon), Proven Auto-PR System, Community Hero for Kolkata.', c:C.mint},
 {d:'2026', h:'🥇 Kriti 1st · 🥈 Union Bank 2nd · ★ KLA Top 5', p:'BDH-ECHR, PCOP and SEM restoration — three very different ML problems, three podium finishes.', c:C.sun},
 {d:'Oct 2026', h:'Meeting Intelligence + SplitSnap', p:'Two more ships in the same week: a verified meeting-record pipeline and an exact bill splitter.', c:C.sky}
];

const MARQUEE = ['PyTorch','LangGraph','FastAPI','RAG','Qdrant','PostgreSQL','Azure','Causal Inference','XGBoost','GraphSAGE','NAFNet','Solidity','React','Next.js','TypeScript','Docker','Kafka','Redis','C++','MLflow','Chainlink VRF','Donut','Groq','ChromaDB'];
