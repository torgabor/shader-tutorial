attribute vec4 tangent;

varying vec3 vNormal;
varying vec2 vUv;
  
  void main() {
    
    mat3 normalMatrix = transpose(inverse(mat3(modelViewMatrix)));
    vNormal = normalMatrix * normal;
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }