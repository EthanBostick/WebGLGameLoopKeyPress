# WebGLGameLoopKeyPress

## Overview

A Three.js WebGL game where you move a blue cube around a plane and search for the hidden Icosahedron.

## Run

Open `GameLoopKeyPress.html` in a modern browser. The game loads Three.js from the unpkg CDN, so an internet connection is required.

## Controls

- Move with `W`, `A`, `S`, and `D`.
- Arrow keys also move the cube.

## Gameplay

- Four regular shapes and one Icosahedron are placed randomly on the plane.
- Regular shapes blink and display a collision message when touched.
- Finding the Icosahedron makes it disappear and displays a win message.
- The 20-second timer appears in the upper-right corner.
- When time reaches zero, `TIME'S UP!` appears across the screen.