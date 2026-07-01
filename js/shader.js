const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
    // Map position from [-1, 1] to [0, 1]
    v_texCoord = a_position * 0.5 + 0.5;
    // Invert Y coordinate so 0.0 is at bottom (standard GL behavior, but for UV it doesn't matter much for noise)
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

varying vec2 v_texCoord;

// Simplex 2D noise implementation for organic motion
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i   = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  vec3 m0 = 1.0 - 0.05 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    // We adjust UV to account for aspect ratio to avoid stretching the noise
    vec2 uv = v_texCoord;
    uv.x *= u_resolution.x / u_resolution.y;
    
    // Brand Colors (Normalized to 0.0 - 1.0)
    vec3 cloud = vec3(0.945, 0.953, 0.945); // #F1F3F1
    vec3 mist = vec3(0.651, 0.757, 0.796);  // #A6C1CB
    vec3 sage = vec3(0.435, 0.545, 0.475);  // #6F8B79
    
    // Animate multiple noise layers at different scales/speeds
    float n1 = snoise(uv * 2.0 + u_time * 0.1);
    float n2 = snoise(uv * 4.0 - u_time * 0.15);
    float n3 = snoise(uv * 8.0 + u_time * 0.2);
    
    float noise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
    
    // Create a flowing, liquid-like gradient blend
    vec3 color = mix(cloud, mist, smoothstep(-1.0, 1.0, n1));
    color = mix(color, sage, smoothstep(0.5, 1.0, n2) * 0.4);
    
    // Add a soft vignette for depth
    float vignette = 1.0 - smoothstep(0.5, 1.5, length(v_texCoord - 0.5));
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
}
`;

function initShader() {
  const canvas = document.getElementById('shader-bg');
  if (!canvas) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    console.error('WebGL not supported');
    return;
  }

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Error linking program:', gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  // Set up full screen quad
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
     1.0,  1.0,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Uniform locations
  const timeLocation = gl.getUniformLocation(program, 'u_time');
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  const mouseLocation = gl.getUniformLocation(program, 'u_mouse');

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function resizeCanvas() {
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    }
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas(); // initial setup

  function render(time) {
    // time is in milliseconds from requestAnimationFrame
    gl.uniform1f(timeLocation, time * 0.001); 
    gl.uniform2f(mouseLocation, mouseX, mouseY);
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

// Ensure it runs after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShader);
} else {
  initShader();
}
