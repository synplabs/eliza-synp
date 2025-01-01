const fragmentShader = `
void main() {
  vec3 color = vec3(0.054, 0.306, 0.282); 
  gl_FragColor = vec4(color, 1.0);
}
`;

export default fragmentShader;
