varying vec3 vColor;

  void main() {
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vColor = (mvPosition.xyz+1.0)*0.5;
    gl_Position = projectionMatrix * mvPosition;
  }