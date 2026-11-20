# hero_props.js: how each stretch uses the hero objects (props-hero, 2026-11-15)
Module: `episodes/lightning-spear/sets/hero_props.js` (shared, never copy it; the test film copies it only because its server cannot reach up).
Import inside a set's build: `const HP = await import('./hero_props.js');` Every builder is `(THREE, ctx, opts)` and returns `{ group, anchors, parts, ... }`.
Groups are in three.js LOCAL metres, Y up; place with `g.group.position.copy(ctx.B2T(planPoint)); scene.add(g.group)` (rotate with `rotation.y`).
Add them BEFORE build() returns, so kit3d gives them UVs and the env map. kit3d off / no ctx.pbr: same parts in toon colours.
Film needs `"kit3d": true` (or `{pbr, relief}`) for the real metal; `"far": true` in opts drops bolts and forge scale for wide shots.

| Object | Builder | Origin / size | Anchors | Replaces in | Stretches |
|---|---|---|---|---|---|
| Spear 1765 | `buildSpear(THREE, ctx, {})` | shaft foot = tower_top `SPEAR.base` (plan [0,0,.45]); tip at +2.17 = `SPEAR.tip` | base, tip, eye (= plan EYE), glint, collar_low/up, grip, socket, stay_feet | tower_top.js lines 90-106 (`spear_lightning_rod`), `bracket_eye` | S1 hero, S2 far (`far:true`), S4 far tower, S5, S6 end |
| Small spear | `buildSpear(THREE, ctx, {small:true, length, radius})` | foot on the ridge, L .72 default (yard: coop .72 r .016, well 1.1, dovecote 1.3, barn 1.5, house 1.55 with radius .035-.045) | same + stay_feet | yard.js `spearOn()` shaft/collar/socket/blade/foot plate (keep its own wire route) | S6 |
| Wire | `buildWire(THREE, ctx, {points, hook:true, splice:.62, staples:[{u, n}]})` | points = the stretch's route in three coords (tower_top `rp` + wall run mapped with B2T) | start, end; `setGrow(u)` for the S1 build-up (replaces `setDrawRange`) | tower_top `spear_wire`, `spear_wire_hook`, `spear_wire_wall`, staples | S1, S2 (wall through the door, `strands:0` if far), S5 (night glow: add an emissive copy of the curve) |
| Wire foot | `buildWireFoot(THREE, ctx, {wallZ:0})` | ground point under the wire = tower_top `WIRE_FOOT` (plan [1.0,-2.05,TOWN_Z]); wire top 1.1 m up | top, ground | tower_top `wire_foot_mound` (keep the mud/puddle) | S1 row 7, S5 |
| Storm bell + yoke | `buildBell(THREE, ctx, {})` | ORIGIN = PIVOT: add to marble `bell_swing` (sw) in place of headstock+bell+clapper; crown top y -.22, mouth y -2.8 (10 cm lower than old) | pivot, mouth, crown, mark; `.clapper` group to swing | marble.js lines 156-167 | S3 |
| Bell wheel | `buildBellWheel(THREE, ctx, {})` | hub; `wheel.group.position.set(0,0,2.62)` inside sw (axle = local Z) | hub, rope_exit (= marble ROPE x 1.25) | marble `bell_wheel_*` | S3 |
| Bell frame | `buildBellFrame(THREE, ctx, {})` | chamber floor under pivot (`BC` origin), pivot 3.3, frames z +-2.2 | pivot, floor | marble `bell_frame_*`, `bell_bearing` | S3 |
| Gold angel | `buildAngel(THREE, ctx, {})` | base underside on `PED_U` (marble AN0), faces +Z (hero hill), trumpet toward +X; halo top 3.0 m, trumpet bell 4.4 m | top, mouth, trumpet_bell, orb | marble `gold_angel` children (keep the group/animation, put HP group inside) | S3, S4 far |
| Struck angel | same object, `setStruck(true)` | bent noodle trumpet, scorch, 2 burnt primaries, right wing knocked down; marble keeps the fall pose | | marble `tBent` | S3, S5 far |
| Hammer | `buildMasonHammer(THREE, ctx)` | same frame as tower_props `buildHammer` (+Y handle, grip .07, tip [.12,.375,0]) | grip, tip | held3d `"builder": "buildMasonHammer", "module": "../sets/hero_props.js"` style | S1 |
| Wire coil | `buildWireCoil(THREE, ctx, {r:.15})` | coil centre, axis local Z | end, centre | tower_top `wire_coil` | S1 |

Signature glint: `spear.setGlint(v, size)` (v 0..1); the sprite is #bfe6ff, normal blending, never clips; `noExport`.
Lettering on the bell: `+ FVLGVRA FRANGO + VIVOS VOCO + MORTVOS PLANGO + A D MDCCXL +` (old bell Latin "I break the lightning"; no names). Founder's mark: bell, three stars, MDCCXL. `opts.text` to change (lead decides).
Held props: hammer in the Mason's RIGHT fist on the hammer words (S1 rows 1-3); coil on his LEFT shoulder (S1). No other hero prop is held.
