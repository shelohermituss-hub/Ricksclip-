# look_pack.js: the hospital surface pack (look helper phase A 2026-11-16). Proof: `_test/` (`bash _test/run.sh`), numbers `_test/numbers.txt`, sheet `_test/kinds_sheet.jpg`
`import * as LP from './look_pack.js'; const M = LP.pack(THREE, ctx);` (cached per ctx). Every material carries `userData.k3scale` = metres per texture repeat: the kit3d finish pass
gives each mesh metre UVs by itself (box projection; on walls v = height). Use `LP.finishUV(THREE, scene)` last in build() ONLY if the set makes no kit3d call at all.
Every set also calls `LP.applyLight(THREE, scene, ctx)` once (fill_color / fill_i, shadow_color, veil_color + place key `fog`) and `LP.sync(M)` in its update (glazed / plastic / lacquer materials take the kit env map).

| M.<name> | what (real size) | kind |
|---|---|---|
| `tileSea` / `tileSeaGloss` | sea-green glazed tile #4fa59a, 15 cm, light grout, per-tile tone, glaze pooled at the edge, sheen streak, crazing, a few chipped corners; repeat 1.2 m | toon / glossy (env .5) |
| `dadoTile` | = tileSeaGloss (corridor + stairwell dado, height `world.js DADO_Z` 1.2 m: the loop colour) | glossy |
| `tile(col, grout, size)` | any other glazed tile | glossy |
| `ceilPanel` | dark teal #123a36 acoustic panels 60 cm, fissures, pinholes, steel T-bar grid, one old water stain; 1.2 m | toon |
| `vinyl`, `vinylOf(col)` | speckled sheet vinyl #7f9a90: chips in 3 sizes, a heat-welded seam every 2 m, heel scuffs, trolley tracks; 2.0 m | glossy (rough .38) |
| `terrazzo` | cream-grey matrix, 7 chip colours, brass divider strips every 1.2 m | glossy (rough .25) |
| `plaster`, `paint(col)` | butter-cream #f3e2a6 painted plaster, roller stipple, patched spots, faint chair-height scuffs; 2.0 m | toon |
| `block`, `blockOf(col)` | painted cinder block 40 x 20 cm, stretcher bond, struck joints, pores; 1.6 m | toon |
| `veneer` | wood panelling #8a5a32, 30 cm boards with V-grooves (vertical), cathedral figure; 1.2 m | glossy (rough .45) |
| `desk` | desk oak #a8743e straight grain, coffee-cup rings, fine scratches; 1.0 m | glossy |
| `locker` | olive-green #6a7a4a baked steel paint, orange peel, chips to primer, key scratches; 1.0 m | glossy, metalness .25 |
| `plasticOrange` / `plasticTeal` / `plasticOf(col)` | moulded chair plastic #f09a2a / #2aa0a0, stipple, mould flow lines; 0.5 m | glossy |
| `carpet` | carpet tile 50 cm, quarter-turned pile, tweed flecks, a coffee spot; 1.0 m | toon |
| `drape` / `drapeDk` | blue surgical drape #2f5fa8 / #24508e, crepe weave, pack fold creases; 0.5 m, double sided | toon |
| `rug(w, l)` | kids' play-mat town (road loop, ABC/123 squares, pond, houses; no red), UV 0..1 over the plane | toon |
| `steel`, `steelDk`, `chrome` | kit3d `ctx.pbr.metal('steel')` brushed / dark / smooth chrome (toon colours with pbr off) | PBR |
| `glow(c)` | unlit lamp / screen colour | basic |

`LP.sky(THREE, ctx, kind, { w, h, at:[x,y,z] plan, yaw, gain, haze })` -> `{ mesh, update(t) }`: an unlit backdrop plane for windows (no shadows, no fog). Kinds:
`texas` (hot white Texas sky, far downtown in heat haze, the elevated freeway on piers with traffic, lamp posts, palms, a water tower and a blank billboard; heat-haze UV wobble in the lower third, guarded: sin only, clamped UV),
`night` (deep blue #1e3a8a, stars, crescent moon, lit windows, sodium freeway lights), `coral` (7:15 PM lilac-magenta to coral, low sun glow, lit cloud streaks, plum skyline), `overcast` (2004 grey-lilac #9aa4c8, layered cloud, slate skyline).
These are stand-ins for the background-painter's far layers: keep the API, replace the canvas. Call `update(t)` from the set's update (haze moves).
`LP.uv(mesh, size)` = metre UVs now (bakes the mesh scale), `LP.uvBox`, `LP.finishUV`, `LP.antiTile(mat, amt, freq)` (world-space tint that breaks the repeat; clamped .6-1.4).

Red gate: nothing in the pack sits within 12 deg of #e01e2a with sat > .5 (orange chair hue 34; coral sky hue 18-30). Cost: texture generation is CPU at set-up, cached per process (~1-2 s for the whole pack).
Light kinds: copy the blocks from `PLACE_KEYS.json` (OR, CO, NI, AF, GR, EV, EV_or). `lp_testroom.js` is a TEST BOX (place key `dress`), never used in the film.
