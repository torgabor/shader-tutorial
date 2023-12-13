varying vec3 vNormal;
varying vec3 vViewDirection;
varying vec2 vUv;
  
  void main() {
    
    mat3 normalMatrix = transpose(inverse(mat3(modelViewMatrix)));
    vNormal = normalMatrix * normal;
    //Flip y direction because it's flipped on textures
    vUv = vec2(uv.x,1.0-uv.y);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDirection = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }