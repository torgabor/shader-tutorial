attribute vec4 tangent;

varying vec3 vTangent;
varying vec3 vBitangent;
varying vec3 vNormal;
varying vec3 vWorldPosition;
//varying vec3 vWorldCameraPosition;
uniform vec3 cameraPositionWorld;
varying vec3 vViewDirection;
varying vec2 vUv;
  
  void main() {
    
    mat3 normalMatrix = transpose(inverse(mat3(modelMatrix)));
    vTangent =  normalMatrix * tangent.xyz;
    vBitangent = normalMatrix *cross(normal, tangent.xyz);
    vNormal = normalMatrix * normal;
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    vWorldPosition = worldPosition.xyz;
    vec3 viewDirection    = normalize( vWorldPosition - cameraPositionWorld);
    vViewDirection = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }