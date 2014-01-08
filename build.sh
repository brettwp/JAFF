#!/bin/bash
rm -f lib/jaff*
middleman build
MINIFY=true middleman build
