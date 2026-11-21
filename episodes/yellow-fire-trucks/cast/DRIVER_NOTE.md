# Seated drivers: how to place them (character-artist, FIX 1, 2026-11-21)
For the S3 and S6 stretch builders. Proof: `cast/cabtest/` (film.json + sets/cabtest.js, real truck_light.glb and milk_van.glb), stills in `cast/sheets/CAST_FIX.jpg`.

## Cast entries (film.json `cast`)
```
"sceptic": { "puppet": "cast:firetrucks/scepticDriver", "height": 1.88, "in_vehicle": true }
"rookie":  { "puppet": "cast:firetrucks/rookieDriver",  "height": 1.64, "in_vehicle": true }
"milkman": { "puppet": "cast:firetrucks/milkmanDriver", "height": 1.62, "in_vehicle": true }
```
Same person, same face, faces_ep, moves and held3d hands as the standing puppet. The card is cut just under the hips (no legs, no lower body), so nothing can show under the cab floor or through a door. For a shot where he climbs out, switch the act's character back to the standing one (two cast keys, `visible` swap on the cut).
`in_vehicle: true` is the kit's driver flag: page_check then skips body_in_mesh / seat / feet / slide for him and hands him to body_check + scale_check.
Known: body_check FAILs "in_vehicle without a body rig" (templates/body_rig is not wired into film.js); scale_check needs a vehicles.js `driverSeat`, which our GLB trucks do not have. Those are kit-owner items, not cast items.

## Pose
- `"pose": "drive"`: both fists on the wheel rim in every view (side = kit push; front / 3/4 = fists at the torso edges, mid chest, drawn in front of the body).
- Your own cab move (`m:../../ep_s3/sc_cab`, `rk_cab`, `mk_van`) also works: the move's legs are simply cut off.

## Position: card pos z = seat_z - hip_up_m (CAST_KEYS.json: hip_up_m, seated_head_m)
| driver | hip_up_m | head top above the seat | proof pos z |
|---|---|---|---|
| scepticDriver | 0.683 | 1.197 m | 0.27 in the truck (bare head top 2.15 m) |
| rookieDriver | 0.670 | 0.970 m | 0.45 in the truck (bare head top 2.09 m) |
| milkmanDriver | 0.662 | 0.958 m | 0.29 in the van (seat 0.95, head top 1.91 m) |
Rule: set z so that the BARE head top sits about 0.1 m under the cab roof line. The face then fills the side window / windscreen, as in Rick's cab shots.

## Anchors (truck local: front -X, driver side +Z, Y up; GLB windscreen_driver x -3.25..-2.78, y 1.76..2.21, z 0.06..0.75)
- Truck driver seat (plan, yaw 0): truck origin + (x -2.30, driver side 0.42 m), i.e. with yaw 0 plan [X0 - 2.30, Y0 - 0.42, z]. With another yaw, rotate (-2.30, +0.42 local Z) by the truck yaw (local +Z = plan -Y at yaw 0).
- Van driver seat (milk_van.glb Car_Chair x -1.71..-1.17, z -0.15..0.37; wheel Car_Steering x -2.05..-1.68, y 0.95..1.18): van local (x -1.45, z +0.11); at yaw 0 plan [X0 - 1.45, Y0 - 0.11, z]. S3 has the van at yaw -90 (local -X -> plan +Y, local +Z -> plan -X): plan [VX - 0.11, VY + 1.45, z] (S3 make_film DRV already uses VY + 1.45).
- A riding driver: give the card the same linear runs as the vehicle (as S3 / S6 already do). Feet slide rows no longer apply (in_vehicle).

## Views
Pick the view from the camera as for any card (S3 lesson: in a 3/4 card `dir` flips the screen side). From the driver's door side: `side`, dir = the truck's heading on screen. Through the windscreen: `34`.
