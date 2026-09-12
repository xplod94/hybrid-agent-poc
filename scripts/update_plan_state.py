from pathlib import Path
import sys

ALLOWED = {"PLAN.md", "STATE.md"}


def validate(name: str) -> Path:
    path = Path(name)

    if (
        path.is_absolute()
        or len(path.parts) != 1
        or path.name not in ALLOWED
    ):
        raise PermissionError(
            f"Only PLAN.md and STATE.md may be accessed: {name}"
        )

    return path


def main():
    if len(sys.argv) != 3:
        print(
            "Usage: update_plan_state.py <PLAN.md|STATE.md> <content>",
            file=sys.stderr,
        )
        sys.exit(1)

    path = validate(sys.argv[1])
    content = sys.argv[2]

    path.write_text(content, encoding="utf-8")


if __name__ == "__main__":
    main()