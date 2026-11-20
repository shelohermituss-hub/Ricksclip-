# Frame checks: s4/film.json

1 FAIL, 7 WARN, 20 PASS. 418 of 1696 frames checked (camera rests: f0-1695), cast patientShorts, climber1, climber2, climber3, surgeonOff, 43.3 s.
Numbers: head_cut = % of head+hat inside the frame (100 = whole). body_side = % of the figure's width inside the frame. face_covered = face rays (head centre, two eyes) blocked by set geometry. feet = cm between the foot and the surface below (+ floats, - inside). body_in_mesh = % of the body (neck to sole) inside a solid set part (counter, table, tub, chair, cart).

| result | who | rest | check | number | worst at | bad frames | what | crop |
|---|---|---|---|---|---|---|---|---|
| FAIL | patientShorts | f0-1695 | slide | 5.5 % | f1362 | 17/134 | the planted foot slides 5.5 cm per frame across the picture (pose "pt_bound"): it glides instead of stepping | [crop](frame_checks/FAIL_slide_patientShorts_f01362.jpg) |
| WARN | climber1 | f0-1695 | head_cut | 36 % | f1448 | 2/42 | cut by the right+bottom edge (only 2 frames: WARN) |  |
| WARN | climber2 | f0-1695 | head_cut | 66 % | f1448 | 2/42 | cut by the bottom edge (only 2 frames: WARN) |  |
| WARN | climber1 | f0-1695 | body_side | 61 % | f1449 | 2/42 | cut by the right edge (only 2 frames: WARN) |  |
| WARN | climber3 | f0-1695 | body_side | 43 % | f1446 | 1/44 | cut by the right edge (only 1 frames: WARN) |  |
| WARN | climber3 | f0-1695 | head_cut | 60 % | f1446 | 1/44 | cut by the right+bottom edge (only 1 frames: WARN) |  |
| WARN | climber2 | f0-1695 | face_covered | 3 rays | f1448 | 1/42 | head centre INSIDE stairwell/step_mass; in front: stairwell/tread_terrazzo (only 1 frames: WARN) |  |
| WARN | surgeonOff | f0-1695 | slide | 1.9 % | f1585 | 1/205 | the planted foot slides 1.9 cm per frame across the picture (pose "pt_dial"): it glides instead of stepping |  |
| PASS | patientShorts | f0-1695 | face_covered | 0 rays | f1334 | 0/156 |  |  |
| PASS | patientShorts | f0-1695 | body_side | 100 % | f1335 | 0/156 |  |  |
| PASS | patientShorts | f0-1695 | head_cut | 100 % | f1335 | 0/156 |  |  |
| PASS | patientShorts | f0-1695 | feet | -3.3 cm | f1434 | 0/155 | on stairwell/landing_mass |  |
| PASS | climber3 | f0-1695 | face_covered | 0 rays | f1446 | 0/44 |  |  |
| PASS | climber3 | f0-1695 | prop_in_hand | 0 % | f1446 | 0/44 |  |  |
| PASS | climber3 | f0-1695 | slide | 0.1 % | f1447 | 0/43 |  |  |
| PASS | climber1 | f0-1695 | face_covered | 0 rays | f1448 | 0/42 |  |  |
| PASS | climber2 | f0-1695 | body_side | 85 % | f1448 | 0/42 | cut by the left edge |  |
| PASS | climber1 | f0-1695 | prop_in_hand | 0 % | f1448 | 0/42 |  |  |
| PASS | climber2 | f0-1695 | prop_in_hand | 0 % | f1448 | 0/42 |  |  |
| PASS | climber1 | f0-1695 | slide | 0 % | f1449 | 0/41 |  |  |
| PASS | climber2 | f0-1695 | slide | 0 % | f1449 | 0/41 |  |  |
| PASS | climber3 | f0-1695 | feet | 0 cm | f1455 | 0/35 | on stairwell/step_mass |  |
| PASS | climber1 | f0-1695 | feet | 0 cm | f1457 | 0/33 | on stairwell/step_mass |  |
| PASS | climber2 | f0-1695 | feet | 0 cm | f1457 | 0/33 | on stairwell/step_mass |  |
| PASS | surgeonOff | f0-1695 | body_side | 97 % | f1490 | 0/206 | cut by the right edge |  |
| PASS | surgeonOff | f0-1695 | head_cut | 100 % | f1490 | 0/206 |  |  |
| PASS | surgeonOff | f0-1695 | face_covered | 0 rays | f1490 | 0/206 |  |  |
| PASS | surgeonOff | f0-1695 | feet | 0 cm | f1585 | 0/206 | on office_set/office_carpet_tiles |  |
