# PROPS, style test (props-hero 2026-11-21). Built by `props/build_props.py` (+ `props/hose_tool.py`), Blender 5.3, no hand edits.
File: `props/props.blend`. Metres, Z up. Each prop = one collection with a ROOT EMPTY named as its LAYOUT.json key, placed at the
layout point and turn (read live from LAYOUT.json at build time; re-run the script after a layout change). Children sit in the root's
local frame: origin on the ground at the footprint centre, front along -Y before the turn. Sizes = world bounding box, measured.

| Collection (root) | Size m (bbox) | Place / turn | Source, licence |
|---|---|---|---|
| car (`car`) | 1.83 W x 5.41 L x 1.50 H (car-local) | LAYOUT car pos, rot_z -26 | Sketchfab "1954 Buick based" sedan, Libau Media, CC BY 4.0 (see ASSETS.md) |
| bucket (`bucket`) | bucket 0.32 dia x 0.31 (+ handle); bubbles/drip trail spread 1.2 m | LAYOUT bucket | own model |
| chamois (`chamois`) | 0.19 x 0.17 x 0.16 drape | same root point as the bucket | own model |
| sponge (`sponge`) | 0.20 x 0.13 x 0.08 | grandpa hand 1 (LAYOUT hands_world_local_xz[0]) minus 6 cm, rot -26 | own model |
| hose_reel (`hose_reel`) | 0.56 x 0.46 x 0.71 | LAYOUT hose_reel | own model |
| hose (`hose`, root at world 0) | 11 mm radius, route 4.5 x 5.2 m | points in `hose_points.json` (WORLD) | own model |
| mailbox (`mailbox`) | box 0.48 x 0.17 x 0.15 on a 1.02 m post, 1.36 total | LAYOUT mailbox, rot_z 180 (door to the street, flag + dent to the camera) | own model |
| kids_bike (`bike`) | 16-inch bike 1.12 long, lying on its side, 0.64 high | LAYOUT bike, rot_z +70 (= -yaw) | own model |
| water (`water`, root at world 0) | arc 5.33 m long, nozzle tip -> car roof | `water_points.json` (WORLD) | own model |

## Five details per object, as built
- Car: candy turquoise metallic clearcoat (flake bump) with cream gloss roof and steel wheels; chrome bumpers, grille bars, side spears, trim; whitewall tyres (asset texture) on chrome hubcaps; round headlamps under chrome hoods, wiper blades (asset); 724 soap-foam bubbles in 4 patches on the hood + 12 wet streaks + 2 wet sheen sheets (material `wet_film`). Badges blanked: "BUICK" hood letters and trunk script deleted (1287 verts), author logo -> chrome, plate -> blank yellow, credits plane deleted.
- Bucket: galvanised steel, 3 pressed ribs, rolled rim, riveted handle ears (4 rivets), wire bail handle with red grip dropped to one side; 420 suds bubbles heaped over the rim + 40 running down one side; 26 loose bubbles on the ground; 9-blob glossy drip trail toward the car (-X).
- Chamois: tan leather cloth, solidified 3 mm, hanging folds, lies on the suds inside and hangs over the lip toward the camera (angle -125 deg).
- Sponge: yellow body with voronoi pores (displace), green scouring layer, rounded bevels, 40 suds blobs on top.
- Hose: glossy green, darker spiral stripe + spiral ridge bump (curve UV), flattened kink near the reel (point 5, radius 0.45), lies on the ground (handles clamped >= radius), wet dark trail decals on the concrete under the flat part; brass pistol nozzle at the kid's hands: hex coupling, barrel with 2 knurl rings, cone spray head with rubber orifice, black rubber grip, trigger on a pivot pin, trigger lock loop.
- Hose reel: red A-frame tubes with braces and runners, yellow flanges with 6 chrome bolts each side, 3 layers of wound green hose on the drum, chrome axle, chrome crank arm with yellow handle, red pull handle, 2 rubber wheels with yellow hubs.
- Mailbox: glossy blue tunnel box with rounded top, front door with chrome latch and hinge, red flag UP on a chrome pivot, raised white "27" on both sides, a soft dent on the camera side, white post with grain bump, mount board and 2 braces, 26 flowers (yellow, pink, white; stems, 6 petals, centres, leaves) at the foot.
- Kid's bike: cherry clearcoat frame (7 tubes + head tube + fork), 2 wheels each with tyre + 48 tread blocks + whitewall + chrome rim + hub + 28 laced spokes + spoke reflector, chrome fenders, high-rise chrome bar, white grips with pink/blue streamers, bell, white saddle, 32-tooth chainring, chain, rear cog, chain guard, cranks, pedals with reflectors, kickstand, rear reflector.
- Water: tapering tube (16 sides) that beads (Rayleigh wobble) and closes to a point at 70 % of the path; 44 drops along the broken end, 20 strays falling under the arc; splash crown on the roof = flared sheet + 18 spikes with a bead each + 14 flung drops. Material is a placeholder: shading belongs to the look-finisher.

## Held props: hand, word, model
| Prop | Who / hand | Word | Model |
|---|---|---|---|
| sponge | grandpa, hand 1 (LAYOUT hands_world_local_xz[0]) | still, no line | `sponge` collection |
| hose nozzle | kid, both hands (mean of LAYOUT kid hands) | still, no line | end of `hose` + nozzle parts |
Lettering in the world: mailbox "27" only. No brand names left on the car.
