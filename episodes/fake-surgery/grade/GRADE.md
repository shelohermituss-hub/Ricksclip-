# GRADE (fake-surgery, adapted from monopoly-escape; CPU)
Files: grade/grade.py (grade_u8(img, film_frame)), lights.json (kind per film-frame range), params.json (per kind), measure.py (`python measure.py before|after`, every 15th frame in each span, impact/fold/lid frames skipped).
Method: per light kind one pure colour map (no blur, vignette or grain, so no flicker): identity luminance curve (no added contrast), a coloured HAZE veil lifting only the darkest tones so the darkest 1 % lands near 0.10 (set by `measure.py before --set-haze`; kinds already at or above 0.10 get none), a mild saturation gain on weak colours, tiny shadow/highlight tints, NI night floor (mean >= 0.322, only for frames that fall under it).
Guards (from the UNGRADED pixel): faces and near-white identity; caption letters pure 255 and the black outline ring untouched; THE red (pain, hue within 10-20 deg of red, S>.4) no gain; EV coral sun/iodine orange (hue 6-46, S>.4) no gain/tint (params `terra`); glint identity; soft ceiling .975 (only caption letters are 255). Frames with mean < 0.12 (the black lid fade 1676-1695) get the haze scaled down so black stays black.
Kind changes blend 12 f (B-6..B+5) except hard cuts 927 and 1290; last 12 f blend EV -> OR (loop).
Kinds: OR 0-374, 1087-1289, 1684-1765 | CO 375-539, 927-1086 | NI 540-926 | AF 1290-1683, 1766-1925 | GR 1926-2062 | EV 2063-2229.

| kind | n | sat before | sat after | mean before | mean after | darkest 1% before | after | clip>.985 before/after |
|---|---|---|---|---|---|---|---|---|
| OR | 36 | 0.513 | 0.502 | 0.374 | 0.394 | 0.040 | 0.107 | 0.030 / 0.027 |
| CO | 21 | 0.481 | 0.544 | 0.494 | 0.508 | 0.110 | 0.114 | 0.015 / 0.012 |
| NI | 24 | 0.410 | 0.424 | 0.400 | 0.406 | 0.076 | 0.100 | 0.029 / 0.019 |
| AF | 34 | 0.494 | 0.514 | 0.457 | 0.457 | 0.100 | 0.100 | 0.013 / 0.012 |
| GR | 8 | 0.358 | 0.357 | 0.476 | 0.476 | 0.106 | 0.106 | 0.048 / 0.010 |
| EV | 10 | 0.467 | 0.478 | 0.429 | 0.434 | 0.075 | 0.099 | 0.028 / 0.026 |

Caveats: measured on the frames on disk at run time (s2 co 369-540, s3 1087-1289 and s4 1588-1619 were being re-rendered, so CO/OR/AF samples are partial; GR/EV n is small). OR sat is 0.011 under before (haze veil on near-black teal; gain 1.5 is the cap I set: raise it if CB wants). CO gain 1.4 may be too much once the real corridor frames land (before .48 there only from the pre-op bay). Faces white, the pain red and caption letters are numeric guards, not yet checked by eye on rows 34/36-38. No picture-level before/after pair viewed; v0_sheet16.jpg shows the graded cut only.
