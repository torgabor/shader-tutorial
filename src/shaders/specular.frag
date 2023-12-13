  uniform sampler2D specularMap;
  uniform sampler2D diffMap;
  uniform float specPower;
  uniform vec3 lightDirection;
  uniform vec3 lightColor;
  uniform vec3 ambientColor;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vViewDirection;

  void main() {
    vec3 halfwayDirection = normalize(normalize(lightDirection) + normalize(vViewDirection));
    vec3 sampledColor = texture2D(diffMap, vUv).xyz;   
     
    // Sample specular from specular map
    float sampledSpecular = texture2D(specularMap, vUv).x;
    vec3 normalizedLightDirection = normalize(lightDirection);
     vec3 nNormal = normalize(vNormal);
    // Blinn-Phong lighting model
    float lambertian = max(dot(nNormal, normalizedLightDirection), 0.0);
    float specular = pow(max(dot(nNormal, halfwayDirection), 0.0),  specPower); // shininess

    vec3 finalColor = lightColor *  (sampledColor * (lambertian + specular*sampledSpecular)) + sampledColor * ambientColor;  
    gl_FragColor = vec4(finalColor, 1.0);
  }