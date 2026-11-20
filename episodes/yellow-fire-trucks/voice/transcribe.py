"""Word times with faster-whisper, no trimming. python transcribe.py in.(mp3|wav) words.json"""
import sys, json, subprocess, numpy as np
from faster_whisper import WhisperModel
pcm = subprocess.run(["ffmpeg","-loglevel","error","-i",sys.argv[1],"-f","s16le","-ac","1","-ar","16000","-"],capture_output=True,check=True).stdout
a = np.frombuffer(pcm,np.int16).astype(np.float32)/32768.0
segs,_ = WhisperModel("small.en",device="cpu",compute_type="int8").transcribe(a,word_timestamps=True,beam_size=5,vad_filter=False)
w=[{"w":x.word.strip(),"s":round(float(x.start),3),"e":round(float(x.end),3)} for s in segs for x in s.words]
json.dump(w,open(sys.argv[2],"w"),indent=0); print(len(w),"words;"," ".join(x["w"] for x in w))
