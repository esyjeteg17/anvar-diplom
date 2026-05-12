#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

DEFAULT_RUNSERVER_ADDRPORT = "127.0.0.1:8042"


def _inject_default_runserver_port(argv: list[str]) -> list[str]:
    """If `manage.py runserver` is invoked without an addrport, default to 8042
    so the project never accidentally starts on Django's stock 8000."""
    if len(argv) >= 2 and argv[1] == "runserver":
        rest = argv[2:]
        has_addrport = any(
            not arg.startswith("-") and (":" in arg or arg.isdigit())
            for arg in rest
        )
        if not has_addrport:
            return [argv[0], argv[1], DEFAULT_RUNSERVER_ADDRPORT, *rest]
    return argv


def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(_inject_default_runserver_port(sys.argv))


if __name__ == "__main__":
    main()
