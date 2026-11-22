"""camera projection helpers for the cabin stretch (Blender metres, Z up). Frame 9:16, vfov on the long (vertical) side."""
import math
def norm(v): l = math.sqrt(sum(x*x for x in v)); return [x/l for x in v]
def sub(a, b): return [a[i]-b[i] for i in range(3)]
def cross(a, b): return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
def dot(a, b): return sum(a[i]*b[i] for i in range(3))
def basis(c):
    fw = norm(sub(c['look'], c['loc'])); rt = norm(cross(fw, [0, 0, 1])); up = cross(rt, fw)
    r = math.radians(-c.get('roll', 0))   # roll: picture roll (sign checked on render)
    rt2 = [rt[i]*math.cos(r)+up[i]*math.sin(r) for i in range(3)]; up2 = [up[i]*math.cos(r)-rt[i]*math.sin(r) for i in range(3)]
    return fw, rt2, up2
def unproject(c, sx, sy, depth):
    """screen (0..1 from left, 0..1 from top) at view depth -> world point"""
    fw, rt, up = basis(c); tv = math.tan(math.radians(c['vfov'])/2); th = tv*9/16
    return [c['loc'][i] + depth*(fw[i] + (2*sx-1)*th*rt[i] + (1-2*sy)*tv*up[i]) for i in range(3)]
def project(c, p):
    fw, rt, up = basis(c); tv = math.tan(math.radians(c['vfov'])/2); th = tv*9/16; d = sub(p, c['loc']); z = dot(d, fw)
    return ((dot(d, rt)/z/th+1)/2, (1-dot(d, up)/z/tv)/2, z)
def depth_of(c, p): return dot(sub(p, c['loc']), norm(sub(c['look'], c['loc'])))
def frame_h(c, depth): return 2*depth*math.tan(math.radians(c['vfov'])/2)
