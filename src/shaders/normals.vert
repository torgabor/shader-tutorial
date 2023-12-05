attribute vec4 tangent;

varying vec3 vTangent;
varying vec3 vBitangent;
varying vec3 vNormal;
varying vec3 vViewDirection;
varying vec2 vUv;
  
  void main() {
    
    mat3 normalMatrix = transpose(inverse(mat3(modelViewMatrix)));
    vTangent =  normalMatrix * tangent.xyz;
    vBitangent = normalMatrix *cross(normal, tangent.xyz);
    vNormal = normalMatrix * normal;
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDirection = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }