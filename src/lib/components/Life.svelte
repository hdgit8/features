<script>
	import { onMount } from "svelte";

    onMount(async ()=> {
        const canvas = document.querySelector("canvas");

        const width = Math.round(window.innerWidth / 2) * 2;

        canvas.width = width;
        canvas.height = width;

        if (!navigator.gpu) {
            throw new Error("WebGPU not supported on this browser.")
        }
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            throw new Error("No appropriate GPUAdapter found.")
        }
        const device = await adapter.requestDevice();
        const context = canvas.getContext('webgpu');
        const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
        context.configure({
            device: device,
            format: canvasFormat
        }) // bind the format and device to the canvas' context
        

        /* CONSTANTS AND GLOBALS */
        const WORKGROUP_SIZE = 8; // 8x8 = 64 (standard) workgroup size for compute shaders
        const GRID_SIZE = width; // Uniform buffer for gridSize
        const UPDATE_INTERVAL = 16; // Update every 16ms (60 fps)
        let step = 0; // Track how many simulation steps have been run


        /* BUFFERS */
        const vertices = new Float32Array([
            // X,    Y,
            -1, -1, // Triangle 1 (Blue)
                1, -1,
                1,  1,

            -1, -1, // Triangle 2 (Red)
                1,  1,
            -1,  1,
        ]);
        const vertexBuffer = device.createBuffer({
            label: "Cell vertices buffr",
            size: vertices.byteLength,
            usage:  GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        })
        device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/0, vertices)

        const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE]) // (x:4, y:4)
        const uniformBuffer = device.createBuffer({
            label: "Grid uniform buffer",
            size: uniformArray.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })
        device.queue.writeBuffer(uniformBuffer, 0, uniformArray)

        // storage buffer for cell state
        const cellStateArray = new Uint32Array(GRID_SIZE * GRID_SIZE);
        const cellStateStorage = [
            device.createBuffer({
                label: "Cell state storage A",
                size: cellStateArray.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
            }),
            device.createBuffer({
                label: "Cell state storage B",
                size: cellStateArray.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
            })
        ];
        // state storage buffer A
        for (let i = 0; i < cellStateArray.length; i++) {
            let cellX = i % GRID_SIZE;
            let cellY = Math.floor(i / GRID_SIZE);

            let chance = i / (cellStateArray.length / cellX);

            cellStateArray[i] = Math.random() > chance ? 1 : 0;
        }
        device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray);
        // state storage buffer B
        device.queue.writeBuffer(cellStateStorage[1], 0, cellStateArray);

        /* LAYOUTS */
        const vertexBufferLayout = {
            arrayStride: 8,
            attributes: [{
                format: "float32x2",
                offset: 0,
                shaderLocation: 0, // Position, see vertex shader
            }]
        }
        const bindGroupLayout = device.createBindGroupLayout({
            label: "Cell bind group layout",
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                buffer: {} // Grid uniform buffer (gridSize)
            }, {
                binding: 1,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                buffer: {type: 'read-only-storage'} // Cell state input buffer
            }, {
                binding: 2,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {type: 'storage'} // Cell state output buffer
            }]
        })
        const pipelineLayout = device.createPipelineLayout({
            label: "Pipeline layout",
            bindGroupLayouts: [bindGroupLayout],
        })


        /* PIPELINE VERTEX / FRAGMENT */
        const cellShaderModule = device.createShaderModule({
            label: "Cell shader",
            code: /* wgsl */`
            struct VertexInput {
                @location(0) pos: vec2f, 
                @builtin(instance_index) instance: u32
            };

            struct VertexOutput {
                @builtin(position) pos: vec4f,
                @location(0) cell: vec2f,
            };

            @group(0) @binding(0) var<uniform> gridSize: vec2f;
            @group(0) @binding(1) var<storage> cellState: array<u32>;

            @vertex
            fn vertex(input: VertexInput) -> VertexOutput {
                let i = f32(input.instance);
                let cell = vec2f(i % gridSize.x, floor(i / gridSize.x));
                let state = f32(cellState[input.instance]);

                let cellOffsetPosition = (cell / gridSize) * 2;

                let gridPosition = ((input.pos * state + 1) / gridSize - 1) + cellOffsetPosition;

                var output: VertexOutput;
                output.pos = vec4f(gridPosition, 0, 1);
                output.cell = cell;
                return output;
            }

            // VertexOutput is the same as the FragInput
            @fragment
            fn fragment(input: VertexOutput) -> @location(0) vec4f {
                return vec4f(input.cell / gridSize, 1 - (input.cell.x / gridSize.x), 1); // red, green, blue, alpha
            }
            `
        });

        const cellPipeline = device.createRenderPipeline({
            label: "Cell pipeline",
            layout: pipelineLayout,
            vertex: {
                module: cellShaderModule,
                entryPoint: 'vertex',
                buffers: [vertexBufferLayout]
            },
            fragment: {
                module: cellShaderModule,
                entryPoint: 'fragment',
                targets: [{
                    format: canvasFormat
                }]
            }
        })

        /* PIPELINE COMPUTE */
        const simulationShaderModule = device.createShaderModule({
            label: "Game of Life simulation compute",
            code: /* wgsl */`
            @group(0) @binding(0) var<uniform> grid: vec2f;

            @group(0) @binding(1) var<storage> cellStateIn: array<u32>;
            @group(0) @binding(2) var<storage, read_write> cellStateOut: array<u32>;

            fn cellIndex(cell: vec2u) -> u32 {
                return (cell.y % u32(grid.y)) * u32(grid.x) + (cell.x % u32(grid.x));
            }

            fn cellActive(x:u32, y:u32) -> u32 {
                return cellStateIn[cellIndex(vec2(x, y))];
            }

            @compute
            @workgroup_size(${WORKGROUP_SIZE}, ${WORKGROUP_SIZE})
            fn compute(@builtin(global_invocation_id) cell: vec3u) {

                let activeNeighborsCount = 
                    cellActive(cell.x+1, cell.y+1) +
                    cellActive(cell.x+1, cell.y  ) +
                    cellActive(cell.x+1, cell.y-1) +
                    cellActive(cell.x,   cell.y-1) +
                    cellActive(cell.x-1, cell.y-1) +
                    cellActive(cell.x-1, cell.y  ) +
                    cellActive(cell.x-1, cell.y+1) +
                    cellActive(cell.x,   cell.y+1);

                let i = cellIndex(cell.xy);

                switch activeNeighborsCount {
                    case 2: { // Active cells with 2 neighbors stay active.
                        cellStateOut[i] = cellStateIn[i];
                    }
                    case 3: { // Cells with 3 neighbors become or stay active.
                        cellStateOut[i] = 1;
                    }
                    default: { // Cells with < 2 or > 3 neighbors become inactive.
                        cellStateOut[i] = 0;
                    }
                }
            }
            `
        })
        const simulationPipeline = device.createComputePipeline({
            label: "Simulation pipeline",
            layout: pipelineLayout,
            compute: {
                module: simulationShaderModule,
                entryPoint: "compute",
            }
        })

        // bind uniform and storage buffers
        const bindGroups = [
            device.createBindGroup({
                label: "Cell renderer bind group A",
                layout: bindGroupLayout,
                entries: [{
                    binding: 0,
                    resource: { buffer: uniformBuffer }
                }, {
                    binding: 1,
                    resource: { buffer: cellStateStorage[0] }
                }, {
                    binding: 2,
                    resource: { buffer: cellStateStorage[1] }
                }]
            }),
            device.createBindGroup({
                label: "Cell renderer bind group B",
                layout: bindGroupLayout,
                entries: [{
                    binding: 0,
                    resource: { buffer: uniformBuffer }
                }, {
                    binding: 1,
                    resource: { buffer: cellStateStorage[1] }
                }, {
                    binding: 2,
                    resource: { buffer: cellStateStorage[0] }
                }]
            }),
        ];

        function tick() {
            // command encoder
            const encoder = device.createCommandEncoder();

            // compute pass
            const computePass = encoder.beginComputePass();
            computePass.setPipeline(simulationPipeline);
            computePass.setBindGroup(0, bindGroups[step % 2]);

            // execute and complete pass
            const workgroupCount = Math.ceil(GRID_SIZE / WORKGROUP_SIZE);
            computePass.dispatchWorkgroups(workgroupCount, workgroupCount)
            computePass.end();
            
            step++;
            
            // render pass
            const pass = encoder.beginRenderPass({
                colorAttachments: [{
                    view: context.getCurrentTexture().createView(),
                    loadOp: "clear",
                    clearValue: [0, 0, 0, 1], // { r: 0, g: 0, b: 0, a: 1 },
                    storeOp: "store",
                }]
            });
            pass.setPipeline(cellPipeline);
            pass.setBindGroup(0, bindGroups[step % 2])
            pass.setVertexBuffer(0, vertexBuffer);

            // execute and complete pass
            pass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE);
            pass.end();

            // submit to the gpu
            device.queue.submit([encoder.finish()]);
        }

        tick();
        setInterval(tick, UPDATE_INTERVAL);
    })
</script>
<canvas width="512" height="512" style="transform:rotate(-90deg); overflow-y: scroll; min-width:100%; max-width: 100%;"></canvas>