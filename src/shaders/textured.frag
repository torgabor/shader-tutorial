varying vec2 vUv;
uniform sampler2D diffMap;
  void main() {
    vec3 sampledColor = texture2D(diffMap, vUv).rgb; 
    gl_FragColor = vec4(sampledColor, 1.0);
  }