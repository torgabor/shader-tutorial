varying vec2 vUv;
uniform sampler2D diffMap;
  void main() {
    vec2 uv = vec2(vUv.x, 1.0-vUv.y);
    vec3 sampledColor = texture2D(diffMap, uv).rgb; 
    gl_FragColor = vec4(sampledColor, 1.0);
  }