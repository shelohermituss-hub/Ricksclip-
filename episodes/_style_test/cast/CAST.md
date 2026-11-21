# STYLE TEST CAST (character-artist, 2026-11-21). Locked vector cast only; nothing in templates/ changed.
Built by `node episodes/_style_test/cast/tools/make_cards.mjs` (SCALE=2) + `python3 episodes/_style_test/cast/tools/finish_cards.py`.
Source: cast/sheets/styletest.mjs (outfit recipes `stGrandpaAloha`, `stKidShark` registered at load from outfit_lib parts + small parts; hats wrap HATS2
fedora / capBack). Poses: kit puppets.mjs svgFor + poses.mjs, two poses added at run time (`jump_surprise`, `hose_aim`), fists placed by state.hat.

| ID | Role (story) | Body | Height | Hair / face gear | Outfit (colour <- scene source) | Signature |
|---|---|---|---|---|---|---|
| grandpa | proud owner washing his turquoise car | fat (standard bean) | 1.75 m | baldTufts white, chevron moustache, round glasses | cream aloha (<- car roof/wheels cream), turquoise hibiscus (<- car paint), coral bloom (accent, his own), khaki trousers (<- drive/mulch warm), leather braces | cream car-badge pin on the turquoise hat band |
| kid | mischief ambusher with the hose | kid form | 1.25 m | spiky brown, freckles | white raglan tee, cherry sleeves/collar (<- his cherry bike + hose reel), denim shorts (<- mailbox blue family), turquoise star patch (<- car, ties him to grandpa) | knee plaster on the near (right) knee |

## Five details (Hard Rule 2)
GRANDPA: 1 Panama straw hat (pinched crown, dashed weave lines) with a turquoise band in his car's paint and a cream car pin, flying off the head.
2 cream aloha shirt: turquoise and coral hibiscus on palm leaves, camp collar, shell buttons. 3 chest pocket with folded sunglasses hooked on and a red pencil.
4 khaki trousers on leather braces with brass clips, darned patch on the thigh, chamois cloth tucked in the waistband. 5 fresh wet hose splashes on the shirt;
yellow sponge with suds, flung drips and bubbles in his right fist.
KID: 1 cherry cap worn backwards (peak behind, dashed seam, white strap arch, fringe tufts through the hole). 2 white raglan tee, cherry sleeves and collar,
big grinning shark print (teeth, fin, splash ticks). 3 turquoise star iron-on patch with stitch ring, grass stain. 4 denim shorts, orange contrast
stitching, back pockets, frayed hem. 5 criss-cross knee plaster, freckles, toothy cheeky grin (k:evil echoes the shark).

## Cards (cards.json has every number; px origin = card top-left; bottom edge = ground)
- grandpa.png 898x1400, 529.9 px/m, 3/4 facing screen LEFT, jump 0.34 m clear of the ground (lowest foot y 1219), fists R (118,479) sponge / L (773,460).
- kid.png 948x1400, 938.7 px/m, 3/4 facing screen RIGHT, nozzle grip back (his R fist) (658,815), front (his L fist) (850,761), axis 28 deg up-right, outlet ~(968,698).
- *_flat.png = same without the baked costume shade. kid_nozzle2d.png = 2D nozzle stand-in, preview only (props-hero builds the 3D nozzle; fists in front of it).
- Costume shade baked on the screen-LEFT side (sun front-right, LAYOUT to_sun_xy), faces/whites/ink untouched, sponge untouched. hat_shadow 0, no brim band on faces.

## Check (Rule 1 / Hard Rule 2 / phone)
- Side by side: character-artist_vs_rick.jpg (ours left, Rick car film f0049 right, PRIVATE). Costume detail is at or above his (he: cap + goggles, pocket pens,
  grime stains); below him: his figure takes the scene light (warm lit side, cool shade, dirt on face) - that comes from the look-finisher's light, not the card.
- Black fill (CAST_SHEET row 2): grandpa reads (flying hat + arms up + jump legs); kid reads (backwards cap + arm out) but the nozzle is not on the card,
  so his aim reads only once the 3D nozzle and water are in.
- Phone (CAST_SHEET row 3, LAYOUT sizes): grandpa reads; the kid is ~12 % of frame height at 7.5 m and his grin/shark are too small to read -> layout matter.
- check_views.mjs: FAIL as shipped only (24 "no approved picture" lady/dad/stationmaster/inspector + SKIPs of absent films); templates/ untouched.
- NOT done: footwear (rubber boots / sandals / sneakers): locked rule "no shoes" (CB_RULES s4); a boot covering the whole foot needs CB's OK.
  Short sleeves / rolled trousers do not exist on the template (bare ink arms and legs).
