#!/usr/bin/env bash
set -euo pipefail
OUT="/home/ubuntu/setankober-cctv/setankober-cctv-explainer-hd.mp4"
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
ROOT="/home/ubuntu/screenshots/webdev-preview-root-1787648477351045475-8889.png"
CAM="/home/ubuntu/screenshots/webdev-preview-cameras-1787648477022946472-5929.png"
DEV="/home/ubuntu/screenshots/webdev-preview-devices-1787648477273143550-5820.png"
SET="/home/ubuntu/screenshots/webdev-preview-settings-1787648477196623026-5713.png"
VIEW="/home/ubuntu/screenshots/webdev-preview-camera_viewer-1787648477022875334-3370.png"
ffmpeg -y \
  -loop 1 -t 15 -i "$ROOT" \
  -loop 1 -t 15 -i "$CAM" \
  -loop 1 -t 15 -i "$DEV" \
  -loop 1 -t 15 -i "$SET" \
  -loop 1 -t 15 -i "$VIEW" \
  -i /home/ubuntu/setankober-cctv/video_voiceover_id.wav \
  -stream_loop -1 -i /home/ubuntu/setankober-cctv/video_bgm_cyber.wav \
  -filter_complex "\
    [0:v]scale=720:1280,format=yuv420p,drawbox=x=0:y=0:w=720:h=118:color=black@0.72:t=fill,drawtext=fontfile=$FONT:text='SETANKOBER.CCTV':fontcolor=0x19f5c6:fontsize=38:x=28:y=28,drawtext=fontfile=$FONT:text='Dashboard & build monitor':fontcolor=white:fontsize=22:x=28:y=76,fade=t=in:st=0:d=0.45,fade=t=out:st=14.4:d=0.6[v0];\
    [1:v]scale=720:1280,format=yuv420p,drawbox=x=0:y=0:w=720:h=118:color=black@0.72:t=fill,drawtext=fontfile=$FONT:text='KAMERA BERIZIN':fontcolor=0x19f5c6:fontsize=36:x=28:y=34,drawtext=fontfile=$FONT:text='Simpan dan buka viewer':fontcolor=white:fontsize=22:x=28:y=76,fade=t=in:st=0:d=0.45,fade=t=out:st=14.4:d=0.6[v1];\
    [2:v]scale=720:1280,format=yuv420p,drawbox=x=0:y=0:w=720:h=118:color=black@0.72:t=fill,drawtext=fontfile=$FONT:text='LOCAL DISCOVERY':fontcolor=0x19f5c6:fontsize=36:x=28:y=34,drawtext=fontfile=$FONT:text='Private CIDR only':fontcolor=white:fontsize=22:x=28:y=76,fade=t=in:st=0:d=0.45,fade=t=out:st=14.4:d=0.6[v2];\
    [3:v]scale=720:1280,format=yuv420p,drawbox=x=0:y=0:w=720:h=118:color=black@0.72:t=fill,drawtext=fontfile=$FONT:text='SAFETY CENTER':fontcolor=0x19f5c6:fontsize=36:x=28:y=34,drawtext=fontfile=$FONT:text='Export audit tanpa rahasia':fontcolor=white:fontsize=22:x=28:y=76,fade=t=in:st=0:d=0.45,fade=t=out:st=14.4:d=0.6[v3];\
    [4:v]scale=720:1280,format=yuv420p,drawbox=x=0:y=0:w=720:h=118:color=black@0.72:t=fill,drawtext=fontfile=$FONT:text='CAMERA VIEWER':fontcolor=0x19f5c6:fontsize=36:x=28:y=34,drawtext=fontfile=$FONT:text='Pantau koneksi milikmu':fontcolor=white:fontsize=22:x=28:y=76,fade=t=in:st=0:d=0.45,fade=t=out:st=14.4:d=0.6[v4];\
    [v0][v1][v2][v3][v4]concat=n=5:v=1:a=0,format=yuv420p[v];\
    [5:a]aresample=48000,atrim=duration=75,asetpts=N/SR/TB[voice];\
    [6:a]aresample=48000,atrim=duration=75,asetpts=N/SR/TB,volume=0.16[music];\
    [voice][music]amix=inputs=2:duration=first:dropout_transition=2, loudnorm=I=-16:TP=-1.5:LRA=11[a]" \
  -map "[v]" -map "[a]" -t 75 \
  -c:v libx264 -preset veryfast -crf 19 -pix_fmt yuv420p -movflags +faststart \
  -c:a aac -b:a 160k -ar 48000 "$OUT"
printf '%s\n' "$OUT"
