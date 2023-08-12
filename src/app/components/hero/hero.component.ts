import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.sass'],
})
export class HeroComponent implements OnInit {
  ngOnInit(): void {
    initializeCanvas();

    function initializeCanvas() {
      const canvas = document.getElementById('blobs') as HTMLCanvasElement;
      let width = (canvas.width = window.innerWidth),
        height = (canvas.height = 850),
        gl =
          canvas.getContext('webgl') ||
          (canvas.getContext('expirimental-webgl') as WebGL2RenderingContext);
      window.onresize = () => {
        width = width = canvas.width = window.innerWidth;
        gl.viewport(0, 0, width, height);
        for (var i = window.requestAnimationFrame(() => {}); i--; ) {
          window.cancelAnimationFrame(i);
        }
        loop();
      };
      // Stop initializing if no context
      if (!gl) return alert('Your browser does not support WebGL.');
      gl.viewport(0, 0, width, height);

      // link our shaders and intialize
      const vertexShader = createShader(
          gl.VERTEX_SHADER,
          `precision lowp float;
        // this is a basic vertex shader
        // since we are only drawing a rectangle across the canvas
        attribute vec2 position;
        
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }`
        ),
        fragmentShader = createShader(
          gl.FRAGMENT_SHADER,
          `precision lowp float;
      
          // this will store an array of vec3 objects
          // data will be stored as <x, y, radius>
          // in <x, y, z> format
          
          uniform vec3 metaballs[10];
          
          void main() {
            // start with "alpha" of zero
            // this ends up being black given our fragcolor formula
            float alpha = 0.0;
            
            // iterate through all balls
            for(int i = 0; i < 10; i++) {
              vec3 metaball = metaballs[i];
              // sqrt((x2 - x1)^2 + (y2 - y1)^2)
              // but we are going to square it, so no need for sqrt
              float dist = (metaball.x - gl_FragCoord.x) * (metaball.x - gl_FragCoord.x) + (metaball.y - gl_FragCoord.y) * (metaball.y - gl_FragCoord.y);
              // increase alpha level based on how close this pixel is
              // to the current metaball, therefore making this
              // pixel lighter
              alpha +=  metaball.z * metaball.z / dist;
            }
            gl_FragColor = vec4(min(alpha * gl_FragCoord.x / 800.0, 0.65), min(alpha, 0.65), min(alpha * 6.0, 0.65), 1.0);
          }`
        ),
        program = createProgram(vertexShader, fragmentShader) as WebGLProgram;
      gl.useProgram(program);

      // we are going to draw a rectangle across the whole canvas,
      // and the pixels are going to be colored based on their
      // distance from the metaballs' origin

      // remember to use Float32Array!
      const vertices = new Float32Array([
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, -1.0,
      ]);

      // create our buffer - get ready to pass our data
      const verticesBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      // get the position attrib, and give it the data
      const positionAttrib = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(positionAttrib);
      gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 2 * 4, 0);

      // set up metaballs
      const metaballData = new Float32Array(30);
      for (var i = 0; i < 30; i += 3) {
        // give each metaball a random radius,
        // and different position
        const radius = Math.random() * 20 + 40;
        metaballData[i] = Math.random() * (width - radius) + radius;
        metaballData[i + 1] = Math.random() * (height - radius) + radius;
        metaballData[i + 2] = radius;
      }

      // clear old animation frames!
      for (var i = window.requestAnimationFrame(() => {}); i--; ) {
        window.cancelAnimationFrame(i);
      }

      // create array to give each ball a velocity
      // we don't put it in the Float32Array since that
      // is uneccesary for the fragment shader to know
      const velocities = Array.from({ length: 10 }, () => ({
        x: Math.random() * 2 + 1,
        y: Math.random() * 2 + 1,
      }));

      // get metaballs uniform
      const metaballUnif = gl.getUniformLocation(program, 'metaballs');

      // call the initial loop!
      loop();
      // our loop will be called whenever it is in the user's viewport
      // around 60Hz on my computer
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      function loop() {
        // first, loop through all the metaballs
        for (var i = 0; i < 30; i += 3) {
          const radius = metaballData[i + 2],
            velocity = velocities[i / 3];

          // add velocity to the metaball position
          metaballData[i] += velocity.x;
          metaballData[i + 1] += velocity.y;

          // check if the ball is out of the viewport
          // if it is, reverse the respective velocity
          if (metaballData[i] + radius > width) {
            metaballData[i] = width - radius;
            velocity.x = -Math.abs(velocity.x);
          } else if (metaballData[i] < radius) {
            metaballData[i] = radius;
            velocity.x = Math.abs(velocity.x);
          }
          if (metaballData[i + 1] + radius > height) {
            metaballData[i + 1] = height - radius;
            velocity.y = -Math.abs(velocity.y);
          } else if (metaballData[i + 1] < radius) {
            metaballData[i + 1] = radius;
            velocity.y = Math.abs(velocity.y);
          }
        }
        gl.clear(gl.COLOR_BUFFER_BIT);
        // pass the new data to the uniform
        gl.uniform3fv(metaballUnif, metaballData);
        // draw the canvas! (with balls "highlighted")
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // loop again, when we can!
        requestAnimationFrame(loop);
      }

      // this function creates a shader, compiles it
      // and returns the compiled shader
      function createShader(type: number, source: string) {
        const shader = gl.createShader(type) as WebGLShader;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
      }
      // this function creates a program with given shaders,
      // and returns a linked program
      function createProgram(vs: WebGLShader, fs: WebGLShader): WebGLProgram {
        const program = gl.createProgram() as WebGLProgram;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        return program;
      }
    }
  }
}
