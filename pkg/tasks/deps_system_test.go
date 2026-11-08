package tasks

import (
	"os/exec"
	"testing"
)

func TestSystemToolsOptIn(t *testing.T) {
	t.Setenv("XBVR_USE_SYSTEM_FFMPEG", "true")
	expected, err := exec.LookPath("sh")
	if err != nil {
		t.Fatal(err)
	}
	if got := GetBinPath("sh"); got != expected {
		t.Fatalf("got %q; want system tool %q", got, expected)
	}
}
