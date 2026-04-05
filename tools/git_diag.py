import subprocess
import os

def run(cmd):
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return f"CMD: {cmd}\nSTDOUT: {result.stdout}\nSTDERR: {result.stderr}\nRET: {result.returncode}\n{'-'*20}\n"
    except Exception as e:
        return f"CMD: {cmd}\nEXCEPTION: {e}\n{'-'*20}\n"

output_file = 'git_diagnostic.txt'
with open(output_file, 'w') as f:
    f.write(run("git log -n 5 --oneline"))
    f.write(run("git status"))
    f.write(run("git remote -v"))
    f.write(run("git branch -vv"))
