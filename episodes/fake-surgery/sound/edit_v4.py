# one-time edit of cues.json for mix_v4 (FINAL JOIN v3). Backup: cues_v3_before.json.bak. Do not rerun on an edited cues.json.
import json
d=json.load(open('cues_v3_before.json.bak'))
C=d['cues']
def key(c): return (c['row'],c['clip'],c.get('word'),c.get('off'),c.get('frame'))
def drop(pred):
    n=len(C); C[:]=[c for c in C if not pred(c)]; assert len(C)<n, 'nothing dropped'
def mod(pred,**kw):
    hit=[c for c in C if pred(c)]; assert hit, kw
    for c in hit: c.update(kw)
def add(row,frame,clip,db,why,**kw):
    c=dict(row=str(row),frame=frame,clip=clip,db=db,why='v4: '+why); c.update(kw); C.append(c)
# ---- S1 bulb_splash water 85-115
mod(lambda c:c['row']=='4' and c['clip']=='squeeze', off=-5, why='v4: pinky squeeze of the rubber bulb (f83)')
drop(lambda c:c['row']=='4' and c['clip']=='water_fan')
drop(lambda c:c['row']=='4' and c['clip']=='drips' and c.get('word'))
drop(lambda c:c['clip']=='sploosh' and c.get('frame') in (89,103) and c['row']=='4')
add(4,85,'water_spray',-26,'bulb_splash: the spray leaves the nozzle (f85)')
add(4,89,'water_fan',-27,'bulb_splash crown 1: the fan of water over the knee')
add(4,89,'sploosh',-29,'bulb_splash crown 1 bursts')
add(4,97,'water_spray',-29,'bulb_splash spray 2',rate=1.15)
add(4,103,'sploosh',-30,'bulb_splash crown 2 over the drape')
add(4,96,'drip1',-30,'drops land on the drape',pan=-.1)
add(4,100,'drip2',-31,'drops',pan=.1)
add(4,106,'drip1',-31,'drops',rate=1.1)
add(4,110,'drip2',-32,'drops',rate=.95,pan=-.15)
add(4,114,'drips',-33,'last patter on the drape',len=.7)
# ---- S1 nurse two-shot whisper 300-345: keep the voice, closer room tone (bed below), her sleeve + his smile
mod(lambda c:c['row']=='10' and c['clip']=='cloth_soft' and c.get('frame')==300, frame=302, db=-38, why='v4: she leans to his ear, medium two-shot f300 [retime]')
add(10,322,'cloth_soft',-42,'nurse two-shot: her sleeve settles at his ear',pan=.15)
# ---- zzz: the repeating snore is replaced by a soft snore only in voice gaps, >= 3 s apart (len caps it to the gap)
drop(lambda c:c['clip']=='snore')
add(1,171,'snore',-44,'zzz: one soft snore in the gap after "plasters." (f170-184)',len=.45,pan=-.3)
add(27,1153,'snore',-44,'zzz: gap after "screen." (f1153-1165)',len=.4,pan=-.3)
add(27,1273,'snore',-44,'zzz: gap before "Two" (f1272-1290)',len=.5,pan=-.3)
add(40,1685,'snore',-44,'zzz: gap before "Being" (f1673-1695), the OR replay opens',len=.3,pan=-.3)
# ---- S3 gurney through the OR doors 1040-1122 (slow, 2 s), doors swing 1060-1082
drop(lambda c:c['row']=='27' and c['clip']=='wheels')
drop(lambda c:c['row']=='27' and c['clip'] in ('door','hinge') and c.get('frame') in (1066,1069,1078))
add(27,1040,'wheel_roll',-27,'slower gurney starts rolling toward the OR doors')
add(27,1066,'wheel_roll',-28,'gurney rolls through the vestibule',rate=.95)
add(27,1092,'wheel_roll',-29,'gurney into the OR (J2 dissolve 1094-1105)',len=1.0)
add(27,1050,'squeak',-35,'a gurney wheel squeaks',pan=-.1)
add(27,1074,'squeak2',-35,'wheel squeak 2')
add(27,1098,'squeak',-36,'wheel squeak 3',rate=.9)
add(27,1060,'door',-26,'the OR doors swing open (1060-1082)')
add(27,1063,'hinge',-30,'door hinges as the leaves swing',len=.9)
add(27,1081,'door',-31,'the leaves reach the stops')
# ---- S3 CRT / VCR shot 1110-1150
mod(lambda c:c['row']=='27' and c['clip']=='vcr_clunk', frame=1115, why='v4: VCR clunk, the tape REAL ONE goes in (CRT shot 1110-1150)')
mod(lambda c:c['row']=='27' and c['clip']=='play_click', frame=1122, why='v4: PLAY on the VCR')
add(27,1123,'vcr_whirr',-33,'VCR whirr: the heads spin up',pan=-.2)
add(27,1137,'vcr_whirr',-35,'VCR whirr continues under the picture on the CRT',pan=-.2,rate=.95)
# ---- S3 jug_flood 1215-1260 (water only: no plastic thunk, no lamp rattle)
drop(lambda c:c['row']=='29' and c['clip']=='pour')
drop(lambda c:c['row']=='29' and c['clip']=='chain')
drop(lambda c:c['row']=='29' and c['clip']=='hit_boom')
drop(lambda c:c['row']=='29' and c['clip']=='sploosh' and c.get('frame') in (1226,1228))
drop(lambda c:c['row']=='29' and c['clip']=='wave')
add(29,1210,'water_pour',-24,'jug_flood: the jug pours from high up (f1215-1226)',len=1.6)
add(29,1226,'sploosh',-15,'EXTREME: the SPLOOSH, water crown (s3 impact f1226)')
add(29,1226,'hit_boom',-30,'the splash body (soft: water, not a thunk)',bus='hit',lp=0) if False else add(29,1226,'hit_boom',-29,'the splash body, soft',bus='sfx')
add(29,1228,'sploosh',-23,'crown collapses into the floor water',rate=.8)
add(29,1231,'water_move',-27,'floor wave 1 runs shin-deep',pan=-.2)
add(29,1241,'water_move',-29,'floor wave 2 rolls out',rate=.85,pan=.2)
add(29,1250,'gurgle',-30,'water settles around the clogs')
add(29,1236,'drip1',-32,'drops fall back into the flood',pan=.2); add(29,1244,'drip2',-33,'drops',pan=-.2)
# ---- S2: the colleague's bubble shows at 562
mod(lambda c:c['row']=='16' and c['clip']=='pop' and c.get('frame')==560, frame=562, why='v4: speech bubble with the ? pops (562-612)')
# ---- S4: the stair->chart dissolve is 8 f at 1486-1493
mod(lambda c:c['row']=='36' and c['clip']=='whoosh_soft', frame=1486, why='v4: stair -> chart dissolve 1486-1493 (8 f)')
# ---- beds: OR bed 1087 -> 1100 (J2 dissolve 1094-1105); S1 closer room tone for the nurse two-shot 300-345 (bed at 296, OR restored at 346)
B=d['beds']
for b in B:
    if b['frame']==1087: b['frame']=1100; b['place']+=' (v4: starts at the J2 dissolve 1094-1105)'
B.append({'frame':296,'place':'A OR 3 nurse two-shot: closer room tone under the whisper (v4)','layers':[['amb_hum',-38],['amb_room',-37],['amb_monitor',-50]]})
B.append({'frame':347,'place':'A OR 3 morning again after the whisper','layers':[['amb_hum',-36],['amb_monitor',-47],['amb_room',-44]]})
B.sort(key=lambda b:b['frame'])
d['frames']=2230
json.dump(d,open('cues.json','w'),indent=1)
print(len(C))
