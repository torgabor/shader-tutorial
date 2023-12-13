  uniform sampler2D normalMap;
  uniform sampler2D specularMap;
  uniform sampler2D diffMap;
  uniform float specPower;
  uniform vec3 lightDirection;
  uniform vec3 lightColor;
  uniform vec3 ambientColor;
  varying vec3 vTangent;
  varying vec3 vBitangent;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vViewDirection;


  void main() {
    vec3 halfwayDirection = normalize(normalize(lightDirection) + normalize(vViewDirection));
    vec3 sampledColor = texture2D(diffMap, vUv).xyz; 
    // Sample normal from normal map, normal is in tangent space
    // bring the sampled values from 0..1 range to 1..-1 range
    vec3 tangentNormal = normalize(texture2D(normalMap, vUv).xyz * 2.0 - 1.0);     
     
    mat3 TBN = mat3(normalize(vTangent), normalize(vBitangent), normalize(vNormal));
		vec3 viewNormal = TBN * tangentNormal;
    // Sample specular from specular map
    float sampledSpecular = texture2D(specularMap, vUv).x;
    vec3 normalizedLightDirection = normalize(lightDirection);

    // Blinn-Phong lighting model
    float lambertian = max(dot(viewNormal, normalizedLightDirection), 0.0);
    float specular = pow(max(dot(viewNormal, halfwayDirection), 0.0),  specPower); // shininess

    vec3 finalColor = lightColor *  (sampledColor * (lambertian + specular*sampledSpecular)) + sampledColor * ambientColor;  
    gl_FragColor = vec4(finalColor, 1.0);
  }