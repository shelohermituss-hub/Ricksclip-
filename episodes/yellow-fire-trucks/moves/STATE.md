# moves/ STATE (animator, 2026-11-21, shared locked-feet moves round)
## Built
- shared_walks.mjs: gait engine (walk / march / run / burst) + ladder climb, side (default) and front exports, USES for S1, S2, S5, S6, S7, PLAN, PXM.
- tools/make_acts.mjs -> shared_walks_acts.json (the act lines per use); tools/probe_px.mjs (card px per metre per cast); tools/check_motion_ep.mjs (gate copy).
- SHARED_WALKS.md: method, paste lines, table per use, lessons.
## Numbers
- Gate, both exports, 5 uses: twos 0, linear 0, no_settle 0, creep 0, foot slide 0, over-reach 0 (out/motion_gate.txt, out/motion_gate_front.txt).
- px per metre: hero 494.5, chief 598.8, kid 519.2, clerk 533.6.
## Open
- No render proof (strip) yet; frame_checks slide not measured. _test/ empty.
- S5 climb reaches +1.5 m only in the voice window (needs a lead decision). S6 step-over the ball (1445) not built.
- Depth pops on flight frames (burst 29 cm/f, kid 22.5 cm/f) to be looked at in a picture.
