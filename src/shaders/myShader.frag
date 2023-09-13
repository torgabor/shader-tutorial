  uniform vec3 color;
  uniform sampler2D diffMap;
  varying vec2 vUv;

  void main() {
    vec4 texColor = texture2D(diffMap, vUv);
    gl_FragColor = texColor;
  }