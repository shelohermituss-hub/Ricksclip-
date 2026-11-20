# Cart army match: lessons for every future film (2026-11-12)

Learned by matching Rick's "How One Cart Stopped an Entire Army" (66.8 s) shot for shot. CB 2026-11-12 13:48Z: "do you learn his camera movement and set build and motion? and save for future projects", 13:49Z: "always remember the camera movement".

## 1. Camera movement (measured, feature tracking 10 samples per second, caption band masked)

| | Rick, whole film | Rick, 0-7.7 s | Ours, 0-7.7 s (v4) |
|---|---|---|---|
| camera moving | 100 % of the time | 100 % | 99 % |
| hard cuts per 10 s | 0.9 (6 in the film, ALL after 39 s) | 0 | 2.6 |
| soft blends per 10 s | 0.45 | 1.3 | 1.3 |
| push in / pull back | 69 % / 12 % | 57 % / 9 % | 76 % / 1 % |
| move speed (px per sample at 270 px wide) | 2.6 | 1.4 | 2.9 |

Rules taken from this:
- The camera never stops. Every picture has one slow continuous move; a hold is still a slow creep.
- Join pictures with the move itself (whip up the wall, ride over the gate, orbit) or a 6-14 frame blend. Hard cuts only for a shock beat late in the film (he has none in the first 39 s). His "whip up the wall" at 2.1 s is ONE continuous move, not a cut.
- Mostly push in, but pull back about one move in eight to reveal (we almost never pull back).
- Move half as fast as we think: his opening moves are 1.4, ours 2.9.
- With a character in frame the camera stays at character height (chest to eye, or low looking up), at most 10 degrees down; high views only for places and objects, and a shot that starts high cranes down to the character.
- Before CB sees an animatic: side-by-side video (his left, ours right, his sound), measured with the same tracker, every move compared per second.

## 2. Set build
- ONE connected world: fort yard, wall walk, gate, valley road are one model shot from many sides.
- Deep grass from hundreds of thousands of instanced blades, thickest at the character's feet and path edges; the grass moves in the wind (vertex shader wind waves in world space, costs nothing).
- Big foreground in most frames (grass, board, wheel, wall edge).
- Real parts: block joints, battlements, banners with words and animals, lanterns, carved litter rails, parasol fringe.
- His grade: saturation 0.38 (ours 0.46 = too saturated), brightness range 0.22 (ours 0.11 = too flat), darkest 1 % at 0.15 (ours 0.06 = too black), about 37 colours per frame.

## 3. Motion and hands
- Hands always end ON the object: a 2D pose cannot follow a 3D tool, so draw 3D arms from the card shoulder to named points on the tool, each ending in a round fist (ep_arms + noArms pose). Arm tube width = the 19 px limb line.
- Carried things: bearers stand at the pole ends, feet on the ground, one arm out to the pole, a fist on the pole at shoulder height; poles hang under the deck at shoulder height.
- Spears and shields: the fist is drawn on the shaft (spec.arms to the shaft point), the other hand behind the shield; no loose fist dots.
- A crowd marches with four walk frames per soldier (step, pass, step, pass), each soldier on his own step phase. From the front only a HIGH knee lift reads as walking, plus a small body rock.
- Cast cards take the scene light: three rays per card toward the key light, lit = warm sun colour, blocked = cool shade colour.
- Head pieces, hair and beards sit inside the head outline; check every hat on the cast sheet before a film frame.

## 4. Look choices CB made on this film
- Body sizes: the new three locked sizes (thin, standard, fat), never the old thin.
- Premium texture finish on outfits (weave, flecks, thicker outlines): CB "keep before better" 12:40Z, so not used.
