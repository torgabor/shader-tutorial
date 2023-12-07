  uniform sampler2D diffMap;
  uniform vec3 lightDirection;
  uniform vec3 lightColor;
  uniform vec3 ambientColor;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vec2 uv = vec2(vUv.x, 1.0-vUv.y);
    vec3 sampledColor = texture2D(diffMap, uv).xyz; 
    vec3 normalizedLightDirection = normalize(lightDirection);
    vec3 nNormal = normalize(vNormal);
    // Lambertian model
     float lambertian = max(dot(nNormal, normalizedLightDirection), 0.0);

    vec3 finalColor = lightColor *  (sampledColor * (lambertian)) + sampledColor * ambientColor;  
    gl_FragColor = vec4(finalColor, 1.0);
  }