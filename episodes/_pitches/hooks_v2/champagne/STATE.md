# champagne hook STATE (pitch 3 "The Widow Who Drilled Her Kitchen Table", Reims 1816, frame 0) 2026-11-16
One three.js kit still, GPU fair queue (monopoly-escape/tools/gpu_render.sh). No voice, motion, captions or judge.

## Files
- out/hook.png (1080x1920), out/hook_small.jpg (540x960), out/full/f_00000.png (raw), out/frame_checks.md
- film.json: 1 place `kitchen` (light morning, light_over warm, card_shade 0/rim 0, costume_shade smooth 40, kit3d pbr+relief), 2 acts, 1 station lens 35,
  cam [-1.5,-2.8,1.12] aim [0.05,0.8,1.0]; place key `brace` = the widow's measured hands (render --hands widow:0-0) + the bit tip on the table
- cast/sheets/champ.mjs: widow = standard body, outfit widow1816 (high-waisted black mourning gown, white ruff, waist band) + white frilled widow's cap
  with black mourning ribbon (drawn here) + iron cellar keys at the waist; cellar = fat body, outfit cellar1816 (shirt, brown waistcoat, kerchief,
  long BLUE work apron) + knitted cap (beanie, no pompom, brick red) + silver tastevin on a cord. Period check 1816 in the file head.
- moves/ep_champ.mjs: widow_drill (side, leans on the brace: far fist on the head pad, near fist turns the crank, push bob each turn),
  cellar_shock (3/4 facing her, both fists thrown up and out, settle). Plain kit poses 0, frozen moves 0.
- sets/kitchen.js: tomette floor, limewash walls + stone plinth, oak beams, tall small-paned window (vineyard slopes + Reims spire outside, blue shutters,
  geranium), stone hearth (fire, iron crane + cauldron, candlesticks), copper pans on a rail, blue dresser with plates, wine crates stencilled
  REIMS 1816 / CHAMPAGNE, laid-bottle rack, herbs + garlic. Table: oak planks, legs, aprons, stretcher, knife scars + wine ring; SIX bottles upside
  down in holes (necks down, x1.35 scale, tilted to the lens, chalk riddling mark on each punt), chalk circles for the next holes, ledger, inkwell + quill,
  candle stub; brace and bit (steel crank, oak pad + handle, brass chuck, twisted bit), sawdust heap, curled shavings, sawdust spray, dust falling, floor pile;
  wicker basket of bottles under the table. Foreground crate with straw + bottles is built but OUT of frame.
- Rebuild: python ../../../../tools/film_plan.py bake film.json ; bash ../../../monopoly-escape/tools/gpu_render.sh film.json --frames 0 --scale 1 --no-captions --stills-dir out/full

## Numbers
- frame_checks 0 FAIL, 0 WARN, 10 PASS (widow body_side 99 %, all heads 100 %, feet 0 cm, no face covered)
- saturation 0.665 (target >= 0.30 day), mean brightness 0.389, near-black 0 %
- widow about 57 % of frame height (cap top ~26 %, soles ~84 %), face at ~38 %; cellar master face ~40 %, both fists beside his head

## Weak (vs rick_ref.jpg)
- No foreground prop in frame (the crate went out on the last camera move); bottom quarter is plain tile floor. Rick has a near rail/beam.
- The drill reads only fairly at phone size: the brace is thin against the black dress; no light shaft or highlight pulls the eye to the bit.
- Widow's cap side view is a library-free drawing: the frill reads as a bead chain, the ribbon as a black band; needs the character-artist.
- Cellar master partly behind the bottles (body, not face); his "throw-up" fists sit at head height (big head, arm length limit), not above.
- Morning light is a warm wash; no hard window-bar light patch on the floor or table, no visible shaft. Copper pans small. The last fix
  (pad smaller, brace 8 cm behind her card) was checked by numbers only (1.6 % of pixels changed, all in the drill area).
