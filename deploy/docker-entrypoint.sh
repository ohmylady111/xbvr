#!/bin/sh
set -eu
mkdir -p "${XBVR_APPDIR:-/config}/bin"
# XBVR expects tools inside its data directory, not on PATH.
ln -sf /usr/bin/ffmpeg "${XBVR_APPDIR:-/config}/bin/ffmpeg"
ln -sf /usr/bin/ffprobe "${XBVR_APPDIR:-/config}/bin/ffprobe"
exec "$@"
