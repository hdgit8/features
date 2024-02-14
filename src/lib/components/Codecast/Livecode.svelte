<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { basicSetup } from 'codemirror';
	import { EditorView, keymap } from '@codemirror/view';
	import { javascript } from '@codemirror/lang-javascript';
	import { indentWithTab } from '@codemirror/commands';

	let listenToCodeChanges = true;
	let ready = false;
	let preview;
	let editor;
	let mirror;

	export let scrollIntoView = true;

	export let code = '';
	export let cursor = { anchor: 0, head: 0 };

	export function set(_code, _cursor) {
		listenToCodeChanges = false;

		cursor = _cursor;
		code = _code;

		if (!_code) {
			console.log('code', _code);
		}

		if (!_cursor) {
			console.log('cursor', _cursor);
		}

		if (scrollIntoView) {
			mirror.dispatch({
				changes: { from: 0, to: mirror.state.doc.length, insert: _code },
				selection: { anchor: cursor.anchor, head: cursor.head },
				effects: EditorView.scrollIntoView(cursor.anchor, {
					y: 'center'
				})
			});
		} else {
			mirror.dispatch({
				changes: { from: 0, to: mirror.state.doc.length, insert: _code },
				selection: { anchor: cursor.anchor, head: cursor.head }
			});
		}
	}

	export function setModeListenToTextChanges() {
		listenToCodeChanges = true;
	}

	$: onChange(code);

	function onChange(code) {
		if (ready) {
			try {
				validSketch(code);
				setPreview(code);
			} catch (e) {
				preview.textContent = e;
			}
		}
	}

	function validSketch(code) {
		const api = {
			width: 1,
			height: 1,
			ellipse: function () {},
			background: function () {
				if (arguments.length < 1) {
					throw new Error('background must be given a color argument');
				}
			},
			clear: function () {},
			colorMode: function () {},
			fill: function () {},
			noFill: function () {},
			noStroke: function () {},
			stroke: function () {},
			erase: function () {},
			noErase: function () {},
			arc: function () {},
			circle: function () {},
			line: function () {},
			point: function () {},
			quad: function () {},
			rect: function () {},
			square: function () {},
			triangle: function () {},
			ellipseMode: function () {},
			noSmooth: function () {},
			rectMode: function () {},
			smooth: function () {},
			strokeCap: function () {},
			strokeJoin: function () {},
			strokeWeight: function () {},

			// VERTEX
			beginContour: function () {},
			beginShape: function () {},
			bezierVertex: function () {},
			curveVertex: function () {},
			endContour: function () {},
			endShape: function () {},
			quadraticVertex: function () {},
			vertex: function () {},
			normal: function () {},

			// CONSTANTS
			HALF_PI: 1,
			PI: 1,
			QUARTER_PI: 1,
			TAU: 1,
			TWO_PI: 1,
			DEGREES: 1,
			RADIANS: 1,
			CLOSE: 'close',

			// STRUCTURE
			remove: function () {},
			noLoop: function () {},
			loop: function () {},
			isLooping: function () {},
			push: function () {},
			pop: function () {},
			redraw: function () {},

			// TRANSFORM
			rotate: function () {},
			rotateX: function () {},
			rotateY: function () {},
			rotateZ: function () {},
			scale: function () {},
			shearX: function () {},
			shearY: function () {},
			translate: function () {},

			// EVENTS (mouse)
			movedX: 1,
			movedY: 1,
			mouseX: 1,
			mouseY: 1,
			pmouseX: 1,
			pmouseY: 1,
			winMouseX: 1,
			winMouseY: 1,
			pwinMouseX: 1,
			pwinMouseY: 1,
			mouseButton: 1,
			mouseIsPressed: 1,
			mouseMoved: function () {},
			mouseDragged: function () {},
			mousePressed: function () {},
			mouseReleased: function () {},
			mouseClicked: function () {},
			doubleClicked: function () {},
			mouseWheel: function () {},
			requestPointerLock: function () {},
			exitPointerLock: function () {},

			// EVENTS (keyboard)
			keyIsPressed: 1,
			key: 1,
			keyCode: 1,
			keyPressed: function () {},
			keyReleased: function () {},
			keyTyped: function () {},
			keyIsDown: function () {},

			// MATH (calculation)
			abs: function () {},
			ceil: function () {},
			constrain: function () {},
			dist: function () {},
			exp: function () {},
			floor: function () {},
			lerp: function () {},
			log: function () {},
			mag: function () {},
			map: function () {},
			max: function () {},
			min: function () {},
			norm: function () {},
			pow: function () {},
			round: function () {},
			sq: function () {},
			sqrt: function () {},
			fract: function () {},

			// MATH (vector)
			createVector: function () {
				return {
					toString() {},
					copy() {},
					add() {},
					rem() {},
					sub() {},
					mult() {},
					div() {},
					mag() {},
					magSq() {},
					dot() {},
					cross() {},
					dist() {},
					normalize() {},
					limit() {},
					setMag() {},
					heading() {},
					setHeading() {},
					rotate() {},
					angleBetween() {},
					lerp() {},
					slerp() {},
					reflect() {},
					equals() {},
					fromAngle() {},
					random2D() {},
					random3D() {}
				};
			},

			// MATH (noise)
			noise: function () {},
			noiseDetail: function () {},
			noiseSeed: function () {},

			// MATH (random)
			randomSeed: function () {},
			random: function () {},
			randomGaussian: function () {},

			// MATH (trigonometry)
			acos: function () {},
			asin: function () {},
			atan: function () {},
			atan2: function () {},
			cos: function () {},
			sin: function () {},
			tan: function () {},
			degrees: function () {},
			radians: function () {},
			angleMode: function () {},

			// TEXT
			textAlign: function () {},
			textLeading: function () {},
			textSize: function () {},
			textStyle: function () {},
			textWidth: function () {},
			textAscent: function () {},
			textDescent: function () {},
			textWrap: function () {},
			loadFont: function () {},
			text: function () {},
			textFont: function () {}
		};

		const func = new Function(
			'api',
			`with(api) {

            ` +
				code +
				`
				if (typeof draw !== 'undefined') {
					draw();
				}

				if (typeof preload !== 'undefined') {
					preload();
				}
            }`
		);
		func(api);
	}

	function setPreview(code) {
		if (!preview) return;

		const width = preview?.offsetWidth;
		const height = preview?.offsetHeight;

		let iframe = document.createElement('iframe');
		iframe.setAttribute('sandbox', 'allow-scripts');
		iframe.setAttribute('loading', 'lazy');
		iframe.style = 'height: 100%; width:100%';
		iframe.srcdoc =
			`<html>
                    <script src="/libs/p5.min.js"><` +
			`/script>
                    <script>
                    function setup() {
                        createCanvas(` +
			width +
			`, ` +
			height +
			`);
                        ` +
			code +
			`
		} 
                    <` +
			`/script>
                </head>
                <body>
                    <style>
                        html, body, canvas, main {
                            margin: 0;
                            padding: 0;
                            overflow: hidden;
                        }
                        p5Canvas {
                            width: 100%;
                            height: 100%;
                        }
                    </style>
                </body>
                </html>`;

		preview.textContent = '';
		preview.append(iframe);
	}

	onMount(() => {
		if (browser) {
			if (code) {
				setPreview(code);
			}

			ready = true;

			window.onresize = function () {
				setPreview(code);
			};

			mirror = new EditorView({
				extensions: [
					basicSetup,
					javascript(),
					EditorView.updateListener.of((view) => {
						if (!listenToCodeChanges) {
							// we are playing back changes not recording them
							return;
						}

						code = view.state.doc.toString();

						const anchor = view.state.selection.main.anchor;
						const head = view.state.selection.main.head;

						cursor = { anchor, head };
						/* line and column
						let cursor = view.state.doc.lineAt(head);
						let line = cursor.number;
						let col = head - cursor.from;
						console.log('line = ' + line + ' col = ' + col);
						*/
					}),
					keymap.of([indentWithTab])
				],
				parent: editor
			});

			console.log(mirror);
		}
	});
</script>

<div class="flex flex-col-reverse sm:flex-row aspect-ratio-container mx-auto">
	<div class="block h-1/2 w-full sm:w-1/2 sm:h-full bg-white text-black">
		<div class="flex w-full h-full text-start" bind:this={editor} />
	</div>
	<div class="block h-1/2 w-full sm:w-1/2 sm:h-full bg-white text-black" bind:this={preview} />
</div>

<style>
	.aspect-ratio-container {
		max-height: 70vh;
		aspect-ratio: 3 / 2;
	}

	@media (min-width: 640px) {
		.aspect-ratio-container {
			aspect-ratio: 800 / 400;
		}
	}
</style>
