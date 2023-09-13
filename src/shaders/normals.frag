  uniform sampler2D normalMap;
  uniform sampler2D specularMap;
  uniform sampler2D diffMap;
  uniform vec3 lightDirection;
  uniform vec3 lightColor;
  uniform vec3 ambientColor;
  uniform vec3 cameraPositionWorld;
  varying vec3 vTangent;
  varying vec3 vBitangent;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying vec3 vViewDirection;

  void main() {
    
  //  vec3 viewDirection    = normalize( vWorldPosition - cameraPositionWorld);
    vec3 halfwayDirection = normalize(lightDirection + vViewDirection);
    vec3 sampledColor = texture2D(diffMap, vUv).xyz; 
    // Sample normal from normal map, normal is in tangent space
     vec3 tangentNormal = normalize(texture2D(normalMap, vUv).xyz * 2.0 - 1.0);
    mat3 TBN = mat3(normalize(vTangent), normalize(vBitangent), normalize(vNormal));
		vec3 worldNormal = TBN * tangentNormal;
    // Sample specular from specular map
    float sampledSpecular = texture2D(specularMap, vUv).x;
    
    vec3 normalizedLightDirection = normalize(lightDirection);

    // Blinn-Phong lighting model
     float lambertian = max(dot(worldNormal, normalizedLightDirection), 0.0);
    float specular = pow(max(dot(worldNormal, halfwayDirection), 0.0),  50.0); // shininess

    vec3 finalColor = lightColor *  (sampledColor * (lambertian + specular*sampledSpecular)) + sampledColor * ambientColor;  
    gl_FragColor = vec4(finalColor, 1.0);
  }