# Fake surgery v4: NO overlaps, NO cut heads (CB 2026-11-17)

CB: "the nurse and kid still in the chair. you mention about it but didnit change. patient in hall way also have half of the head. check again and fix the issue. i dont want have stupid mistakes like this."

## The rule (no exceptions except the three below)
- Every frame-check line of type body_in_mesh, head_cut, body_side, face_covered or seat on a REST (and on a slow move) is FIXED, FAIL or WARN alike. Never waived, never "small".
- Allowed, by design, and only these:
  1. the reclined patient lying on the OR table's head section / under the drape (body_in_mesh <= 4 % into table_head_section, pillow, back pad, drape, leg tent);
  2. the grandkid's feet off the floor (he rides on the shoulders);
  3. a power-moment effect crossing a face for <= 3 frames.
- HOW to fix:
  - Move or HIDE THE PROP first (a chair segment, a side table, a cabinet, a saline bag, a paper); re-aim or widen the lens second; move the person last.
  - Moving people around created new collisions in v3: after every change re-run the check.
  - Do NOT render until the check is clean.
- The loop:
  1. edit build_film.py (and your own set/wrap keys, new keys only);
  2. bake;
  3. `timeout 600 node ../../../tools/frame_checks/check.mjs film.json` (it stages from the plan, about 1 min);
  4. repeat until 0 lines of those types (except the allowed three);
  5. THEN delete and re-render only the changed frame ranges, make_final, flicker, and the check once more on the final plan;
  6. look by eye at one crop per fixed item (out/frame_checks crops or the frames).
- Keep the v3 camera (moves, timings) and content.
- Report: the checks line before and after, every fixed item, any line left with its allowed reason. At most 12 lines. Hard cap 70 minutes.

## Per stretch (from the sweep `sN/board/checks_sweep.txt`)
- **S1:**
  - the knee close f142-185: the nurse cut by the right edge (head 45 %) and the patient cut by the left edge: widen or re-aim so both are whole, or keep them fully out of frame;
  - the patient body at the left edge f300-344 in the nurse two-shot: fully in or fully out;
  - check the patient's 2-3 % in the table head section (allowed type 1).
- **S2:**
  - the hallway gurney patients: g2 25 % inside env_handrail at about f473 (CB: "patient in hall way also have half of the head");
  - g3 inside the gurney drape;
  - every gurney patient's head whole and on the pillow, nothing (rail, handrail, frame edge, another gurney) across any head; move the handrail section or the gurney.
- **S3:**
  - pre-op: g1 48 % inside side_table_cabinet and g2 17 % inside the bay window dado (954-1004), g1 sitting with no seat (1005-1022), the patient 1 % in the bay window sill, the office surgeon in the desk pedestal / locker (781-926);
  - the CRT shot 1100-1140: patientR and the surgeon cut by the left edge, the surgeon's foot sliding 82 cm/f (a pop: he jumps from the pre-op to the OR spot: hide him until he walks in, or start him at his OR spot);
  - the nurse behind a saline bag (1100-1244) and cut by the right edge 1290-1301 (handles): move the IV pole/bag.
- **S5:**
  - THE WAITING ROOM:
    - the nurse inside chair_gang_a 1675-1925 (11-15 %) and the boy inside it (3 %): remove or move that chair segment so the nurse kneels on open floor and the boy sits ON a seat, not in it;
    - the boy's head cut by the left edge 1920-1925;
  - nr_e inside table_frame 2006-2194 (8 %): move the table or her;
  - sg_o face behind a paper 1980-2005 and behind the stamp mount 1926-1977.
- **S4:** clean of these types (only foot-slide WARNs): no round.

## v4b: THE STRICT EVERY-FRAME CHECK (lead, after CB's note and the lead's 2 fps look)
The rest-only check missed half heads that happen DURING camera moves (the lead saw them at 0:05.5, 0:33-34.5, 0:44, 0:50, 1:08, 1:10).
The gate for v4b is the strict check:
`timeout 900 node ../../../tools/frame_checks/check.mjs film.json --all-frames --frames <your render range> --no-body`
(your list: `sN/board/checks_strict.txt`).
- Fix every head_cut, body_side (a person sliced by the frame edge) and face_covered line, except:
  1. a person ENTERING or LEAVING frame by walking, for at most 4 frames;
  2. inside a join dissolve where the other image covers it (state the frames);
  3. the planned power close-ups on the surgeon's face (S2 650-665 "?" field), where the face itself is whole.
- Fix by camera path first:
  - slower sweeps that do not slice people;
  - frame the group so nobody is half in;
  - start or stop a move where nobody is at the edge.
  Then move or hide props; move people last.
- Re-run the strict check until clean (it stages from the plan); THEN re-render only the changed ranges, make_final, flicker, the rest check and the strict check once more.
- Look by eye at the lead's frames for your stretch: S1 f165, S3 f990-1030, S4 f1320, f1500, S5 f2040, f2100, f2156.
- Report the strict-check line before and after. At most 10 lines. Hard cap 60 minutes.
