# STATE set helper B1 (2026-11-16): corridor.js + office.js, ONE build round, test in sets/_b1_test (run.sh, make_film.py, measure.py, sheet.jpg, numbers.txt)
Built: corridor.js (place "corridor" + PRE-OP BAY), office.js (place "office", dress night | stripes | y2004). Both at world.js ORIGIN, anchors + STATIONS in WORLD metres.
Surfaces: look_pack.js (terrazzo, dadoTile, paint #f3e2a6, ceilPanel, veneer, desk, locker, carpet, steel/steelDk/chrome), LP.applyLight + LP.sync, LP.sky night/overcast (office window).
Props: hero_props.js buildGurney (12 queue gurneys), buildCane (pre-op), buildWireTray x3, buildStickyNote (locker 2), buildLightBox (stripes + charts only), buildScopeCase. Own stand-ins if missing.
Keys corridor: clock, clock_spin (blur >=2), window noon|morning, shimmer, portholes work|lit|dark, rhythm, in_use, queue 0-12 (curls round the corner), queue_out n (EXTREME r15), honk, flicker [f], curtain, preop, dust, wet, fog_out.
Keys office: dress, clock, clock_spin, lamp, lamp_duck (r19), blinds, blinds_up, sun, charts (stripes only; red bars), trays, tray_fill, note locker|none|tray, scope_case, lid, door, steam, dust. Ceiling 3.2 m.
Anchors corridor: or_door, or_door_in, porthole_L/R, clock, crt, phone, calendar, window, corner, gurney_0..11 {at,head,knee,yaw}, gurney_path(u) (tower roll r47->48), wave_spot, preop_chair/seat/table/clipboard/cane/window/extra_1/2.
Anchors office: desk_top, desk_front, card_stack, tray_1..3, note_locker, lamp_head, lamp_pool, light_box, bar_top_1..3, ruler_rest, scope_case(_lid), coffee_cup, coffee_machine, clock, chair, surgeon_sit/stand, letter_spot, stamp_spot, pen_cup, door, door_out(u), window, ceiling_z.
Numbers round 2 (0.5 scale, ungraded): sat / bright / red_gate / edge
 CO wide .183 / .787 / 0 / .104 | CO row15 out .196 / .695 / 0 / .191 | CO pre-op .268 / .728 / 0 / .120
 NI office .463 / .286 / 4 px (pink-amber lamp on the tray cards) / .106 | AF stripes .408 / .405 / 0 / .165 | GR 2004 .372 / .378 / 0 / .124
WEAK (below Rick, not done):
 - CO is washed out: sat .18-.27 (bible: >=.30 by day), bright .70-.79, flat yellow walls; needs a richer grade (less veil, deeper butter, stronger tile).
 - Row 15 EXTREME does not read: the freeway is a big grey slab, the 140 gurneys are too small, the window blind + mullions clutter it. Needs a lower, longer freeway and bigger near gurneys.
 - AF: NO visible blind stripes on desk/wall (sun shadow through slats not showing). Must be fixed before row 36-39.
 - NI bright .286 < .31; 4 red-gate px where the amber pool hits the tray cards (shift lamp hue or lower its gain on the trays).
 - Pre-op: sparse (edge .12, 703 shapes); the pastel curtain is off-frame from the station; the sheer window reads empty.
 - density_check 4-5/7 per still: G4 chroma low (CO, GR), G6 fine, G7 haze fail on CO wide / pre-op / AF.
 - Porthole silhouettes (row 13) and the clock spin blur not yet looked at in a still.
 - Hanging sign text overlapped ("SURGERY" + "OR 1-4"); fixed after round 2, not re-rendered.
Open: _DRESSING.md / _STORY.md not written (outside my write list); background-painter owns the window sky (corridor uses own gradient + 3D car park/freeway because r15 needs a 3D queue).
