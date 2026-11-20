# Camera test: our 5 finals vs 6 Rick clips (CB 2026-11-16: "lets test all camera?")

Tool: `python tools/measure/cam_track.py <video> --json <out>` (it tracks pan, zoom and roll from the picture; speed in 720p px/frame). Raw data: `camera_test_all_2026-11-16.json` next to this file.
Films: Rick's Pink Cell, Crash Tree, Cart Army, Ancient Jar, Railroads and Roller Coasters; our lightning spear v2 (approved), Monopoly v1, elevator v2, fake surgery v1 and braking lines v2. Traffic lights has no final yet.

| Film | Parked % | Gentle drift % | Moving % | Typical speed | Moves per 10 s | How hard a move hits (peak) | Frames to full speed | Slow push-in active % |
|---|---|---|---|---|---|---|---|---|
| Rick Pink Cell | 11 | 38 | 51 | 2.1 | 6.0 | 30 | 5 | 74 |
| Rick Crash Tree | 8 | 30 | 62 | 3.1 | 9.8 | 19 | 5 | 69 |
| Rick Cart Army | 9 | 21 | 71 | 5.6 | 9.9 | 18 | 6.5 | 67 |
| Rick Ancient Jar | 10 | 23 | 67 | 4.2 | 7.4 | 15 | 7.5 | 76 |
| Rick Railroads | 3 | 17 | 80 | 7.1 | 10.9 | 21 | 7 | 76 |
| Rick Roller Coasters | 8 | 13 | 80 | 8.1 | 10.0 | 17 | 8 | 66 |
| **Rick's range** | **3-11** | 13-38 | **51-80** | **2-8** | 6-11 | **15-30, mostly about 18** | **5-8** | 66-76 |
| Lightning spear v2 (approved) | **27** | 26 | **47** | 1.7 | 10.2 | 25 | **4** | **45** |
| Monopoly v1 | 6 | 47 | **48** | 1.9 | 7.4 | **32** | 5 | 79 |
| Elevator v2 | **18** | 32 | **50** | 2.0 | 9.9 | 30 | 5 | 59 |
| Fake surgery v1 | **17** | 39 | **44** | **1.4** | 9.3 | 28 | **4** | 68 |
| Braking lines v2 | **26** | 21 | 53 | 2.6 | 11.5 | 26 | **4** | **46** |

Bold = outside Rick's range or at its edge.

## What it shows
1. **Rick's camera is almost never parked** (3-11 % of the time) and moves on 51-80 % of frames, with a slow push-in running about 70 % of the time. Ours parks for 17-27 % of the time (Monopoly 6 %) and moves on only 44-53 %.
2. **Our moves hit harder and start more abruptly.** A typical Rick move peaks at about 18 (15-30) and takes 5-8 frames to reach full speed. Ours peak at 25-32 and take 4-5 frames. That is the "stop, jump, stop" CB sees: parked, then a sudden fast move, then parked again.
3. **The number of moves is not the problem.** Rick makes 6-11 moves per 10 s and so do we. The difference is how they feel: his flow from one into the next with a drift or push-in between them, and ours stop dead between them.
4. **Lightning spear v2 has the same pattern** (most parked of all at 27 %, push-in only 45 %, starts in 4 frames). Its moves are a little softer (peak 25), so it feels calmer, but it is not a clean model. Compare with Rick's range for the kind of scene, not with one film of ours.
5. **Monopoly** parks the least (6 %), but it has the hardest hits (32): its drifts are fine, and the moves themselves are too fast.

## What a stretch's camera should aim for (a range, and the scene decides)
- Parked under about 12 %: every rest keeps a slow push-in or drift.
- Moves start and stop gently: at least 6 frames to full speed and 6 to stop.
- Most move peaks between about 15 and 25. Above 30 only for a planned power hit or a whip at a place change.
- Check each finished stretch with cam_track.py beside a Rick clip of the same kind of scene, then watch the two together at full speed.
