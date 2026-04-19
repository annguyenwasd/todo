import { spawn } from "child_process";

export function copyToClipboard(text: string): void {
  const [cmd, ...args] =
    process.platform === "darwin"
      ? ["pbcopy"]
      : process.platform === "win32"
      ? ["clip"]
      : ["xclip", "-selection", "clipboard"];
  const proc = spawn(cmd, args);
  proc.stdin.write(text);
  proc.stdin.end();
}
