# LOOK_INVENTORY: astro-flush reference, first 40 s (PRIVATE, never published)

Source: `references/look_match/astro_flush/ref/full2/t_NNN.jpg` (1080x1920, t_N = (N-1)*0.5 s = reference frame (N-1)*15)
and `ref/all/f_NNNN.jpg` (540x960, every frame). Work files: `references/look_match/astro_flush/work/look/`
(`stats.py`, `patch.py`, `quant.py`, contact sheets `sheet_*.jpg`, timelines `tl_*.jpg`).

How to read this file
- Hex = median of a hand-picked patch, or a 6-colour quantise of a crop (marked q). Read from JPEG video frames:
  expect +-6 per channel. "L" = relative luminance 0..1 (Rec.709 weights on the 8-bit values, no gamma removal).
- "f123" = reference frame number (0-based, 30 fps). Timeline frames come from 5-6 frame steps, so +-5 frames.
- Sizes are ESTIMATES against a character (1 unit = about 1.1 m, head included; head is about 0.35 m wide).
  Marked "est.". Nothing here was measured in 3D.
- Characters and captions are not sets; they are listed only where a builder needs them for scale or colour.
- Not seen in these 40 s (do not invent from this file): the toilet room's 4th wall behind the camera, the cabin's
  left and front walls, the sleep bay ceiling above the top windows, the ship's far side and belly aft of the nose.

Whole-frame numbers for all 80 half-second frames: `python3 references/look_match/astro_flush/work/look/stats.py`.

---

## A. Ship toilet room

Four states of ONE room: day (shot 1, t_001-002), night (shot 6, t_034-036), wide (shot 12, t_068-073),
exploded toilet (t_073-075).

### A1. Palette
| Surface | Day lit | Day shade | Night (t_035) | Wide (t_068) |
|---|---|---|---|---|
| Wall panels, upper | #302f3c / #282a37 | #081122 (beside window) | #1b1b41 | #212129 (lit spot #222220) |
| Wall panels, lower (under shelf) | #191923 | #15151b q | #020138 | #151821 |
| Panel seams / baseboard | #000000 | - | #000018 | #0b0b18 q |
| Window frame (metal ring) | #4f4953, warm top light #736361 to #8b776f q | #1c191f q | #101c50 | #6e6f77 q, shade #17191f q |
| Door frame (wide only) | - | - | - | #646973 |
| Door opening, wall behind it | - | - | - | #2e5590 (blue panels) |
| Shelf, wood | #864d45 | - | dark line | top #a3705d q, front #693a2c q |
| Floor, white tile | #f5f2f5 q | #d4cfd3 to #b1abb0 q | #f5f7fd q (bloomed), #d4d9e9 q | #fefdfe q, #dfdee1 q, in shadow #8a939f q |
| Floor, black tile | #211f25 q | #141217 q | #384476 to #576498 q (blue lift) | lit #6f6f73 (sheen), shade #393943, q mean #4e4d54 |
| Toilet porcelain | #e6e3dd, top #fdfdfd q | #c1bfbe, deep #868589 q | #d1e7fe lit, #4455a7 lid in shade, #b1c8ef bowl | #ecede8 / #ebebeb |
| Toilet roll + ribbon | #ece9e2 | - | - | #f8f0e1 q |
| Grab handle, orange | #e77012, hi #f29934 q | #a64618 q | - | #ea9126 |
| Towel (wide only) | - | - | - | #f1971b, white stripes #f8f0e1 q |
| Cup (blue) | - | - | #2aa4f9 | #2a8ecd q |
| Paper dispenser box (night, left) | - | - | #5367bd | white box at tank side |
| Plant pot / leaves (day) | #e1d1c2 q / #61962e q | - | - | - |
| Hose, ribbed (wide) | - | - | - | ribs #fafcfd q on #64656b / #44484e q |
| Poster "FLUSH" | - | - | - | paper #f9faf8 q, header #151e47 q |
| Window view: space | #010019 | - | #01001b | - |
| Window view: Earth | ocean #5593f3 q, haze #7bc9f7 q, rim glow #a2f8fe q, cloud #e0fcfb q | - | none (stars only) | #1f52a6 |
| Exploded parts (t_074) | #fefefe (clipped) | #4a555d bowl underside | - | glow #f8fffd |

Whole-frame numbers
| Frame | mean L | p1 | p50 | p99 | mean sat | std L |
|---|---|---|---|---|---|---|
| t_001 day | 0.351 | 0.000 | 0.185 | 1.000 | 0.381 | 0.346 |
| t_035 night | 0.321 | 0.003 | 0.115 | 0.999 | 0.654 | 0.362 |
| t_068 wide | 0.327 | 0.000 | 0.171 | 1.000 | 0.209 | 0.336 |
| t_074 exploded | 0.331 | 0.000 | 0.208 | 1.000 | 0.245 | 0.333 |

### A2. Light
- Day: key from high and in front (camera side), slightly left. Soft contact shadow under the toilet and the
  character, no long cast shadow. Window frame catches a warm top light (#8b776f). Earth is self-lit (emissive
  picture), it does not light the room.
- Wide (shot 12): key from the right/window side, high. HARD long shadows of both characters and of the roof beams
  across the checker (t_068 lower third). Shadow colour is neutral dark grey-blue (#393943 on black tile, #8a939f on
  white). Shadow/lit on black tile: 0.226 / 0.436 = 0.52. Floor is glossy: faint grey reflections and marble veins
  in the black tiles (t_068, y 1500-1900). One warm spot on the back wall top centre (#222220 against #212129).
- Night: room is blue monochrome. The toilet is the light: white-blue emissive with bloom. Luminance on a row
  through the tank edge (t_035, y=1100): 0.03 at 80 px away, 0.38 at 20 px, 1.0 at the surface, so the halo is
  about 60-80 px wide at 1080. Floor tiles near it clip to white. No visible cast shadows.
- Exploded: toilet goes cyan-white emissive from f1086, parts clip to #fefefe, cyan spill on the floor at the hose
  joint (t_073-074).
- Haze: none.

### A3. Inventory
| Object | Size (est.) | Shape and parts | Notes |
|---|---|---|---|
| Room | 2.6 m wide, 2.4 m to the roof peak, 2.5 m deep | Back wall is a house-shaped gable: vertical to 1.5 m, then two 45 degree roof slopes with a lighter rim strip (#6e6f77) following the gable; 2 thick roof beams | t_068 |
| Wall panels | 0.45 x 0.30 m | rectangular plates, dark seam 3-4 px, 4 small light rivets at each panel corner | t_068, t_001 |
| Window (right wall in wide = back wall in shot 1) | opening 0.9 x 0.75 m | rounded rectangle, radius about 0.15 m, metal ring frame 0.12 m wide with about 14 round bolts, deep inner bevel | Earth limb fills the lower half (day) |
| Orange grab handle | 0.9 m tall, 3 cm tube | vertical bar on 2 black standoffs, right of the window (and one at the left edge) | t_001 x=940 |
| Black wall speaker / dispenser | 0.12 x 0.2 m | black box on the right wall at head height | t_001 x=1040,y=400 |
| Shelf | full wall width, 0.06 m thick, top at 0.75 m | wood plank, slightly darker front edge | carries plant (day) or cup+toothbrush on a spring, toilet roll, framed kid drawing (wide) |
| Lower cabinets under the shelf | 0.75 m tall | flat dark doors with seams | towel rail with orange/white towel (wide) |
| Toilet | 0.73 m tall with lid up, bowl 0.4 m wide | standard two-piece: tank with lid, oval lid upright, oval seat, bowl narrowing to a foot, chrome flush lever on the tank's left side (0.2 m long), 2 black hinge pegs | no outline; 2 px dark rim only |
| Toilet roll | 0.12 m | roll on the wall right of the tank, core #c49b2a-ish; its paper unspools as a floating ribbon in shot 1 (f20-32) | t_001 |
| Floor | tiles about 0.22-0.25 m | black/white checker, square to the back wall | glossy in the wide shot |
| Floor wedge blocks | 0.1 m | 2 small grey wedges at the wall base (door stops / foot restraints) | t_001 x=350 and x=950,y=1280 |
| Door (wide only, back wall left) | 0.57 x 1.2 m | rounded-top opening, grey frame 0.07 m, blue panel wall seen through it | commander stands in it |
| Poster (wide, left of door) | 0.2 x 0.25 m | white sheet, navy header | see lettering |
| Hose (wide) | 5 cm thick | ribbed hose lying on the floor from the toilet base to the left wall | start of shot 13 |

Lettering
- Poster header, white on navy #151e47: "FLUSH" and a small second line (unreadable, two words with a dot between).
  THE WHOLE POSTER IS MIRRORED in the reference (reads "HSULF", day names on the right read backwards: MON, MON?, TUE,
  ..., WED, WED). 6 rows: 3 with ticked boxes, the 4th struck through with a red hand-drawn line and a red stamp, 2
  empty boxes; each row has a time like "07:00" / "21:00". Black text on white.
- Character name tag: "NEW GUY", hand-lettered black on cream, tilted.

Changes over time
- Shot 1: f0-20 held, f20-32 paper ribbon unspools, f32 pull back through the window, f36 outside.
- Night: f497 cross-dissolve in from the sleep bay; f503-527 toilet glowing; f533 dissolve to the cockpit.
- Wide: f1002 dissolve in from space; f1008-1068 commander in the doorway; f1074 he is gone; f1086 toilet starts to
  glow cyan; f1098 it lifts; f1104-1116 exploded view: from top to bottom tank (tilted), lid, seat ring, bowl,
  floor flange and gasket ring, spread over about 1.6 m of height; f1122 camera drops to the hose.

### A4. Materials
| Object | Feel |
|---|---|
| Wall panels | flat matte, uniform fill (patch sd 1-6), detail = seams + rivets only |
| Window ring, door frame | matte metal, light grey, no sharp speculars |
| Floor | glossy tile (reflections, veins) in the wide; reads matte in shot 1 |
| Toilet | glossy white, soft shading, clipped highlight on top; emissive at night and when exploded |
| Shelf | matte wood with faint grain lines |
| Handles, towel, cup | flat saturated matte |
| Outline | none on props. Toilet edge shows a 2 px dark rim (L 0.15-0.18 against wall 0.23-0.27, t_001 y=1000) |

### A5. Top view (shot 12 camera at the bottom, looking up the page)
```
        back wall (gable)
   +--[poster]--[DOOR]---------------+
   |            cmdr                 |  right wall:
   |                 new guy   shelf |  [ WINDOW -> Earth ]
   |  hose ==================[TOILET]|  shelf + towel under it
   |                                 |
   |        checker floor            |
   +--------------  CAM (shot 12) ---+
Shot 1 camera: stands where "new guy" is, looks at the RIGHT wall (window behind toilet and character).
Shot 6 (night): same as shot 1, closer, lower.
```

---

## B. Ship exterior "LODESTAR", Earth, stars, flame, glitter

### B1. Palette
| Surface | Lit | Shade |
|---|---|---|
| Hull side panels | #2e323d (t_059), #2c2f3c q | #1a1e29, #00000c (shot 2 close, t_003) |
| Hull top / shoulder | #9d9fa9 (t_063), #717682 to #a6a6a9 q (t_061) | #3a4657, #555b69 |
| Hull, cockpit end in shot 7 (warm key) | #736870, #8c7b81 q | #413634, deep #08051a |
| Panel seams | #0d101a | - |
| Belt stripe | #e67817 orange (shot 11); #a41300 red (shot 2 close, in shade) | - |
| Sill under stripe | #a4a6b4 | - |
| Belly heat tiles | #1f2a43, #303d57 q | - |
| Porthole outer ring | #8c9194 | - |
| Porthole inner bevel | #516082 | - |
| Window glow (lit cabins) | #edc57f, #e9be7c | dark window #000000 |
| "LODESTAR" letters | #fcfcfc emissive, soft white halo | - |
| Roof marker dashes | yellow #f1e126-ish | - |
| Gold foil (tanks, collar) | #c2a832, #c2aa54 q | #3d2902 |
| Round solar fans | #7ea1d5 / #759aca (lit, shot 11); #081467 (shot 7, back-lit) | - |
| Rectangular solar arrays | #3b3e47 with fine line grid | - |
| Engine flame | core #fefefe; edge #cbaaf1, #8a6ee7, #6d51b8; outer halo #392d5d | - |
| Space | #010019, #000014, #06001e | - |
| Nebula smudges | #24182d (purple-red), #0f1121 | - |
| Earth ocean | #2062bd, #2c76c1 q; in hull shadow #05397e | - |
| Earth land | #8fc583 (pale green) | - |
| Earth cloud | #dee6f2, #e1eef4 q | #b8c6d2 q |
| Earth rim (atmosphere) | #e4fffe, clipped to #ffffff at the edge | - |
| Glitter | white points #d3d2dd to #ffffff on #020118 | - |

Whole-frame numbers
| Frame | mean L | p1 | p50 | p99 | mean sat | std L |
|---|---|---|---|---|---|---|
| t_004 ship over Earth | 0.394 | 0.005 | 0.390 | 0.999 | 0.587 | 0.365 |
| t_008 burn | 0.111 | 0.005 | 0.011 | 0.996 | 0.798 | 0.240 |
| t_063 hull + name | 0.120 | 0.005 | 0.013 | 0.962 | 0.780 | 0.223 |
| t_066 whole ship, small Earth | 0.065 | 0.005 | 0.012 | 0.830 | 0.883 | 0.159 |

### B2. Light
- One hard white key (sun) from above and slightly behind the camera: hull top L 0.63, hull side L 0.12-0.20
  (side/top = 0.19-0.31, t_063). Shadow side is navy-black, never grey.
- Shot 7 (cockpit) uses a WARM key: hull reads #736870 and there is a warm haze in the top-left of frame
  (#685a59, t_046) like a sun just out of frame, plus a lens star at f694-704.
- Emissive: cabin windows (amber), "LODESTAR" letters (white with bloom), flame (clipped core, purple halo about
  100-150 px each side at 1080 in t_008), engine pre-glow red at f84-92.
- Earth: evenly lit day side, no terminator in shot 2, a soft white sun glare patch on the clouds bottom right
  (#f2f2f4, t_004). Thin bright cyan-white atmosphere rim about 15-20 px. In shot 11 Earth is a small disc 140 px
  wide with a dark crescent on the lower right (t_066).
- Stars: background median L 0.006-0.019. About 240-380 stars per megapixel at 1080x1920, typical star 9 px area
  (3 px across), 10 percent are 15-25 px area with a soft glow, peak L 0.84-0.98. Coloured ones are rare. Faint
  purple nebula smudges add L 0.07-0.11.
- Glitter trail (shot 11, t_064-067): cloud of white sparkles streaming from the aft end, widening, about 400 px
  long; a second small puff at the collar. In shot 7 (t_041-047) glitter fills the air around the cockpit as dense
  white points and 4-point sparkles; a few larger pieces are hexagons.

### B3. Inventory
| Object | Size (est.) | Shape and parts |
|---|---|---|
| Fuselage | 17 m long, 3 m tall, 3 m wide | Long box with chamfered (45 degree) top shoulders, so the cross-section is a house/hexagon shape. Flat panels in brick-offset rows about 1.3 x 0.9 m, dark seam, rivet rows along seams. Tapers at the nose over the last 3 m to a small flat tip with a round port |
| Side windows | frame 0.72 x 1.0 m, opening 0.45 x 0.7 m | 10 per side (t_004: 8 amber + door window + 1). Rounded rectangle, flat grey ring with 6 white hex bolts (4 corners, top, bottom), blue-grey inner bevel. One window dark in shot 11 (the toilet room: t_062-063, 6th from the nose) |
| Larger aft window / hatch | 0.9 x 1.1 m | rounded rectangle with lighter ring at the aft end of the side (t_063 x=260,y=960) |
| Belt stripe | 0.25 m tall | orange band under the windows along the whole side, light sill below, sweeps down toward the nose |
| "LODESTAR" | letters 0.5 m tall, word 5 m | on the upper shoulder panel, mid-ship |
| Roof dashes | 0.4 m | short yellow dashes in 2 rows on the roof and shoulder; in shot 2 close they are yellow bracket handles |
| Small hazard box | 0.3 m | square box with yellow-black hazard border and a round lens, on the stripe under the toilet window (t_003 x=390,y=1130): the waste vent seen from outside |
| Cockpit canopy | 3 m | faceted glass with a white frame grid 4 x 3 panes on the nose top (t_066), see F |
| Collar | 2 m dia | gold foil dome joining fuselage to truss; antenna mast (thin rod) and a small dish on it |
| Truss | 6 m | open white lattice with 2 gold capsule tanks in line |
| Round solar fans | 3.5 m dia | 2 discs on thin booms left/right of the collar, 10-12 pie segments with dark spokes, fine cell texture |
| Rectangular arrays | 4 x 2.5 m | 2 dark panels on the truss with a V notch cut in the outer edge, fine vertical lines, thin light frame |
| Engine block | 2.5 m | dark octagonal drum with 2 gold bands, bell nozzle |
| Wrench | 0.2 m | a loose spanner drifting near the stripe (t_060 x=980,y=1210) |

Lettering
- "LODESTAR": white, all caps, wide letter spacing, italic condensed sans, emissive with halo (t_061-063). Also small
  on the forward upper hull in shot 2 (t_004).
- No other readable hull text.

Changes over time
- Shot 2: f36 close on the hull, f40-72 pull back to the whole ship over Earth, f76-88 ship yaws away, f84 engine
  red glow, f100-120 full purple-white flame, ship shrinks; f120-125 the picture becomes an inset panel on the
  mission control wall screen.
- Shot 11: f858 porthole close, pull back along the hull past the name (t_060-062), f930-990 whole ship with the
  glitter trail, Earth small top right; f1002 dissolve to the toilet room.

### B4. Materials
| Object | Feel |
|---|---|
| Hull panels | flat matte, uniform fill (sd 1, t_059); a few short lighter scuff dashes per panel |
| Hull top | slightly glossy grey, catches the key |
| Gold foil | crinkled faceted metallic (low-poly facets), strong light/dark facets |
| Solar | flat with fine line texture |
| Windows | emissive amber card with a faint inner rectangle; the toilet window shows the real room |
| Letters, flame | emissive + bloom |
| Outline | none. Porthole ring to hull edge: 0.13 -> 0.65 in 4 px, no dark line (t_059) |

### B5. Top view (shot 11)
```
 glitter <<<< [ENGINE]==truss+2 gold tanks==(gold collar)[=========== FUSELAGE ===========>nose/canopy
                 rect array (V notch) above and below truss     LODESTAR on the shoulder
                 round fan  o--boom--   --boom--o  round fan
 Earth: far, behind the ship, top right of frame.
 Camera: starts on the 6th porthole (new guy), pulls back and up to a high 3/4 view from the nose side.
```

---

## C. Mission control room

### C1. Palette
| Surface | Lit | Shade / variant |
|---|---|---|
| Wall screen, map background | #31437e, #253671 q | grid lines slightly lighter #354888 q |
| Continents | #608c99 q (grey-teal), outline lighter | #4b717f q |
| Orbit track | yellow #f5e27f-ish line, 5 px | predicted part: thin white dashed |
| Wall screen, dark (FLUSH WINDOW) | #32385a | #1d2a3b q |
| Screen during red alert | #463557 | graph area #543c39, #2a1927 q |
| Clock strip housing | #161928 | #050823 q |
| Clock digits | amber #f5e27f q core, glow #8f7b45, unlit segments #472b16 q | labels white |
| Ceiling tiles | #3c4784 (normal) | #4e386c (red alert, t_019), #5f4b5f (shot 10) |
| Ceiling grid lines | lighter, 2-3 px | - |
| Cyan light strip (cove) | #d1ffff core, glow | - |
| Soffit above the screen | #000321, #000020 | - |
| Side wall | #383a62 | - |
| Carpet | #5e66a3, #666fae q | #58609a q; speckles #9fa7df q; near-dark #343549 under the alert |
| Desk top | #fffdff | - |
| Desk front / cabinets | #2e2d3f, #3c3f51 | recessed panels with lighter 3 px frame #585b77 q |
| Desk label band | #383645, text white | - |
| Floor rings (pedestal bases) | black disc with yellow ring #ece963 q | - |
| Pedestal pole | #29325d | - |
| GO button | green dome #8dffcd on a white box | - |
| NO GO button | cover yellow #feff7f, dome #f9bcac (lit red-pink) | - |
| Bin | #515267, paper balls white | - |
| Books | white #f7f6fa, red #d8606d, yellow #f9eb59, blue #6cb0ed q | - |
| Side monitor | #14204a / #23305c q, lines #d8e8fa, graphs cream + cyan | - |
| GO graphic | #62fdbd q with glow, on #273a49 | ring dims to #32a175 q |
| Alert banner | #e4163d, header strip #ab082c, text #fef6f8 | - |
| OFF COURSE | band #d6072b q / #a6001e, frame #7a214c, letters white | - |

Whole-frame numbers
| Frame | mean L | p1 | p50 | p99 | mean sat | std L |
|---|---|---|---|---|---|---|
| t_010 map | 0.267 | 0.007 | 0.208 | 0.996 | 0.525 | 0.239 |
| t_014 countdown | 0.281 | 0.007 | 0.221 | 0.996 | 0.482 | 0.229 |
| t_019 red banner | 0.289 | 0.006 | 0.218 | 1.000 | 0.494 | 0.257 |
| t_056 OFF COURSE | 0.311 | 0.006 | 0.201 | 1.000 | 0.428 | 0.301 |

### C2. Light
- Soft, even, blue-violet ambient. No strong key; characters cast only a soft dark blob on the carpet and a soft
  shadow on the cabinet behind them (t_014 x=680,y=1450). No hard edges.
- Emissive: wall screen, clocks, cyan cove strip (bloom), 2+ round ceiling downlights (white ovals, t_014 top),
  buttons (the GO dome glows green on its box, the yellow cover glows), pedestal floor rings (yellow).
- The screen tints the room: ceiling #3c4784 -> #4e386c and carpet #5e66a3 -> #343549 when the red banner is up
  (f265-275), back to blue-violet with a pink cast in shot 10.
- Haze: none.

### C3. Inventory
| Object | Size (est.) | Shape and parts |
|---|---|---|
| Wall screen | 5 m wide, 2.3 m tall, bottom edge at 1.0 m | one flat panel in a dark bezel, tilted back slightly; thin dashed white header lines at the top corners |
| Clock strip | 5 m x 0.3 m, directly above the screen | 4 recessed dark boxes with 7-segment amber digits and a small white label top-left of each |
| Soffit + cove | full width | dark band above the clocks, then a cyan light strip, then the ceiling |
| Ceiling | - | square grid tiles about 0.6 m, light lines, round downlights |
| Controller desk | 2.7 m long, 0.75 m tall, 0.7 m deep | white top slab 6 cm thick; dark band under it with the 3 station names; 3 recessed front panels. On top per station: a dark keyboard block and a lower dark monitor base with a thin cyan light line. A white mug with a blue band at FAO |
| 3 controllers | seated, heads only above the desk | FAO (green shirt, glasses), CAPCOM (blue), GUIDO (grey uniform); all with black headsets and boom mics |
| Flight director console | 2 pedestals | each: black disc base 0.5 m with a yellow ring, thin pole 0.85 m, small white box on top. Left box: green dome button. Right box: red dome button labelled "NO GO" under a flip-up yellow cover |
| Side counter (right) | 1.5 m, 0.75 m tall | white top, dark cabinets with 2 vertical door seams; 4 standing books (white, red, yellow, blue) |
| Side monitor (right wall) | 0.6 x 0.9 m | portrait screen, 2 line graphs (cream, cyan) over rows of dashed "text" |
| Bin | 0.35 m | grey cylinder with crumpled paper balls, right of the desk; removed after f150 when the director walks in |
| Carpet | - | blue-violet with random small lighter square speckles (pixel confetti, 4-8 px at 1080) |

Lettering and screen contents
- Clock labels (white, small caps sans): "GMT", "MET", "CST", "LOS".
- Clock digits (amber 7-segment): GMT "325:21:41:57", MET "0 12:04:17:33", CST "16:41:57", LOS "12:03" (f130-150).
  They run in real time, 1 s per 30 frames: MET 17:33 (f135) -> 17:38 (f270). LOS counts DOWN: 12:03 -> 11:59
  (t_019). Shot 10: GMT ..:42:20, MET 0 12:04:17:56, CST 16:42:20, LOS 11:41 -> 11:40.
- Desk band, white bold wide sans: "FAO", "CAPCOM", "GUIDO".
- Button: "NO GO" small pale text on the white box.
- Screen states:
| Frames | Screen |
|---|---|
| f120-130 | the space shot shrinks into a portrait inset (blue 3 px border) at the screen's upper left |
| f130-180 | world map: navy grid, flat grey-teal continents with simplified straight-edged outlines, yellow sine orbit track, white dot = ship, dashed white predicted track; block of dashed "text" lower left; inset still shows the burn |
| f185 | cross-fade map -> dark screen |
| f190 | header "FLUSH WINDOW" (white italic caps, yellow tick bar left, thin cyan rule under it); empty amber ring |
| f195-205 | big "3" (cream-white, amber glow, rounded square digit) with a ring arc sweeping |
| f205-212 | "2" |
| f215-222 | "1" |
| f225-260 | green ring with "GO" (bold italic, rounded, #62fdbd) and "AUTHORIZED" small under it, green glow on the screen |
| f265-270 | screen tints red, "NO GO" in red outline letters with glow |
| f275-285 | red banner: header strip with yellow-black hazard stripes, "C&W  FLT DIR  WCS INHIBIT" left, "MSG 0417" right (white italic caps); box with white border; "NO FLUSHING" / "TONIGHT" in 2 lines, white bold italic squared sans |
| shot 10, f804-855 | header "C&W  FIDO  TRAJ DEVIATION", "MSG 0418"; huge "OFF COURSE" white on red, wider than its red band; sub line "FIDO  TRAJ  PLAN VS ACTUAL" left and "DEV 4.7 DEG" right (the number counts up from 0.0 at f804 to 4.7 by about f825); dark red graph: white dashed straight line labelled "PLANNED", red solid line that leaves it and bends down, ending in a red arrow head; whole screen framed in dark red |
- Director action: walks in from the right at f150-170, presses GO (f225), flips the yellow cover and hits NO GO
  (f260-265).
- f285: pull back; the whole room is a picture on the cabin wall screen (place D).

### C4. Materials
| Object | Feel |
|---|---|
| Walls, cabinets, desk | flat matte, uniform (sd 1-6) |
| Desk top | flat white, clipped |
| Screens, clocks, strip, buttons, floor rings | emissive, light bloom |
| Carpet | matte with speckle pattern |
| Outline | none on props |

### C5. Top view
```
   ================= WALL SCREEN (clocks above) =================   | side monitor
                                                                    |
   [FAO][CAPCOM][GUIDO]  desk     (GO)o   o(NO GO)   [side counter + books]
                        (bin)       director
        carpet
   CAM: starts on the screen's upper left (inset), pulls back and pans right to the director,
        ends centred on him between the two pedestals, low angle looking up.
```

---

## D. Ship cabin, day

### D1. Palette
| Surface | Lit | Shade |
|---|---|---|
| Upper wall panels | #a7abbe (cool grey), #b6b4bf q | #958c8b q (soft shadow under the bags), warm bounce #beaea0 q |
| Panel seams | darker grey 2-3 px + corner rivets | - |
| Quilted lower wall | #b4aa9e / #beb4a8 q | grooves #8f857b q; in character shadow #201714 q |
| Floor (dotted rubber) | #bfb2a7, #c7bcaf to #d3c8ba q | in character shadow #3a3127 |
| Rail band between upper and quilted wall | teal #0dc8a6 with an orange line #ea7121 above | - |
| Wall screen frame | #241a1a | label plate #24232a, text #f3f2f8 |
| Stowage bags | blue #4c548e, orange #f69c19, red #e62d1b; straps grey #78748e; white label patch | - |
| HEAD sign | green #344e46, border gold #ebd58a, pictogram/letters #fcfce9 | - |
| Hatch door (right) | teal #73bca3 with a glowing cyan sheen #8bf6fb, frame #0f0405 | - |
| Roof braces | grey-beige tubes | - |
| Table / galley (left) | black #080303, brown #332824 | red bottle #c02119 |
| Magazine | cyan #54ecf3 / #93fdfa, label yellow with orange text | - |

Whole-frame numbers
| Frame | mean L | p1 | p50 | p99 | mean sat | std L |
|---|---|---|---|---|---|---|
| t_022 | 0.518 | 0.001 | 0.619 | 0.996 | 0.292 | 0.284 |
| t_024 | 0.504 | 0.002 | 0.611 | 0.998 | 0.316 | 0.293 |
| t_027 | 0.496 | 0.003 | 0.602 | 0.996 | 0.325 | 0.295 |

### D2. Light
- Brightest place of the film (p50 0.61). Key from the front, high, slightly right of camera: each puppet throws a
  HARD, sharp silhouette shadow down-left onto the quilted wall and onto the floor (t_022: three shadows, legs and
  arms readable).
- Shadow colour: warm near-black on the quilt (#201714), warm brown on the floor (#3a3127).
- Shadow/lit: floor 0.197 / 0.706 = 0.28. Quilt 0.095 / 0.71 = 0.13.
- Bags throw only a soft, light shadow on the wall (0.555 / 0.71 = 0.78).
- Emissive: wall screen, door sheen, small green LED at the screen's bottom right. No haze.

### D3. Inventory
| Object | Size (est.) | Shape and parts |
|---|---|---|
| Back wall | 3 m wide seen | upper 1.3 m: flat grey panels about 0.55 x 0.4 m with seams and corner rivets; then the teal rail band at 1.0 m; below it the quilted wall down to the floor |
| Quilting | diamonds 0.12 m | diagonal grid, each diamond padded (light centre, dark groove), small button at crossings |
| Floor | - | light grey-beige rubber with a regular dot grid, dots about 2 cm at 5 cm pitch |
| Wall screen | 0.75 x 1.35 m portrait, centre | thin dark frame, small camera on top centre, label plate under it; shows mission control live |
| Bags | 0.45 x 0.3 x 0.3 m | soft rounded duffels strapped to the wall with 2 grey straps each, white rectangular label: blue (upper left), orange (upper right, overlapping the screen corner), red (far left) |
| HEAD sign | 0.3 x 0.4 m | right of the screen at 1.6 m |
| Hatch door | 0.7 m wide, 1.4 m tall | rounded-top door at the right edge, dark thick frame, teal leaf with a round porthole (light blue glass, bolted ring), long brown lever handle |
| Roof braces | 6 cm tube | 2 diagonal braces from the upper corners toward the centre top |
| Galley table (left edge) | top at 0.8 m | black round table on a single black pole and disc foot; on it: red ketchup-like bottle, yellow block, tray. Behind: a grey box (printer/oven) on a shelf. Under the top: 4 small food drawer labels |
| Props in hand | - | commander: red/white ball drink with straw; new guy: cyan magazine "MEGA SIP" (yellow label, orange-red letters) with a black straw; navigator: clipboard with a crossword-like grid, pencil in mouth |

Lettering
- Sign: "HEAD" (cream, tall condensed bold caps), white toilet pictogram, "AFT" + a down-pointing triangle below.
- Screen label plate: "LINK • HOUSTON FLIGHT" (light grey condensed caps on dark).
- Screen shows the red "NO FLUSHING / TONIGHT" banner and running clocks (..17:39 at t_021).
- Drawer labels (tiny, 2 lines, white on colour): orange "MAC & CHEESE" (first word unsure), red "BEEF FAJITA"
  (unsure), maroon "COFFEE BLACK", green "GREEN BEANS".
- Magazine: "MEGA SIP".

Changes over time
- f285-300 pull back out of the wall screen; f300-405 the three talk, camera nearly locked with a slow push;
  f405 dissolve to the sleep bay (t_028 is the mix frame).

### D4. Materials
| Object | Feel |
|---|---|
| Wall panels | flat matte, faint soft gradient |
| Quilt | matte padded fabric, relief by shading |
| Floor | matte rubber, dot relief |
| Bags | soft matte fabric, rounded shading |
| Door | glossy/emissive teal sheen |
| Outline | none on props (bag edge 0.72 -> 0.38 in 2 px, t_022 y=200) |

### D5. Top view
```
   [red bag][blue bag]   [WALL SCREEN]   [orange bag] [HEAD sign] [HATCH DOOR]
   -------- upper panels / teal rail / quilted wall ------------------------
 [galley
  table]    commander      new guy        navigator
                 (all three float 0.2-0.4 m above the floor, 0.5 m from the wall)
                              CAM (frontal, eye level, slow push)
```

---

## E. Sleep bay, night

### E1. Palette
| Surface | Lit | Shade |
|---|---|---|
| Wall panels | #131138 | lower wall #00002c, floor #010020 |
| Warm pools on the panels | #654d58, #5b495f | - |
| Top windows / skylights | #2b40a0, glow #30479e | - |
| End wall (blue, t_033) | #020c7d top | #00004f, door frame #000018 |
| Sleeping bags | teal #0a676f (hi #7f9d9d q), blue #0a19a0, green #04341e (lit green #9daa8e q with a bright mint rim) | - |
| Headrest pads | #767fc6 | - |
| Porthole frames | #2c2145 | glass shows stars |
| Floor light | #feffe3 | - |
| Floor grate | #020625 | - |
| Toilet room through the door | tiles #7ba7d8 / #122248, room #031625 | - |
| Whole frame q (t_029) | 60 percent #020223, 18 percent #1f2148, 9 percent #2a439a | - |

Whole-frame numbers
| Frame | mean L | p1 | p50 | p99 | mean sat | std L |
|---|---|---|---|---|---|---|
| t_029 | 0.129 | 0.006 | 0.017 | 0.969 | 0.798 | 0.204 |
| t_031 | 0.150 | 0.005 | 0.048 | 0.978 | 0.786 | 0.226 |
| t_033 | 0.139 | 0.004 | 0.067 | 0.975 | 0.812 | 0.211 |

### E2. Light
- Deep blue monochrome; the lower third of the frame falls to almost black (#01001d).
- Soft warm spot pools on the wall panels, one per panel column (about 0.3 m across, L 0.32 against 0.08), as if
  from small reading lights above each bunk.
- Cool blue glow from 2 slanted top windows.
- One round floor light near the door (clipped core, halo about 40 px: L 0.99 -> 0.38 in 16 px, t_033).
- Characters stay full-bright white (not tinted), bags are saturated and self-bright: they read as lit by a
  separate front light.
- No visible cast shadows. No haze.

### E3. Inventory
| Object | Size (est.) | Shape and parts |
|---|---|---|
| Side wall | 3.5 m long | panels 0.6 x 0.45 m with seams and corner rivets; wall leans in above 1.6 m (slanted roof section with 2 rounded-rectangle skylights 0.5 x 0.8 m, divided in 4 panes) |
| Sleeping bags | 0.5 m wide, 1.1 m tall | 3 upright bags hung on the wall from a chrome rail with 2 hooks each; each has a headrest pad with a black strap, a zip line down the middle, a lighter collar; colours left to right: teal (navigator, purple eye mask), blue (commander, cap on), green (new guy) |
| Portholes | 0.45 x 0.7 m | 2 between the bags, rounded rectangle, thick frame, a small rectangular latch plate in the middle of the glass |
| Kid drawing | 0.25 x 0.2 m | taped above the commander's bag |
| Floating items | 5-15 cm | a rolled white tube with a red end, a small book (red cover, white pages), a red crisp bag ("MEGA" style pack), a white-red striped strip, a blue pen |
| End wall + door | door 0.7 x 1.5 m | smooth blue wall with vertical panel lines; rounded doorway on the right with a thick dark frame, long chrome vertical grab bar left of it, a horizontal chrome rail and a black sign plate above; the checker floor and the toilet are visible through it |
| Floor | - | dark perforated grate with one flush round light |

Lettering
- Kid drawing: "MY DAD" in orange crayon, a red house/tent outline, 2 stick figures, yellow sun, green grass strip.
- Crisp bag: red with yellow letters (unreadable at this size).

Changes over time
- f405-420 dissolve in; f420-470 the new guy's eyes open, he slides up out of the green bag (bag left open and
  empty, t_032-033); f470-495 he floats right to the door, camera pans right with him; f497 dissolve to the toilet.

### E4. Materials
| Object | Feel |
|---|---|
| Panels | matte, dark, rivets catch tiny highlights |
| Bags | soft fabric with broad folds, saturated |
| End wall | smooth, slightly glossy blue |
| Rails | chrome with a light line highlight |
| Outline | none on props; the bags have a thin black zip line only |

### E5. Top view
```
  side wall:  [teal bag] (porthole) [blue bag] (porthole) [green bag] | corner |  END WALL  [DOOR -> toilet room]
                                    kid drawing above blue bag                   grab bar
                                                                        (floor light)
  CAM: frontal on the three bags, then pans right 90 degrees following the new guy to the door.
```

---

## F. Cockpit with glass canopy (seen from outside), star map on the glass

### F1. Palette
| Surface | Lit | Shade |
|---|---|---|
| Back wall slats | #7c6d6e, #857270 q | #252331, #2d2a38 q |
| Canopy frame bars | #293056 (navy) | - |
| Roof / brow | #171624 | glass over it #192133 |
| Glass | clear, slight navy tint #22202f, white streak reflections | - |
| Seats | navy #1b223f / #1d213e q, stripes orange #a44d2c | #121226 |
| Floor | #121226 | - |
| Tall chair back (navigator's) | navy #0f1534 with a red emblem | - |
| Red half-round object | #6f091d | - |
| Blue box | #141a56 | - |
| Ceiling lamps | glow #ffe983, orange tube #efcb9c q | - |
| Side consoles | #36313f, lights cyan #baced5, amber #d8ae60, pink | - |
| Hull outside | #736870, #8c7b81 q | #413634, #594f5e q |
| Star map sheet | line work #f9f7f8, sheet tint #1a1b26 over #090d1a, tape #b6aca5 | - |
| Map ring | red-pink #f4c3aa core (glowing red) | - |
| Canopy strut in shot 8 | #99a1ad | - |

Whole-frame numbers
| Frame | mean L | p1 | p50 | p99 | mean sat | std L |
|---|---|---|---|---|---|---|
| t_039 inside view | 0.207 | 0.007 | 0.135 | 0.993 | 0.402 | 0.196 |
| t_043 outside, glitter | 0.219 | 0.005 | 0.143 | 0.989 | 0.376 | 0.204 |
| t_050 star map | 0.079 | 0.004 | 0.006 | 0.994 | 0.807 | 0.194 |

### F2. Light
- Interior: 2 hanging warm lamps light the slatted back wall from above (bright fan on the slats, L 0.44, falling
  to 0.14 at the sides). Seats and floor stay dark navy.
- Exterior: warm key from upper left on the hull; warm haze glow in the top-left corner (#685a59, t_046) and a
  bright 4-point lens star on the canopy edge at f694-704.
- Glass: visible only by its frame, thin white edge lines and 2-3 diagonal white streaks (t_046).
- Glitter: hundreds of white points between camera and cockpit from f600 on, densest at t_044.
- Star map: white lines glow (halo about 10 px); real stars behind it are bright soft blobs (20-30 px) that sit
  next to, not on, the map's node circles.

### F3. Inventory
| Object | Size (est.) | Shape and parts |
|---|---|---|
| Canopy | 3 m wide, 2 m tall | faceted glass box on the nose: flat front pane, 2 angled side panes, thin navy frame bars; a dark roof brow with panel lines above |
| Back wall | 3 m | diagonal/chevron slats (ribbed panels meeting at angles), light where the lamps hit |
| Ceiling lamps | 0.6 m long | 2 pairs of black rods hanging from the roof, each pair ending in an orange glowing tube and a round orange tip |
| Pilot seats | 0.5 m wide, 1.0 m tall | 2 high-back seats side by side facing forward (toward camera), navy with 2 vertical orange stripes on the back and an orange V on the seat |
| Navigator's chair | 1.3 m tall | tall rounded navy seat back behind the pilots, red emblem (star-map/compass sign) on it |
| Centre console | 0.4 m | between the seats, small red lights and a lever |
| Side consoles | 1 m | rows of small coloured square lights (cyan, amber, white, pink) |
| Red half-round | 0.5 m | red semicircular cushion/stool with a dark block on it, left |
| Blue box | 0.3 m | on a dark table, right |
| Wall emblem | 0.2 m | round badge on the right wall: navy disc, gold crescent ring, gold 4-point star with a dotted orbit, text "LODESTAR" |
| Hanging toy | 0.12 m | small white astronaut figure on a string from the left lamp |
| Outside | - | grey-tan hull with seams, blue round solar fan behind the roof, pale disc antenna on a mast, a small dark block with 2 short cylinders on the hull side under the canopy |
| Star map (shot 8) | 0.6 x 0.75 m | transparent sheet taped on the glass with 2 beige tape strips at the top corners; double white border, ruler ticks along top and bottom edges, fine grid 8 x 9; one corner (bottom left) is folded/cut; 8 small white circles joined by straight white lines into a crooked figure; a red glowing ring in the centre around a small bright streak |

Lettering
- Badge: "LODESTAR" small gold caps under the star.
- Star map: no words; ruler ticks only.

Changes over time
- f533 dissolve in on the navigator (drinking from a juice box, eyes closed); f555-575 she looks up; f585-600 eyes
  wide; f600-700 camera pulls out through the glass and orbits left and down to a low 3/4 outside view, glitter
  everywhere; f709 the star map fades in over the canopy; f714-760 map held, slow push, the red ring pulses;
  f764-769 dissolve to the radio.

### F4. Materials
| Object | Feel |
|---|---|
| Glass | clear glass, frame + streak reflections only, no full mirror |
| Slats | matte ribbed |
| Seats | matte fabric, flat stripes |
| Hull | matte with seams and dashed stitch-like rivet lines |
| Lamps, console lights, map lines | emissive + bloom |
| Outline | none on props |

### F5. Top view
```
                   back wall (slats)         [badge]
     [red half-round]   NAV CHAIR (navigator floats in front of it)   [blue box]
     [side console]   [seat]  [centre]  [seat]   [side console]
     =========== canopy glass (front) ===========   <- star map taped here, inside
                        CAM f533 (outside, level, looking in)
        CAM f700 (outside, lower left, 3/4 view; hull runs back to the right)
```

---

## G. Radio console close-up

### G1. Palette
| Surface | Lit | Shade |
|---|---|---|
| Upper panel | #343233 (warm dark grey) | #150a13, #00000c |
| Radio body | #5e2c39 q / #672e3f (maroon, red-lit) | #32111a q, #29141f |
| Desk surface (right) | #6c2236 | #611e2f |
| Alert window | #f03a3a, text white, bloom | - |
| Indicator squares | cyan #c8fffd (3), yellow (1) | - |
| Amber digits | #cd9d18 to #faf2c7 q core, display background #5a2903 | - |
| INCOMING lamp | #feff7f core, red halo | - |
| Toggle guards | red #b60004 / #bb0b12 q | - |
| Lever caps | orange #fdb23a | - |
| Knobs | black #000000 with a grey crescent highlight | - |
| Panel dashes / labels | white #dce7ef q | - |

Whole-frame numbers
| Frame | mean L | p1 | p50 | p99 | mean sat | std L |
|---|---|---|---|---|---|---|
| t_052 | 0.148 | 0.000 | 0.107 | 0.964 | 0.557 | 0.172 |
| t_053 | 0.148 | 0.000 | 0.104 | 0.972 | 0.569 | 0.178 |
| t_054 | 0.146 | 0.000 | 0.101 | 0.967 | 0.561 | 0.178 |

### G2. Light
- Dark. The lamps are the light: the red INCOMING lamp throws a red wash over the radio and desk (maroon cast), the
  red alert window glows above, amber dial markers glow. Everything else falls to near black.
- Strong bloom on the lamp (halo about 60 px), the alert window and a glowing pencil-like amber/red rod at the right
  edge (x=1040,y=1200).
- No hard shadows. Stars visible through the canopy at the very top.

### G3. Inventory
| Object | Size (est.) | Shape and parts |
|---|---|---|
| Radio set | 0.3 m wide, 0.25 m deep | wedge box with a sloped face and a thin lighter edge line; on the face: label top centre, round lamp top right with its label under it, a recessed display with amber digits, a speaker grille of 7 horizontal slots, 2 big black round knobs (lower left, right) |
| Twin levers | 0.12 m | 2 T-handle levers on a grey block behind the radio, red glowing stems, black grips with orange end caps |
| Handheld mic | 0.1 m | dark mic with a grille on a stand, right of the radio |
| Upper panel | 1 m wide seen | sloped instrument panel: 4 large round dials with one glowing amber marker line each; a central multi-function display with a grey bezel and 5 square keys down each side; a second smaller display to the right; a row of 9 toggle switches on square black bases, 2 of them under red flip guards; short white dash labels |
| Lower panel | - | dark plates with seams and pale round rivets |
| Top right | 0.1 m | a small juice box with a straw standing on the brow |

Lettering and screens
- Central display: top row small cyan-green caps "PWR  O2  H2O  PROP", 4 small outline boxes under them; big red
  window "COMM" / "INCOMING" (white bold caps, 2 lines); bottom row 3 cyan squares + 1 yellow square.
- Right display: "COMM  S-BAND" small amber, "2287.5" amber digits, an amber waveform line.
- Radio: "COMM 1" (white condensed caps, glowing), "INCOMING" under the lamp, "VOL" and "FREQ" under the knobs,
  display "121.50".

Changes over time
- f769: display shows green bars before the alert; from f774 the red "COMM INCOMING" window is on.
- f769-800: the radio digits scramble ("12 .50", "1-1.", "-21.") while it crackles; the lamp flickers between a
  yellow core and red; camera drifts slowly in.
- f804 cut to mission control.

### G4. Materials
| Object | Feel |
|---|---|
| Panels, radio | matte, flat faces with crisp bevel edges |
| Knobs | glossy black, one crescent highlight |
| Lamps, digits, alert | emissive + bloom |
| Outline | none; the radio face has a thin light edge line instead |

### G5. Top view
```
        canopy / stars
   [dial] [ MFD: COMM INCOMING ] [dial] [S-BAND display]      <- upper sloped panel
   [toggle row ....................................]
   ---------------- lower dark panel -----------------
        [twin levers]
        [   RADIO "COMM 1"   ]  [mic]   desk
   CAM: above and left of the radio, looking down-right, 35 degrees; slow push.
```

---

## H. Under-floor hose bay, WASTE VENT, nozzle

### H1. Palette
| Surface | Lit | Shade |
|---|---|---|
| Wall panels (room side, t_076) | #272c30 | #12161d, slope plate #1d2b3b |
| Window/door frame ring | light grey #6e6f77-ish | - |
| Structural beams (under floor) | #6b9aaa (blue-grey, cyan-lit) | #23445c, #21262f |
| Gold foil insulation | #e8db49, #e9dd4d q | #c1a827 q, #6f510b, #383204 |
| Hose | ribs #d6f1f1 q on #89aaaf q; glowing section cyan-white #f0ffff | #293438 q |
| Flange plate | #4f8aa7, bolts white | - |
| Sign plates | yellow #f1e126 q, letters/border black; in shade #b6a311 q / #947b1e q | - |
| Orange handle | #a43c0a (in shade), #943709 | - |
| Rail bar | chrome with a blue line | - |
| Checker floor (t_076) | white #fdfdfd q | dark #3a3e43 q (grey, lit from above) |
| Nozzle cone | #092334, #1b2530 q | #010104 q |
| Nozzle centre | #7fc3d2 ring, inner #337b8a | - |
| Plate around nozzle | #404550 brushed, bolts #5b6168, highlight #c5c8c3 | #26252a |
| Inside the nozzle (t_080) | #17283a, #102130 q, far light #50808f q | #020d1a q |

Whole-frame numbers
| Frame | mean L | p1 | p50 | p99 | mean sat | std L |
|---|---|---|---|---|---|---|
| t_076 hose at the wall | 0.337 | 0.000 | 0.200 | 1.000 | 0.296 | 0.330 |
| t_078 under floor | 0.386 | 0.001 | 0.331 | 0.992 | 0.513 | 0.270 |
| t_079 nozzle | 0.163 | 0.000 | 0.123 | 0.764 | 0.464 | 0.152 |
| t_080 inside nozzle | 0.139 | 0.006 | 0.136 | 0.391 | 0.679 | 0.076 |

### H2. Light
- Room side: same hard key as the wide toilet shot; hard beam shadows on the checker.
- Under the floor: the moving cyan-white pulse inside the hose is the main light (clipped core 150 px wide,
  t_078), it lights the foil to bright yellow and the beams to cyan-grey. Foil in shade drops to olive-brown.
  Shadow/lit on the foil: 0.188 / 0.828 = 0.23. Hard dark gaps between beams.
- Nozzle: dim blue-teal, one soft specular patch on the cone (L 0.78), rim light on the inner ring. The last frame
  is the flattest of the film (std 0.076, p99 0.39): concentric dark blue rings with a faint centre glow.
- Faint lens sparkle on the hose at the wall joint (t_076).

### H3. Inventory
| Object | Size (est.) | Shape and parts |
|---|---|---|
| Hose | 5 cm dia, 3 m visible | ribbed vacuum hose, white spiral ribs on blue-grey; lies on the checker, enters the wall base through a round port with a dark collar; under the floor it bends twice and ends at the flange |
| Wall base port | 0.1 m | round hole in a sloped dark plate at the wall foot |
| "WASTE LINE" plate | 0.25 x 0.07 m | on the sloped plate above the port |
| Wall above | - | dark panels, a rounded window frame showing gold foil and 2 dark boxes outside, an orange vertical handle, a thin horizontal rail |
| "WASTE VENT" plate | 0.2 x 0.3 m | on a dark beam face above the flange |
| Flange | 0.2 m square | blue-grey square plate with 6-8 white bolts, a round boss in the centre, a brass threaded coupling where the hose meets it |
| Beams | 0.15-0.3 m thick | heavy rounded-corner frames (window-like cut-outs), grey-blue, brushed streaks on the big curved one |
| Gold foil | - | crinkled faceted foil lining the hull below, with a line of dark rivet dots |
| Rail | 3 cm | chrome bar with a black clip crossing the frame |
| Pipes | 3-4 cm | yellow and black thin pipes running along the foil (t_077 lower centre) |
| Nozzle | 0.3 m | outside: brushed dark plate with 4 dome bolts; a dark egg-shaped smooth housing; in its centre a recessed ring with a cyan lens-like disc and a darker inner disc. Inside: smooth concentric tube rings |

Lettering
- "WASTE LINE": black bold condensed caps on yellow, thin black inner border, slightly tilted plate.
- "WASTE" / "VENT" in 2 lines with a black down arrow at the right: black bold caps on yellow, black border.

Changes over time
- f1122-1134 camera drops to floor level and follows the hose left to the wall port (a cyan glow travels in the
  hose, bright at the port at f1128); f1140-1170 under the floor, following the glowing pulse along the hose to
  the flange, past the "WASTE VENT" plate; f1176 the nozzle from outside; f1182-1194 push into the nozzle, rings
  rush past, cyan core light at f1188.

### H4. Materials
| Object | Feel |
|---|---|
| Foil | metallic crinkle, faceted, very saturated yellow in light |
| Beams | brushed metal, soft streak texture |
| Hose | ribbed plastic, emissive where the pulse is |
| Nozzle | smooth dark semi-gloss with one soft highlight, brushed plate around |
| Signs | flat matte sticker |
| Outline | none |

### H5. Top view (follow path)
```
 toilet room floor:  [TOILET]=====hose=====>(wall port, "WASTE LINE" above)
                                               |  down through the floor
 under floor:        beams / frames            v
        gold foil hull lining   ~~~hose~~~> [FLANGE] ("WASTE VENT" plate above) -> hull skin
 outside:                                    (NOZZLE) in the small hazard box under the toilet window
 CAM: rides 0.3 m above the hose the whole way, then turns to face the nozzle head-on and flies in.
```

---

## How this differs from a plain 3D render

1. Flat ink puppets inside a shaded 3D set. Characters have a 9-15 px outline at 1080 width (#0e0407, t_001
   y=700 and y=1100) and flat fills (body #f8d036, patch sd 2); nothing in the set has that line.
2. Props carry NO outline: edges are value jumps only (bag to wall 0.72 -> 0.38 within 2 px, t_022; porthole ring
   0.13 -> 0.65 within 4 px, t_059). Only the toilet shows a 2 px dark rim.
3. Full tonal range in almost every frame: p1 <= 0.01 in 79 of 80 half-second frames and p99 >= 0.99 in 52 of 80
   (64 of 80 have both p1 <= 0.01 and p99 >= 0.96). Blacks are crushed, whites clip.
4. High saturation: mean HSV saturation >= 0.50 in 36 of 80 frames, 0.79-0.88 in space and night (t_008 0.80,
   t_066 0.88). Shadows are coloured (navy #010019, warm #201714), never neutral grey.
5. Surfaces are flat uniform fills, detail comes from seams, rivets and stickers, not textures: hull panel patch
   sd 1 (#2e323d, t_059), desk front sd 1 (#2e2d3f, t_010), wall patch sd 2-6.
6. One hard key with dark, sharp silhouette shadows where the scene is bright: cabin floor shadow/lit 0.28, quilt
   0.13 (t_022); toilet wide black tile 0.52 with beam shadows across the floor (t_068).
7. Emissives with bloom carry the story beats: toilet halo 60-80 px (t_035), flame core clipped #fefefe with a
   purple #8a6ee7 halo (t_008), LODESTAR letters #fcfcfc (t_061), floor lamp 0.99 -> 0.38 in 16 px (t_033).
8. One colour key per place, and night is a blue relight, not a dim one: cabin warm grey (p50 0.62, sat 0.29),
   mission control blue-violet (#5e66a3 carpet, #3c4784 ceiling), sleep bay 60 percent #020223 (sat 0.80), radio
   maroon #5e2c39; night toilet still has mean L 0.32 because the toilet glows.
9. Space is navy with dense stars, not black with sparse dots: background #010019-#06001e, 240-380 stars per
   megapixel, 3 px across, peak L 0.84-0.98, plus purple nebula smudges #24182d (t_004, t_050, t_066).
10. Screens are crisp readable UI that changes on the beat and tints the room: 3-2-1 at f195-222, GO at f225, red
    banner at f275; the ceiling goes #3c4784 -> #4e386c with it (t_014 vs t_019), and the same picture becomes a
    wall screen in the next place (f120-125 and f285).
